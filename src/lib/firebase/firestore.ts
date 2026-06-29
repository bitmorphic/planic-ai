/**
 * PLANIC AI — Firestore Service Layer
 * All database operations for the live app.
 * Every function is scoped to a userId to enforce data isolation.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Unsubscribe,
  DocumentData,
} from 'firebase/firestore';
import { db } from './client';
import type {
  Task,
  Bill,
  Goal,
  Habit,
  Email,
  Interview,
  CalendarEvent,
  PlanicMessage,
} from '@/lib/types';

// ─── Collection helpers ──────────────────────────────────────────────────────

function userCol(uid: string, col: string) {
  return collection(db, 'users', uid, col);
}

function userDoc(uid: string, col: string, id: string) {
  return doc(db, 'users', uid, col, id);
}

// ─── User Profile ────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  email: string;
  image?: string;
  role?: string;
  productivityScore: number;
  focusScore: number;
  streak: number;
  createdAt: unknown;
  updatedAt: unknown;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
  await setDoc(doc(db, 'users', uid), {
    productivityScore: 75,
    focusScore: 60,
    streak: 0,
    role: 'User',
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export async function getTasks(uid: string): Promise<Task[]> {
  const snap = await getDocs(query(userCol(uid, 'tasks'), orderBy('deadline', 'asc')));
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as Task));
}

export function subscribeToTasks(uid: string, onChange: (tasks: Task[]) => void): Unsubscribe {
  return onSnapshot(
    query(userCol(uid, 'tasks'), orderBy('deadline', 'asc')),
    snap => onChange(snap.docs.map(d => ({ ...d.data(), id: d.id } as Task)))
  );
}

export async function addTask(uid: string, task: Omit<Task, 'id'>): Promise<string> {
  const ref = await addDoc(userCol(uid, 'tasks'), { ...task, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateTask(uid: string, id: string, data: Partial<Task>) {
  await updateDoc(userDoc(uid, 'tasks', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteTask(uid: string, id: string) {
  await deleteDoc(userDoc(uid, 'tasks', id));
}

// ─── Bills ───────────────────────────────────────────────────────────────────

export async function getBills(uid: string): Promise<Bill[]> {
  const snap = await getDocs(query(userCol(uid, 'bills'), orderBy('dueDate', 'asc')));
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as Bill));
}

export function subscribeToBills(uid: string, onChange: (bills: Bill[]) => void): Unsubscribe {
  return onSnapshot(
    query(userCol(uid, 'bills'), orderBy('dueDate', 'asc')),
    snap => onChange(snap.docs.map(d => ({ ...d.data(), id: d.id } as Bill)))
  );
}

export async function addBill(uid: string, bill: Omit<Bill, 'id'>): Promise<string> {
  const ref = await addDoc(userCol(uid, 'bills'), { ...bill, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateBill(uid: string, id: string, data: Partial<Bill>) {
  await updateDoc(userDoc(uid, 'bills', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteBill(uid: string, id: string) {
  await deleteDoc(userDoc(uid, 'bills', id));
}

// ─── Goals ───────────────────────────────────────────────────────────────────

export async function getGoals(uid: string): Promise<Goal[]> {
  const snap = await getDocs(query(userCol(uid, 'goals'), orderBy('targetDate', 'asc')));
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as Goal));
}

export function subscribeToGoals(uid: string, onChange: (goals: Goal[]) => void): Unsubscribe {
  return onSnapshot(
    query(userCol(uid, 'goals'), orderBy('targetDate', 'asc')),
    snap => onChange(snap.docs.map(d => ({ ...d.data(), id: d.id } as Goal)))
  );
}

export async function addGoal(uid: string, goal: Omit<Goal, 'id'>): Promise<string> {
  const ref = await addDoc(userCol(uid, 'goals'), { ...goal, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateGoal(uid: string, id: string, data: Partial<Goal>) {
  await updateDoc(userDoc(uid, 'goals', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteGoal(uid: string, id: string) {
  await deleteDoc(userDoc(uid, 'goals', id));
}

// ─── Habits ──────────────────────────────────────────────────────────────────

export async function getHabits(uid: string): Promise<Habit[]> {
  const snap = await getDocs(userCol(uid, 'habits'));
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as Habit));
}

export function subscribeToHabits(uid: string, onChange: (habits: Habit[]) => void): Unsubscribe {
  return onSnapshot(
    userCol(uid, 'habits'),
    snap => onChange(snap.docs.map(d => ({ ...d.data(), id: d.id } as Habit)))
  );
}

export async function addHabit(uid: string, habit: Omit<Habit, 'id'>): Promise<string> {
  const ref = await addDoc(userCol(uid, 'habits'), { ...habit, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateHabit(uid: string, id: string, data: Partial<Habit>) {
  await updateDoc(userDoc(uid, 'habits', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteHabit(uid: string, id: string) {
  await deleteDoc(userDoc(uid, 'habits', id));
}

// ─── Emails ──────────────────────────────────────────────────────────────────

export async function getEmails(uid: string): Promise<Email[]> {
  const snap = await getDocs(query(userCol(uid, 'emails'), orderBy('receivedAt', 'desc')));
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as Email));
}

export function subscribeToEmails(uid: string, onChange: (emails: Email[]) => void): Unsubscribe {
  return onSnapshot(
    query(userCol(uid, 'emails'), orderBy('receivedAt', 'desc')),
    snap => onChange(snap.docs.map(d => ({ ...d.data(), id: d.id } as Email)))
  );
}

export async function addEmail(uid: string, email: Omit<Email, 'id'>): Promise<string> {
  const ref = await addDoc(userCol(uid, 'emails'), { ...email, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateEmail(uid: string, id: string, data: Partial<Email>) {
  await updateDoc(userDoc(uid, 'emails', id), { ...data });
}

// ─── Interviews ──────────────────────────────────────────────────────────────

export async function getInterviews(uid: string): Promise<Interview[]> {
  const snap = await getDocs(query(userCol(uid, 'interviews'), orderBy('date', 'asc')));
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as Interview));
}

export function subscribeToInterviews(uid: string, onChange: (interviews: Interview[]) => void): Unsubscribe {
  return onSnapshot(
    query(userCol(uid, 'interviews'), orderBy('date', 'asc')),
    snap => onChange(snap.docs.map(d => ({ ...d.data(), id: d.id } as Interview)))
  );
}

export async function addInterview(uid: string, interview: Omit<Interview, 'id'>): Promise<string> {
  const ref = await addDoc(userCol(uid, 'interviews'), { ...interview, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateInterview(uid: string, id: string, data: Partial<Interview>) {
  await updateDoc(userDoc(uid, 'interviews', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteInterview(uid: string, id: string) {
  await deleteDoc(userDoc(uid, 'interviews', id));
}

// ─── Calendar Events ─────────────────────────────────────────────────────────

export async function getCalendarEvents(uid: string): Promise<CalendarEvent[]> {
  const snap = await getDocs(query(userCol(uid, 'calendar'), orderBy('start', 'asc')));
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as CalendarEvent));
}

export function subscribeToCalendarEvents(uid: string, onChange: (events: CalendarEvent[]) => void): Unsubscribe {
  return onSnapshot(
    query(userCol(uid, 'calendar'), orderBy('start', 'asc')),
    snap => onChange(snap.docs.map(d => ({ ...d.data(), id: d.id } as CalendarEvent)))
  );
}

export async function addCalendarEvent(uid: string, event: Omit<CalendarEvent, 'id'>): Promise<string> {
  const ref = await addDoc(userCol(uid, 'calendar'), { ...event, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateCalendarEvent(uid: string, id: string, data: Partial<CalendarEvent>) {
  await updateDoc(userDoc(uid, 'calendar', id), { ...data });
}

export async function deleteCalendarEvent(uid: string, id: string) {
  await deleteDoc(userDoc(uid, 'calendar', id));
}

// ─── Planic Messages ─────────────────────────────────────────────────────────

export async function getPlanicMessages(uid: string): Promise<PlanicMessage[]> {
  const snap = await getDocs(query(userCol(uid, 'messages'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as PlanicMessage));
}

export function subscribeToPlanicMessages(uid: string, onChange: (msgs: PlanicMessage[]) => void): Unsubscribe {
  return onSnapshot(
    query(userCol(uid, 'messages'), orderBy('createdAt', 'desc')),
    snap => onChange(snap.docs.map(d => ({ ...d.data(), id: d.id } as PlanicMessage)))
  );
}

export async function addPlanicMessage(uid: string, msg: Omit<PlanicMessage, 'id'>): Promise<string> {
  const ref = await addDoc(userCol(uid, 'messages'), { ...msg, createdAt: serverTimestamp() });
  return ref.id;
}
