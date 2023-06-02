import { Button, Flex } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

export default function Nav() {
    const iconStyle = {
        fontSize: "1.5em",
    };
    return (
        <Flex
            flexDir="column"
            width={245}
            h="100vh"
            borderRight="1px"
            borderColor="gray.300"
            p={3}
            position="fixed"
            backgroundColor="white"
        >
            <Image
                src="/logo.png"
                alt="logo"
                width={120}
                height={0}
                style={{
                    paddingLeft: ".75rem",
                    margin: "30px 0",
                }}
            />
            <Flex flexDir="column" w="full" gap={3}>
                <Button
                    variant="ghost"
                    justifyContent="start"
                    gap={2}
                    size="lg"
                    fontSize="1em"
                    fontWeight="normal"
                    px={3}
                    leftIcon={
                        <i
                            className="fa-solid fa-house-blank"
                            style={iconStyle}
                        ></i>
                    }
                >
                    Accueil
                </Button>
                <Button
                    variant="ghost"
                    justifyContent="start"
                    gap={2}
                    size="lg"
                    fontSize="1em"
                    fontWeight="normal"
                    px={3}
                    leftIcon={
                        <i
                            className="fa-regular fa-magnifying-glass"
                            style={iconStyle}
                        ></i>
                    }
                >
                    Recherche
                </Button>
                <Button
                    variant="ghost"
                    justifyContent="start"
                    gap={2}
                    size="lg"
                    fontSize="1em"
                    fontWeight="normal"
                    px={3}
                    leftIcon={
                        <i
                            className="fa-regular fa-paper-plane"
                            style={iconStyle}
                        ></i>
                    }
                >
                    Messages
                </Button>
                <Button
                    variant="ghost"
                    justifyContent="start"
                    gap={2}
                    size="lg"
                    fontSize="1em"
                    fontWeight="normal"
                    px={3}
                    leftIcon={
                        <i
                            className="fa-regular fa-heart"
                            style={iconStyle}
                        ></i>
                    }
                >
                    Notifications
                </Button>
                <Button
                    variant="ghost"
                    justifyContent="start"
                    gap={2}
                    size="lg"
                    fontSize="1em"
                    fontWeight="normal"
                    px={3}
                    leftIcon={
                        <i
                            className="fa-regular fa-square-plus"
                            style={iconStyle}
                        ></i>
                    }
                >
                    Créer
                </Button>
                <Button
                    variant="ghost"
                    justifyContent="start"
                    gap={2}
                    size="lg"
                    fontSize="1em"
                    fontWeight="normal"
                    px={3}
                    leftIcon={
                        <i className="fa-regular fa-user" style={iconStyle}></i>
                    }
                >
                    Profil
                </Button>
            </Flex>
            <Button
                mt="auto"
                variant="ghost"
                justifyContent="start"
                gap={2}
                size="lg"
                fontSize="1em"
                fontWeight="normal"
                px={3}
                leftIcon={
                    <i className="fa-regular fa-bars" style={iconStyle}></i>
                }
            >
                Plus
            </Button>
        </Flex>
    );
}
