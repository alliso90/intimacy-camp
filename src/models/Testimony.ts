import mongoose, { Schema, Document } from "mongoose";

export interface ITestimony extends Document {
    name: string;
    email?: string;
    testimony: string;
    isApproved: boolean;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TestimonySchema = new Schema<ITestimony>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        testimony: {
            type: String,
            required: true,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

TestimonySchema.index({ isApproved: 1, isPublished: 1 });

export default mongoose.models.Testimony || mongoose.model<ITestimony>("Testimony", TestimonySchema);
