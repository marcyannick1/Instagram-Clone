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

function LoginForm() {
    return (
        <Center flexDir="column" h="100vh">
            <Heading mb={10}>Connexion</Heading>
            <FormControl w={250}>
                <FormLabel>Email</FormLabel>
                <Input type="email" mb={5} />
                <FormLabel>Mot de passe</FormLabel>
                <Input type="password" mb={5} />
                <Button type="submit" w="full">
                    {"S'inscrire"}
                </Button>
            </FormControl>
            <Text mt={5}>
                {"Vous n'avez pas de compte? "}
                <Link href="/register">{"S'inscrire"}</Link>
            </Text>
        </Center>
    );
}

export default LoginForm;