"use client";

import { useState, useEffect } from "react";
import { Upload, Music, Loader2, Trash2, Play } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

interface AudioMessage {
    _id: string;
    title: string;
    speaker: string;
    duration: number;
    plays: number;
    url?: string;
}

export default function AudioPage() {
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [audioMessages, setAudioMessages] = useState<AudioMessage[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        speaker: "",
        date: "",
    });
    const [audioFile, setAudioFile] = useState<File | null>(null);

    // Fetch audio messages on component mount
    useEffect(() => {
        fetchAudioMessages();
    }, []);

    const fetchAudioMessages = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/dashboard");
            const data = await response.json();

            if (data.success) {
                setAudioMessages(data.data.recent?.audioMessages || []);
            }
        } catch (error) {
            console.error("Error fetching audio messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (audioId: string) => {
        if (!confirm("Are you sure you want to delete this audio message?")) return;

        try {
            const response = await fetch(`/api/dashboard/content?type=audio&id=${audioId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchAudioMessages();
            }
        } catch (error) {
            console.error("Error deleting audio message:", error);
            alert("Failed to delete audio message");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!audioFile) return;

        setUploading(true);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append("file", audioFile);
            uploadFormData.append("folder", "audio/messages");

            const response = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            });

            const data = await response.json();
            if (data.success) {
                // Save audio message to database
                const audioData = {
                    title: formData.title,
                    description: formData.description,
                    speaker: formData.speaker,
                    audioUrl: data.data.url,
                    duration: 0, // You can calculate this from the audio file if needed
                    category: "message",
                };

                const saveResponse = await fetch("/api/audio", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(audioData),
                });

                const saveData = await saveResponse.json();

                if (saveData.success) {
                    alert("Audio message uploaded and saved successfully!");
                    fetchAudioMessages();
                } else {
                    alert(`Failed to save audio: ${saveData.message}`);
                }

                setFormData({ title: "", description: "", speaker: "", date: "" });
                setAudioFile(null);
            } else {
                alert("Failed to upload audio to Cloudinary");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload audio");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Audio Messages</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Upload and manage audio messages
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Audio Message</CardTitle>
                        <CardDescription>Add new audio content</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Message Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <Input
                                label="Speaker Name"
                                value={formData.speaker}
                                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                                required
                            />

                            <Input
                                label="Date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium mb-2">Audio File</label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
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
                                        Upload Audio
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Audio Messages</CardTitle>
                        <CardDescription>
                            {audioMessages.length} audio message{audioMessages.length !== 1 ? 's' : ''} uploaded
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-12">
                                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-green-600" />
                                <p className="text-gray-500">Loading audio messages...</p>
                            </div>
                        ) : audioMessages.length === 0 ? (
                            <div className="text-center text-gray-500 py-12">
                                <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No audio messages uploaded yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {audioMessages.map((audio) => (
                                    <div
                                        key={audio._id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-lg">{audio.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {audio.speaker}
                                            </p>
                                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Play className="w-4 h-4" />
                                                    {audio.plays.toLocaleString()} plays
                                                </span>
                                                <span>
                                                    Duration: {Math.floor(audio.duration / 60)}:{(audio.duration % 60).toString().padStart(2, '0')}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(audio._id)}
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
