import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

export async function uploadImage(
    image: any,
    uploadPreset: any,
    publicId: string
) {
    const upload = cloudinary.v2.uploader.unsigned_upload(image, uploadPreset, {
        public_id: publicId,
    });

    return upload;
}

export async function imageExist(publicId :string): Promise<boolean> {
    const response = await cloudinary.v2.api.resource(publicId);

    return response
}
