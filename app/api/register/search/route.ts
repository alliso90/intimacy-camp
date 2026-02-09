import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/mongodb';
import mongoose from 'mongoose';

// Validation schemas - UPDATED (same as main registration)
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();
    const type = searchParams.get('type'); // "participant", "volunteer", or null for all

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required',
          data: { registrations: [], count: 0 }
        },
        { status: 400 }
      );
    }

    // Get models
    const models = await getModels();

    // Build search conditions
    const searchConditions = [
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { registrationCode: { $regex: query, $options: 'i' } },
      { phone: { $regex: query, $options: 'i' } }
    ];

    // If query looks like an exact email, search exactly
    const isEmail = query.includes('@');
    let participantQuery: any = {};
    let volunteerQuery: any = {};

    if (isEmail) {
      participantQuery.email = query.toLowerCase();
      volunteerQuery.email = query.toLowerCase();
    } else {
      participantQuery.$or = searchConditions;
      volunteerQuery.$or = searchConditions;
    }

    // Add type filter if specified
    if (type === 'participant') {
      participantQuery.type = 'participant';
      volunteerQuery = null; // Don't search volunteers
    } else if (type === 'volunteer') {
      volunteerQuery.type = 'volunteer';
      participantQuery = null; // Don't search participants
    }

    // Execute searches
    let participants: any[] = [];
    let volunteers: any[] = [];

    if (participantQuery) {
      participants = await models.Participant.find(participantQuery)
        .select('-__v') // REMOVED: -confirmationToken -confirmationTokenExpires
        .sort({ createdAt: -1 })
        .limit(type ? 10 : 5);
    }

    if (volunteerQuery) {
      volunteers = await models.Volunteer.find(volunteerQuery)
        .select('-__v') // REMOVED: -confirmationToken -confirmationTokenExpires
        .sort({ createdAt: -1 })
        .limit(type ? 10 : 5);
    }

    // Combine results
    const registrations = [...participants, ...volunteers];

    // Format the response
    const formattedRegistrations = registrations.map(user => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      registrationType: user.type,
      registrationCode: user.registrationCode,
      gender: user.gender,
      isLeader: user.isLeader,
      isConfirmed: user.isConfirmed, // Will be true for all
      checkInStatus: user.checkInStatus || user.attendanceChecked || false,
      checkInTime: user.checkInTime || user.checkedInAt || null,
      createdAt: user.createdAt,
      // Volunteer specific fields
      ...(user.type === 'volunteer' && {
        departments: user.departments
      }),
      // Participant specific fields
      ...(user.type === 'participant' && {
        ministry: user.ministry,
        customMinistry: user.customMinistry,
        maritalStatus: user.maritalStatus,
        address: user.address
      })
    }));

    return NextResponse.json({
      success: true,
      data: {
        registrations: formattedRegistrations,
        count: registrations.length,
        breakdown: {
          participants: participants.length,
          volunteers: volunteers.length
        }
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        data: { registrations: [], count: 0 }
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
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}