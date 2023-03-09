import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export default async function DeleteKey(key_id: string) {
    const options = {
        url: "https://api.mux.com/video/v1/signing-keys/",
        headers: {
            "Content-Type": "application/json",
        },
    };

    return await axios
        .delete(options.url + key_id, {
            auth: {
                username: process.env.MUX_TOKEN_ID as string,
                password: process.env.MUX_TOKEN_SECRET as string,
            },
            headers: options.headers,
        })
        .catch((err) => {
            throw new Error(err);
        });
}
