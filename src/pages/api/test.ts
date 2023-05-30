import type { NextApiRequest, NextApiResponse } from "next";
import { getUserPosts } from "../../../utils/user";

interface Data {}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "POST") {

        const posts = await getUserPosts(1);

        res.status(200).send(posts);
    }
}
