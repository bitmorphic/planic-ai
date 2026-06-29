import {
  Task,
  Email,
  Bill,
  Goal,
  Habit,
  CalendarEvent,
  Interview,
  PlanicMessage,
  ProductivitySlot,
  AISuggestion,
} from './types';
import { inHours, inDays } from './utils';

// ============================================================
// DEMO DATA — Planic AI
// Realistic seed data powering every module.
// Dates are computed relative to "now" so the demo always feels live.
// ============================================================

export const DEMO_USER = {
  name: 'Anas Khan',
  email: 'anas@planic.ai',
  role: 'CS Senior · Indie Hacker',
  avatarColor: '#4F46E5',
  productivityScore: 78,
  focusScore: 64,
  streak: 12,
};

// ---------- TASKS ----------
export const TASKS: Task[] = [
  {
    id: 't1',
    title: 'Submit AI Project — Generative RAG System',
    description: 'Final submission for CS447. Include report, code repo, and 5-min demo video.',
    category: 'assignment',
    priority: 'critical',
    status: 'in_progress',
    deadline: inHours(19),
    effortHours: 8,
    progress: 55,
    source: 'gmail',
    tags: ['CS447', 'finals'],
    subtasks: [
      { id: 's1', title: 'Finish retrieval pipeline', done: true, effortHours: 2 },
      { id: 's2', title: 'Wire Gemini 2.5 endpoint', done: true, effortHours: 1.5 },
      { id: 's3', title: 'Write evaluation report', done: false, effortHours: 2 },
      { id: 's4', title: 'Record demo video', done: false, effortHours: 1 },
      { id: 's5', title: 'Push to GitHub + submit', done: false, effortHours: 0.5 },
    ],
    scheduledStart: inHours(2),
    scheduledEnd: inHours(5),
  },
  {
    id: 't2',
    title: 'Google SWE Interview — Technical Round',
    description: 'System design + DSA. Remote via Google Meet.',
    category: 'interview',
    priority: 'critical',
    status: 'todo',
    deadline: inDays(3),
    effortHours: 6,
    progress: 20,
    source: 'gmail',
    tags: ['career', 'google'],
    subtasks: [
      { id: 's1', title: 'Review rate limiting & load balancing', done: true, effortHours: 1 },
      { id: 's2', title: 'Practice 5 LeetCode hards', done: false, effortHours: 3 },
      { id: 's3', title: 'Mock interview with peer', done: false, effortHours: 1 },
      { id: 's4', title: 'Research Google culture + prepare questions', done: false, effortHours: 1 },
    ],
  },
  {
    id: 't3',
    title: 'Electricity Bill Payment — BSES Rajdhani',
    category: 'bill',
    priority: 'high',
    status: 'todo',
    deadline: inHours(38),
    effortHours: 0.2,
    progress: 0,
    source: 'gmail',
    tags: ['utilities'],
  },
  {
    id: 't4',
    title: 'Hackathon Project — Build & Ship',
    description: 'Google AI Hackathon. 48 hours. Planic AI MVP.',
    category: 'project',
    priority: 'high',
    status: 'in_progress',
    deadline: inDays(5),
    effortHours: 24,
    progress: 35,
    source: 'planner',
    tags: ['hackathon', 'startup'],
    subtasks: [
      { id: 's1', title: 'Research + scope', done: true, effortHours: 2 },
      { id: 's2', title: 'Design system + UI', done: true, effortHours: 4 },
      { id: 's3', title: 'Frontend build', done: false, effortHours: 8 },
      { id: 's4', title: 'AI agents integration', done: false, effortHours: 6 },
      { id: 's5', title: 'Deploy + presentation', done: false, effortHours: 4 },
    ],
  },
  {
    id: 't5',
    title: 'Team Sync — Startup Standup',
    category: 'meeting',
    priority: 'medium',
    status: 'todo',
    deadline: inHours(6),
    effortHours: 0.5,
    progress: 0,
    source: 'gmail',
    tags: ['team'],
  },
  {
    id: 't6',
    title: 'Read Research Paper — “Attention Is All You Need”',
    category: 'assignment',
    priority: 'medium',
    status: 'todo',
    deadline: inDays(2),
    effortHours: 2,
    progress: 0,
    source: 'manual',
    tags: ['reading'],
  },
  {
    id: 't7',
    title: 'Gym — Push Day',
    category: 'habit',
    priority: 'low',
    status: 'todo',
    deadline: inHours(9),
    effortHours: 1,
    progress: 0,
    source: 'manual',
    tags: ['health'],
  },
  {
    id: 't8',
    title: 'Finalize Pitch Deck for Investors',
    description: 'Seed round. 10 slides. Focus on AI moat + traction.',
    category: 'project',
    priority: 'high',
    status: 'in_progress',
    deadline: inDays(4),
    effortHours: 5,
    progress: 40,
    source: 'manual',
    tags: ['startup', 'fundraising'],
  },
  {
    id: 't9',
    title: 'Phone Bill — Jazz (Postpaid)',
    category: 'bill',
    priority: 'medium',
    status: 'todo',
    deadline: inDays(6),
    effortHours: 0.2,
    progress: 0,
    source: 'gmail',
    tags: ['utilities'],
  },
  {
    id: 't10',
    title: 'Database Systems Assignment — Normalization',
    category: 'assignment',
    priority: 'medium',
    status: 'todo',
    deadline: inDays(7),
    effortHours: 3,
    progress: 0,
    source: 'vision',
    tags: ['CS301'],
  },
  {
    id: 't11',
    title: 'Newsletter Issue #14 — “AI Accountability”',
    category: 'personal',
    priority: 'low',
    status: 'todo',
    deadline: inDays(8),
    effortHours: 2,
    progress: 10,
    source: 'manual',
    tags: ['content'],
  },
  {
    id: 't12',
    title: 'Renew Domain — planic.ai',
    category: 'bill',
    priority: 'low',
    status: 'todo',
    deadline: inDays(14),
    effortHours: 0.1,
    progress: 0,
    source: 'gmail',
    tags: ['subscription'],
  },
];

// ---------- EMAILS (Gmail Intelligence) ----------
export const EMAILS: Email[] = [
  {
    id: 'e1',
    from: 'Prof. Sarah Chen',
    fromEmail: 's.chen@university.edu',
    subject: 'CS447 Final Project — Submission deadline June 30',
    preview: 'Reminder: your final AI project is due before midnight on June 30…',
    body: 'Dear students,\n\nThis is a reminder that your CS447 final project (Generative RAG System) is due before 11:59 PM on June 30. Please submit your report, GitHub repository, and a 5-minute demo video via the LMS portal.\n\nLate submissions incur a 10% penalty per day.\n\nBest,\nProf. Sarah Chen',
    receivedAt: inHours(-5),
    detectedType: 'assignment',
    extractedTask: {
      title: 'Submit AI Project — Generative RAG System',
      deadline: inHours(19),
      priority: 'critical',
      category: 'assignment',
      effortHours: 8,
    },
    read: false,
    avatarColor: '#4F46E5',
  },
  {
    id: 'e2',
    from: 'Google Recruiting',
    fromEmail: 'noreply@google.com',
    subject: 'Your technical interview is scheduled',
    preview: 'Hi Anas, your Google SWE technical round is confirmed for…',
    body: 'Hi Anas,\n\nCongratulations on advancing to the technical interview round for the Software Engineer role at Google!\n\nYour interview is scheduled and will cover system design and data structures & algorithms. Please join via Google Meet 10 minutes early.\n\nWe look forward to speaking with you.\n\nGoogle Recruiting Team',
    receivedAt: inHours(-22),
    detectedType: 'interview',
    extractedTask: {
      title: 'Google SWE Interview — Technical Round',
      deadline: inDays(3),
      priority: 'critical',
      category: 'interview',
      effortHours: 6,
    },
    read: false,
    avatarColor: '#10B981',
    iconName: 'SiGoogle',
  },
  {
    id: 'e3',
    from: 'BSES Rajdhani',
    fromEmail: 'billing@bsesdelhi.in',
    subject: 'Your electricity bill of ₹3,200 is due',
    preview: 'Your June electricity bill is now available. Payment due in 2 days…',
    body: 'Dear Customer,\n\nYour electricity bill for June 2026 is ₹3,200. Payment is due within 2 days. Please pay online to avoid late fees.\n\nAccount: •••• 4821\nDue: in 2 days\n\nBSES Rajdhani Power Limited',
    receivedAt: inHours(-30),
    detectedType: 'bill',
    extractedTask: {
      title: 'Electricity Bill Payment — BSES Rajdhani',
      deadline: inHours(38),
      priority: 'high',
      category: 'bill',
      effortHours: 0.2,
    },
    read: true,
    avatarColor: '#F59E0B',
  },
  {
    id: 'e4',
    from: 'Linear',
    fromEmail: 'notifications@linear.app',
    subject: 'Standup meeting reminder — Today 6:00 PM',
    preview: 'Reminder: team standup starts at 6:00 PM today…',
    body: 'Your team standup is scheduled for 6:00 PM today. Agenda: sprint review + blockers.\n\nJoin the call from your calendar invite.',
    receivedAt: inHours(-3),
    detectedType: 'meeting',
    extractedTask: {
      title: 'Team Sync — Startup Standup',
      deadline: inHours(6),
      priority: 'medium',
      category: 'meeting',
      effortHours: 0.5,
    },
    read: true,
    avatarColor: '#06B6D4',
    iconName: 'SiLinear',
  },
  {
    id: 'e5',
    from: 'GitHub',
    fromEmail: 'noreply@github.com',
    subject: '3 pull requests awaiting your review',
    preview: 'You have 3 PRs pending review in planic-ai…',
    body: 'You have 3 pull requests awaiting review in planic-ai:\n• feat: AI Planner agent\n• fix: calendar sync edge cases\n• chore: update dependencies',
    receivedAt: inHours(-1),
    detectedType: 'none',
    read: false,
    avatarColor: '#6366F1',
    iconName: 'SiGithub',
  },
  {
    id: 'e6',
    from: 'Spotify',
    fromEmail: 'no-reply@spotify.com',
    subject: 'Your Premium subscription renews tomorrow',
    preview: '₹119 will be charged to your card tomorrow…',
    body: 'Your Spotify Premium subscription will renew tomorrow. ₹119 will be charged to your card ending in •••• 8842.\n\nManage your subscription anytime.',
    receivedAt: inHours(-12),
    detectedType: 'bill',
    extractedTask: {
      title: 'Spotify Premium Renewal',
      deadline: inDays(1),
      priority: 'low',
      category: 'bill',
      effortHours: 0.05,
    },
    read: true,
    avatarColor: '#22C55E',
    iconName: 'SiSpotify',
  },
];

// ---------- BILLS ----------
export const BILLS: Bill[] = [
  {
    id: 'b1',
    name: 'Electricity Bill',
    provider: 'BSES Rajdhani',
    amount: 3200,
    currency: 'INR',
    dueDate: inHours(38),
    recurring: 'monthly',
    category: 'electricity',
    status: 'due',
    autoPay: false,
    riskLevel: 'high',
  },
  {
    id: 'b2',
    name: 'Spotify Premium',
    provider: 'Spotify',
    amount: 119,
    currency: 'INR',
    dueDate: inDays(1),
    recurring: 'monthly',
    category: 'subscription',
    status: 'upcoming',
    autoPay: true,
    riskLevel: 'low',
    iconName: 'SiSpotify',
  },
  {
    id: 'b3',
    name: 'Phone Bill',
    provider: 'Jio Postpaid',
    amount: 599,
    currency: 'INR',
    dueDate: inDays(6),
    recurring: 'monthly',
    category: 'phone',
    status: 'upcoming',
    autoPay: false,
    riskLevel: 'medium',
  },
  {
    id: 'b4',
    name: 'Co-working Space',
    provider: 'WeWork',
    amount: 12000,
    currency: 'INR',
    dueDate: inDays(9),
    recurring: 'monthly',
    category: 'rent',
    status: 'upcoming',
    autoPay: false,
    riskLevel: 'high',
    iconName: 'SiWework',
  },
  {
    id: 'b5',
    name: 'Domain Renewal',
    provider: 'Namecheap',
    amount: 12.99,
    currency: 'USD',
    dueDate: inDays(14),
    recurring: 'yearly',
    category: 'subscription',
    status: 'upcoming',
    autoPay: true,
    riskLevel: 'low',
    iconName: 'SiNamecheap',
  },
  {
    id: 'b6',
    name: 'Figma Pro',
    provider: 'Figma',
    amount: 15,
    currency: 'USD',
    dueDate: inDays(-2),
    recurring: 'monthly',
    category: 'subscription',
    status: 'overdue',
    autoPay: false,
    riskLevel: 'high',
    iconName: 'SiFigma',
  },
];

// ---------- GOALS ----------
export const GOALS: Goal[] = [
  {
    id: 'g1',
    title: 'Land a Google SWE Offer',
    description: 'Crack the technical round and secure an offer letter.',
    category: 'goal',
    targetDate: inDays(14),
    progress: 45,
    milestones: [
      { id: 'm1', title: 'Resume reviewed by 3 engineers', done: true },
      { id: 'm2', title: 'Complete 50 DSA problems', done: true },
      { id: 'm3', title: 'Pass technical round', done: false },
      { id: 'm4', title: 'Pass behavioral round', done: false },
      { id: 'm5', title: 'Receive offer', done: false },
    ],
    streak: 8,
  },
  {
    id: 'g2',
    title: 'Ship Planic AI to 1,000 users',
    description: 'Launch MVP, run growth experiments, hit first 1k MAU.',
    category: 'project',
    targetDate: inDays(45),
    progress: 30,
    milestones: [
      { id: 'm1', title: 'MVP feature-complete', done: true },
      { id: 'm2', title: 'Win hackathon', done: false },
      { id: 'm3', title: 'Product Hunt launch', done: false },
      { id: 'm4', title: 'Reach 1,000 users', done: false },
    ],
    streak: 12,
  },
  {
    id: 'g3',
    title: 'Maintain 3.9+ GPA',
    description: 'Finish senior year strong.',
    category: 'goal',
    targetDate: inDays(60),
    progress: 72,
    milestones: [
      { id: 'm1', title: 'CS447 project', done: false },
      { id: 'm2', title: 'CS301 assignment', done: false },
      { id: 'm3', title: 'Final exams', done: false },
    ],
    streak: 5,
  },
];

// ---------- HABITS ----------
export const HABITS: Habit[] = [
  {
    id: 'h1',
    title: 'Deep Work (2 hrs)',
    icon: 'Brain',
    streak: 12,
    bestStreak: 21,
    week: [true, true, true, true, false, true, true],
    targetPerWeek: 6,
    color: '#4F46E5',
  },
  {
    id: 'h2',
    title: 'Read 20 pages',
    icon: 'BookOpen',
    streak: 7,
    bestStreak: 15,
    week: [true, false, true, true, true, true, false],
    targetPerWeek: 5,
    color: '#06B6D4',
  },
  {
    id: 'h3',
    title: 'Gym / Workout',
    icon: 'Dumbbell',
    streak: 4,
    bestStreak: 18,
    week: [true, true, false, true, false, true, false],
    targetPerWeek: 4,
    color: '#10B981',
  },
  {
    id: 'h4',
    title: 'No phone after 11 PM',
    icon: 'Moon',
    streak: 3,
    bestStreak: 9,
    week: [false, true, true, true, false, false, true],
    targetPerWeek: 7,
    color: '#F59E0B',
  },
];

// ---------- CALENDAR ----------
export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'c1',
    title: 'Focus Block: AI Project Report',
    start: inHours(2),
    end: inHours(4.5),
    type: 'focus',
    source: 'ai',
    taskId: 't1',
  },
  {
    id: 'c2',
    title: 'DSA Practice — Graph Problems',
    start: inHours(5),
    end: inHours(6.5),
    type: 'focus',
    source: 'ai',
    taskId: 't2',
  },
  {
    id: 'c3',
    title: 'Team Standup',
    start: inHours(6),
    end: inHours(6.5),
    type: 'meeting',
    source: 'google',
    taskId: 't5',
  },
  {
    id: 'c4',
    title: 'CS447 Lecture',
    start: inHours(8),
    end: inHours(9.5),
    type: 'class',
    source: 'google',
  },
  {
    id: 'c5',
    title: 'Lunch Break',
    start: inHours(9.5),
    end: inHours(10),
    type: 'break',
    source: 'manual',
  },
  {
    id: 'c6',
    title: 'Build: AI Planner Agent',
    start: inHours(11),
    end: inHours(14),
    type: 'focus',
    source: 'ai',
    taskId: 't4',
  },
  {
    id: 'c7',
    title: 'Mock Interview w/ Peer',
    start: inHours(26),
    end: inHours(27),
    type: 'meeting',
    source: 'ai',
    taskId: 't2',
  },
];

// ---------- INTERVIEWS ----------
export const INTERVIEWS: Interview[] = [
  {
    id: 'i1',
    company: 'Google',
    role: 'Software Engineer (L3)',
    date: inDays(3),
    round: 'Technical — System Design + DSA',
    logoColor: '#10B981',
    iconName: 'SiGoogle',
    prepProgress: 35,
    checklist: [
      { id: 'ic1', label: 'Resume tailored to Google', done: true },
      { id: 'ic2', label: 'Study system design (rate limiting, sharding)', done: true },
      { id: 'ic3', label: 'Solve 5 graph + DP problems', done: false },
      { id: 'ic4', label: 'Mock interview booked', done: false },
      { id: 'ic5', label: 'Prepare 3 questions for interviewer', done: false },
      { id: 'ic6', label: 'Tech setup check (meet, IDE)', done: false },
    ],
    research: [
      { title: 'Google Cloud + Gemini', summary: 'You can reference Gemini/Vertex work — ties your AI project to their stack.' },
      { title: 'Googley culture', summary: 'Emphasize ownership, scale, and data-driven decisions.' },
      { title: 'Recent news', summary: 'Gemini 2.5 launch — great conversation starter on AI infra.' },
    ],
  },
  {
    id: 'i2',
    company: 'Linear',
    role: 'Frontend Engineer',
    date: inDays(9),
    round: 'Take-home + culture fit',
    logoColor: '#6366F1',
    iconName: 'SiLinear',
    prepProgress: 10,
    checklist: [
      { id: 'ic1', label: 'Review Linear’s public design principles', done: true },
      { id: 'ic2', label: 'Build take-home project', done: false },
      { id: 'ic3', label: 'Prepare portfolio walkthrough', done: false },
    ],
  },
];

// ---------- PLANIC MESSAGES ----------
export const PLANIC_MESSAGES: PlanicMessage[] = [
  {
    id: 'f1',
    tone: 'regret',
    title: 'A message from tomorrow night',
    body: "This is Future You. It's 11:47 PM tomorrow. Your AI project is due in 13 minutes and the demo video isn't recorded. Your chest is tight. You're whispering 'why didn't I just start yesterday?'\n\nSpend 30 focused minutes right now. Future You will thank you.",
    createdAt: inHours(-1),
  },
  {
    id: 'f2',
    tone: 'motivation',
    title: 'Momentum is compounding',
    body: "You've shipped 12 days in a row. That's not luck — that's identity. The person who shows up today becomes the person who gets the Google offer. Keep the streak alive.",
    createdAt: inHours(-6),
  },
  {
    id: 'f3',
    tone: 'warning',
    title: 'Your Google interview is in 3 days',
    body: "You've prepped 35%. The candidate who gets the offer preps 90%. You don't need to be smarter — you need to be more consistent. Block 2 hours tonight for graph problems.",
    createdAt: inHours(-10),
  },
];

// ---------- PRODUCTIVITY DNA HEATMAP ----------
// 7 days x 24 hours, score 0-100
function genHeatmap(): ProductivitySlot[] {
  const slots: ProductivitySlot[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      let score = 10;
      // Evening peak 8PM-11PM
      if (hour >= 20 && hour <= 23) score = 70 + Math.random() * 30;
      // Morning 9-11
      else if (hour >= 9 && hour <= 11) score = 50 + Math.random() * 25;
      // Afternoon slump
      else if (hour >= 14 && hour <= 16) score = 20 + Math.random() * 15;
      // Late night
      else if (hour >= 0 && hour <= 6) score = 5 + Math.random() * 10;
      else score = 30 + Math.random() * 20;
      // Weekends slightly lower
      if (day === 0 || day === 6) score *= 0.8;
      slots.push({ day, hour, score: Math.round(score) });
    }
  }
  return slots;
}
export const PRODUCTIVITY_HEATMAP = genHeatmap();

export const PEAK_HOURS = [
  { window: '8:00 PM – 11:00 PM', label: 'Peak Focus', lift: '+40%', score: 92, color: '#4F46E5' },
  { window: '9:00 AM – 11:00 AM', label: 'Morning Clarity', lift: '+18%', score: 68, color: '#06B6D4' },
  { window: '2:00 PM – 4:00 PM', label: 'Afternoon Slump', lift: '-32%', score: 22, color: '#F59E0B' },
];

export const WEEKLY_TREND = [
  { day: 'Mon', tasks: 7, focus: 4.5 },
  { day: 'Tue', tasks: 5, focus: 3.2 },
  { day: 'Wed', tasks: 9, focus: 6.1 },
  { day: 'Thu', tasks: 6, focus: 4.0 },
  { day: 'Fri', tasks: 8, focus: 5.5 },
  { day: 'Sat', tasks: 4, focus: 2.8 },
  { day: 'Sun', tasks: 6, focus: 4.2 },
];

// ---------- AI SUGGESTIONS ----------
export const AI_SUGGESTIONS: AISuggestion[] = [
  {
    id: 'a1',
    type: 'warning',
    title: 'AI Project due in 19 hours',
    description: 'You need ~3.6 more hours of work and your peak focus window starts at 8 PM. Start now to finish by midnight.',
    action: 'Start focus block',
    icon: 'Flame',
  },
  {
    id: 'a2',
    type: 'schedule',
    title: 'Move DSA practice to your peak window',
    description: 'You complete graph problems 40% faster between 8–11 PM. I rescheduled it for you.',
    action: 'View calendar',
    icon: 'CalendarClock',
  },
  {
    id: 'a3',
    type: 'focus',
    title: '2 PRs are blocking your team',
    description: 'GitHub notifications show 3 PRs pending review. Block 20 min after standup.',
    action: 'Open GitHub',
    icon: 'GitPullRequest',
  },
  {
    id: 'a4',
    type: 'opportunity',
    title: 'Bundle your bill payments',
    description: '3 bills are due this week. Pay BSES + Spotify + Jio together to avoid late fees.',
    action: 'Pay now',
    icon: 'Receipt',
  },
  {
    id: 'a5',
    type: 'insight',
    title: 'Your Deep Work streak is at 12 days',
    description: 'Skipping today breaks your best momentum. Even 30 minutes counts.',
    action: 'Protect streak',
    icon: 'Flame',
  },
];

// ---------- AGENTS (for agent-workflow visualizations) ----------
export const AGENTS = [
  {
    id: 'gmail',
    name: 'Gmail Intelligence',
    role: 'Reads inbox · extracts tasks',
    icon: 'Mail',
    color: '#EF4444',
    status: 'active',
    processed: 142,
  },
  {
    id: 'vision',
    name: 'Vision Task',
    role: 'Photos & screenshots → tasks',
    icon: 'ScanLine',
    color: '#06B6D4',
    status: 'active',
    processed: 28,
  },
  {
    id: 'voice',
    name: 'Voice Capture',
    role: 'Speak → scheduled task',
    icon: 'Mic',
    color: '#F59E0B',
    status: 'idle',
    processed: 17,
  },
  {
    id: 'planner',
    name: 'AI Planner',
    role: 'Breaks projects into steps',
    icon: 'Workflow',
    color: '#4F46E5',
    status: 'active',
    processed: 9,
  },
  {
    id: 'calendar',
    name: 'Calendar',
    role: 'Auto-schedules work',
    icon: 'CalendarClock',
    color: '#10B981',
    status: 'active',
    processed: 64,
  },
  {
    id: 'interview',
    name: 'Interview Copilot',
    role: 'Interview prep engine',
    icon: 'Briefcase',
    color: '#6366F1',
    status: 'active',
    processed: 3,
  },
  {
    id: 'bill',
    name: 'Bill Guardian',
    role: 'Tracks recurring bills',
    icon: 'Receipt',
    color: '#22C55E',
    status: 'active',
    processed: 11,
  },
  {
    id: 'planic',
    name: 'Planic AI',
    role: 'Emotional accountability',
    icon: 'Sparkles',
    color: '#EC4899',
    status: 'active',
    processed: 38,
  },
  {
    id: 'panic',
    name: 'Panic Mode',
    role: 'Emergency rescue plans',
    icon: 'Siren',
    color: '#EF4444',
    status: 'idle',
    processed: 2,
  },
  {
    id: 'dna',
    name: 'Productivity DNA',
    role: 'Learns your patterns',
    icon: 'Dna',
    color: '#8B5CF6',
    status: 'active',
    processed: 7,
  },
] as const;

// ---------- DERIVED HELPERS ----------
export function upcomingTasks(limit = 6) {
  return [...TASKS]
    .filter((t) => t.status !== 'done')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, limit);
}

export function overdueTasks() {
  return TASKS.filter((t) => new Date(t.deadline).getTime() < Date.now() && t.status !== 'done');
}

export function panicTasks() {
  // Deadlines < 24h
  return TASKS.filter(
    (t) => t.status !== 'done' && (Date.now() - new Date(t.deadline).getTime()) / 3_600_000 > -24
  ).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
}

export function totalBillAmount() {
  return BILLS.filter((b) => b.status !== 'paid').reduce((sum, b) => sum + b.amount, 0);
}
