"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
            <div className="text-center max-w-md">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        404
                    </h1>
                    <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
                        Page Not Found
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                        Oops! The page you&apos;re looking for doesn&apos;t exist.
                    </p>
                </div>

                <div className="flex gap-4 justify-center">
                    <Link href="/">
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            <Home className="w-4 h-4 mr-2" />
                            Go Home
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
}
