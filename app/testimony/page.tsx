"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { toast } from "sonner";

export default function TestimonyPage() {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        email: "",
        category: "",
        content: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.author || !formData.email || !formData.content) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/testimony", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Testimony submitted successfully!");
                setIsSubmitted(true);
                setFormData({
                    title: "",
                    author: "",
                    email: "",
                    category: "",
                    content: "",
                });
            } else {
                toast.error(data.error || "Failed to submit testimony");
            }
        } catch (error) {
            toast.error("Failed to submit testimony. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="text-center"
                >
                    <Card className="max-w-md">
                        <CardContent className="pt-12 pb-8">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Thank You!
                            </h2>
                            <p className="text-gray-600 mb-8 text-lg">
                                Your testimony has been submitted and is pending approval.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button
                                    onClick={() => setIsSubmitted(false)}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                >
                                    Submit Another
                                </Button>
                                <Link href="/">
                                    <Button variant="outline">
                                        Go to Home
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4 py-12">
            <div className="container mx-auto max-w-3xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-block bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg mb-6">
                        <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            YMR
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        Share Your Testimony
                    </h1>
                    <p className="text-xl text-gray-700 font-medium">
                        Tell us how God has been faithful
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <MessageSquare className="w-6 h-6 text-purple-600" />
                                Testimony Form
                            </CardTitle>
                            <CardDescription>
                                Your testimony will be reviewed before being published
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">
                                        Testimony Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., God's Faithfulness in My Life"
                                        value={formData.title}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Author Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="author">
                                        Your Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="author"
                                        placeholder="John Doe"
                                        value={formData.author}
                                        onChange={(e) => handleChange("author", e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email Address <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category (Optional)</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleChange("category", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="healing">Healing</SelectItem>
                                            <SelectItem value="provision">Provision</SelectItem>
                                            <SelectItem value="deliverance">Deliverance</SelectItem>
                                            <SelectItem value="salvation">Salvation</SelectItem>
                                            <SelectItem value="breakthrough">Breakthrough</SelectItem>
                                            <SelectItem value="restoration">Restoration</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <Label htmlFor="content">
                                        Your Testimony <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Share your testimony here..."
                                        value={formData.content}
                                        onChange={(e) => handleChange("content", e.target.value)}
                                        required
                                        rows={8}
                                        className="resize-none"
                                    />
                                    <p className="text-sm text-gray-500">
                                        {formData.content.length} characters
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-2" />
                                                Submit Testimony
                                            </>
                                        )}
                                    </Button>
                                    <Link href="/">
                                        <Button type="button" variant="outline" className="h-12">
                                            <ArrowLeft className="w-5 h-5 mr-2" />
                                            Back
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
