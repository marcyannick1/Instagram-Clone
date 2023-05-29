import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../../../utils/jwt";
import cookie from "cookie";

const prisma = new PrismaClient();

interface Data {}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "POST") {
        const email = req.body.email;
        const password = req.body.password;

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        const userData = {
            id: user?.id,
            email: user?.email,
            username: user?.username,
            name: user?.name,
        };

        if (user && user.password === password) {
            const jwtoken = await generateToken(
                userData,
                process.env.JWT_SECRET!,
                60 * 60 * 60 * 24
            );

            res.setHeader(
                "Set-Cookie",
                cookie.serialize("jwt", jwtoken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 60 * 60 * 60 * 24,
                    path: "/",
                })
            );

            res.status(200).send("vous etes connecté");
        } else {
            res.status(401).send("email ou mot de passe incorrect");
        }
    }
}
