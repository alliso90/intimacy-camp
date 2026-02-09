import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import mongoose from "mongoose";

// Define Testimony model if it doesn't exist
const defineTestimonyModel = () => {
    if (!mongoose.models.Testimony) {
        mongoose.model("Testimony", new mongoose.Schema({
            title: { type: String, required: true },
            content: { type: String, required: true },
            author: { type: String, required: true },
            email: { type: String, required: true },
            status: {
                type: String,
                enum: ['pending', 'approved', 'rejected'],
                default: 'pending'
            },
            category: { type: String, default: '' },
            createdAt: { type: Date, default: Date.now }
        }));
    }
    return mongoose.models.Testimony;
};

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const Testimony = defineTestimonyModel();

        const body = await req.json();
        const { title, content, author, email, category } = body;

        // Validation
        if (!title || !content || !author || !email) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Create testimony
        const testimony = await Testimony.create({
            title,
            content,
            author,
            email,
            category: category || '',
            status: 'pending',
            createdAt: new Date()
        });

        return NextResponse.json({
            success: true,
            message: "Testimony submitted successfully",
            data: {
                id: testimony._id,
                status: testimony.status
            }
        }, { status: 201 });

    } catch (err) {
        console.error("Testimony submission error:", err);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to submit testimony",
                message: process.env.NODE_ENV === 'development' ? (err as Error).message : undefined
            },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const Testimony = defineTestimonyModel();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const query = status ? { status } : {};
        const testimonies = await Testimony.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: testimonies
        });

    } catch (err) {
        console.error("Fetch testimonies error:", err);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch testimonies"
            },
            { status: 500 }
        );
    }
}
