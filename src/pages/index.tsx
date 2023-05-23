import { GetServerSideProps } from "next/types";
import { verifyToken } from "../../utils/jwt";

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

export default function Home({user} :any) {
  return (
    <>
      <div>Bonjour {user.name}</div>
    </>
  )
}
