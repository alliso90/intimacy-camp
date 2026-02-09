import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import AudioMessage from "@/src/models/AudioMessage";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { title, speaker, audioUrl, duration, category } = body;

        // Validate required fields
        if (!title || !speaker || !audioUrl) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields: title, speaker, and audioUrl are required",
                },
                { status: 400 }
            );
        }

        // Create new audio message
        const audioMessage = await AudioMessage.create({
            title,
            speaker,
            audioUrl,
            duration: duration || 0,
            category: category || "message",
            plays: 0,
        });

        return NextResponse.json({
            success: true,
            message: "Audio message created successfully",
            data: audioMessage,
        });
    } catch (error) {
        console.error("Error creating audio message:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create audio message",
                error: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
            },
            { status: 500 }
        );
    }
}
