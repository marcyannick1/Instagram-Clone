import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if(req.method === "POST"){
        const email = req.body.email;
        const fullname = req.body.fullname;
        const username = req.body.username;
        const password = req.body.password;

        const user = await prisma.user.create({
            data: {
                email : email,
                name : fullname,
                username : username,
                password : password
            },
        });


        res.status(200).send({email, fullname, username, password})
    }

}