import mongoose, { Schema, Document } from "mongoose";

export interface IRegistration extends Document {
    userId: mongoose.Types.ObjectId;
    // Personal Information
    firstName: string;
    lastName: string;
    email: string;
    phone: string;

    // Camp Preferences
    campDate: string;
    accommodationType: "shared" | "private" | "couple";
    dietaryRestrictions?: string;

    // Emergency Contact
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;

    // Additional Information
    experience?: string;
    goals?: string;
    medicalConditions?: string;

    // Confirmation
    confirmationToken?: string;
    isConfirmed: boolean;
    confirmedAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        campDate: {
            type: String,
            required: true,
        },
        accommodationType: {
            type: String,
            enum: ["shared", "private", "couple"],
            required: true,
        },
        dietaryRestrictions: {
            type: String,
        },
        emergencyContactName: {
            type: String,
            required: true,
        },
        emergencyContactPhone: {
            type: String,
            required: true,
        },
        emergencyContactRelation: {
            type: String,
            required: true,
        },
        experience: {
            type: String,
        },
        goals: {
            type: String,
        },
        medicalConditions: {
            type: String,
        },
        confirmationToken: {
            type: String,
        },
        isConfirmed: {
            type: Boolean,
            default: false,
        },
        confirmedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
RegistrationSchema.index({ email: 1 });
RegistrationSchema.index({ confirmationToken: 1 });

export default mongoose.models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema);
