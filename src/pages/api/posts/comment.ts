import type { NextApiRequest, NextApiResponse } from "next";
import { createComment } from "../../../../utils/user";

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === "POST") {
        const { userId, postId, content } = req.body;

        try {
            const comment = await createComment(userId, postId, content);
            res.status(200).send(comment);
        } catch (error) {
            res.status(400).send("error");
            console.log(error);
        }
    }
}
