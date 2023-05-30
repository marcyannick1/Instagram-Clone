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
        const form = formidable();

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
                        paths.push(element.filepath);
                    }
                }

                const { loggedInUserId, description, uploadPreset } = fields;

                try {
                    for (let i = 0; i < paths.length; i++) {
                        const path = paths[i];
                        const media = await uploadMedia(path, uploadPreset)
                        urls.push(media.secure_url);
                    }

                    await createPost(
                        parseInt(loggedInUserId as string),
                        description,
                        urls
                    );
                    res.status(200).send("ok");
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
