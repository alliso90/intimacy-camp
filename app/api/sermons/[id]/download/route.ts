import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import Sermon from "@/src/models/Sermon";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        const sermon = await Sermon.findByIdAndUpdate(
            id,
            { $inc: { downloads: 1 } },
            { new: true }
        );

        if (!sermon) {
            return NextResponse.json(
                { success: false, message: "Sermon not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: { downloads: sermon.downloads },
        });
    } catch (error) {
        console.error("Download tracking error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to track download" },
            { status: 500 }
        );
    }
}
