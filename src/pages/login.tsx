import { NextPage } from "next";
import LoginForm from "../../components/Login/LoginForm";
import { GetServerSideProps } from "next/types";
import { verifyToken } from "../../utils/jwt";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const token = context.req.cookies.jwt;

    if (token) {
        const user = await verifyToken(token, process.env.JWT_SECRET!);
        if (user) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
            };
        }
    }

    return {
        props: {},
    };
};

interface Props {}

const Login: NextPage<Props> = ({}) => {
    return (
        <div>
            <LoginForm />
        </div>
    );
};

export default Login;
