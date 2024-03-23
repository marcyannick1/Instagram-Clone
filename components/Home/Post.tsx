import { Flex, Image, Input, Link, Spinner, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import React from "react";
import MediasSlider from "../MediasSlider";
import relativeTime from "dayjs/plugin/relativeTime";
import { IPost } from "@/interfaces/Post";

interface Props{
    post : IPost
}

export default function Post({post} : Props){
    dayjs.locale("fr");
    dayjs.extend(relativeTime as any);

    return (
        <Flex flexDir="column" py={5} w={450} gap={1.5} margin="auto" borderBottom="1px" borderColor="gray.200">
            <Flex alignItems="center" gap={2}>
                <Link href={`profil/${post.user.username}`}>
                    <Image src={post.user.photo!} alt={""} width="30" height="30" style={{ borderRadius: "50%", border: "1px solid gainsboro" }} />
                </Link>
                <Link href={`profil/${post.user.username}`} fontWeight="medium">
                    {post.user.username}
                </Link>
                <Text color="blackAlpha.700" fontSize=".9em">
                    • {dayjs(post.date).fromNow(true)}
                </Text>
            </Flex>
            <MediasSlider medias={post.media} />
            <Flex gap={4}>
                <i className="fa-regular fa-heart" style={{ fontSize: "1.4em" }}></i>
                <i className="fa-regular fa-comment" style={{ fontSize: "1.4em" }}></i>
                <i className="fa-regular fa-bookmark" style={{ fontSize: "1.4em", marginLeft: "auto" }}></i>
            </Flex>
            <Text fontWeight="medium">1 {"J'aime"}</Text>
            {post.description && (
                <Text>
                    <Link href={`profil/${post.user.username}`} fontWeight="medium">
                        {post.user.username}
                    </Link>{" "}
                    {post.description}
                </Text>
            )}
            <Link href={`/post/${post.id}`} target="_blank" color="blackAlpha.700" role="button">
                Afficher les 1 commentaire(s)
            </Link>
            <form style={{ display: "flex" }}>
                <Input autoComplete="off" placeholder="Ajouter un commentaire..." name={(post.id - 1).toString()} variant="ghost" padding={0} disabled={false} />
                <Spinner thickness="3px" speed="0.75s" emptyColor="gray.200" color="blue.300" size="sm" />
                <Link fontWeight="medium" color="blue.300" _hover={{ color: "blue.600" }} style={{ textDecoration: "none" }}>
                    Publier
                </Link>
            </form>
        </Flex>
    );
}
