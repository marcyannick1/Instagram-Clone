import { Button, Center, Text, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import axios from "axios";
import { NextPage } from "next";
import router from "next/router";
import { useState } from "react";

interface Props {}

const PasswordChange: NextPage<Props> = ({}) => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    return (
        <Center h="100vh" flexDir="column">
            <Text>Entrez un nouveau mot de passe</Text>
            <InputGroup size="md" w={300} mt={5}>
                <Input
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    placeholder="Enter password"
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
            <InputGroup size="md" w={300} mt={5}>
                <Input
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    placeholder="Enter password"
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </Center>
    );
};

export default PasswordChange;
