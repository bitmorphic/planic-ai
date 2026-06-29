import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { generatePlanicMessage } from '@/lib/gemini';
import type { Task, Bill } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { tasks, bills, completedToday, streak, userName } = body as {
      tasks: Task[];
      bills: Bill[];
      completedToday: number;
      streak: number;
      userName: string;
    };

    const now = Date.now();

    // Build context for Gemini
    const criticalTasks = tasks
      .filter(t => t.status !== 'done' && t.priority === 'critical')
      .slice(0, 3)
      .map(t => ({
        title: t.title,
        hoursLeft: Math.max(0, (new Date(t.deadline).getTime() - now) / 3_600_000),
      }));

    const upcomingBills = bills
      .filter(b => b.status !== 'paid')
      .slice(0, 2)
      .map(b => ({
        name: b.name,
        amount: b.amount,
        daysLeft: Math.max(0, (new Date(b.dueDate).getTime() - now) / 86_400_000),
      }));

    const message = await generatePlanicMessage({
      userName: userName || 'User',
      criticalTasks,
      completedToday: completedToday || 0,
      streak: streak || 0,
      upcomingBills,
    });

    return NextResponse.json({ success: true, message });

  } catch (error) {
    console.error('Planic Agent Error:', error);
    return NextResponse.json({ error: 'Failed to generate message.' }, { status: 500 });
  }
}
