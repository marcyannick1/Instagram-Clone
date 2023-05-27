import { NextPage, GetServerSideProps } from "next";
import {
    getFollowersCount,
    getPostsCount,
    getSuiviesCount,
    getUserDatas,
    getUserIdByUsername,
    isFollowed,
} from "../../../utils/user";
import { verifyToken } from "../../../utils/jwt";
import { Button } from "@chakra-ui/react";

interface Props {}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const token = ctx.req.cookies.jwt;

    const loggedInUser = token
        ? await verifyToken(token, process.env.JWT_SECRET!)
        : null;

    const username: any = ctx.query.username;
    const userId = await getUserIdByUsername(username);

    const userDatas = await getUserDatas(userId);

    const suscribedToHim: any = loggedInUser ? await isFollowed(loggedInUser.id, userId) : null;
    const suscribedToMe: any = loggedInUser ? await isFollowed(userId, loggedInUser.id) : null;

    const postsCount = await getPostsCount(userId);
    const followersCount = await getFollowersCount(userId);
    const suiviesCount = await getSuiviesCount(userId);

    return {
        props: {
            user: userDatas,
            loggedInUser: loggedInUser,
            suscribedToHim: suscribedToHim,
            suscribedToMe: suscribedToMe,
            postsCount: postsCount,
            followersCount: followersCount,
            suiviesCount: suiviesCount,
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
}: any) => {
    let Buttons;

    if (loggedInUser) {
        if (loggedInUser.id == user.id) {
            Buttons = (
                <>
                    <Button>Modifier le profil</Button>
                </>
            );
        } else if (!suscribedToHim && !suscribedToMe) {
            Buttons = (
                <>
                    <Button colorScheme="twitter">Suivre</Button>
                    <Button>Contacter</Button>
                </>
            );
        } else if (!suscribedToHim && suscribedToMe) {
            Buttons = (
                <>
                    <Button colorScheme="twitter">Suivre en retour</Button>
                    <Button>Contacter</Button>
                </>
            );
        } else if (
            (suscribedToHim && suscribedToMe) ||
            (suscribedToHim && !suscribedToMe)
        ) {
            Buttons = (
                <>
                    <Button>Suivi</Button>
                    <Button>Contacter</Button>
                </>
            );
        }
    } else {
        Buttons = (
            <>
                <Button colorScheme="twitter">Suivre</Button>
                <Button>Contacter</Button>
            </>
        );
    }

    return (
        <>
            <div>Username : {user.username}</div>
            <div>Nom : {user.name}</div>
            <div>Bio : {user.bio}</div>
            <div>Publications : {postsCount}</div>
            <div>Followers : {followersCount}</div>
            <div>Suivi(e)s : {suiviesCount}</div>
            {Buttons}
        </>
    );
};

export default Profil;
