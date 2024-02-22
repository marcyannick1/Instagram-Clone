import { Link, Text, Flex, Box, Input, Spinner } from "@chakra-ui/react";
import { NextPage, GetServerSideProps } from "next";
import { getPostById } from "../../../utils/post";
import Image from "next/image";
import Layout from "../../../components/Layout";
import { verifyToken } from "../../../utils/jwt";
import { alreadyLiked, alreadySaved, getUserDatas, isFollowed } from "../../../utils/user";
import NextLink from "next/link";
import axios from "axios";
import { useState } from "react";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

interface Props {}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { postId } = ctx.query;
    const post = JSON.parse(JSON.stringify(await getPostById(parseInt(postId as string))));

    const token = ctx.req.cookies.jwt;

    const user = token ? await verifyToken(token, process.env.JWT_SECRET!) : null;
    const loggedInUser = await getUserDatas(user.id);

    const postUserIsFollowed = loggedInUser.id !== post.user.id ? await isFollowed(loggedInUser.id, post.user.id) : null;

    post.liked = await alreadyLiked(loggedInUser.id, post.id);
    post.saved = await alreadySaved(loggedInUser.id, post.id);

    return {
        props: {
            loggedInUser: loggedInUser,
            post: post,
            isFollowed: postUserIsFollowed,
        },
    };
};

const Post: NextPage<any> = ({ post, loggedInUser, isFollowed }) => {
    console.log(post);

    dayjs.locale("fr");
    dayjs.extend(relativeTime as any);

    const [postLiked, setPostLiked] = useState<boolean>(post.liked);
    const [postLikesCount, setPostLikesCount] = useState<number>(post.likes.length);
    const [postSaved, setPostSaved] = useState<boolean>(post.saved);

    const [suscribeToHim, setSuscribedToHim] = useState(isFollowed);
    const [suscribeLoading, setSuscribeLoading] = useState(false);

    const [commentInput, setCommentInput] = useState<string>("");
    const [postCommentLoading, setPostCommentLoading] = useState<boolean>(false);

    const [comments, setComments] = useState<any[]>(post.comments);

    function handlePostLike(postId: number, action: string) {
        setPostLiked((prev) => !prev);
        setPostLikesCount((prev) => (action === "like" ? prev + 1 : prev - 1));

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
        setPostSaved((prev) => !prev);
        axios({
            method: "POST",
            url: "/api/favoris",
            data: {
                userId: loggedInUser.id,
                postId: postId,
            },
        }).then((response) => console.log(response));
    }

    function handleSuscribe() {
        setSuscribeLoading(true);
        axios({
            method: "POST",
            url: "/api/suscribtion",
            data: {
                suscriberId: loggedInUser.id,
                suscriberToId: post.user.id,
            },
        })
            .then(() => {
                setSuscribedToHim((previous: any) => !previous);
            })
            .finally(() => {
                setSuscribeLoading(false);
            });
    }

    function handleCommentInputChange(e: any) {
        const { value } = e.target;
        setCommentInput(value);
    }

    function handlePostComment(postId: number, content: string) {
        setPostCommentLoading((previous: any) => !previous);
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
                .then(() => {
                    setComments([
                        {
                            id: null,
                            content: commentInput,
                            userId: loggedInUser.id,
                            postId: postId,
                            user: loggedInUser,
                        },
                        ...comments,
                    ]);
                    setCommentInput("");
                })
                .finally(() => {
                    setPostCommentLoading(false);
                });
        }
    }

    return (
        <Layout loggedInUser={loggedInUser} style={{ height: "100vh", display: "flex" }}>
            <Flex border="1px" borderColor="blackAlpha.300" maxWidth="max-content" margin="auto">
                <Flex borderRight="1px" borderColor="blackAlpha.200">
                    {/* {post.media.map((media: any, i: number) => (
                        <img
                            style={{ maxHeight: "600px" }}
                            key={i}
                            src={media.url}
                        />
                    ))} */}
                    <img style={{ maxHeight: "550px" }} src={post.media[0].url} alt="" />
                </Flex>
                <Flex width={340} flexDir="column">
                    <Flex gap={3} alignItems="center" p={4} borderBottom="1px" borderColor="blackAlpha.200">
                        <img
                            width={30}
                            src={post.user.photo}
                            style={{
                                borderRadius: "50%",
                                border: "1px solid gainsboro",
                            }}
                        />
                        <Link as={NextLink} href={`/profil/${post.user.username}`} fontWeight="medium" fontSize=".9em">
                            {post.user.username}
                        </Link>
                        {suscribeToHim != null &&
                            (suscribeToHim ? (
                                <Flex role="button" fontSize=".9em" color="blackAlpha.500" fontWeight="medium" gap={1} onClick={handleSuscribe} alignItems="center">
                                    <Text color="black">•</Text> {suscribeLoading ? <Spinner thickness="3px" speed="0.75s" emptyColor="gray.200" color="blue.300" size="sm" marginLeft={3} /> : "Suivi(e)"}
                                </Flex>
                            ) : (
                                <Flex role="button" fontSize=".9em" color="blue.400" fontWeight="medium" gap={1} onClick={handleSuscribe} alignItems="center">
                                    <Text color="black">•</Text>
                                    {suscribeLoading ? <Spinner thickness="3px" speed="0.75s" emptyColor="gray.200" color="blue.300" size="sm" marginLeft={3} /> : "Suivre"}
                                </Flex>
                            ))}
                    </Flex>
                    <Flex flexDir="column" p={4} borderBottom="1px" borderColor="blackAlpha.200" height="332px" overflowY="scroll" gap={4}>
                        {post.description && (
                            <Flex gap={3} alignItems="center" mb={2}>
                                <img
                                    width={30}
                                    src={post.user.photo}
                                    style={{
                                        borderRadius: "50%",
                                        border: "1px solid gainsboro",
                                    }}
                                />
                                <Text>
                                    <Link as={NextLink} href={`/profil/${post.user.username}`} fontWeight="medium" fontSize=".9em">
                                        {post.user.username}
                                    </Link>{" "}
                                    {post.description}
                                </Text>
                            </Flex>
                        )}
                        {post.comments.length > 0 ? (
                            comments.map((comment, idx) => {
                                return (
                                    <Flex gap={3} alignItems="center" key={idx}>
                                        <img
                                            width={30}
                                            src={comment.user.photo}
                                            style={{
                                                borderRadius: "50%",
                                                border: "1px solid gainsboro",
                                            }}
                                        />
                                        <Flex flexDir="column">
                                            <Text>
                                                <Link as={NextLink} href={`/profil/${comment.user.username}`} fontWeight="medium" fontSize=".9em">
                                                    {comment.user.username}
                                                </Link>{" "}
                                                {comment.content}
                                            </Text>
                                            <Text fontSize="xs" color="blackAlpha.700">
                                                {dayjs(comment.date).fromNow()}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                );
                            })
                        ) : (
                            <Flex height="100%" alignItems="center">
                                <Text textAlign="center" fontWeight="bold" fontSize="1.4em" marginTop={10}>
                                    {"Aucun commentaire pour l'instant."}
                                </Text>
                            </Flex>
                        )}
                    </Flex>
                    <Flex p={4} flexDir="column" borderBottom="1px" borderColor="blackAlpha.200">
                        <Flex gap={4} width="100%">
                            {postLiked ? (
                                <i
                                    className="fa-solid fa-heart"
                                    style={{
                                        fontSize: "1.4em",
                                        color: "#ff3040",
                                    }}
                                    onClick={() => handlePostLike(post.id, "dislike")}
                                ></i>
                            ) : (
                                <i className="fa-regular fa-heart" style={{ fontSize: "1.4em" }} onClick={() => handlePostLike(post.id, "like")}></i>
                            )}
                            <i className="fa-regular fa-comment" style={{ fontSize: "1.4em" }}></i>
                            {postSaved ? (
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
                        <Flex flexDir="column">
                            <Text fontWeight="medium">
                                {postLikesCount} {"J'aime"}
                            </Text>
                            <Text fontSize="sm" color="blackAlpha.700">
                                {dayjs(post.date).fromNow()}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex alignItems="center" px={4} py={1} gap={4}>
                        <i className="fa-regular fa-face-smile fa-xl"></i>
                        <Input autoComplete="off" placeholder="Ajouter un commentaire..." onChange={handleCommentInputChange} name={(post.id - 1).toString()} value={commentInput} variant="ghost" padding={0} disabled={postCommentLoading} />
                        {commentInput && (
                            <Box role="button" color="blue.400" fontWeight="medium" onClick={() => handlePostComment(post.id, commentInput)}>
                                {postCommentLoading ? <Spinner thickness="3px" speed="0.75s" emptyColor="gray.200" color="blue.300" size="sm" /> : "Publier"}
                            </Box>
                        )}
                    </Flex>
                </Flex>
            </Flex>
        </Layout>
    );
};

export default Post;
