import mongoose, { Schema, Document } from "mongoose";

export interface ISermon extends Document {
    title: string;
    description: string;
    speaker: string;
    date: Date;
    videoUrl?: string;
    audioUrl?: string;
    thumbnailUrl?: string;
    duration?: string;
    category: "sermon" | "teaching" | "worship";
    isPublished: boolean;
    views: number;
    downloads: number;
    createdAt: Date;
    updatedAt: Date;
}

const SermonSchema = new Schema<ISermon>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        speaker: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        videoUrl: {
            type: String,
        },
        audioUrl: {
            type: String,
        },
        thumbnailUrl: {
            type: String,
        },
        duration: {
            type: String,
        },
        category: {
            type: String,
            enum: ["sermon", "teaching", "worship"],
            default: "sermon",
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        views: {
            type: Number,
            default: 0,
        },
        downloads: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

SermonSchema.index({ isPublished: 1, date: -1 });

export default mongoose.models.Sermon || mongoose.model<ISermon>("Sermon", SermonSchema);
