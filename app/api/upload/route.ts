import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/src/lib/cloudinary";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "ymr";

        if (!file) {
            return NextResponse.json(
                { success: false, error: { message: "No file provided" } },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(file, folder);

        return NextResponse.json({
            success: true,
            data: {
                url: result.url,
                publicId: result.publicId,
            },
        });
    } catch (error: any) {
        console.error("File upload error:", error);

        return NextResponse.json(
            { success: false, error: { message: "File upload failed" } },
            { status: 500 }
        );
    }
}
