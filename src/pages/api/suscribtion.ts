import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { createSuscribtion, deleteSuscribtion, isFollowed } from "../../../utils/user";

const prisma = new PrismaClient();

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === "POST") {
        const suscriberId = req.body.suscriberId;
        const suscriberToId = req.body.suscriberToId;

        const alreadySuscribed = await isFollowed(suscriberId, suscriberToId);

        try {
            alreadySuscribed ? deleteSuscribtion(suscriberId, suscriberToId) : createSuscribtion(suscriberId, suscriberToId);
            res.status(200).send("ok");
        } catch (error) {
            res.status(400).send(error as any);
        }
    }
}
