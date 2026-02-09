import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/mongodb';
import mongoose from 'mongoose';

// Validation schemas
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
  registrationCode: { type: String, required: true, unique: true },
  isConfirmed: { type: Boolean, default: true },
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

async function findUserById(id: string) {
  const models = await getModels();

  // Try to find in both collections
  let user = await models.Participant.findById(id)
    .select('-__v');

  if (!user) {
    user = await models.Volunteer.findById(id)
      .select('-__v');
  }

  return user;
}

// GET single registration by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // AWAIT the params
    await connectToDatabase();
    const user = await findUserById(id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Registration not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        registration: {
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
          isConfirmed: user.isConfirmed,
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
        }
      }
    });

  } catch (error) {
    console.error('GET registration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// PATCH for check-in or update
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // AWAIT the params
    await connectToDatabase();
    const body = await request.json();
    const { action, ...updateData } = body;

    // Find which collection the user belongs to
    const models = await getModels();
    let user = await models.Participant.findById(id);
    let Model = models.Participant;

    if (!user) {
      user = await models.Volunteer.findById(id);
      Model = models.Volunteer;
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

    if (action === 'check-in') {
      // Check if already checked in
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
    } else if (action === 'confirm') {
      // Since all registrations are auto-confirmed, just return success
      if (!user.isConfirmed) {
        user.isConfirmed = true;
        await user.save();
      }

      return NextResponse.json({
        success: true,
        message: 'Registration confirmed!',
        data: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          type: user.type,
          registrationCode: user.registrationCode,
          isConfirmed: user.isConfirmed,
        }
      });
    } else if (action === 'update') {
      // Handle update (restrict what can be updated)
      const allowedUpdates = ['phone', 'address', 'maritalStatus', 'ministry', 'customMinistry', 'departments'];
      const updates: any = {};

      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = updateData[key];
        }
      });

      // Only update if there are allowed fields
      if (Object.keys(updates).length > 0) {
        Object.assign(user, updates);
        await user.save();
      }

      return NextResponse.json({
        success: true,
        message: 'Registration updated successfully!',
        data: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          type: user.type,
          ...updates
        }
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action. Use "check-in", "confirm", or "update"'
        },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('PATCH registration error:', error);

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

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
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
        'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}