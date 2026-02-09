import mongoose, { Schema, Document } from "mongoose";

export interface IParticipant extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    gender: 'male' | 'female';
    maritalStatus: 'single' | 'engaged' | 'married';
    isLeader: 'yes' | 'no';
    ministry?: string;
    customMinistry?: string;
    type: 'participant' | 'volunteer';
    confirmationToken?: string;
    confirmationTokenExpires?: Date;
    registrationCode: string;
    isConfirmed: boolean;
    emailSent: boolean;
    checkInStatus: boolean;
    checkInTime?: Date;
    createdAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>({
    firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
    lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true, maxlength: 500 },
    gender: { type: String, required: true, enum: ['male', 'female'] },
    maritalStatus: { type: String, required: true, enum: ['single', 'engaged', 'married'] },
    isLeader: { type: String, required: true, enum: ['yes', 'no'] },
    ministry: {
        type: String,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        required: function (this: any) {
            return this.isLeader === 'yes';
        }
    },
    customMinistry: {
        type: String,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        required: function (this: any) {
            return this.isLeader === 'yes' && this.ministry === 'other';
        }
    },
    type: { type: String, default: 'participant', enum: ['participant', 'volunteer'] },
    confirmationToken: { type: String },
    confirmationTokenExpires: { type: Date },
    registrationCode: { type: String, required: true, unique: true },
    isConfirmed: { type: Boolean, default: true },
    emailSent: { type: Boolean, default: false },
    checkInStatus: { type: Boolean, default: false },
    checkInTime: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

// Indexes
ParticipantSchema.index({ email: 1 }, { unique: true });
ParticipantSchema.index({ registrationCode: 1 }, { unique: true });
ParticipantSchema.index({ createdAt: 1 });

export default mongoose.models.Participant || mongoose.model<IParticipant>("Participant", ParticipantSchema);
