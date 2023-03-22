import { NextPage } from 'next'
import LoginForm from '../../components/LoginForm';

interface Props {}

const Login: NextPage<Props> = ({}) => {
  return <div>
    <LoginForm/>
  </div>
}

export default Login;