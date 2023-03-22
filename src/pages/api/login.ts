import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if(req.method === "POST"){
    const email = req.body.email
    const password = req.body.password

    // const user = await prisma.user.findMany({
    //     where: {
    //         AND: [{ email: email}, { password: password }]
    //     }
    // });
    const user = await prisma.user.findUnique({
        where: { email: email},
    });


    if (user && user.password === password) {
        res.status(200).send("vous etes connecté")
    }else{
        res.status(401).send("email ou mot de passe incorrect")
    }
  }
}