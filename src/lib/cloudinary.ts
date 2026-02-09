import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
    file: File | string,
    folder: string = "ymr"
): Promise<{ url: string; publicId: string }> {
    try {
        if (typeof file === "string") {
            // It's a base64 string or URL
            const result = await cloudinary.uploader.upload(file, {
                folder,
                resource_type: "auto",
            });
            return {
                url: result.secure_url,
                publicId: result.public_id,
            };
        } else {
            // It's a File object
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            return await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder,
                        resource_type: "auto",
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary upload stream error:", error);
                            return reject(error);
                        }
                        if (!result) {
                            return reject(new Error("Cloudinary upload returned no result"));
                        }
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                        });
                    }
                );
                uploadStream.end(buffer);
            });
        }
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload file");
    }
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        throw new Error("Failed to delete file");
    }
}
