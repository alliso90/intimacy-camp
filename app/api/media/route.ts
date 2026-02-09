import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import Media from "@/src/models/Media";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { title, description, type, url } = body;

    // Validate required fields
    if (!title || !type || !url) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: title, type, and url are required",
        },
        { status: 400 }
      );
    }

    // Create new media clip
    const mediaClip = await Media.create({
      title,
      description: description || "",
      type,
      url,
      isPublished: true,
      views: 0,
    });

    return NextResponse.json({
      success: true,
      message: "Media clip created successfully",
      data: mediaClip,
    });
  } catch (error) {
    console.error("Error creating media clip:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create media clip",
        error: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}
