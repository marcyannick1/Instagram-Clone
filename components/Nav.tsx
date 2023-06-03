import { Button, Flex, Link } from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function Nav({ loggedInUser }: any) {
    const router = useRouter();
    console.log(router);

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
                onClick={() => router.push("/")}
            />
            <Flex flexDir="column" gap={3}>
                <Link as={NextLink} href="/" w="full">
                    <Button
                        variant="ghost"
                        justifyContent="start"
                        gap={2}
                        size="lg"
                        fontSize="1em"
                        fontWeight={router.asPath === "/" ? "bold" : "normal"}
                        px={3}
                        w="full"
                        leftIcon={
                            <i
                                className={`${
                                    router.asPath === "/"
                                        ? "fa-solid"
                                        : "fa-regular"
                                } fa-house-blank`}
                                style={iconStyle}
                            ></i>
                        }
                    >
                        Accueil
                    </Button>
                </Link>
                <Link as={NextLink} href="#" w="full">
                    <Button
                        variant="ghost"
                        justifyContent="start"
                        gap={2}
                        size="lg"
                        fontSize="1em"
                        fontWeight={router.asPath === "#" ? "bold" : "normal"}
                        px={3}
                        w="full"
                        leftIcon={
                            <i
                                className="fa-regular fa-magnifying-glass"
                                style={iconStyle}
                            ></i>
                        }
                    >
                        Recherche
                    </Button>
                </Link>
                <Link as={NextLink} href="#" w="full">
                    <Button
                        variant="ghost"
                        justifyContent="start"
                        gap={2}
                        size="lg"
                        fontSize="1em"
                        fontWeight="normal"
                        px={3}
                        w="full"
                        leftIcon={
                            <i
                                className="fa-regular fa-paper-plane"
                                style={iconStyle}
                            ></i>
                        }
                    >
                        Messages
                    </Button>
                </Link>
                <Link as={NextLink} href="#" w="full">
                    <Button
                        variant="ghost"
                        justifyContent="start"
                        gap={2}
                        size="lg"
                        fontSize="1em"
                        fontWeight="normal"
                        px={3}
                        w="full"
                        leftIcon={
                            <i
                                className="fa-regular fa-heart"
                                style={iconStyle}
                            ></i>
                        }
                    >
                        Notifications
                    </Button>
                </Link>
                <Link as={NextLink} href="#" w="full">
                    <Button
                        variant="ghost"
                        justifyContent="start"
                        gap={2}
                        size="lg"
                        fontSize="1em"
                        fontWeight="normal"
                        px={3}
                        w="full"
                        leftIcon={
                            <i
                                className="fa-regular fa-square-plus"
                                style={iconStyle}
                            ></i>
                        }
                    >
                        Créer
                    </Button>
                </Link>
                <Link
                    as={NextLink}
                    href={`profil/${loggedInUser.username}`}
                    w="full"
                >
                    <Button
                        variant="ghost"
                        justifyContent="start"
                        gap={2}
                        size="lg"
                        fontSize="1em"
                        fontWeight={
                            router.asPath === `/profil/${loggedInUser.username}`
                                ? "bold"
                                : "normal"
                        }
                        px={3}
                        w="full"
                        leftIcon={
                            <Image
                                src={loggedInUser.photo}
                                alt={""}
                                width="30"
                                height="30"
                                style={{
                                    borderRadius: "50%",
                                    border:
                                        router.asPath ===
                                        `/profil/${loggedInUser.username}`
                                            ? "3px solid black"
                                            : "1px solid gainsboro",
                                }}
                            />
                        }
                    >
                        Profil
                    </Button>
                </Link>
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
