import { NextPage, GetServerSideProps } from "next";
import {
    getFollowersCount,
    getPostsCount,
    getSuiviesCount,
    getUserDatas,
    getUserIdByUsername,
    getUserPosts,
    isFollowed,
} from "../../../utils/user";
import { verifyToken } from "../../../utils/jwt";
import {
    Box,
    Button,
    Flex,
    Input,
    ListItem,
    Text,
    UnorderedList,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import Image from "next/image";
import { Spinner } from "@chakra-ui/react";

interface Props {}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const token = ctx.req.cookies.jwt;

    const loggedInUser = token
        ? await verifyToken(token, process.env.JWT_SECRET!)
        : null;

    const username: any = ctx.query.username;
    const userId = await getUserIdByUsername(username);

    const userDatas = await getUserDatas(userId);

    const suscribedToHim: any = loggedInUser
        ? await isFollowed(loggedInUser.id, userId)
        : null;
    const suscribedToMe: any = loggedInUser
        ? await isFollowed(userId, loggedInUser.id)
        : null;

    const postsCount = await getPostsCount(userId);
    const followersCount = await getFollowersCount(userId);
    const suiviesCount = await getSuiviesCount(userId);
    const userPosts = JSON.parse(JSON.stringify(await getUserPosts(userId)));

    return {
        props: {
            user: userDatas,
            loggedInUser: loggedInUser,
            suscribedToHim: suscribedToHim,
            suscribedToMe: suscribedToMe,
            postsCount: postsCount,
            followersCount: followersCount,
            suiviesCount: suiviesCount,
            userPosts: userPosts,
        },
    };
};

const Profil: NextPage<Props> = ({
    user,
    loggedInUser,
    suscribedToHim,
    suscribedToMe,
    postsCount,
    followersCount,
    suiviesCount,
    userPosts,
}: any) => {
    const router = useRouter();

    console.log(userPosts);

    const [suscribeToHim, setSuscribedToHim] = useState(suscribedToHim);
    const [suscribeToMe, setSuscribedToMe] = useState(suscribedToMe);

    function handleSuscribe() {
        axios({
            method: "POST",
            url: "/api/suscribtion",
            data: {
                suscriberId: loggedInUser.id,
                suscriberToId: user.id,
            },
        }).then(() => {
            setSuscribedToHim((previous: any) => !previous);
        });
    }

    let Buttons;

    if (loggedInUser) {
        if (loggedInUser.id == user.id) {
            Buttons = (
                <>
                    <Button minWidth="100px" size="sm">
                        Modifier le profil
                    </Button>
                </>
            );
        } else if (!suscribeToHim && !suscribeToMe) {
            Buttons = (
                <Flex gap={2}>
                    <Button
                        minWidth="100px"
                        size="sm"
                        colorScheme="twitter"
                        onClick={handleSuscribe}
                    >
                        Suivre
                    </Button>
                    <Button minWidth="100px" size="sm">
                        Contacter
                    </Button>
                </Flex>
            );
        } else if (!suscribeToHim && suscribeToMe) {
            Buttons = (
                <Flex gap={2}>
                    <Button
                        minWidth="100px"
                        size="sm"
                        width={100}
                        colorScheme="twitter"
                        onClick={handleSuscribe}
                    >
                        Suivre en retour
                    </Button>
                    <Button minWidth="100px" size="sm">
                        Contacter
                    </Button>
                </Flex>
            );
        } else if (
            (suscribeToHim && suscribeToMe) ||
            (suscribeToHim && !suscribeToMe)
        ) {
            Buttons = (
                <Flex gap={2}>
                    <Button minWidth="100px" size="sm" onClick={handleSuscribe}>
                        Suivi
                    </Button>
                    <Button minWidth="100px" size="sm">
                        Contacter
                    </Button>
                </Flex>
            );
        }
    } else {
        Buttons = (
            <>
                <Button
                    colorScheme="twitter"
                    onClick={() => router.push("/login")}
                >
                    Suivre
                </Button>
                <Button>Contacter</Button>
            </>
        );
    }

    // Upload d'image
    const [loading, setLoading] = useState(false);

    const handleImageChange = async (event: any) => {
        if (event.target.files[0]) {
            setLoading(true);
            const formData = new FormData();
            formData.append("image", event.target.files[0]);

            formData.append("loggedInUserId", loggedInUser.id);
            formData.append("loggedInUsername", loggedInUser.username);
            formData.append("uploadPreset", "Instagram-Clone-Profil-Pic");

            axios({
                method: "POST",
                url: "/api/profilpic",
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((res) => {
                    router.reload();
                })
                .catch((error) =>
                    console.error("Error uploading image:", error)
                );
        }
    };
    return (
        <Layout>
            <main style={{maxWidth: "935px", margin: "auto"}}>
                <Flex gap='100px' py={10} borderBottom='1px' borderColor="blackAlpha.300">
                    <Box position="relative" px={5}>
                        {loading && (
                            <Spinner
                                position="absolute"
                                top="0"
                                left="0"
                                height="168px"
                                width="168px"
                                color="gray.300"
                            />
                        )}
                        <Image
                            src={user.photo}
                            width={170}
                            height={0}
                            style={{
                                borderRadius: "50%",
                                border: "1px solid gainsboro",
                                opacity: loading ? 0.5 : 1,
                            }}
                            alt="profil pic"
                        />
                        {loggedInUser && loggedInUser.id == user.id && (
                            <Input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                position="absolute"
                                top="0"
                                left="0"
                                height="100%"
                                width="100%"
                                opacity={0}
                                cursor="pointer"
                                borderRadius="50%"
                            />
                        )}
                    </Box>
                    <Flex flexDir="column" gap={4}>
                        <Flex gap={6} alignItems="center">
                            <Text fontWeight="medium" fontSize="1.2em">
                                {user.username}
                            </Text>
                            {Buttons}
                        </Flex>
                        <UnorderedList
                            listStyleType="none"
                            margin={0}
                            display="flex"
                            gap={10}
                        >
                            <ListItem>
                                <Text fontWeight="medium" display="inline">
                                    {postsCount}
                                </Text>{" "}
                                publications
                            </ListItem>
                            <ListItem>
                                <Text fontWeight="medium" display="inline">
                                    {followersCount}
                                </Text>{" "}
                                followers
                            </ListItem>
                            <ListItem>
                                <Text fontWeight="medium" display="inline">
                                    {suiviesCount}
                                </Text>{" "}
                                suivi(e)s
                            </ListItem>
                        </UnorderedList>
                        <Flex flexDir="column">
                            <Text fontWeight="medium">{user.name}</Text>
                            <Text>{user.bio}</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </main>

            {/* /////////////////////////////////////////////////////// */}
            <div>
                Posts :
                {userPosts.map((post: any, indx: number) => {
                    return (
                        <div key={indx}>
                            <img src={post.media[0].url} width={300}></img>
                            <p>{post.description}</p>
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
};

export default Profil;
