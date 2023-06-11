import { NextPage, GetServerSideProps } from "next";
import { getPostById } from "../../../utils/post";

interface Props {}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { postId } = ctx.query;
    const post = JSON.parse(
        JSON.stringify(await getPostById(parseInt(postId as string)))
    );
    return {
        props: {
            post: post,
        },
    };
};

const Post: NextPage<any> = ({ post }) => {
    console.log(post);
    return (
        <>
            <div>
                Username:
                {post.user.username}
            </div>
            <div>
                Photos :
                {post.media.map((media: any, idx: any) => (
                    <img key={idx} src={media.url} width={200} />
                ))}
            </div>
            <div>
                Desc : {post.description} personnes
            </div>
            <div>
                Aimé par {post.likes.length} personnes
            </div>
            <div>
                date : {post.date}
            </div>
            <div>
                date : {post.date}
            </div>
        </>
    );
};

export default Post;
