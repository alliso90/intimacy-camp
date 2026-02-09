import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        // TODO: Save to database (example below)
        // await prisma.newsletter.create({ data: { email } });

        console.log("Subscribed email:", email);

        return NextResponse.json(
            { message: "Successfully subscribed!" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
