import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import Sermon from "@/src/models/Sermon";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { title, description, speaker, date, videoUrl, audioUrl, category } = body;

        // Validate required fields
        if (!title || !description || !speaker || !date) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields: title, description, speaker, and date are required",
                },
                { status: 400 }
            );
        }

        // Create new sermon
        const sermon = await Sermon.create({
            title,
            description,
            speaker,
            date: new Date(date),
            videoUrl: videoUrl || undefined,
            audioUrl: audioUrl || undefined,
            category: category || "sermon",
            isPublished: true,
            views: 0,
            downloads: 0,
        });

        return NextResponse.json({
            success: true,
            message: "Sermon created successfully",
            data: sermon,
        });
    } catch (error) {
        console.error("Error creating sermon:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create sermon",
                error: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
            },
            { status: 500 }
        );
    }
}
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");

        let query: any = { isPublished: true };

        if (category && category !== "all") {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { speaker: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const sermons = await Sermon.find(query).sort({ date: -1 }).lean();

        return NextResponse.json({
            success: true,
            data: sermons,
        });
    } catch (error) {
        console.error("Error fetching sermons:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch sermons",
            },
            { status: 500 }
        );
    }
}
