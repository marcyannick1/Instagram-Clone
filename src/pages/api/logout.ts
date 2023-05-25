import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

interface Data {}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "POST") {
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("jwt", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: -1,
                path: "/",
            })
        );
        res.status(200).json({ message: "logout" });
    }
}
