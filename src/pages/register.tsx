import { NextPage } from 'next'
import RegisterForm from '../../components/Register/RegisterForm'
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

const Register: NextPage<Props> = ({}) => {
  return <div>
    <RegisterForm/>
  </div>
}

export default Register;