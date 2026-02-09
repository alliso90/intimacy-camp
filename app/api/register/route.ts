import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/mongodb';
import { sendConfirmationEmail } from '@/src/lib/email';
import { isValidEmail } from '@/src/lib/utils';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

import Participant from '@/src/models/Participant';
import Volunteer from '@/src/models/Volunteer';

async function getModels() {
  await connectToDatabase();
  return { Participant, Volunteer };
}

// Helper functions
function generateRegistrationCode(type: 'participant' | 'volunteer' = 'participant'): string {
  const prefix = type === 'volunteer' ? 'VOL' : 'PAR';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

function validateParticipantData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'gender', 'maritalStatus', 'isLeader'];
  requiredFields.forEach(field => {
    if (!String(data[field] ?? '').trim()) {
      errors.push(`${field} is required`);
    }
  });

  // Email validation
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }

  // Phone validation (basic)
  if (data.phone && !/^[\d\s\-\+\(\)]{10,20}$/.test(data.phone)) {
    errors.push('Invalid phone number format');
  }

  // If leader, ministry is required
  if (data.isLeader === 'yes') {
    if (!data.ministry) {
      errors.push('Ministry is required for leaders');
    }
    if (data.ministry === 'other' && !data.customMinistry?.trim()) {
      errors.push('Custom ministry name is required when selecting "other"');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateVolunteerData(data: any): { isValid: boolean; errors: string[] } {
  const participantValidation = validateParticipantData(data);
  if (!participantValidation.isValid) {
    return participantValidation;
  }

  const errors = [...participantValidation.errors];

  // Departments validation
  if (!data.departments || !Array.isArray(data.departments) || data.departments.length !== 1) {
    errors.push('Exactly one department must be selected');
  }

  // Validate department IDs
  const validDepartments = ['media', 'protocol', 'logistics', 'welfare', 'technical', 'music', 'registration', 'prayer', 'creative', 'medical'];
  data.departments?.forEach((dept: string) => {
    if (!validDepartments.includes(dept)) {
      errors.push(`Invalid department: ${dept}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type = 'participant', ...data } = body;

    console.log('Registration attempt:', { type, email: data.email });

    // Validate request body
    if (!type || !['participant', 'volunteer'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid registration type. Must be "participant" or "volunteer"' },
        { status: 400 }
      );
    }

    // Validate data based on type
    const validation = type === 'volunteer'
      ? validateVolunteerData(data)
      : validateParticipantData(data);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Get models
    const models = await getModels();
    const Model = type === 'volunteer' ? models.Volunteer : models.Participant;

    // Check for existing email in BOTH collections
    const existingParticipantByEmail = await models.Participant.findOne({ email: data.email });
    const existingVolunteerByEmail = await models.Volunteer.findOne({ email: data.email });

    if (existingParticipantByEmail || existingVolunteerByEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Check for existing phone in BOTH collections
    if (data.phone) {
      const existingParticipantByPhone = await models.Participant.findOne({ phone: data.phone });
      const existingVolunteerByPhone = await models.Volunteer.findOne({ phone: data.phone });

      if (existingParticipantByPhone || existingVolunteerByPhone) {
        return NextResponse.json(
          { error: 'Phone number already registered' },
          { status: 409 }
        );
      }
    }

    // Generate registration data - NO TOKEN NEEDED
    const registrationCode = generateRegistrationCode(type);

    // Prepare user data - AUTO CONFIRMED
    const userData = {
      ...data,
      type,
      registrationCode,
      isConfirmed: true, // AUTO CONFIRMED
      emailSent: false,
      createdAt: new Date(),
      // Don't include confirmationToken or confirmationTokenExpires
    };

    // Create user in database
    const user = new Model(userData);
    await user.save();

    console.log('User saved to database (auto-confirmed):', {
      id: user._id,
      email: user.email,
      type,
      isConfirmed: true
    });

    // Send registration success email
    try {
      await sendConfirmationEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
        user.registrationCode,
        "", // No token needed
        type as 'participant' | 'volunteer'
      );

      // Update email sent status
      user.emailSent = true;
      await user.save();

      console.log('Registration success email sent to:', user.email);
    } catch (emailError) {
      console.error('Failed to send registration email:', emailError);
      // Don't fail registration if email fails
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Your registration is confirmed.',
        data: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          type: user.type,
          registrationCode: user.registrationCode,
          isConfirmed: user.isConfirmed, // Will be true
          emailSent: user.emailSent,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = field === 'email'
        ? 'Email already registered'
        : field === 'registrationCode'
          ? 'Registration code conflict. Please try again.'
          : 'Duplicate key error';

      return NextResponse.json(
        { error: message },
        { status: 409 }
      );
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const registrationCode = searchParams.get('code');
    const type = searchParams.get('type') as 'participant' | 'volunteer' || 'participant';

    // Get models
    const models = await getModels();
    const Model = type === 'volunteer' ? models.Volunteer : models.Participant;

    // Check if email exists
    if (email) {
      const user = await Model.findOne({ email }).select('-__v');
      if (!user) {
        return NextResponse.json(
          { exists: false },
          { status: 404 }
        );
      }
      return NextResponse.json({
        exists: true,
        data: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          type: user.type,
          registrationCode: user.registrationCode,
          isConfirmed: user.isConfirmed, // Will always be true
          createdAt: user.createdAt,
        }
      });
    }

    // Check registration code
    if (registrationCode) {
      const user = await Model.findOne({ registrationCode }).select('-__v');
      if (!user) {
        return NextResponse.json(
          { exists: false },
          { status: 404 }
        );
      }
      return NextResponse.json({
        exists: true,
        data: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          type: user.type,
          isConfirmed: user.isConfirmed, // Will always be true
          createdAt: user.createdAt,
        }
      });
    }

    return NextResponse.json(
      { error: 'Please provide email or registration code parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('GET registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}