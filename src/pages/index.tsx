import { GetServerSideProps } from "next/types";
import { verifyToken } from "../../utils/jwt";
import { Link } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";

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
        return {
            props: {
                user: user,
            },
        };
    }
};

export default function Home({ user }: any) {
    const router = useRouter();

    function Logout() {
        axios({
            method: "post",
            url: "/api/logout",
        }).then(() => {
            router.push('/login')
        })
    }
    return (
        <>
            <div>Bonjour {user.name}</div>
            <Link onClick={Logout}>Se déconnecter</Link>
        </>
    );
}
