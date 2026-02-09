import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import User from "@/src/models/User";
import { comparePassword, generateToken } from "@/src/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const body = await request.json();
        const validatedData = loginSchema.parse(body);

        // ⚠️ Special admin login (hardcoded)
        if (
            validatedData.email === "admin@user.com" &&
            validatedData.password === "admin"
        ) {
            const token = generateToken({
                userId: "admin",
                email: "admin@user.com",
                role: "admin",
            });

            return NextResponse.json({
                success: true,
                data: {
                    user: {
                        id: "admin",
                        email: "admin@user.com",
                        name: "Administrator",
                        role: "admin",
                    },
                    token,
                },
            });
        }

        // Find user
        const user = await User.findOne({ email: validatedData.email });
        if (!user) {
            return NextResponse.json(
                { success: false, error: { message: "Invalid credentials" } },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await comparePassword(
            validatedData.password,
            user.password
        );

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: { message: "Invalid credentials" } },
                { status: 401 }
            );
        }

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
        console.error("Login error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: { message: "Invalid input data" } },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: { message: "Login failed" } },
            { status: 500 }
        );
    }
}
