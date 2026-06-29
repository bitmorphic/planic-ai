import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { extractTaskFromEmail } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { subject, body: emailBody, from } = body;

    if (!emailBody?.trim()) {
      return NextResponse.json({ error: 'Email body is required' }, { status: 400 });
    }

    // Call Gemini to extract task from email
    const extracted = await extractTaskFromEmail(
      subject || '(No subject)',
      emailBody,
      from || 'Unknown'
    );

    return NextResponse.json({
      success: true,
      extracted,
    });

  } catch (error) {
    console.error('Gmail Agent Error:', error);
    return NextResponse.json({ error: 'Failed to analyze email. Please try again.' }, { status: 500 });
  }
}
