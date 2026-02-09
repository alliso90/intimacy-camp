import mongoose, { Schema, Document } from "mongoose";

export interface IMedia extends Document {
    title: string;
    description?: string;
    type: "short" | "clip" | "reel";
    category?: string;
    url: string;
    thumbnailUrl?: string;
    duration?: string;
    isPublished: boolean;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        type: {
            type: String,
            enum: ["short", "clip", "reel"],
            required: true,
        },
        category: {
            type: String,
        },
        url: {
            type: String,
            required: true,
        },
        thumbnailUrl: {
            type: String,
        },
        duration: {
            type: String,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

MediaSchema.index({ isPublished: 1, createdAt: -1 });

export default mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);
