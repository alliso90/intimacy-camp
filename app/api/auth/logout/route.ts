import { NextResponse } from "next/server";

export async function POST() {
    // In a real app, you might want to invalidate the token on the server
    // For now, we'll just return success and let the client handle token removal

    return NextResponse.json({
        success: true,
        data: { message: "Logged out successfully" },
    });
}
