import { Comments, Likes, Posts, Prisma, PrismaClient, Suscribtions, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserIdByUsername(username: string): Promise<number> {
    const user = await prisma.user.findUnique({
        select: {
            id: true,
        },
        where: {
            username: username,
        },
    });

    return user!.id;
}

export async function getUserDatas(userId: number): Promise<User> {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    return user!;
}

export async function getPostsCount(userId: number): Promise<number> {
    const postsCount = await prisma.posts.count({
        where: {
            userId: userId,
        },
    });

    return postsCount;
}

export async function getFollowersCount(userId: number): Promise<number> {
    const followersCount = await prisma.suscribtions.count({
        where: {
            suscriberToId: userId,
        },
    });

    return followersCount;
}

export async function getSuiviesCount(userId: number): Promise<number> {
    const followersCount = await prisma.suscribtions.count({
        where: {
            suscriberId: userId,
        },
    });

    return followersCount;
}

export async function isFollowed(suscriberId: number, suscriberToId: number): Promise<boolean> {
    const subscription = await prisma.suscribtions.count({
        where: {
            AND: [
                {
                    suscriberId: suscriberId,
                    suscriberToId: suscriberToId,
                },
            ],
        },
    });

    return subscription !== 0;
}

export async function createSuscribtion(suscriberId: number, suscriberToId: number): Promise<Suscribtions> {
    const subscribtion = await prisma.suscribtions.create({
        data: {
            suscriberId: suscriberId,
            suscriberToId: suscriberToId,
        },
    });

    return subscribtion;
}

export async function deleteSuscribtion(suscriberId: number, suscriberToId: number): Promise<Prisma.BatchPayload> {
    const subscribtionDel = await prisma.suscribtions.deleteMany({
        where: {
            suscriberId: suscriberId,
            suscriberToId: suscriberToId,
        },
    });

    return subscribtionDel;
}

export async function uploadProfilPic(loggedInUserId: number, url: any): Promise<void> {
    await prisma.user.update({
        where: {
            id: loggedInUserId,
        },
        data: {
            photo: url,
        },
    });
}

export async function createComment(userId: number, postId: number, content: string): Promise<Comments> {
    const comment = await prisma.comments.create({
        data: {
            userId: userId,
            postId: postId,
            content: content,
        },
    });

    return comment;
}
