import cloudinary from "cloudinary";
import streamifier from "streamifier";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadMedia(
    imagePath: any,
    uploadPreset: any,
    publicId?: string
) {
    const upload = cloudinary.v2.uploader.unsigned_upload(
        imagePath,
        uploadPreset,
        {
            public_id: publicId,
            resource_type: "auto",
        }
    );

    return upload;
}

export async function uploadBuffer(
    buffer: any,
    uploadPreset: any,
    type :any,
    publicId?: string
): Promise<any> {
    let uploadFromBuffer = (buffer: any) => {
        return new Promise((resolve, reject) => {
            let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
                {
                    upload_preset: uploadPreset,
                    public_id : publicId,
                    resource_type : type.match(/image/) ? "image" : "video",
                },
                (error: any, result: any) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );

            streamifier.createReadStream(buffer).pipe(cld_upload_stream);
        });
    };

    return await uploadFromBuffer(buffer);
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
