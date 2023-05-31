import type { NextApiRequest, NextApiResponse } from "next";
import { createOrDeleteSaved } from "../../../utils/user";

interface Data {}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "POST") {
        const { userId, postId } = req.body;

        try {
            const saved = await createOrDeleteSaved(userId, postId);
            res.status(200).send(saved);
        } catch (error) {
            res.status(400).send("error");
            console.log(error);
        }
    }
}
