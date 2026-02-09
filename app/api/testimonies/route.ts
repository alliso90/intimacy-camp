import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import Testimony from "@/src/models/Testimony";
import { z } from "zod";

const testimonySchema = z.object({
    name: z.string().min(1),
    email: z.string().email().optional(),
    testimony: z.string().min(10),
});

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const body = await request.json();
        const validatedData = testimonySchema.parse(body);

        const testimony = await Testimony.create({
            ...validatedData,
            isApproved: false,
            isPublished: false,
        });

        return NextResponse.json({
            success: true,
            data: {
                testimonyId: testimony._id,
                message: "Thank you for sharing your testimony! It will be reviewed shortly.",
            },
        });
    } catch (error: any) {
        console.error("Testimony submission error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: "Invalid input data",
                        details: error.errors,
                    },
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: { message: "Failed to submit testimony" } },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const published = searchParams.get("published");

        const query =
            published === "true"
                ? { isPublished: true, isApproved: true }
                : {};

        const testimonies = await Testimony.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: testimonies,
        });
    } catch (error: any) {
        console.error("Get testimonies error:", error);

        return NextResponse.json(
            { success: false, error: { message: "Failed to fetch testimonies" } },
            { status: 500 }
        );
    }
}
