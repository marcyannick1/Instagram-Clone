import { PrismaClient } from "@prisma/client";

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

export async function getUserDatas(userId: number): Promise<any> {
    const userDatas = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    return userDatas;
}

export async function getUserPosts(userId: number): Promise<any> {
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

export async function getFollowedUsersPosts(userId: number): Promise<any> {
    const followedUsers = await prisma.user
        .findUnique({
            where: { id: userId },
        })
        .suivies();

    const posts = await prisma.posts.findMany({
        where: {
            userId: {
                in: followedUsers?.map((user) => user.suscriberToId),
            },
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

export async function isFollowed(
    suscriberId: number,
    suscriberToId: number
): Promise<any> {
    const bool = await prisma.suscribtions.count({
        where: {
            AND: [
                {
                    suscriberId: suscriberId,
                    suscriberToId: suscriberToId,
                },
            ],
        },
    });

    return bool !== 0;
}

export async function createSuscribtion(
    suscriberId: number,
    suscriberToId: number
): Promise<any> {
    const subscribtion = await prisma.suscribtions.create({
        data: {
            suscriberId: suscriberId,
            suscriberToId: suscriberToId,
        },
    });

    return subscribtion;
}

export async function deleteSuscribtion(
    suscriberId: number,
    suscriberToId: number
): Promise<any> {
    const subscribtionDel = await prisma.suscribtions.deleteMany({
        where: {
            suscriberId: suscriberId,
            suscriberToId: suscriberToId,
        },
    });

    return subscribtionDel;
}

export async function uploadProfilPic(loggedInUserId: any, url: any) {
    const photo = await prisma.user.update({
        where: {
            id: loggedInUserId,
        },
        data: {
            photo: url,
        },
    });

    return photo;
}

export async function createPost(userId: any, description: any, urls: any) {
    const post: any = await prisma.posts.create({
        data: {
            userId: userId,
            date: new Date(Date.now()),
            description: description,
        },
    });

    for (const url of urls) {
        await prisma.medias.create({
            data: {
                url: url,
                postId: post.id,
            },
        });
    }
}

export async function createOrDeleteLike(
    userId: number,
    postId: number
): Promise<any> {
    const likeCount = await prisma.likes.count({
        where: {
            userId: userId,
            postId: postId,
        },
    });

    if (likeCount > 0) {
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

export async function createOrDeleteSaved(
    userId: number,
    postId: number
): Promise<any> {
    const savedCount = await prisma.favoris.count({
        where: {
            userId: userId,
            postId: postId,
        },
    });

    if (savedCount > 0) {
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

export async function createComment(
    userId: number,
    postId: number,
    content: string
): Promise<any> {
    const comment = await prisma.comments.create({
        data: {
            userId: userId,
            postId: postId,
            content: content,
        },
    });

    return comment;
}