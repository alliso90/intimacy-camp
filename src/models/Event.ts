import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: {
        address: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
        formattedAddress?: string;
    };
    capacity: number;
    registeredCount: number;
    images: string[]; // Cloudinary URLs
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        location: {
            address: {
                type: String,
                required: true,
            },
            coordinates: {
                lat: Number,
                lng: Number,
            },
            formattedAddress: String,
        },
        capacity: {
            type: Number,
            required: true,
            default: 100,
        },
        registeredCount: {
            type: Number,
            default: 0,
        },
        images: {
            type: [String],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
EventSchema.index({ startDate: 1 });
EventSchema.index({ isActive: 1 });

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
