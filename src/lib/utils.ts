import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date relative to now, e.g. "in 2 days", "3 hours ago" */
export function formatRelative(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = d.getTime() - Date.now();
  const abs = Math.abs(diff);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (abs < hour) return rtf.format(Math.round(diff / minute), 'minute');
  if (abs < day) return rtf.format(Math.round(diff / hour), 'hour');
  if (abs < 30 * day) return rtf.format(Math.round(diff / day), 'day');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Hours remaining until a deadline */
export function hoursUntil(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return (d.getTime() - Date.now()) / 3_600_000;
}

/** Urgency score 0–100 based on time left + priority */
export function urgencyScore(deadline: Date | string, priority: 'low' | 'medium' | 'high' | 'critical'): number {
  const h = hoursUntil(deadline);
  const prioWeight = { low: 0.5, medium: 0.75, high: 1, critical: 1.25 }[priority];
  // Decay: at 0h => 100, at 168h (1 week) => ~8
  const timeScore = Math.max(0, Math.min(100, 100 * Math.exp(-h / 72)));
  return Math.min(100, Math.round(timeScore * prioWeight));
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', opts ?? { month: 'short', day: 'numeric', year: 'numeric' });
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Build a deterministic future date N hours from now (for demo data freshness) */
export function inHours(h: number): string {
  return new Date(Date.now() + h * 3_600_000).toISOString();
}
export function inDays(d: number): string {
  return new Date(Date.now() + d * 86_400_000).toISOString();
}
