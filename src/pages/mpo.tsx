import {
    Alert,
    AlertIcon,
    Button,
    Center,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
} from "@chakra-ui/react";
import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

interface Props {}

const Mpo: NextPage<Props> = ({}) => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    function Mpo(e: any) {
        e.preventDefault();
        
        axios({
            method: "post",
            url: "/api/mpo",
            data: {
                email: email,
            },
        }).then((response) => {
            router.push("/passwordchange");
        }).catch((err) => {
            setError(err.response.data)
        });
    }
    return (
        <Center h="100vh" flexDir="column">
            <Heading mb={10}>Mot de passe oublié</Heading>
            <form onSubmit={Mpo}>
                <FormLabel>Email address</FormLabel>
                <Input
                    type="email"
                    mb={5}
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <Button type="submit" w="full">
                    Suivant
                </Button>
            </form>
            {error &&
            <Alert status="error" w={300}>
                <AlertIcon />
                {error}
            </Alert>}
        </Center>
    );
};

export default Mpo;
