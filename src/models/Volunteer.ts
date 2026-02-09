import mongoose, { Schema, Document } from "mongoose";

// Inherit from Participant definition just for structure if possible, but mongoose needs explicit schema
export interface IVolunteer extends Document {
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
    type: 'volunteer';
    departments: string[];
    confirmationToken?: string;
    confirmationTokenExpires?: Date;
    registrationCode: string;
    isConfirmed: boolean;
    emailSent: boolean;
    checkInStatus: boolean;
    checkInTime?: Date;
    createdAt: Date;
}

const VolunteerSchema = new Schema<IVolunteer>({
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
    type: { type: String, default: 'volunteer' },
    departments: {
        type: [String],
        required: true,
        validate: {
            validator: function (v: string[]) {
                return v.length === 1;
            },
            message: 'Please select exactly 1 department'
        }
    },
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
VolunteerSchema.index({ email: 1 }, { unique: true });
VolunteerSchema.index({ registrationCode: 1 }, { unique: true });
VolunteerSchema.index({ createdAt: 1 });

export default mongoose.models.Volunteer || mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);
