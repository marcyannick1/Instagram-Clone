import cloudinary from "cloudinary";

interface Transformation {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    crop?: string
}

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadMedia(
    mediaPath: any,
    uploadPreset: any,
    mediaType : string,
    publicId?: string,
    transformation?: Transformation
) {
    const upload = cloudinary.v2.uploader.upload(
        mediaPath,
        {
            public_id: publicId,
            upload_preset : uploadPreset,
            resource_type: mediaType.match(/image/) ? 'image' : 'video',
            transformation : transformation,
            format : mediaType.match(/image/) ? 'jpg' : 'mp4'
        }
    );

    return upload;
}

export async function mediaExist(publicId: string): Promise<boolean> {
    const response = await cloudinary.v2.search
        .expression(`public_id = ${publicId}`)
        .execute();

    return response.total_count > 0;
}

export async function deleteMedia(imagePublicId: string) {
    try {
        const result = await cloudinary.v2.uploader.destroy(imagePublicId);

        if (result) {
            return result;
        }

        if (result.result === "ok") {
            console.log("Image deleted:", imagePublicId);
            return true;
        } else {
            console.log("Failed to delete image:", imagePublicId);
            return false;
        }
    } catch (error) {
        console.error("Error deleting image:", error);
        return false;
    }
}
