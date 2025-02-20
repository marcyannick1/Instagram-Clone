import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import {
    deleteMedia,
    mediaExist,
    uploadMedia,
} from "../../../utils/cloudinary";
import { uploadProfilPic } from "../../../utils/user";

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

                const { image }: any = files;

                const { loggedInUserId, loggedInUsername, uploadPreset } =
                    fields;

                try {
                    if (
                        await mediaExist(
                            `Instagram-Clone/profil/${loggedInUsername}`
                        )
                    ) {
                        await deleteMedia(
                            `Instagram-Clone/profil/${loggedInUsername}`
                        );
                    }

                    const result = await uploadMedia(
                        image.filepath,
                        uploadPreset,
                        image.mimetype,
                        loggedInUsername as string,
                        {width : 340, height : 340, crop : "fill"}
                    );

                    await uploadProfilPic(
                        parseInt(loggedInUserId as string),
                        result.secure_url
                    );
                    res.status(200).send(result);
                } catch (error) {
                    console.error(
                        "Error uploading image to Cloudinary:",
                        error
                    );
                    res.status(500).json({ message: "Internal Server Error" });
                }
            });
        } catch (error) {
            console.error("Error parsing form data:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
