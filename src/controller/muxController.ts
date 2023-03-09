import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import stream from "../utils/stream";
import Mux from "@mux/mux-node";
import AWS from "aws-sdk";
import CreateSignedVideo from "../mux/CreateSignedVideo";
import CreateKey from "../mux/CreateKey";
import DeleteKey from "../mux/DeleteKey";
import * as dotenv from "dotenv";
dotenv.config();
const { Video } = new Mux(
    process.env.MUX_TOKEN_ID as string,
    process.env.MUX_TOKEN_SECRET as string
);

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
});

export default async function muxController(fastify: FastifyInstance) {
    fastify.get(
        "/",
        async function (_request: FastifyRequest, reply: FastifyReply) {
            reply.send({ message: "ping" });
        }
    );

    fastify.register(require("fastify-multipart"), {
        limits: {
            fileSize: 1024 * 1024 * 1024, // 1 GB
        },
    });

    fastify.get(
        "/:asset_id",
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { asset_id } = request.params as any;

            try {
                const asset = await Video.Assets.get(asset_id);
                if (!asset.playback_ids) {
                    throw new Error("Error while geting the playback id");
                }

                const key = await CreateKey();
                const token = Mux.JWT.sign(asset.playback_ids[0].id as string, {
                    keyId: key.id,
                    keySecret: key.private_key,
                    expiration: process.env.EXPIRATION_TIME,
                });
                setTimeout(async () => {
                    await DeleteKey(key.id);
                }, 10800000);
                // await DeleteKey(key.id);
                reply.send({ asset, token });
            } catch (err) {
                reply.send({ err });
            }
        }
    );

    fastify.post("/", async function (request: any, reply: FastifyReply) {
        const data = await request.file();
        const { filename } = data;

        const fileStream = data.file;
        console.log(filename)
        try {
            const location = await stream(fileStream, filename);
            const asset = await CreateSignedVideo(location as string);

            reply.send({ asset_id: asset.id });
        } catch (err) {
            reply.send({ err });
        }

        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: filename,
        };
        s3.deleteObject(deleteParams, (err) => {
            if (err) {
                console.log("Erro ao excluir o arquivo: ", err);
            } else {
                console.log(`Arquivo excluído com sucesso`);
            }
        });
    });
}
