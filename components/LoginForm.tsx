import {
    Center,
    Text,
    FormControl,
    Input,
    FormLabel,
    Heading,
    Button,
    Link,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from 'next/router'

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter()

    function Login(e: any) {
        e.preventDefault();

        axios({
            method: "post",
            url: "/api/login",
            data: {
                email: email,
                password: password,
            },
        }).then(function () {
            router.push("/");
        }).catch((err) => console.log(err.response));
    }

    return (
        <Center flexDir="column" h="100vh">
            <Heading mb={10}>Connexion</Heading>
            <form onSubmit={Login}>
                <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    mb={5}
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <FormLabel>Mot de passe</FormLabel>
                <Input
                    type="password"
                    mb={5}
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <Button type="submit" w="full">
                    {"S'inscrire"}
                </Button>
            </form>
            <Text mt={5}>
                {"Vous n'avez pas de compte? "}
                <Link href="/register">{"S'inscrire"}</Link>
            </Text>
        </Center>
    );
}

export default LoginForm;
