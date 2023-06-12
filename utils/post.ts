import { Posts, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPostById(postId: number): Promise<Posts>{
    const post = await prisma.posts.findUnique({
        where: {
            id: postId
        },
        include: {
            media: true,
            user: true,
            likes: true,
            comments: {
                orderBy : {
                    id : "desc"
                },
                include : {
                    user: true,
                }
            },
        },
    })

    return post!
}