import {
    Center,
    Text,
    Input,
    FormLabel,
    Heading,
    Button,
    Link,
    Box,
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
    const [loading, setLoading] = useState(false);

    function Register(e: any) {
        setLoading(true);
        e.preventDefault();

        axios({
            method: "post",
            url: "/api/register",
            data: {
                email: email,
                fullname: fullName,
                username: username,
                password: password,
            },
        }).then((response) => {
            router.push("/login");
        }).finally(() => {
            setLoading(false);
        })
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
                    style={{ padding: "35px 0 15px" }}
                />
                <Text fontWeight="medium" mb={4} fontSize="lg" color="blackAlpha.600">Inscrivez-vous pour voir les photos et vidéos de vos amis.</Text>
                <form onSubmit={Register}>
                    <Input
                        placeholder="Adresse e-mail"
                        type="email"
                        mb={2}
                        value={email}
                        onChange={(e: any) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <Input
                        placeholder="Nom complet"
                        type="text"
                        value={fullName}
                        onChange={(e: any) => {
                            setFullName(e.target.value);
                        }}
                        mb={2}
                    />
                    <Input
                        placeholder="Nom d'utilisateur"
                        type="text"
                        mb={2}
                        value={username}
                        onChange={(e: any) => {
                            setUserName(e.target.value);
                        }}
                    />
                    <Input
                        placeholder="Mot de passe"
                        type="password"
                        mb={5}
                        value={password}
                        onChange={(e: any) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <Button isLoading={loading} type="submit" w="full" colorScheme="twitter">
                        {"S'inscrire"}
                    </Button>
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
                    Vous avez déjà un compte ?{" "}
                    <Link href="login" color="blue.400" fontWeight="medium">Se connecter</Link>
                </Text>
            </Box>
        </Center>
    );
}

export default RegisterForm;
