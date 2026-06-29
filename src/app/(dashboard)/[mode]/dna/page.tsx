'use client';

import { motion } from 'framer-motion';
import {
  Dna,
  TrendingUp,
  Clock,
  Brain,
  Zap,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
  ListTodo,
  Target,
  Activity,
} from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreRing } from '@/components/shared/score-ring';
import { Counter } from '@/components/shared/counter';
import { useData } from '@/contexts/data-context';
import { cn } from '@/lib/utils';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function heatColor(score: number) {
  if (score < 15) return 'bg-muted/40';
  if (score < 30) return 'bg-primary/20';
  if (score < 50) return 'bg-primary/40';
  if (score < 70) return 'bg-primary/60';
  if (score < 85) return 'bg-primary/80';
  return 'bg-primary';
}

export default function DnaPage() {
  const { tasks, goals, habits, user, mode } = useData();

  // Compute real stats from actual user data
  const doneTasks = tasks.filter(t => t.status === 'done');
  const pendingTasks = tasks.filter(t => t.status !== 'done');
  const completionRate = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0;
  const criticalTasks = tasks.filter(t => t.priority === 'critical');

  // Productivity score based on real data
  const productivityScore = user.productivityScore;
  const focusScore = user.focusScore;

  // Weekly trend: count tasks whose deadline falls on each day this week
  const today = new Date();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = weekDays.map((day, i) => {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() - (today.getDay() - i));
    const count = doneTasks.filter(t => {
      if (!t.deadline) return false;
      const d = new Date(t.deadline);
      return d.toDateString() === dayDate.toDateString();
    }).length;
    return { day, tasks: count };
  });

  const maxWeekly = Math.max(...weeklyData.map(d => d.tasks), 1);

  // Heatmap — derive from task deadlines (hour from deadline string)
  const heatmap: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  doneTasks.forEach(t => {
    if (t.deadline) {
      try {
        const d = new Date(t.deadline);
        const dayIdx = d.getDay();
        const hourIdx = d.getHours();
        heatmap[dayIdx][hourIdx] = Math.min(100, (heatmap[dayIdx][hourIdx] || 0) + 25);
      } catch { /* ignore */ }
    }
  });

  const isNewUser = tasks.length === 0 && goals.length === 0;

  if (isNewUser) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Module 09"
          title="Productivity DNA"
          description="The AI learns when you're fastest, when you procrastinate, and what patterns predict your best days — then schedules your hardest work accordingly."
        />
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted">
            <Dna className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">No data yet</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Your Productivity DNA builds up as you complete tasks and track your work. Start by adding tasks in the Deadline Radar — your patterns will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Module 09"
        title="Productivity DNA"
        description="The AI learns when you're fastest, when you procrastinate, and what patterns predict your best days."
      />

      {/* Top stats — real data */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile icon={CheckCircle2} color="#10B981" label="Tasks completed" value={<Counter value={doneTasks.length} />} delta={doneTasks.length > 0 ? 'All time' : 'Complete your first!'} />
        <StatTile icon={ListTodo} color="#4F46E5" label="Tasks pending" value={<Counter value={pendingTasks.length} />} delta={criticalTasks.length > 0 ? `${criticalTasks.length} critical` : 'On track'} />
        <StatTile icon={Target} color="#06B6D4" label="Completion rate" value={<Counter value={completionRate} suffix="%" />} delta={completionRate >= 70 ? 'Great work!' : tasks.length === 0 ? 'Start adding tasks' : 'Keep going!'} />
        <StatTile icon={Activity} color="#EC4899" label="Goals tracked" value={<Counter value={goals.length} />} delta={habits.length > 0 ? `${habits.length} habits` : 'Add habits'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Heatmap */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Dna className="h-4 w-4 text-primary" /> Activity Heatmap
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">Task completions by hour & day</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                {/* Hour labels */}
                <div className="mb-1 flex gap-1 pl-10">
                  {Array.from({ length: 24 }).map((_, h) => (
                    <div key={h} className="flex-1 text-center text-[8px] text-muted-foreground">
                      {h % 3 === 0 ? `${h}` : ''}
                    </div>
                  ))}
                </div>
                {/* Rows */}
                {days.map((day, d) => (
                  <div key={day} className="mb-1 flex items-center gap-1">
                    <div className="w-9 text-right text-[10px] font-medium text-muted-foreground">{day}</div>
                    <div className="flex flex-1 gap-1">
                      {Array.from({ length: 24 }).map((_, h) => {
                        const score = heatmap[d]?.[h] ?? 0;
                        return (
                          <motion.div
                            key={h}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (d * 24 + h) * 0.001 }}
                            whileHover={{ scale: 1.3, zIndex: 10 }}
                            className={cn('group relative aspect-square flex-1 rounded-[3px] transition-colors', heatColor(score))}
                            title={`${day} ${h}:00`}
                          >
                            {score > 0 && (
                              <span className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-card px-1.5 py-0.5 text-[9px] opacity-0 shadow transition-opacity group-hover:opacity-100">
                                {h}:00 · {score}
                              </span>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {/* Legend */}
                <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className={cn('h-3 w-6 rounded-sm', ['bg-muted/40', 'bg-primary/20', 'bg-primary/40', 'bg-primary/60', 'bg-primary'][i])} />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Focus Score + real breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Scores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center">
              <ScoreRing value={productivityScore} size={110} label="Productivity" color="hsl(var(--primary))" />
            </div>
            <div className="space-y-2">
              {[
                { l: 'Accountability', v: `${productivityScore}%`, c: 'text-primary' },
                { l: 'Focus score', v: `${focusScore}%`, c: 'text-accent' },
                { l: 'Tasks done', v: doneTasks.length.toString(), c: 'text-success' },
                { l: 'Streak', v: `${user.streak}d`, c: 'text-warning' },
              ].map((r) => (
                <div key={r.l} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{r.l}</span>
                  <span className={cn('font-semibold', r.c)}>{r.v}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly trend — real data */}
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-success" /> Tasks Completed This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-end justify-between gap-2 sm:gap-4">
              {weeklyData.map((d, i) => {
                const h = maxWeekly > 0 ? (d.tasks / maxWeekly) * 100 : 0;
                const isToday = i === today.getDay();
                return (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full flex-1 items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${Math.max(h, d.tasks > 0 ? 8 : 3)}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.6, ease: 'easeOut' }}
                        className={cn('w-full rounded-t-lg transition-colors', isToday ? 'bg-primary' : 'bg-primary/50 hover:bg-primary/70')}
                        style={{ minHeight: 4 }}
                      />
                    </div>
                    <div className={cn('text-[11px] font-medium', isToday && 'text-primary')}>{d.day}</div>
                    <div className="text-[10px] text-muted-foreground">{d.tasks > 0 ? `${d.tasks}` : '—'}</div>
                  </div>
                );
              })}
            </div>
            {doneTasks.length === 0 && (
              <p className="mt-4 text-center text-xs text-muted-foreground">Complete tasks to see your weekly trend.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, color, label, value, delta }: { icon: React.ComponentType<{ className?: string }>; color: string; label: string; value: React.ReactNode; delta: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="lift h-full">
        <CardContent className="pt-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${color}1a`, color }}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="mt-3 text-2xl font-bold tabular-nums">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-1 text-[11px] font-medium" style={{ color }}>{delta}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
