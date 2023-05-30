import { NextPage, GetServerSideProps } from "next";
import {
    getFollowersCount,
    getPostsCount,
    getSuiviesCount,
    getUserDatas,
    getUserIdByUsername,
    getUserPosts,
    isFollowed,
    uploadProfilPic,
} from "../../../utils/user";
import { verifyToken } from "../../../utils/jwt";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

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

    console.log(userPosts)

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
                    <Button>Modifier le profil</Button>
                </>
            );
        } else if (!suscribeToHim && !suscribeToMe) {
            Buttons = (
                <>
                    <Button colorScheme="twitter" onClick={handleSuscribe}>
                        Suivre
                    </Button>
                    <Button>Contacter</Button>
                </>
            );
        } else if (!suscribeToHim && suscribeToMe) {
            Buttons = (
                <>
                    <Button colorScheme="twitter" onClick={handleSuscribe}>
                        Suivre en retour
                    </Button>
                    <Button>Contacter</Button>
                </>
            );
        } else if (
            (suscribeToHim && suscribeToMe) ||
            (suscribeToHim && !suscribeToMe)
        ) {
            Buttons = (
                <>
                    <Button onClick={handleSuscribe}>Suivi</Button>
                    <Button>Contacter</Button>
                </>
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
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event: any) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleImageUpload = async () => {
        if (selectedImage) {
            const formData = new FormData();
            formData.append("image", selectedImage);

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
                .then((res) => console.log(res))
                .catch((error) =>
                    console.error("Error uploading image:", error)
                );
        }
    };

    return (
        <>
            <div>
                Photo :{" "}
                <img
                    style={{ borderRadius: "50%", width : 100 }}
                    src={user.photo}
                    alt="#"
                ></img>
                {loggedInUser && loggedInUser.id == user.id && (
                    <form>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <Button onClick={handleImageUpload}>
                            Modifier la photo
                        </Button>
                    </form>
                )}
            </div>
            <div>Username : {user.username}</div>
            <div>Nom : {user.name}</div>
            <div>Bio : {user.bio}</div>
            <div>Publications : {postsCount}</div>
            <div>Followers : {followersCount}</div>
            <div>Suivi(e)s : {suiviesCount}</div>
            {Buttons}
            <div>
                Posts :
                {userPosts.map((post :any, indx :number) => {
                    return <div key={indx}>
                        <img src={post.media[0].url} width={300}></img>
                        <p>{post.description}</p>
                    </div>
                })}
            </div>
        </>
    );
};

export default Profil;
