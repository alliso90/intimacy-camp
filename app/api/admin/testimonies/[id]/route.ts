import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import Testimony from "@/src/models/Testimony";
import { z } from "zod";

const updateSchema = z.object({
    isApproved: z.boolean().optional(),
    isPublished: z.boolean().optional(),
});

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        await connectToDatabase();

        const body = await request.json();
        const validatedData = updateSchema.parse(body);

        const testimony = await Testimony.findByIdAndUpdate(
            id,
            validatedData,
            { new: true }
        );

        if (!testimony) {
            return NextResponse.json(
                { success: false, error: { message: "Testimony not found" } },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: testimony,
        });
    } catch (error) {
        console.error("Update testimony error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: { message: "Invalid update data" } },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: { message: "Failed to update testimony" } },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        await connectToDatabase();

        const testimony = await Testimony.findByIdAndDelete(id);

        if (!testimony) {
            return NextResponse.json(
                { success: false, error: { message: "Testimony not found" } },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Testimony deleted successfully",
        });
    } catch (error) {
        console.error("Delete testimony error:", error);

        return NextResponse.json(
            { success: false, error: { message: "Failed to delete testimony" } },
            { status: 500 }
        );
    }
}
