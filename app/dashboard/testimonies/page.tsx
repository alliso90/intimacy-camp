"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Trash2, RefreshCw, Eye } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

interface Testimony {
    _id: string;
    name: string;
    email?: string;
    testimony: string;
    isApproved: boolean;
    isPublished: boolean;
    createdAt: string;
}

export default function TestimoniesPage() {
    const [testimonies, setTestimonies] = useState<Testimony[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTestimonies = async () => {
        try {
            const response = await fetch("/api/testimonies");
            const data = await response.json();

            if (data.success) {
                setTestimonies(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch testimonies:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonies();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/testimonies/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isApproved: true }),
            });

            if (response.ok) {
                fetchTestimonies();
            }
        } catch (error) {
            console.error("Failed to approve testimony:", error);
        }
    };

    const handlePublish = async (id: string, publish: boolean) => {
        try {
            const response = await fetch(`/api/admin/testimonies/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: publish }),
            });

            if (response.ok) {
                fetchTestimonies();
            }
        } catch (error) {
            console.error("Failed to publish testimony:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimony?")) return;

        try {
            const response = await fetch(`/api/admin/testimonies/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchTestimonies();
            }
        } catch (error) {
            console.error("Failed to delete testimony:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading testimonies...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Testimonies</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Review and manage user testimonies
                    </p>
                </div>
                <Button onClick={fetchTestimonies} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {testimonies.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-gray-500">
                            <p>No testimonies submitted yet</p>
                        </CardContent>
                    </Card>
                ) : (
                    testimonies.map((testimony) => (
                        <Card key={testimony._id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{testimony.name}</CardTitle>
                                        <CardDescription>
                                            {testimony.email || "No email provided"}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant={testimony.isApproved ? "success" : "warning"}>
                                            {testimony.isApproved ? "Approved" : "Pending"}
                                        </Badge>
                                        {testimony.isPublished && (
                                            <Badge variant="default">Published</Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                                    {testimony.testimony}
                                </p>

                                <div className="flex gap-2">
                                    {!testimony.isApproved && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleApprove(testimony._id)}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                            Approve
                                        </Button>
                                    )}

                                    {testimony.isApproved && !testimony.isPublished && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handlePublish(testimony._id, true)}
                                        >
                                            <Eye className="w-4 h-4 mr-2 text-blue-600" />
                                            Publish
                                        </Button>
                                    )}

                                    {testimony.isPublished && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handlePublish(testimony._id, false)}
                                        >
                                            <XCircle className="w-4 h-4 mr-2 text-orange-600" />
                                            Unpublish
                                        </Button>
                                    )}

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(testimony._id)}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
