'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Priority } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

/** Color + label helpers shared across modules. */
export const priorityConfig: Record<Priority, { label: string; variant: 'default' | 'secondary' | 'warning' | 'danger'; dot: string }> = {
  low: { label: 'Low', variant: 'secondary', dot: 'bg-muted-foreground' },
  medium: { label: 'Medium', variant: 'secondary', dot: 'bg-muted-foreground' },
  high: { label: 'High', variant: 'warning', dot: 'bg-warning' },
  critical: { label: 'Critical', variant: 'danger', dot: 'bg-destructive' },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const c = priorityConfig[priority];
  return (
    <Badge variant={c.variant} className="gap-1.5">
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />
      {c.label}
    </Badge>
  );
}

/** Countdown chip that turns red as deadline approaches. */
export function CountdownChip({ deadline }: { deadline: string }) {
  const diff = new Date(deadline).getTime() - Date.now();
  const hours = diff / 3_600_000;
  let label: string;
  let danger = false;
  if (hours < 0) {
    label = 'Overdue';
    danger = true;
  } else if (hours < 24) {
    label = `${Math.round(hours)}h left`;
    danger = hours < 6;
  } else if (hours < 168) {
    label = `${Math.round(hours / 24)}d left`;
  } else {
    label = `${Math.round(hours / 24)}d left`;
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums',
        danger
          ? 'bg-destructive/15 text-destructive'
          : hours < 48
            ? 'bg-warning/15 text-warning'
            : 'bg-muted text-muted-foreground'
      )}
    >
      <span className={cn('h-1 w-1 rounded-full', danger ? 'bg-destructive animate-pulse' : 'bg-current')} />
      {label}
    </span>
  );
}

/** Animated horizontal urgency meter (0–100). */
export function UrgencyMeter({ value, className }: { value: number; className?: string }) {
  const color = value > 80 ? 'hsl(var(--destructive))' : 'hsl(var(--foreground))';
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
}
