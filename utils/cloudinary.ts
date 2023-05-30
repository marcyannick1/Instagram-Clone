import cloudinary from "cloudinary";

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
    const upload = cloudinary.v2.uploader.unsigned_upload(imagePath, uploadPreset, {
        public_id: publicId,
    });

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

        if(result){
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
