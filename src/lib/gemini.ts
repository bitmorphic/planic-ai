/**
 * PLANIC AI — Gemini AI Client
 * Server-side only. Never import this in client components.
 */

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Use gemini-1.5-flash for speed (free tier friendly)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PlanStep {
  id: string;
  title: string;
  phase: string;
  priority: 'high' | 'medium' | 'low';
  effortHours: number;
  dependencies?: string[];
}

export interface ExtractedTask {
  title: string;
  deadline: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  effortHours: number;
  detectedType: 'assignment' | 'interview' | 'bill' | 'meeting' | 'event' | 'none';
}

export interface PlanicMessage {
  tone: 'motivation' | 'regret' | 'celebration' | 'warning';
  title: string;
  body: string;
}

// ─── AI Plan Generator ───────────────────────────────────────────────────────

export async function generatePlan(goal: string): Promise<PlanStep[]> {
  const prompt = `You are an expert project planner. Break this goal into actionable steps:
Goal: "${goal}"

Return a JSON array of steps. Each step must have:
- id: sequential string ("1", "2", etc.)
- title: clear action verb + what (max 60 chars)
- phase: one of [Discovery, Design, Build, Polish, Ship]
- priority: "high" | "medium" | "low"
- effortHours: realistic number (0.5–8)
- dependencies: array of step ids this depends on (can be empty)

Return ONLY valid JSON array, no markdown, no explanation. Maximum 10 steps.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    // Strip markdown code fences if present
    const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(json) as PlanStep[];
  } catch (err) {
    console.error('Gemini generatePlan error:', err);
    throw new Error('Failed to generate plan');
  }
}

// ─── Email Task Extractor ────────────────────────────────────────────────────

export async function extractTaskFromEmail(
  subject: string,
  body: string,
  from: string
): Promise<ExtractedTask> {
  const prompt = `You are an AI assistant that extracts actionable tasks from emails.
Analyze this email and extract task information:

From: ${from}
Subject: ${subject}
Body: ${body}

Return a JSON object with:
- title: clear task title (max 80 chars)
- deadline: ISO 8601 date string if mentioned, or null
- priority: "low" | "medium" | "high" | "critical"
- category: "assignment" | "meeting" | "interview" | "bill" | "goal" | "personal" | "event"
- effortHours: estimated effort in hours (0.1–10)
- detectedType: "assignment" | "interview" | "bill" | "meeting" | "event" | "none"

Return ONLY valid JSON, no markdown, no explanation.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(json) as ExtractedTask;
  } catch (err) {
    console.error('Gemini extractTaskFromEmail error:', err);
    throw new Error('Failed to extract task from email');
  }
}

// ─── Planic AI Message Generator ─────────────────────────────────────────────

export async function generatePlanicMessage(context: {
  userName: string;
  criticalTasks: { title: string; hoursLeft: number }[];
  completedToday: number;
  streak: number;
  upcomingBills: { name: string; amount: number; daysLeft: number }[];
}): Promise<PlanicMessage> {
  const prompt = `You are Planic AI, a sharp but supportive AI accountability partner. Generate a brief, punchy message for the user.

Context:
- User: ${context.userName.split(' ')[0]}
- Critical tasks: ${JSON.stringify(context.criticalTasks)}
- Completed today: ${context.completedToday}
- Current streak: ${context.streak} days
- Upcoming bills: ${JSON.stringify(context.upcomingBills)}

Return a JSON object with:
- tone: "motivation" | "regret" | "celebration" | "warning" (pick what fits)
- title: 5-8 word punchy headline
- body: 1-2 sentences, direct and action-oriented, mention specifics from the context

Be direct and honest like a good mentor. Return ONLY valid JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(json) as PlanicMessage;
  } catch (err) {
    console.error('Gemini generatePlanicMessage error:', err);
    // Fallback message
    return {
      tone: 'motivation',
      title: 'Stay focused — your goals need you.',
      body: "You have tasks waiting. The best time to start was yesterday. The second best time is now.",
    };
  }
}

// ─── Panic Mode Plan Generator ───────────────────────────────────────────────

export async function generatePanicPlan(task: {
  title: string;
  description?: string;
  progress: number;
  hoursLeft: number;
}): Promise<{ focusOn: { title: string; effort: number; why: string }[]; drop: { title: string; why: string }[] }> {
  const prompt = `You are an emergency productivity coach. The user has a critical deadline.

Task: "${task.title}"
${task.description ? `Description: ${task.description}` : ''}
Current progress: ${task.progress}%
Hours remaining: ${task.hoursLeft}h

Create an emergency plan. Return JSON with:
- focusOn: array of 3-4 must-do items, each with { title, effort (hours), why }
- drop: array of 3-4 things to skip, each with { title, why }

Be ruthlessly practical. Only what ships matters. Return ONLY valid JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(json);
  } catch (err) {
    console.error('Gemini generatePanicPlan error:', err);
    throw new Error('Failed to generate panic plan');
  }
}
