import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@tic26.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Validate credentials
        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                email, 
                role: "admin",
                id: "admin-001"
            },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        return NextResponse.json({
            success: true,
            data: {
                token,
                user: {
                    id: "admin-001",
                    email,
                    name: "Admin",
                    role: "admin"
                }
            }
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Login failed" },
            { status: 500 }
        );
    }
}