import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if(req.method === "POST"){
    const email = req.body.email

    // const user = await prisma.user.findMany({
    //     where: {
    //         AND: [{ email: email}, { password: password }]
    //     }
    // });
    const user = await prisma.user.findUnique({
        where: { email: email},
    });

    if (user) {
        res.status(200).send(email)
    }else{
        res.status(401).send("L'email n'existe pas")
    }
  }
}