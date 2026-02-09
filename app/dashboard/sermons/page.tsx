"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Plus, Loader2, Trash2, Eye, Download } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";

interface Sermon {
    _id: string;
    title: string;
    preacher: string;
    date: string;
    views: number;
    downloads: number;
    videoUrl?: string;
    audioUrl?: string;
}

export default function SermonsPage() {
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sermons, setSermons] = useState<Sermon[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        speaker: "",
        date: "",
        category: "sermon",
    });
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);

    // Fetch sermons on component mount
    useEffect(() => {
        fetchSermons();
    }, []);

    const fetchSermons = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/dashboard");
            const data = await response.json();

            if (data.success) {
                setSermons(data.data.recent?.sermons || []);
            }
        } catch (error) {
            console.error("Error fetching sermons:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (sermonId: string) => {
        if (!confirm("Are you sure you want to delete this sermon?")) return;

        try {
            const response = await fetch(`/api/dashboard/content?type=sermons&id=${sermonId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Refresh sermons list
                fetchSermons();
            }
        } catch (error) {
            console.error("Error deleting sermon:", error);
            alert("Failed to delete sermon");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let videoUrl = "";
            let audioUrl = "";

            // Upload video if provided
            if (videoFile) {
                const videoFormData = new FormData();
                videoFormData.append("file", videoFile);
                videoFormData.append("folder", "sermons/videos");

                const videoResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: videoFormData,
                });

                const videoData = await videoResponse.json();
                if (videoData.success) {
                    videoUrl = videoData.data.url;
                }
            }

            // Upload audio if provided
            if (audioFile) {
                const audioFormData = new FormData();
                audioFormData.append("file", audioFile);
                audioFormData.append("folder", "sermons/audio");

                const audioResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: audioFormData,
                });

                const audioData = await audioResponse.json();
                if (audioData.success) {
                    audioUrl = audioData.data.url;
                }
            }

            // Create sermon record in database
            const sermonData = {
                title: formData.title,
                description: formData.description,
                speaker: formData.speaker,
                date: formData.date,
                category: formData.category,
                videoUrl,
                audioUrl,
            };

            const saveResponse = await fetch("/api/sermons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sermonData),
            });

            const saveData = await saveResponse.json();

            if (saveData.success) {
                alert("Sermon uploaded and saved successfully!");
                // Refresh sermons list
                fetchSermons();
            } else {
                alert(`Failed to save sermon: ${saveData.message}`);
            }

            // Reset form
            setFormData({
                title: "",
                description: "",
                speaker: "",
                date: "",
                category: "sermon",
            });
            setVideoFile(null);
            setAudioFile(null);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload sermon");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Sermons Management</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Upload and manage sermon videos and audio messages
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upload New Sermon</CardTitle>
                        <CardDescription>Add video or audio sermon content</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Sermon Title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <Input
                                label="Speaker Name"
                                value={formData.speaker}
                                onChange={(e) =>
                                    setFormData({ ...formData, speaker: e.target.value })
                                }
                                required
                            />

                            <Input
                                label="Date"
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({ ...formData, date: e.target.value })
                                }
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                    className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="sermon">Sermon</option>
                                    <option value="teaching">Teaching</option>
                                    <option value="worship">Worship</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Video File (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Audio File (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                    className="w-full"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={uploading}
                                className="w-full"
                                size="lg"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5 mr-2" />
                                        Upload Sermon
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Recent Sermons */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Sermons</CardTitle>
                        <CardDescription>
                            {sermons.length} sermon{sermons.length !== 1 ? 's' : ''} uploaded
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-12">
                                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-green-600" />
                                <p className="text-gray-500">Loading sermons...</p>
                            </div>
                        ) : sermons.length === 0 ? (
                            <div className="text-center text-gray-500 py-12">
                                <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No sermons uploaded yet</p>
                                <p className="text-sm mt-2">Upload your first sermon to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sermons.map((sermon) => (
                                    <div
                                        key={sermon._id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-lg">{sermon.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {sermon.preacher}
                                            </p>
                                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    {(sermon.views || 0).toLocaleString()} views
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Download className="w-4 h-4" />
                                                    {(sermon.downloads || 0).toLocaleString()} downloads
                                                </span>
                                                <span>
                                                    {new Date(sermon.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(sermon._id)}
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
