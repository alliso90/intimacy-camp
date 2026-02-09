import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/mongodb';
import mongoose from 'mongoose';

const participantSchema = {
    firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
    lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true, maxlength: 500 },
    gender: { type: String, required: true, enum: ['male', 'female'] },
    maritalStatus: { type: String, required: true, enum: ['single', 'engaged', 'married'] },
    isLeader: { type: String, required: true, enum: ['yes', 'no'] },
    type: { type: String, default: 'participant', enum: ['participant', 'volunteer'] },
    registrationCode: { type: String, required: true, unique: true },
    isConfirmed: { type: Boolean, default: true },
    status: { type: String, default: 'active', enum: ['active', 'inactive', 'pending'] },
};

const volunteerSchema = {
    ...participantSchema,
    departments: { type: [String], required: true },
};

let Participant: any;
let Volunteer: any;

async function getModels() {
    await connectToDatabase();
    Participant = mongoose.models.Participant || mongoose.model('Participant', new mongoose.Schema(participantSchema));
    Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', new mongoose.Schema(volunteerSchema));
    return { Participant, Volunteer };
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { Participant, Volunteer } = await getModels();

        // Try to find in both collections
        let user = await Participant.findById(id);
        let Model = Participant;

        if (!user) {
            user = await Volunteer.findById(id);
            Model = Volunteer;
        }

        if (!user) {
            return NextResponse.json({ success: false, error: 'Person not found' }, { status: 404 });
        }

        user.isConfirmed = true;
        user.status = 'active';
        user.checkInStatus = true;
        user.checkInTime = new Date();
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Registration confirmed and checked in successfully',
            data: {
                id: user._id,
                isConfirmed: user.isConfirmed,
                checkInStatus: user.checkInStatus,
                checkInTime: user.checkInTime,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Confirmation error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
