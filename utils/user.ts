import { Comments, Likes, Medias, Posts, Prisma, PrismaClient, Suscribtions, User } from "@prisma/client";

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

export async function createPost(userId: number, description: string, urls: Medias[]): Promise<void> {
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
