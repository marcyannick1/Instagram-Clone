import { Button, Flex, Link, useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Notifs from "./Notifs";
import PostsForm from "./PostsForm";
import Search from "./Search";

export default function Nav({ loggedInUser }: any) {
    const router = useRouter();

    const [showSearchTab, setShowSearchTab] = useState(false);
    const [showNotifsTab, setShowNotifsTab] = useState(false);
    const [showPostsFormTab, setShowPostsFormTab] = useState(false);

    const iconStyle = {
        fontSize: "1.5em",
    };
    return (
        <Flex h="100vh" position="fixed" zIndex={10}>
            <Flex
                flexDir="column"
                width={245}
                borderRight="1px"
                borderColor="gray.300"
                p={3}
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
                        cursor: "pointer"
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
                            fontWeight={
                                router.pathname === "/" &&
                                !showNotifsTab &&
                                !showSearchTab
                                    ? "bold"
                                    : "normal"
                            }
                            px={3}
                            w="full"
                            leftIcon={
                                <i
                                    className={`${
                                        router.pathname === "/" &&
                                        !showNotifsTab &&
                                        !showSearchTab
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
                    <Link
                        as={NextLink}
                        href="#"
                        w="full"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowSearchTab(!showSearchTab);
                            setShowNotifsTab(false);
                        }}
                    >
                        <Button
                            variant="ghost"
                            justifyContent="start"
                            gap={2}
                            size="lg"
                            fontSize="1em"
                            fontWeight={showSearchTab ? "bold" : "normal"}
                            px={3}
                            w="full"
                            leftIcon={
                                <i
                                    className={`${
                                        showSearchTab
                                            ? "fa-solid"
                                            : "fa-regular"
                                    } fa-magnifying-glass`}
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
                    <Link
                        as={NextLink}
                        href="#"
                        w="full"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowNotifsTab(!showNotifsTab);
                            setShowSearchTab(false);
                        }}
                    >
                        <Button
                            variant="ghost"
                            justifyContent="start"
                            gap={2}
                            size="lg"
                            fontSize="1em"
                            fontWeight={showNotifsTab ? "bold" : "normal"}
                            px={3}
                            w="full"
                            leftIcon={
                                <i
                                    className={`${
                                        showNotifsTab
                                            ? "fa-solid"
                                            : "fa-regular"
                                    } fa-heart`}
                                    style={iconStyle}
                                ></i>
                            }
                        >
                            Notifications
                        </Button>
                    </Link>
                    <Link
                        as={NextLink}
                        href="#"
                        w="full"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowPostsFormTab(!showPostsFormTab);
                        }}
                    >
                        <Button
                            variant="ghost"
                            justifyContent="start"
                            gap={2}
                            size="lg"
                            fontSize="1em"
                            fontWeight={showPostsFormTab ? "bold" : "normal"}
                            px={3}
                            w="full"
                            leftIcon={
                                <i
                                    className={`${
                                        showPostsFormTab
                                            ? "fa-solid"
                                            : "fa-regular"
                                    } fa-square-plus`}
                                    style={iconStyle}
                                ></i>
                            }
                        >
                            Créer
                        </Button>
                    </Link>
                    <Link
                        as={NextLink}
                        href={`/profil/${loggedInUser.username}`}
                        w="full"
                    >
                        <Button
                            variant="ghost"
                            justifyContent="start"
                            gap={2}
                            size="lg"
                            fontSize="1em"
                            fontWeight={
                                router.pathname === "/profil/[username]" &&
                                router.query.username ===
                                    loggedInUser.username &&
                                !showNotifsTab &&
                                !showSearchTab
                                    ? "bold"
                                    : "normal"
                            }
                            px={3}
                            w="full"
                            leftIcon={
                                <Image
                                    src={loggedInUser.photo}
                                    alt={""}
                                    width="24"
                                    height="24"
                                    style={{
                                        borderRadius: "50%",
                                        border:
                                            router.pathname ===
                                                "/profil/[username]" &&
                                            router.query.username ===
                                                loggedInUser.username &&
                                            !showNotifsTab &&
                                            !showSearchTab
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
            {showSearchTab && <Search />}
            {showNotifsTab && <Notifs />}
            <PostsForm
                loggedInUser={loggedInUser}
                modalIsOpen={showPostsFormTab}
                setModalIsOpen={setShowPostsFormTab}
            />
        </Flex>
    );
}
