import { NextPage } from 'next'
import RegisterForm from '../../components/RegisterForm'

interface Props {}

const Register: NextPage<Props> = ({}) => {
  return <div>
    <RegisterForm/>
  </div>
}

export default Register;