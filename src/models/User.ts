import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role: "participant" | "volunteer" | "admin";
    profileImage?: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        role: {
            type: String,
            enum: ["participant", "volunteer", "admin"],
            default: "participant",
        },
        profileImage: {
            type: String,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
