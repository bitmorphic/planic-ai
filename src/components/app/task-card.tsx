'use client';

import { motion } from 'framer-motion';
import { CalendarClock, Clock, MoreHorizontal } from 'lucide-react';
import { Task } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PriorityBadge, CountdownChip } from '@/components/shared/priority';
import { formatTime, urgencyScore, cn } from '@/lib/utils';

const categoryColors: Record<string, string> = {
  assignment: '#4F46E5',
  meeting: '#06B6D4',
  interview: '#6366F1',
  bill: '#22C55E',
  goal: '#F59E0B',
  habit: '#EC4899',
  project: '#8B5CF6',
  personal: '#64748B',
  event: '#06B6D4',
};

const sourceLabels: Record<string, string> = {
  gmail: 'Gmail',
  voice: 'Voice',
  vision: 'Vision',
  manual: 'Manual',
  planner: 'AI Planner',
};

export function TaskCard({ task, compact = false }: { task: Task; compact?: boolean }) {
  const urgency = urgencyScore(task.deadline, task.priority);
  const accent = categoryColors[task.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <Card className="group relative overflow-hidden border-border">
        {/* Accent stripe */}
        <div className="absolute left-0 top-0 h-full w-1" style={{ background: accent }} />
        <div className="p-4 pl-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <PriorityBadge priority={task.priority} />
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
                  style={{ background: `${accent}1a`, color: accent }}
                >
                  {task.category}
                </span>
                {task.source !== 'manual' && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    via {sourceLabels[task.source]}
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-sm font-semibold leading-snug">{task.title}</h3>
              {!compact && task.description && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
              )}
            </div>
            <button className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Progress */}
          {task.progress > 0 && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{task.progress}% done · {task.effortHours - (task.effortHours * task.progress) / 100 | 0}h left</span>
              </div>
              <Progress value={task.progress} className="h-1.5" />
            </div>
          )}

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{task.effortHours}h effort</span>
              {task.scheduledStart && (
                <span className="hidden items-center gap-1 sm:flex">
                  · <CalendarClock className="h-3 w-3" /> {formatTime(task.scheduledStart)}
                </span>
              )}
            </div>
            <CountdownChip deadline={task.deadline} />
          </div>

          {/* Urgency meter */}
          {urgency > 50 && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Risk</span>
                <span className={cn('font-medium', urgency > 80 ? 'text-destructive' : 'text-warning')}>{urgency}%</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn('h-full rounded-full', urgency > 80 ? 'bg-destructive' : 'bg-warning')}
                  style={{ width: `${urgency}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
