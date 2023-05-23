import {
    Center,
    Text,
    Input,
    FormLabel,
    Heading,
    Button,
    Link,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";


function RegisterForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    function Register(e: any) {
        e.preventDefault();

        axios({
            method: "post",
            url: "/api/register",
            data: {
                email: email,
                fullname: fullName,
                username: username,
                password : password
            },
        }).then((response) => {
            router.push("/login");
        });
    }

    return (
        <Center flexDir="column" h="100vh">
            <Heading mb={10}>Inscription</Heading>
            <form onSubmit={Register}>
                <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    mb={5}
                    value={email}
                    onChange={(e: any) => {
                        setEmail(e.target.value);
                    }}
                />
                <FormLabel>Full name</FormLabel>
                <Input
                    type="text"
                    value={fullName}
                    onChange={(e: any) => {
                        setFullName(e.target.value);
                    }}
                    mb={5}
                />
                <FormLabel>Username</FormLabel>
                <Input
                    type="text"
                    mb={5}
                    value={username}
                    onChange={(e: any) => {
                        setUserName(e.target.value);
                    }}
                />
                <FormLabel>Mot de passe</FormLabel>
                <Input
                    type="password"
                    mb={5}
                    value={password}
                    onChange={(e: any) => {
                        setPassword(e.target.value);
                    }}
                />
                <Button type="submit" w="full">
                    {"S'inscrire"}
                </Button>
            </form>
            <Text mt={5}>
                Vous avez déjà un compte?{" "}
                <Link href="/login">Se connecter</Link>
            </Text>
        </Center>
    );
}

export default RegisterForm;
