import {
    Center,
    Text,
    Input,
    FormLabel,
    Heading,
    Button,
    Link,
    Alert,
    AlertIcon,
    Box,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";

function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function Login(e: any) {
        e.preventDefault();

        axios({
            method: "post",
            url: "/api/login",
            data: {
                email: email,
                password: password,
            },
        })
            .then(function () {
                router.push("/");
            })
            .catch((err) => {
                setError(err.response.data);
            });
    }

    return (
        <Center flexDir="column" h="100vh" textAlign="center">
            <Center
                border="1px"
                borderColor="gray.300"
                px={10}
                py={5}
                width={380}
                display="flex"
                flexDir="column"
                mb={2}
                rounded={2}
            >
                <img
                    src="logo.png"
                    alt=""
                    width={180}
                    style={{ padding: "35px 0" }}
                />
                <form onSubmit={Login}>
                    <Input
                        type="email"
                        mb={2}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        placeholder="Nom d'utilisateur ou e-mail"
                    />
                    <Input
                        type="password"
                        mb={4}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder="Mot de passe"
                    />
                    <Button type="submit" w="full" mb={5} colorScheme="twitter">
                        Se connecter
                    </Button>
                    {error && (
                        <Text color="red" mb={5}>{error}</Text>
                    )}
                    <Link as={NextLink} href="#" color="blue.600">
                        Mot de passe oublié
                    </Link>
                </form>
            </Center>
            <Box
                border="1px"
                borderColor="gray.300"
                px={10}
                py={5}
                width={380}
                rounded={2}
            >
                <Text>
                    {"Vous n'avez pas de compte "}
                    <Link
                        as={NextLink}
                        href="register"
                        color="blue.400"
                        fontWeight="medium"
                    >
                        Inscrivez-vous
                    </Link>
                </Text>
            </Box>
        </Center>
    );
}

export default LoginForm;
