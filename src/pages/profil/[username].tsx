import { NextPage, GetServerSideProps } from "next";
import { getFollowersCount, getPostsCount, getSuiviesCount, getUserDatas, getUserIdByUsername } from "../../../utils/user";

interface Props {}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const username: any = ctx.query.username;
    const userId = await getUserIdByUsername(username);

    const userDatas = await getUserDatas(userId);

    const postsCount = await getPostsCount(userId);
    const followersCount = await getFollowersCount(userId);
    const suiviesCount = await getSuiviesCount(userId);

    return {
        props: {
            user : userDatas,
            postsCount: postsCount,
            followersCount: followersCount,
            suiviesCount: suiviesCount
        },
    };
};

const Profil: NextPage<Props> = ({ user, postsCount, followersCount, suiviesCount }: any) => {
    return (
        <>
            <div>Username : {user.username}</div>
            <div>Nom : {user.name}</div>
            <div>Bio : {user.bio}</div>
            <div>Publications : {postsCount}</div>
            <div>Followers : {followersCount}</div>
            <div>Suivi(e)s : {suiviesCount}</div>
        </>
    );
};

export default Profil;
