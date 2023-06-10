import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import fs from "fs";

ffmpeg.setFfmpegPath(ffmpegPath.path);

export const config = {
    api: {
        bodyParser: false,
        responseLimit: false,
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

                let tempPaths = [];
                let cropValues = [];
                // let filesResizeBuffers: any[] = [];
                const processedFiles: any = [];

                for (const file in files) {
                    if (Object.prototype.hasOwnProperty.call(files, file)) {
                        const element: any = files[file];
                        tempPaths.push({
                            path: element.filepath,
                            type: element.mimetype,
                        });
                    }
                }

                for (const crop in fields) {
                    if (Object.prototype.hasOwnProperty.call(fields, crop)) {
                        const element: any = fields[crop];
                        cropValues.push(JSON.parse(element));
                    }
                }

                for (let i = 0; i < tempPaths.length; i++) {
                    if (tempPaths[i].type.match(/image/)) {
                        const resizedImageBuffer = await sharp(
                            tempPaths[i].path
                        )
                            .extract({
                                width: cropValues[i].width,
                                height: cropValues[i].height,
                                left: cropValues[i].x,
                                top: cropValues[i].y,
                            })
                            .resize(cropValues[i].width, cropValues[i].height)
                            .toBuffer();
                            
                        processedFiles.push({
                            type: tempPaths[i].type,
                            buffer: resizedImageBuffer,
                        });
                    } else {
                        const commandResizedVideo = ffmpeg(tempPaths[i].path)
                            .videoFilter(
                                `crop=${cropValues[i].width}:${cropValues[i].height}:${cropValues[i].x}:${cropValues[i].y}`
                            )
                            .format("mp4")
                            .save(`./video_${i}.mp4`);

                        await new Promise((resolve, reject) => {
                            commandResizedVideo.on("end", resolve);
                            commandResizedVideo.on("error", reject);
                        });

                        const videoBuffer = fs.readFileSync(`./video_${i}.mp4`);
                        fs.unlinkSync(`./video_${i}.mp4`); // Supprimer le fichier temporaire

                        processedFiles.push({
                            type: tempPaths[i].type,
                            buffer: videoBuffer,
                        });
                    }
                }
                res.json({ files: processedFiles });
            });
        } catch (error: any) {
            console.error("Error parsing form data:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
