import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import User from "@/src/models/User";
import { hashPassword, generateToken } from "@/src/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const body = await request.json();
        const validatedData = registerSchema.parse(body);

        // Check if user already exists
        const existingUser = await User.findOne({ email: validatedData.email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: { message: "User already exists" } },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(validatedData.password);

        // Create user
        const user = await User.create({
            email: validatedData.email,
            password: hashedPassword,
            name: validatedData.name,
            phone: validatedData.phone,
        });

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        return NextResponse.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error: any) {
        console.error("Registration error:", error);

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
            { success: false, error: { message: "Registration failed" } },
            { status: 500 }
        );
    }
}
