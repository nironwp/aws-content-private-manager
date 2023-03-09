import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
export default async function CreateKey() {
    const options = {
        url: "https://api.mux.com/video/v1/signing-keys",
        headers: {
            "Content-Type": "application/json",
        },
    };
    return await axios
        .post(
            options.url,
            {},
            {
                auth: {
                    username: process.env.MUX_TOKEN_ID as string,
                    password: process.env.MUX_TOKEN_SECRET as string,
                },
                headers: options.headers,
            }
        )
        .then((response) => {
            return response.data.data;
        })
        .catch((err) => {
            throw new Error(err);
        });
}
