import { GetServerSideProps } from "next/types";
import { verifyToken } from "../../utils/jwt";
import { Flex, Link, Text, Input, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import {
    alreadyLiked,
    alreadySaved,
    getFollowedUsersPosts,
    getUserDatas,
} from "../../utils/user";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const token = context.req.cookies.jwt;

    if (!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    } else {
        const user = await verifyToken(token, process.env.JWT_SECRET!);
        const loggedInUser = await getUserDatas(user.id);
        const usersFollowedPosts = JSON.parse(
            JSON.stringify(await getFollowedUsersPosts(user.id))
        );

        for (const post of usersFollowedPosts) {
            if (await alreadyLiked(loggedInUser.id, post.id)) {
                post.liked = true;
            } else {
                post.liked = false;
            }

            if (await alreadySaved(loggedInUser.id, post.id)) {
                post.saved = true;
            } else {
                post.saved = false;
            }
        }

        return {
            props: {
                loggedInUser: loggedInUser,
                usersFollowedPosts: usersFollowedPosts,
            },
        };
    }
};

export default function Home({ loggedInUser, usersFollowedPosts }: any) {
    const router = useRouter();

    dayjs.locale("fr");
    dayjs.extend(relativeTime as any);

    const [commentInputs, setCommentInputs] = useState<string[]>([]);
    const [postsSaved, setPostsSaved] = useState<any>({});
    const [postsLiked, setPostsLiked] = useState<any>({});
    const [postsLikesCount, setPostsLikesCount] = useState<any>({});
    const [postsCommentsCount, setPostsCommentsCount] = useState<any>({});
    const [postCommentLoading, setPostCommentLoading] = useState<any>({});

    useEffect(() => {
        for (const post of usersFollowedPosts) {
            setPostsSaved((previous: any) => {
                return { ...previous, [post.id]: post.saved };
            });

            setPostsLiked((previous: any) => {
                return { ...previous, [post.id]: post.liked };
            });

            setPostsLikesCount((previous: any) => {
                return { ...previous, [post.id]: post.likes.length };
            });

            setPostsCommentsCount((previous: any) => {
                return { ...previous, [post.id]: post.comments.length };
            });

            setPostCommentLoading((previous: any) => {
                return { ...previous, [post.id]: false };
            });
        }
    }, []);

    function Logout() {
        axios({
            method: "post",
            url: "/api/logout",
        }).then(() => {
            router.push("/login");
        });
    }

    function handlePostLike(postId: number, action: string) {
        setPostsLiked((previous: any) => {
            return {
                ...previous,
                [postId]: !postsLiked[postId],
            };
        });
        setPostsLikesCount((previous: any) => {
            return {
                ...previous,
                [postId]:
                    action === "like"
                        ? postsLikesCount[postId] + 1
                        : postsLikesCount[postId] - 1,
            };
        });
        axios({
            method: "POST",
            url: "/api/like",
            data: {
                userId: loggedInUser.id,
                postId: postId,
            },
        }).then((response) => console.log(response));
    }

    function handlePostSave(postId: number) {
        setPostsSaved((previous: any) => {
            return {
                ...previous,
                [postId]: !postsSaved[postId],
            };
        });
        axios({
            method: "POST",
            url: "/api/favoris",
            data: {
                userId: loggedInUser.id,
                postId: postId,
            },
        }).then((response) => console.log(response));
    }

    function handlePostComment(postId: number, content: string) {
        setPostCommentLoading((previous: any) => {
            return {
                ...previous,
                [postId]: true,
            };
        });
        if (content) {
            axios({
                method: "POST",
                url: "/api/comment",
                data: {
                    userId: loggedInUser.id,
                    postId: postId,
                    content: content,
                },
            })
                .then((response) => {
                    setCommentInputs((prev: any) => {
                        return [...prev, (prev[postId - 1] = "")];
                    });
                    setPostsCommentsCount((previous: any) => {
                        return {
                            ...previous,
                            [postId]: postsCommentsCount[postId] + 1,
                        };
                    });
                })
                .finally(() => {
                    setPostCommentLoading((previous: any) => {
                        return {
                            ...previous,
                            [postId]: false,
                        };
                    });
                });
        }
    }

    function handleCommentInputsChange(e: any) {
        const { name, value } = e.target;
        const updatedInputValues = [...commentInputs];
        updatedInputValues[name] = value;
        setCommentInputs(updatedInputValues);
    }

    return (
        <Layout loggedInUser={loggedInUser}>
            <Link onClick={Logout}>Se déconnecter</Link>
            <main>
                <div>
                    {usersFollowedPosts.map((post: any, indx: number) => {
                        return (
                            <Flex
                                flexDir="column"
                                key={indx}
                                py={5}
                                w={450}
                                gap={1.5}
                                margin="auto"
                                borderBottom="1px"
                                borderColor="gray.200"
                            >
                                <Flex alignItems="center" gap={2}>
                                    <Link href={`profil/${post.user.username}`}>
                                        <Image
                                            src={post.user.photo}
                                            alt={""}
                                            width="30"
                                            height="30"
                                            style={{
                                                borderRadius: "50%",
                                                border: "1px solid gainsboro",
                                            }}
                                        />
                                    </Link>
                                    <Link
                                        href={`profil/${post.user.username}`}
                                        fontWeight="medium"
                                    >
                                        {post.user.username}
                                    </Link>
                                    <Text
                                        color="blackAlpha.700"
                                        fontSize=".9em"
                                    >
                                        • {dayjs(post.date).fromNow(true)}
                                    </Text>
                                </Flex>
                                <Image
                                    src={post.media[0].url}
                                    width={500}
                                    height={0}
                                    style={{ borderRadius: "4px" }}
                                    alt="post"
                                />
                                <Flex gap={4}>
                                    {postsLiked[post.id] ? (
                                        <i
                                            className="fa-solid fa-heart"
                                            style={{
                                                fontSize: "1.4em",
                                                color: "#ff3040",
                                            }}
                                            onClick={() =>
                                                handlePostLike(
                                                    post.id,
                                                    "dislike"
                                                )
                                            }
                                        ></i>
                                    ) : (
                                        <i
                                            className="fa-regular fa-heart"
                                            style={{ fontSize: "1.4em" }}
                                            onClick={() =>
                                                handlePostLike(post.id, "like")
                                            }
                                        ></i>
                                    )}
                                    <i
                                        className="fa-regular fa-comment"
                                        style={{ fontSize: "1.4em" }}
                                    ></i>
                                    {postsSaved[post.id] ? (
                                        <i
                                            className="fa-solid fa-bookmark"
                                            style={{
                                                fontSize: "1.4em",
                                                marginLeft: "auto",
                                            }}
                                            onClick={() => {
                                                handlePostSave(post.id);
                                            }}
                                        ></i>
                                    ) : (
                                        <i
                                            className="fa-regular fa-bookmark"
                                            style={{
                                                fontSize: "1.4em",
                                                marginLeft: "auto",
                                            }}
                                            onClick={() => {
                                                handlePostSave(post.id);
                                            }}
                                        ></i>
                                    )}
                                </Flex>
                                <Text fontWeight="medium">
                                    {postsLikesCount[post.id]} {"J'aime"}
                                </Text>
                                {post.description && (
                                    <Text>
                                        <Link
                                            href={`profil/${post.user.username}`}
                                            fontWeight="medium"
                                        >
                                            {post.user.username}
                                        </Link>{" "}
                                        {post.description}
                                    </Text>
                                )}
                                <Text color="blackAlpha.700">
                                    Afficher les {postsCommentsCount[post.id]}{" "}
                                    commentaire(s)
                                </Text>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handlePostComment(
                                            post.id,
                                            commentInputs[post.id - 1]
                                        );
                                    }}
                                    style={{ display: "flex" }}
                                >
                                    <Input
                                        autoComplete="off"
                                        placeholder="Ajouter un commentaire..."
                                        onChange={handleCommentInputsChange}
                                        name={(post.id - 1).toString()}
                                        value={commentInputs[post.id - 1]}
                                        variant="ghost"
                                        padding={0}
                                        disabled={postCommentLoading[post.id]}
                                    />
                                    {commentInputs[post.id - 1] &&
                                        (postCommentLoading[post.id] ? (
                                            <Spinner
                                                thickness="3px"
                                                speed="0.75s"
                                                emptyColor="gray.200"
                                                color="blue.300"
                                                size="sm"
                                            />
                                        ) : (
                                            <Link
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePostComment(
                                                        post.id,
                                                        commentInputs[
                                                            post.id - 1
                                                        ]
                                                    );
                                                }}
                                                fontWeight="medium"
                                                color="blue.300"
                                                _hover={{ color: "blue.600" }}
                                                style={{
                                                    textDecoration: "none",
                                                }}
                                            >
                                                Publier
                                            </Link>
                                        ))}
                                </form>
                            </Flex>
                        );
                    })}
                </div>
            </main>
        </Layout>
    );
}
