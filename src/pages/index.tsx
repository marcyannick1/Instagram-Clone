import { GetServerSideProps } from "next/types";
import { verifyToken } from "../../utils/jwt";
import { Link } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import PostsForm from "../../components/PostsForm";
import { getFollowedUsersPosts } from "../../utils/user";

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
        const usersFollowedPosts = JSON.parse(JSON.stringify(await getFollowedUsersPosts(user.id)))
        return {
            props: {
                loggedInUser: user,
                usersFollowedPosts : usersFollowedPosts
            },
        };
    }
};

export default function Home({ loggedInUser, usersFollowedPosts }: any) {
    const router = useRouter();

    console.log(usersFollowedPosts)

    function Logout() {
        axios({
            method: "post",
            url: "/api/logout",
        }).then(() => {
            router.push("/login");
        });
    }
    return (
        <>
            <div>Bonjour {loggedInUser.name}</div>
            <Link onClick={Logout}>Se déconnecter</Link>
            <PostsForm loggedInUser = {loggedInUser}/>
            <div>
                Users Followed Posts :
                {usersFollowedPosts.map((post :any, indx :number) => {
                    return <div key={indx}>
                        <p>{post.user.name}</p>
                        <p>{post.date}</p>
                        <img src={post.media[0].url} width={300}></img>
                        <p>{post.description}</p>
                    </div>
                })}
            </div>
        </>
    );
}
