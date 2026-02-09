"use client";

import { useState, useEffect } from "react";
import { Upload, Video, Loader2, Trash2, Eye } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";

interface MediaClip {
    _id: string;
    title: string;
    type: string;
    category: string;
    views: number;
    url?: string;
}

export default function MediaPage() {
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [mediaClips, setMediaClips] = useState<MediaClip[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "short",
    });
    const [mediaFile, setMediaFile] = useState<File | null>(null);

    // Fetch media clips on component mount
    useEffect(() => {
        fetchMediaClips();
    }, []);

    const fetchMediaClips = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/dashboard");
            const data = await response.json();

            if (data.success) {
                setMediaClips(data.data.recent?.mediaClips || []);
            }
        } catch (error) {
            console.error("Error fetching media clips:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (clipId: string) => {
        if (!confirm("Are you sure you want to delete this media clip?")) return;

        try {
            const response = await fetch(`/api/dashboard/content?type=media&id=${clipId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchMediaClips();
            }
        } catch (error) {
            console.error("Error deleting media clip:", error);
            alert("Failed to delete media clip");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mediaFile) return;

        setUploading(true);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append("file", mediaFile);
            uploadFormData.append("folder", `media/${formData.type}s`);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            });

            const data = await response.json();
            if (data.success) {
                // Save media clip to database
                const mediaData = {
                    title: formData.title,
                    description: formData.description,
                    type: formData.type,
                    url: data.data.url,
                };

                const saveResponse = await fetch("/api/media", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(mediaData),
                });

                const saveData = await saveResponse.json();

                if (saveData.success) {
                    alert("Media uploaded and saved successfully!");
                    fetchMediaClips();
                } else {
                    alert(`Failed to save media: ${saveData.message}`);
                }

                setFormData({ title: "", description: "", type: "short" });
                setMediaFile(null);
            } else {
                alert("Failed to upload media to Cloudinary");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload media");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Media & Clips</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Upload shorts, clips, and reels
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Media</CardTitle>
                        <CardDescription>Upload short videos, clips, or reels</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="short">Short</option>
                                    <option value="clip">Clip</option>
                                    <option value="reel">Reel</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Video File</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                                    className="w-full"
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={uploading} className="w-full" size="lg">
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5 mr-2" />
                                        Upload Media
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Media</CardTitle>
                        <CardDescription>
                            {mediaClips.length} media clip{mediaClips.length !== 1 ? 's' : ''} uploaded
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-12">
                                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-green-600" />
                                <p className="text-gray-500">Loading media...</p>
                            </div>
                        ) : mediaClips.length === 0 ? (
                            <div className="text-center text-gray-500 py-12">
                                <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No media uploaded yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {mediaClips.map((clip) => (
                                    <div
                                        key={clip._id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-lg">{clip.title}</h4>
                                            <div className="flex gap-2 mt-2">
                                                <Badge variant="outline" className="capitalize">
                                                    {clip.type}
                                                </Badge>
                                                <Badge variant="secondary">
                                                    {clip.category}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    {clip.views.toLocaleString()} views
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(clip._id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
