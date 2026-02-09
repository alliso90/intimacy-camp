import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/mongodb';
import mongoose from 'mongoose';

// Validation schemas - UPDATED
const participantSchema = {
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
    required: function (this: any) {
      return this.isLeader === 'yes';
    }
  },
  customMinistry: {
    type: String,
    required: function (this: any) {
      return this.isLeader === 'yes' && this.ministry === 'other';
    }
  },
  type: { type: String, default: 'participant', enum: ['participant', 'volunteer'] },
  // REMOVED: confirmationToken and confirmationTokenExpires
  registrationCode: { type: String, required: true, unique: true },
  isConfirmed: { type: Boolean, default: true }, // CHANGED: true by default
  emailSent: { type: Boolean, default: false },
  checkInStatus: { type: Boolean, default: false },
  checkInTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
};

const volunteerSchema = {
  ...participantSchema,
  departments: {
    type: [String],
    required: true,
    validate: {
      validator: function (v: string[]) {
        return v.length > 0 && v.length <= 2;
      },
      message: 'Please select 1-2 departments'
    }
  },
  type: { type: String, default: 'volunteer' },
};

// MongoDB models
let Participant: any;
let Volunteer: any;

async function getModels() {
  await connectToDatabase();

  if (!Participant) {
    const participantSchemaObj = new mongoose.Schema(participantSchema);
    participantSchemaObj.index({ email: 1 }, { unique: true });
    participantSchemaObj.index({ registrationCode: 1 }, { unique: true });
    participantSchemaObj.index({ createdAt: 1 });
    Participant = mongoose.models.Participant || mongoose.model('Participant', participantSchemaObj);
  }

  if (!Volunteer) {
    const volunteerSchemaObj = new mongoose.Schema(volunteerSchema);
    volunteerSchemaObj.index({ email: 1 }, { unique: true });
    volunteerSchemaObj.index({ registrationCode: 1 }, { unique: true });
    volunteerSchemaObj.index({ createdAt: 1 });
    Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchemaObj);
  }

  return { Participant, Volunteer };
}

// Find user by registration code (not token)
async function findUserByRegistrationCode(code: string) {
  const models = await getModels();

  // Try to find in both collections
  let user = await models.Participant.findOne({ registrationCode: code });

  if (!user) {
    user = await models.Volunteer.findOne({ registrationCode: code });
  }

  return user;
}

// Simplified POST - only for check-in now
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationCode, action = 'check-in' } = body;

    if (!registrationCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Registration code is required'
        },
        { status: 400 }
      );
    }

    // Get models
    const models = await getModels();

    // Search for user by registration code
    let user = await models.Participant.findOne({ registrationCode });

    if (!user) {
      user = await models.Volunteer.findOne({ registrationCode });
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Registration not found'
        },
        { status: 404 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'check-in':
        // No need to check isConfirmed since all are auto-confirmed
        if (user.checkInStatus) {
          return NextResponse.json({
            success: true,
            message: 'Already checked in',
            data: {
              id: user._id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              type: user.type,
              registrationCode: user.registrationCode,
              checkInStatus: user.checkInStatus,
              checkInTime: user.checkInTime,
            }
          });
        }

        user.checkInStatus = true;
        user.checkInTime = new Date();
        await user.save();

        return NextResponse.json({
          success: true,
          message: 'Attendance marked successfully!',
          data: {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            type: user.type,
            registrationCode: user.registrationCode,
            checkInStatus: user.checkInStatus,
            checkInTime: user.checkInTime,
          }
        });

      case 'status':
        // Just return user status
        return NextResponse.json({
          success: true,
          data: {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            type: user.type,
            registrationCode: user.registrationCode,
            isConfirmed: user.isConfirmed, // Will be true
            checkInStatus: user.checkInStatus || user.attendanceChecked || false,
            checkInTime: user.checkInTime || user.checkedInAt || null,
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use "check-in" or "status"'
        }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Confirmation/Check-in error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors
        },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// OPTIONS method for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}