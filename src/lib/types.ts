// ============================================================
// PLANIC AI — DOMAIN TYPES
// ============================================================

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Category =
  | 'assignment'
  | 'meeting'
  | 'interview'
  | 'bill'
  | 'goal'
  | 'habit'
  | 'project'
  | 'personal'
  | 'event';

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'overdue';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  status: TaskStatus;
  deadline: string; // ISO
  effortHours: number; // estimated
  progress: number; // 0–100
  source: 'gmail' | 'voice' | 'vision' | 'manual' | 'planner';
  tags?: string[];
  subtasks?: SubTask[];
  dependencies?: string[];
  scheduledStart?: string;
  scheduledEnd?: string;
}

export interface SubTask {
  id: string;
  title: string;
  done: boolean;
  effortHours?: number;
}

export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  receivedAt: string;
  detectedType: 'assignment' | 'interview' | 'bill' | 'meeting' | 'event' | 'none';
  extractedTask?: Partial<Task>;
  read: boolean;
  avatarColor: string;
  iconName?: string;
}

export interface Bill {
  id: string;
  name: string;
  provider: string;
  amount: number;
  currency: string;
  dueDate: string;
  recurring: 'monthly' | 'yearly' | 'weekly' | 'one-time';
  category: 'electricity' | 'rent' | 'subscription' | 'phone' | 'internet' | 'insurance' | 'other';
  status: 'upcoming' | 'due' | 'paid' | 'overdue';
  autoPay: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  iconName?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: Category;
  targetDate: string;
  progress: number;
  milestones: Milestone[];
  streak?: number;
}

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
  date?: string;
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  streak: number;
  bestStreak: number;
  // 7-day completion (Mon..Sun)
  week: boolean[];
  targetPerWeek: number;
  color: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'focus' | 'meeting' | 'class' | 'personal' | 'break';
  source: 'ai' | 'google' | 'manual';
  taskId?: string;
}

export interface Interview {
  id: string;
  company: string;
  role: string;
  date: string;
  round: string;
  logoColor: string;
  iconName?: string;
  prepProgress: number;
  checklist: { id: string; label: string; done: boolean }[];
  research?: { title: string; summary: string }[];
}

export interface PlanicMessage {
  id: string;
  tone: 'motivation' | 'regret' | 'celebration' | 'warning';
  title: string;
  body: string;
  createdAt: string;
}

export interface ProductivitySlot {
  hour: number; // 0–23
  day: number; // 0–6 (Sun..Sat)
  score: number; // 0–100
}

export interface AISuggestion {
  id: string;
  type: 'schedule' | 'focus' | 'warning' | 'opportunity' | 'insight';
  title: string;
  description: string;
  action: string;
  icon: string;
}
