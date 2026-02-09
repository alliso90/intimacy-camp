import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/mongodb';
import { sendConfirmationEmail } from '@/src/lib/email';
import mongoose from 'mongoose';

import Participant from '@/src/models/Participant';
import Volunteer from '@/src/models/Volunteer';

async function getModels() {
  await connectToDatabase();
  return { Participant, Volunteer };
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { Participant, Volunteer } = await getModels();
    const body = await request.json();

    const { ids, subject, content, emailType } = body;

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Get people from both collections
    const [participants, volunteers] = await Promise.all([
      Participant.find({ _id: { $in: ids } }),
      Volunteer.find({ _id: { $in: ids } })
    ]);

    const people = [...participants, ...volunteers];

    if (people.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No people found' },
        { status: 404 }
      );
    }

    // Send emails
    const results = [];
    for (const person of people) {
      try {
        if (emailType === 'confirmation') {
          await sendConfirmationEmail(
            person.email,
            `${person.firstName} ${person.lastName}`,
            person.registrationCode,
            "", // No token needed since auto-confirmed
            person.type as 'participant' | 'volunteer'
          );
        }
        // Add other email types as needed
        results.push({
          email: person.email,
          status: 'sent',
          name: `${person.firstName} ${person.lastName}`
        });
      } catch (error: any) {
        console.error(`Failed to send email to ${person.email}:`, error);
        results.push({
          email: person.email,
          status: 'failed',
          error: error.message || 'Email send failed'
        });
      }
    }

    const sentCount = results.filter(r => r.status === 'sent').length;

    return NextResponse.json({
      success: true,
      message: `Emails sent to ${sentCount} of ${people.length} people`,
      results
    });

  } catch (error: any) {
    console.error('Error sending emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send emails', details: error.message },
      { status: 500 }
    );
  }
}