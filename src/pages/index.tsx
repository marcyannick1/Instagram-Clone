import { GetServerSideProps } from "next/types";
import { verifyToken } from "../../utils/jwt";
import { Button, Link, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import PostsForm from "../../components/PostsForm";
import { getFollowedUsersPosts } from "../../utils/user";
import { useState } from "react";

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
        const usersFollowedPosts = JSON.parse(
            JSON.stringify(await getFollowedUsersPosts(user.id))
        );
        return {
            props: {
                loggedInUser: user,
                usersFollowedPosts: usersFollowedPosts,
            },
        };
    }
};

export default function Home({ loggedInUser, usersFollowedPosts }: any) {
    const router = useRouter();

    const [commentInputs, setCommentInputs] = useState<string[]>([]);

    console.log(usersFollowedPosts);

    function Logout() {
        axios({
            method: "post",
            url: "/api/logout",
        }).then(() => {
            router.push("/login");
        });
    }

    function handlePostLike(postId: number) {
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

    return (
        <>
            <div>Bonjour {loggedInUser.name}</div>
            <Link onClick={Logout}>Se déconnecter</Link>
            <PostsForm loggedInUser={loggedInUser} />
            <div>
                Users Followed Posts :
                {usersFollowedPosts.map((post: any, indx: number) => {
                    return (
                        <div key={indx} style={{ margin: "20px 0" }}>
                            <Link href={`profil/${post.user.username}`}>{post.user.name}</Link>
                            <p>{post.date}</p>
                            <img src={post.media[0].url} width={300}></img>
                            <p>Description: {post.description}</p>
                            <Link
                                color="teal.500"
                                onClick={() => handlePostLike(post.id)}
                            >
                                Liker
                            </Link>
                            <br />
                            <Link
                                color="teal.500"
                                onClick={() => handlePostSave(post.id)}
                            >
                                Enregistrer
                            </Link>
                            <p>{post.likes.length} Like(s)</p>
                            <p>{post.comments.length} Comment(s)</p>
                            <form>
                                <Textarea
                                    placeholder="Ajouter un commentaire"
                                    onChange={handleCommentInputsChange}
                                    name={(post.id - 1).toString()}
                                    value={commentInputs[post.id - 1]}
                                />

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
                            </form>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
