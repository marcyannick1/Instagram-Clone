import { GetServerSideProps } from "next/types";
import { verifyToken } from "../../utils/jwt";
import { Button, Flex, Link, Text, Input } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import PostsForm from "../../components/PostsForm";
import {
    alreadyLiked,
    alreadySaved,
    getFollowedUsersPosts,
    getUserDatas,
} from "../../utils/user";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Image from "next/image";

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

    const [commentInputs, setCommentInputs] = useState<string[]>([]);
    const [postsSaved, setPostsSaved] = useState<any>({});
    const [postsLiked, setPostsLiked] = useState<any>({});
    const [postsLikesCount, setPostsLikesCount] = useState<any>({});

    useEffect(() => {
        for (const post of usersFollowedPosts) {
            setPostsSaved((previous: any) => {
                return { ...previous, [post.id]: post.saved };
            });
        }

        for (const post of usersFollowedPosts) {
            setPostsLiked((previous: any) => {
                return { ...previous, [post.id]: post.liked };
            });
        }

        for (const post of usersFollowedPosts) {
            setPostsLikesCount((previous: any) => {
                return { ...previous, [post.id]: post.likes.length };
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
        if (content) {
            axios({
                method: "POST",
                url: "/api/comment",
                data: {
                    userId: loggedInUser.id,
                    postId: postId,
                    content: content,
                },
            }).then((response) => console.log(response));
        }
    }

    function handleCommentInputsChange(e: any) {
        const { name, value } = e.target;
        const updatedInputValues = [...commentInputs];
        updatedInputValues[name] = value;
        setCommentInputs(updatedInputValues);
    }

    console.log(usersFollowedPosts);

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
                                w={500}
                                gap={2}
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
                                    <Text>{post.date}</Text>
                                </Flex>
                                <Image
                                    src={post.media[0].url}
                                    width={500}
                                    height={0}
                                    style={{ borderRadius: "4px" }}
                                    alt="profil pic"
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
                                            onClick={()=>{
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
                                            onClick={()=>{
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
                                        </Link>
                                        {" "}{post.description}
                                    </Text>
                                )}
                                <Text>
                                    Afficher les {post.comments.length}{" "}
                                    commentaire(s)
                                </Text>
                                <form
                                    onSubmit={() =>
                                        handlePostComment(
                                            post.id,
                                            commentInputs[post.id - 1]
                                        )
                                    }
                                    style={{ display: "flex" }}
                                >
                                    <Input
                                        placeholder="Ajouter un commentaire"
                                        onChange={handleCommentInputsChange}
                                        name={(post.id - 1).toString()}
                                        value={commentInputs[post.id - 1]}
                                        variant="ghost"
                                        padding={0}
                                    />
                                    {commentInputs[post.id - 1] && (
                                        <Button
                                            onClick={() =>
                                                handlePostComment(
                                                    post.id,
                                                    commentInputs[post.id - 1]
                                                )
                                            }
                                        >
                                            Publier
                                        </Button>
                                    )}
                                </form>
                            </Flex>
                        );
                    })}
                </div>
            </main>
        </Layout>
    );
}
