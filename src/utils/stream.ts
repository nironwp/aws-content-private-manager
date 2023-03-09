import AWS from "aws-sdk";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { PassThrough } from "stream";

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
});

async function stream(fileStream: any, filename: string) {
    return new Promise((resolve, reject) => {
        const tempFilePath = `/tmp/${filename}`;

        const tempStream = new PassThrough();
        const writeStream = fs.createWriteStream(tempFilePath);

        writeStream.on("finish", () => {
            const fileContent = fs.readFileSync(tempFilePath);
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME as string,
                Key: filename,
                Body: fileContent,
            };

            s3.upload(params, (err: any, data: { Location: any }) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(
                        `File uploaded successfully. File location: ${data.Location}`
                    );
                    resolve(data.Location);
                }
            });
        });

        fileStream.pipe(tempStream).pipe(writeStream);

        writeStream.on("error", (err) => {
            console.error(err);
            reject(err);
        });
    });
}

export default stream;
