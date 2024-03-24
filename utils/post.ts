import { IPostMedia } from "@/interfaces/Post";
import { Posts, Medias, Likes, PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function createPost(userId: number, description: string, urls: IPostMedia[]): Promise<void> {
    const post = await prisma.posts.create({
        data: {
            userId: userId,
            date: new Date(Date.now()),
            description: description,
        },
    });

    for (const url of urls) {
        await prisma.medias.create({
            data: {
                url: url.url,
                type: url.type,
                postId: post.id,
            },
        });
    }
}

export async function getPostById(postId: number): Promise<Posts> {
    const post = await prisma.posts.findUnique({
        where: {
            id: postId,
        },
        include: {
            media: true,
            user: true,
            likes: true,
            comments: {
                orderBy: {
                    date: "desc",
                },
                include: {
                    user: true,
                },
            },
        },
    });

    return post!;
}

export async function getUserPosts(userId: number): Promise<Posts[]> {
    const userPosts = await prisma.posts.findMany({
        where: {
            userId: userId,
        },
        include: {
            media: true,
        },
    });

    return userPosts;
}

export async function getFollowedUsersPosts(userId: number): Promise<Posts[]> {
    const followedUsers = await prisma.user
        .findUnique({
            where: { id: userId },
        })
        .suivies();

    const posts = await prisma.posts.findMany({
        where: {
            OR: [
                {
                    userId: {
                        in: followedUsers?.map((user) => user.suscriberToId),
                    },
                },
                {
                    userId: userId,
                },
            ],
        },
        include: {
            media: true,
            user: true,
            likes: true,
            comments: true,
        },
        orderBy: {
            date: "desc",
        },
    });

    return posts;
}

export async function alreadyLiked(userId: number, postId: number): Promise<boolean> {
    const likeCount = await prisma.likes.count({
        where: {
            userId: userId,
            postId: postId,
        },
    });

    return likeCount > 0;
}

export async function alreadySaved(userId: number, postId: number): Promise<boolean> {
    const favCount = await prisma.favoris.count({
        where: {
            userId: userId,
            postId: postId,
        },
    });

    return favCount > 0;
}

export async function createOrDeleteLike(userId: number, postId: number): Promise<Likes | Prisma.BatchPayload> {
    if (await alreadyLiked(userId, postId)) {
        const likeDelete = await prisma.likes.deleteMany({
            where: {
                userId: userId,
                postId: postId,
            },
        });

        return likeDelete;
    } else {
        const likeCreate = await prisma.likes.create({
            data: {
                userId: userId,
                postId: postId,
            },
        });

        return likeCreate;
    }
}

export async function createOrDeleteSaved(userId: number, postId: number): Promise<Promise<Likes | Prisma.BatchPayload>> {
    if (await alreadySaved(userId, postId)) {
        const likeDelete = await prisma.favoris.deleteMany({
            where: {
                userId: userId,
                postId: postId,
            },
        });

        return likeDelete;
    } else {
        const savedCreate = await prisma.favoris.create({
            data: {
                userId: userId,
                postId: postId,
            },
        });

        return savedCreate;
    }
}