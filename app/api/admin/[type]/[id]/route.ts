import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import Participant from "@/src/models/Participant";
import Volunteer from "@/src/models/Volunteer";
import Sermon from "@/src/models/Sermon";
import Media from "@/src/models/Media";
import AudioMessage from "@/src/models/AudioMessage";

// Map types to models
const getModel = (type: string) => {
    switch (type) {
        case 'participants': return Participant;
        case 'volunteers': return Volunteer;
        case 'sermons': return Sermon;
        case 'media': return Media;
        case 'audio': return AudioMessage;
        default: return null;
    }
};

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ type: string; id: string }> }
) {
    try {
        const { type, id } = await context.params;
        await connectToDatabase();

        const Model = getModel(type);
        if (!Model) {
            return NextResponse.json(
                { success: false, error: "Invalid resource type" },
                { status: 400 }
            );
        }

        const item = await Model.findByIdAndDelete(id);

        if (!item) {
            return NextResponse.json(
                { success: false, error: "Item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Item deleted successfully"
        });

    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete item" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ type: string; id: string }> }
) {
    try {
        const { type, id } = await context.params;
        await connectToDatabase();

        const Model = getModel(type);
        if (!Model) {
            return NextResponse.json(
                { success: false, error: "Invalid resource type" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const item = await Model.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );

        if (!item) {
            return NextResponse.json(
                { success: false, error: "Item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: item,
            message: "Item updated successfully"
        });

    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update item" },
            { status: 500 }
        );
    }
}
