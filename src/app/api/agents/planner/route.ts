import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { generatePlan } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { goal } = body;

    if (!goal?.trim()) {
      return NextResponse.json({ error: 'Goal description is required' }, { status: 400 });
    }

    // Call Gemini to generate a structured plan
    const steps = await generatePlan(goal);

    return NextResponse.json({
      success: true,
      steps,
      totalEffort: steps.reduce((s: number, p: { effortHours: number }) => s + p.effortHours, 0),
    });

  } catch (error) {
    console.error('Planner Agent Error:', error);
    return NextResponse.json({ error: 'Failed to generate plan. Please try again.' }, { status: 500 });
  }
}
