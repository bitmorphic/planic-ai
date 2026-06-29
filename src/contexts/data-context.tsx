'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import * as STATIC_DATA from '@/lib/data';
import {
  subscribeToTasks,
  subscribeToBills,
  subscribeToGoals,
  subscribeToHabits,
  subscribeToEmails,
  subscribeToInterviews,
  subscribeToCalendarEvents,
  subscribeToPlanicMessages,
  getUserProfile,
  createUserProfile,
  addTask as fsAddTask,
  updateTask as fsUpdateTask,
  deleteTask as fsDeleteTask,
  addBill as fsAddBill,
  updateBill as fsUpdateBill,
  deleteBill as fsDeleteBill,
  addGoal as fsAddGoal,
  updateGoal as fsUpdateGoal,
  deleteGoal as fsDeleteGoal,
  addHabit as fsAddHabit,
  updateHabit as fsUpdateHabit,
  deleteHabit as fsDeleteHabit,
  addEmail as fsAddEmail,
  updateEmail as fsUpdateEmail,
  addInterview as fsAddInterview,
  updateInterview as fsUpdateInterview,
  deleteInterview as fsDeleteInterview,
  addCalendarEvent as fsAddCalendarEvent,
} from '@/lib/firebase/firestore';
import type { Task, Bill, Goal, Habit, Email, Interview, CalendarEvent, PlanicMessage } from '@/lib/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type UserData = {
  name: string;
  email: string;
  image?: string;
  role?: string;
  productivityScore: number;
  focusScore: number;
  streak: number;
  avatarColor: string;
};

type DataContextType = {
  tasks: Task[];
  emails: Email[];
  bills: Bill[];
  goals: Goal[];
  habits: Habit[];
  calendarEvents: CalendarEvent[];
  interviews: Interview[];
  messages: PlanicMessage[];
  user: UserData;
  mode: 'demo' | 'live';
  loading: boolean;
  addTask: (task: Omit<Task, 'id'>) => Promise<string>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addBill: (bill: Omit<Bill, 'id'>) => Promise<string>;
  updateBill: (id: string, data: Partial<Bill>) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<string>;
  updateGoal: (id: string, data: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id'>) => Promise<string>;
  updateHabit: (id: string, data: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  addEmail: (email: Omit<Email, 'id'>) => Promise<string>;
  updateEmail: (id: string, data: Partial<Email>) => Promise<void>;
  addInterview: (interview: Omit<Interview, 'id'>) => Promise<string>;
  updateInterview: (id: string, data: Partial<Interview>) => Promise<void>;
  deleteInterview: (id: string) => Promise<void>;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<string>;
};

const DataContext = createContext<DataContextType | null>(null);

const DEFAULT_USER: UserData = {
  name: 'User',
  email: '',
  role: 'User',
  productivityScore: 0,
  focusScore: 0,
  streak: 0,
  avatarColor: '#4F46E5',
};

// ─── Provider ────────────────────────────────────────────────────────────────

export function DataProvider({ children, mode }: { children: React.ReactNode; mode: 'demo' | 'live' }) {
  const { data: session, status } = useSession();
  const uid = (session?.user as { id?: string })?.id || session?.user?.email || null;

  // In demo mode, start with static data. In live mode, start empty.
  const [tasks, setTasks] = useState<Task[]>(mode === 'demo' ? STATIC_DATA.TASKS : []);
  const [emails, setEmails] = useState<Email[]>(mode === 'demo' ? STATIC_DATA.EMAILS : []);
  const [bills, setBills] = useState<Bill[]>(mode === 'demo' ? STATIC_DATA.BILLS : []);
  const [goals, setGoals] = useState<Goal[]>(mode === 'demo' ? STATIC_DATA.GOALS : []);
  const [habits, setHabits] = useState<Habit[]>(mode === 'demo' ? STATIC_DATA.HABITS : []);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(mode === 'demo' ? STATIC_DATA.CALENDAR_EVENTS : []);
  const [interviews, setInterviews] = useState<Interview[]>(mode === 'demo' ? STATIC_DATA.INTERVIEWS : []);
  const [messages, setMessages] = useState<PlanicMessage[]>(mode === 'demo' ? STATIC_DATA.PLANIC_MESSAGES : []);
  const [user, setUser] = useState<UserData>(
    mode === 'demo'
      ? {
          name: STATIC_DATA.DEMO_USER.name,
          email: STATIC_DATA.DEMO_USER.email,
          role: STATIC_DATA.DEMO_USER.role,
          productivityScore: STATIC_DATA.DEMO_USER.productivityScore,
          focusScore: STATIC_DATA.DEMO_USER.focusScore,
          streak: STATIC_DATA.DEMO_USER.streak,
          avatarColor: STATIC_DATA.DEMO_USER.avatarColor,
        }
      : DEFAULT_USER
  );
  const [loading, setLoading] = useState(mode === 'live');
  const subscribedRef = useRef(false);

  // ── Live mode: connect to Firestore once session + uid are ready ────────────
  useEffect(() => {
    if (mode !== 'live') return;
    if (status === 'loading') return; // Wait for session to resolve
    if (!uid) {
      // Session resolved but no user — stop loading
      setLoading(false);
      return;
    }
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    setLoading(true);

    // Load or create user profile
    const initProfile = async () => {
      try {
        const profile = await getUserProfile(uid);
        if (profile) {
          setUser({
            name: session?.user?.name || profile.name || 'User',
            email: session?.user?.email || profile.email || '',
            image: session?.user?.image || profile.image,
            role: profile.role || 'User',
            productivityScore: profile.productivityScore ?? 0,
            focusScore: profile.focusScore ?? 0,
            streak: profile.streak ?? 0,
            avatarColor: '#4F46E5',
          });
        } else {
          // First-time user — create profile
          await createUserProfile(uid, {
            name: session?.user?.name || 'User',
            email: session?.user?.email || '',
            image: session?.user?.image || undefined,
          });
          setUser({
            name: session?.user?.name || 'User',
            email: session?.user?.email || '',
            image: session?.user?.image || undefined,
            role: 'User',
            productivityScore: 0,
            focusScore: 0,
            streak: 0,
            avatarColor: '#4F46E5',
          });
        }
      } catch (err) {
        // If Firestore fails, still show session data
        setUser({
          name: session?.user?.name || 'User',
          email: session?.user?.email || '',
          image: session?.user?.image || undefined,
          role: 'User',
          productivityScore: 0,
          focusScore: 0,
          streak: 0,
          avatarColor: '#4F46E5',
        });
      }
    };

    initProfile();

    // Open real-time Firestore listeners
    const unsubs: (() => void)[] = [
      subscribeToTasks(uid, (data) => { setTasks(data); setLoading(false); }),
      subscribeToBills(uid, setBills),
      subscribeToGoals(uid, setGoals),
      subscribeToHabits(uid, setHabits),
      subscribeToEmails(uid, setEmails),
      subscribeToInterviews(uid, setInterviews),
      subscribeToCalendarEvents(uid, setCalendarEvents),
      subscribeToPlanicMessages(uid, setMessages),
    ];

    // Stop loading after 5s regardless (handles empty Firestore collections)
    const timeout = setTimeout(() => setLoading(false), 5000);

    return () => {
      unsubs.forEach(fn => fn());
      clearTimeout(timeout);
      subscribedRef.current = false;
    };
  }, [mode, uid, status]);

  // Keep user display name in sync with session
  useEffect(() => {
    if (mode !== 'live' || !session?.user) return;
    setUser(prev => ({
      ...prev,
      name: session.user?.name || prev.name,
      email: session.user?.email || prev.email,
      image: session.user?.image || prev.image,
    }));
  }, [session, mode]);

  // ── Mutations ──────────────────────────────────────────────────────────────

  const addTask = useCallback(async (task: Omit<Task, 'id'>) => {
    if (mode === 'demo' || !uid) return 'demo';
    return fsAddTask(uid, task);
  }, [mode, uid]);

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    if (mode === 'demo' || !uid) return;
    await fsUpdateTask(uid, id, data);
  }, [mode, uid]);

  const deleteTask = useCallback(async (id: string) => {
    if (mode === 'demo' || !uid) return;
    await fsDeleteTask(uid, id);
  }, [mode, uid]);

  const addBill = useCallback(async (bill: Omit<Bill, 'id'>) => {
    if (mode === 'demo' || !uid) return 'demo';
    return fsAddBill(uid, bill);
  }, [mode, uid]);

  const updateBill = useCallback(async (id: string, data: Partial<Bill>) => {
    if (mode === 'demo' || !uid) return;
    await fsUpdateBill(uid, id, data);
  }, [mode, uid]);

  const deleteBill = useCallback(async (id: string) => {
    if (mode === 'demo' || !uid) return;
    await fsDeleteBill(uid, id);
  }, [mode, uid]);

  const addGoal = useCallback(async (goal: Omit<Goal, 'id'>) => {
    if (mode === 'demo' || !uid) return 'demo';
    return fsAddGoal(uid, goal);
  }, [mode, uid]);

  const updateGoal = useCallback(async (id: string, data: Partial<Goal>) => {
    if (mode === 'demo' || !uid) return;
    await fsUpdateGoal(uid, id, data);
  }, [mode, uid]);

  const deleteGoal = useCallback(async (id: string) => {
    if (mode === 'demo' || !uid) return;
    await fsDeleteGoal(uid, id);
  }, [mode, uid]);

  const addHabit = useCallback(async (habit: Omit<Habit, 'id'>) => {
    if (mode === 'demo' || !uid) return 'demo';
    return fsAddHabit(uid, habit);
  }, [mode, uid]);

  const updateHabit = useCallback(async (id: string, data: Partial<Habit>) => {
    if (mode === 'demo' || !uid) return;
    await fsUpdateHabit(uid, id, data);
  }, [mode, uid]);

  const deleteHabit = useCallback(async (id: string) => {
    if (mode === 'demo' || !uid) return;
    await fsDeleteHabit(uid, id);
  }, [mode, uid]);

  const addEmail = useCallback(async (email: Omit<Email, 'id'>) => {
    if (mode === 'demo' || !uid) return 'demo';
    return fsAddEmail(uid, email);
  }, [mode, uid]);

  const updateEmail = useCallback(async (id: string, data: Partial<Email>) => {
    if (mode === 'demo' || !uid) return;
    await fsUpdateEmail(uid, id, data);
  }, [mode, uid]);

  const addInterview = useCallback(async (interview: Omit<Interview, 'id'>) => {
    if (mode === 'demo' || !uid) return 'demo';
    return fsAddInterview(uid, interview);
  }, [mode, uid]);

  const updateInterview = useCallback(async (id: string, data: Partial<Interview>) => {
    if (mode === 'demo' || !uid) return;
    await fsUpdateInterview(uid, id, data);
  }, [mode, uid]);

  const deleteInterview = useCallback(async (id: string) => {
    if (mode === 'demo' || !uid) return;
    await fsDeleteInterview(uid, id);
  }, [mode, uid]);

  const addCalendarEvent = useCallback(async (event: Omit<CalendarEvent, 'id'>) => {
    if (mode === 'demo' || !uid) return 'demo';
    return fsAddCalendarEvent(uid, event);
  }, [mode, uid]);

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (mode === 'live' && loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
        <p className="text-sm text-muted-foreground">Loading your workspace…</p>
      </div>
    );
  }

  return (
    <DataContext.Provider
      value={{
        tasks, emails, bills, goals, habits,
        calendarEvents, interviews, messages,
        user, mode, loading,
        addTask, updateTask, deleteTask,
        addBill, updateBill, deleteBill,
        addGoal, updateGoal, deleteGoal,
        addHabit, updateHabit, deleteHabit,
        addEmail, updateEmail,
        addInterview, updateInterview, deleteInterview,
        addCalendarEvent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
