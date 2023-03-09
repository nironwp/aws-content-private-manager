import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();
export default async function CreateSignedVideo(location_url: string) {
    var data = JSON.stringify({
        input: location_url,
        playback_policy: ["signed"],
    });

    var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.mux.com/video/v1/assets",
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    };

    return await axios
        .post(config.url, config.data, {
            auth: {
                username: process.env.MUX_TOKEN_ID as string,
                password: process.env.MUX_TOKEN_SECRET as string,
            },
            maxBodyLength: Infinity,
            headers: config.headers,
        })
        .then((response) => {
            console.log(response.data);
            return response.data.data;
        })
        .catch((err) => {
            throw new Error(err.message);
        });
}
