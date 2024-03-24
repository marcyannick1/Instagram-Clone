import { GetServerSideProps } from "next/types";
import { verifyToken } from "../../utils/jwt";
import { Box, Link, } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { alreadyLiked, alreadySaved, getFollowedUsersPosts, getUserDatas } from "../../utils/user";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import "dayjs/locale/fr";
import Post from "../../components/Home/Post";

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
        // const loggedInUser = await getUserDatas(user.id);
        // const usersFollowedPosts = JSON.parse(JSON.stringify(await getFollowedUsersPosts(user.id)));

        // for (const post of usersFollowedPosts) {
            // if (await alreadyLiked(loggedInUser.id, post.id)) {
        //         post.liked = true;
        //     } else {
        //         post.liked = false;
        //     }

        //     if (await alreadySaved(loggedInUser.id, post.id)) {
        //         post.saved = true;
        //     } else {
        //         post.saved = false;
        //     }
        // }

        return {
            props: {
                loggedInUser: user,
                // usersFollowedPosts: usersFollowedPosts,
            },
        };
    }
};

export default function Home({ loggedInUser }: any) {
    console.log(loggedInUser)

    const router = useRouter();

    // const [commentInputs, setCommentInputs] = useState<string[]>([]);
    // const [postsSaved, setPostsSaved] = useState<any>({});
    // const [postsLiked, setPostsLiked] = useState<any>({});
    // const [postsLikesCount, setPostsLikesCount] = useState<any>({});
    // const [postsCommentsCount, setPostsCommentsCount] = useState<any>({});
    // const [postCommentLoading, setPostCommentLoading] = useState<any>({});
    const [usersFollowedPosts, setUsersFollowedPosts] = useState<any[]>([])

    // useEffect(() => {
    //     for (const post of usersFollowedPosts) {
    //         setPostsSaved((previous: any) => {
    //             return { ...previous, [post.id]: post.saved };
    //         });

    //         setPostsLiked((previous: any) => {
    //             return { ...previous, [post.id]: post.liked };
    //         });

    //         setPostsLikesCount((previous: any) => {
    //             return { ...previous, [post.id]: post.likes.length };
    //         });

    //         setPostsCommentsCount((previous: any) => {
    //             return { ...previous, [post.id]: post.comments.length };
    //         });

    //         setPostCommentLoading((previous: any) => {
    //             return { ...previous, [post.id]: false };
    //         });
    //     }
    // }, [usersFollowedPosts])

    useEffect(() => {
        async function fetchFollowedPosts(){
            axios.get('api/posts').then((response) => {
                setUsersFollowedPosts(response.data)
            }).catch((error) => {
                console.error(error)
            })
        }
        fetchFollowedPosts()
    }, [])

    function Logout() {
        axios({
            method: "post",
            url: "/api/logout",
        }).then(() => {
            router.push("/login");
        });
    }

    // function handlePostLike(postId: number, action: string) {
    //     setPostsLiked((previous: any) => {
    //         return {
    //             ...previous,
    //             [postId]: !postsLiked[postId],
    //         };
    //     });
    //     setPostsLikesCount((previous: any) => {
    //         return {
    //             ...previous,
    //             [postId]: action === "like" ? postsLikesCount[postId] + 1 : postsLikesCount[postId] - 1,
    //         };
    //     });
    //     axios({
    //         method: "POST",
    //         url: "/api/like",
    //         data: {
    //             userId: loggedInUser.id,
    //             postId: postId,
    //         },
    //     }).then((response) => console.log(response));
    // }

    // function handlePostSave(postId: number) {
    //     setPostsSaved((previous: any) => {
    //         return {
    //             ...previous,
    //             [postId]: !postsSaved[postId],
    //         };
    //     });
    //     axios({
    //         method: "POST",
    //         url: "/api/favoris",
    //         data: {
    //             userId: loggedInUser.id,
    //             postId: postId,
    //         },
    //     }).then((response) => console.log(response));
    // }

    // function handlePostComment(postId: number, content: string) {
    //     setPostCommentLoading((previous: any) => {
    //         return {
    //             ...previous,
    //             [postId]: true,
    //         };
    //     });
    //     if (content) {
    //         axios({
    //             method: "POST",
    //             url: "/api/comment",
    //             data: {
    //                 userId: loggedInUser.id,
    //                 postId: postId,
    //                 content: content,
    //             },
    //         })
    //             .then((response) => {
    //                 setCommentInputs((prev: any) => {
    //                     return [...prev, (prev[postId - 1] = "")];
    //                 });
    //                 setPostsCommentsCount((previous: any) => {
    //                     return {
    //                         ...previous,
    //                         [postId]: postsCommentsCount[postId] + 1,
    //                     };
    //                 });
    //             })
    //             .finally(() => {
    //                 setPostCommentLoading((previous: any) => {
    //                     return {
    //                         ...previous,
    //                         [postId]: false,
    //                     };
    //                 });
    //             });
    //     }
    // }

    // function handleCommentInputsChange(e: any) {
    //     const { name, value } = e.target;
    //     const updatedInputValues = [...commentInputs];
    //     updatedInputValues[name] = value;
    //     setCommentInputs(updatedInputValues);
    // }

    return (
        <Layout loggedInUser={loggedInUser}>
            <Link onClick={Logout}>Se déconnecter</Link>
            <main>
                <Box>
                    {usersFollowedPosts.map((post: any, indx: number) => {
                        return (
                            <Post post={post} key={indx}/>
                        )
                    })}
                </Box>
            </main>
        </Layout>
    );
}
