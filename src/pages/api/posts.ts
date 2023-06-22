import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { createPost } from "../../../utils/user";
import { uploadMedia } from "../../../utils/cloudinary";

export const config = {
    api: {
        bodyParser: false,
    },
};

interface Data {}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "POST") {
        const form = formidable({maxFieldsSize : 200 * 1024 * 1024 * 1024});

        try {
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error("Error parsing form data:", err);
                    res.status(500).json({ message: "Internal Server Error" });
                    return;
                }

                let paths = [];
                let urls = [];

                for (const file in files) {
                    if (Object.prototype.hasOwnProperty.call(files, file)) {
                        const element: any = files[file];
                        paths.push({path : element.filepath, type : element.mimetype});
                    }
                }

                const { loggedInUserId, description } = fields;
                const cropValues = JSON.parse(fields.cropValues as any);

                try {
                    for (let i = 0; i < paths.length; i++) {
                        const {path, type} = paths[i];
                        const media = await uploadMedia(path, "Instagram-Clone-Posts", type, undefined, {...cropValues[i], crop:"crop"})
                        urls.push({url : media.secure_url, type : type});
                    }
                    await createPost(parseInt(loggedInUserId as string), description, urls)
                    res.status(200).send("ok")
                } catch (error: any) {
                    console.error("Error uploading post:", error);
                    res.status(500).json({ message: "Internal Server Error" });
                }
            });
        } catch (error: any) {
            console.error("Error parsing form data:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
