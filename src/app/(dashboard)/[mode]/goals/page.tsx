'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Target, Flame, Trophy, Plus, TrendingUp, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AddGoalDialog } from '@/components/app/add-goal-dialog';
import { useData } from '@/contexts/data-context';
import { formatRelative, cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Goal } from '@/lib/types';

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function GoalsPage() {
  const { goals, habits, tasks, updateGoal, updateHabit, user } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | undefined>();
  const openAdd = () => { setEditGoal(undefined); setDialogOpen(true); };

  // Compute real streak values from habits
  const currentStreak = user.streak ?? 0;
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.bestStreak ?? 0), currentStreak) : currentStreak;
  const habitsCompletedThisWeek = habits.reduce((s, h) => s + h.week.filter(Boolean).length, 0);
  const doneTasks = tasks.filter(t => t.status === 'done').length;

  const toggleMilestone = async (goal: Goal, milestoneId: string) => {
    const updated = goal.milestones.map(m =>
      m.id === milestoneId ? { ...m, done: !m.done } : m
    );
    const progress = Math.round((updated.filter(m => m.done).length / updated.length) * 100);
    await updateGoal(goal.id, { milestones: updated, progress });
  };

  const toggleHabitDay = async (habitId: string, dayIndex: number, currentWeek: boolean[]) => {
    const newWeek = [...currentWeek];
    newWeek[dayIndex] = !newWeek[dayIndex];
    const streak = newWeek.filter(Boolean).length;
    await updateHabit(habitId, { week: newWeek, streak });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Module 10"
        title="Goals & Habits"
        description="Long-arc accountability. Track goals with milestones, build streaks with habits, and let the AI nudge you before momentum breaks."
        actions={
          <Button className="gap-2" onClick={openAdd}>
            <Plus className="h-4 w-4" /> New goal
          </Button>
        }
      />

      {/* Top: Streak summary */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Flame, label: 'Current streak', value: currentStreak > 0 ? `${currentStreak} days` : '0 days' },
          { icon: Trophy, label: 'Best streak', value: bestStreak > 0 ? `${bestStreak} days` : '0 days' },
          { icon: Target, label: 'Active goals', value: String(goals.length) },
          { icon: TrendingUp, label: 'Habits this week', value: habits.length > 0 ? `${habitsCompletedThisWeek}/${habits.length * 7}` : '0/0' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card>
              <CardContent className="flex items-center gap-3 pt-5">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <s.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-lg font-bold tabular-nums">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Goals */}
        <div className="space-y-4 lg:col-span-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Target className="h-4 w-4" /> Goals
          </h2>
          {goals.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Target className="h-10 w-10 text-muted-foreground" />
              <p className="font-semibold">No goals yet</p>
              <p className="text-sm text-muted-foreground">Create your first goal to start tracking progress</p>
              <Button onClick={openAdd} className="gap-2 mt-2"><Plus className="h-4 w-4" /> Add goal</Button>
            </div>
          ) : goals.map((goal, i) => (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="lift">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{goal.title}</h3>
                      {goal.description && <p className="mt-0.5 text-xs text-muted-foreground">{goal.description}</p>}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{goal.progress}%</div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="h-2.5 w-2.5" /> {formatRelative(goal.targetDate)}
                      </div>
                    </div>
                  </div>
                  <Progress value={goal.progress} className="mt-3 h-1.5" />
                  {/* Milestones - now interactive */}
                  <div className="mt-4 space-y-1.5">
                    {goal.milestones.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => toggleMilestone(goal, m.id)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1 text-left transition-colors hover:bg-muted/50"
                      >
                        {m.done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <span className={cn('text-sm', m.done ? 'text-muted-foreground line-through' : 'text-foreground')}>{m.title}</span>
                      </button>
                    ))}
                  </div>
                  {goal.streak && (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Flame className="h-3 w-3 text-warning" /> {goal.streak}-day momentum
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Habits */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Flame className="h-4 w-4" /> Habits
          </h2>
          {habits.map((habit, i) => {
            const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[habit.icon] ?? Icons.Circle;
            const completedThisWeek = habit.week.filter(Boolean).length;
            const pct = Math.round((completedThisWeek / habit.targetPerWeek) * 100);
            return (
              <motion.div key={habit.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className="lift">
                  <CardContent className="pt-5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${habit.color}1a`, color: habit.color }}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold">{habit.title}</div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Flame className="h-2.5 w-2.5 text-warning" /> {habit.streak} day streak · best {habit.bestStreak}
                        </div>
                      </div>
                      <Badge variant={pct >= 100 ? 'success' : pct >= 60 ? 'warning' : 'secondary'}>
                        {completedThisWeek}/{habit.targetPerWeek}
                      </Badge>
                    </div>
                    {/* Week dots - now interactive */}
                    <div className="mt-3 flex items-center justify-between">
                      {habit.week.map((done, d) => (
                        <div key={d} className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => toggleHabitDay(habit.id, d, habit.week)}
                            className={cn(
                              'grid h-7 w-7 place-items-center rounded-full border-2 transition-colors hover:opacity-80',
                              done ? 'border-transparent text-white' : 'border-border text-muted-foreground hover:border-foreground/30'
                            )}
                            style={done ? { background: habit.color } : {}}
                          >
                            {done && <CheckCircle2 className="h-3.5 w-3.5" />}
                          </button>
                          <span className="text-[9px] text-muted-foreground">{weekDays[d]}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Weekly review — real data */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 rounded-2xl border border-border bg-muted/30 p-6"
      >
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-foreground text-background">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">AI Weekly Review</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {goals.length === 0 && habits.length === 0 ? (
                <>Start by adding a goal or habit above. Once you have data, your AI review will appear here.</>
              ) : (
                <>
                  You have{' '}
                  <span className="font-semibold text-foreground">{goals.length} active {goals.length === 1 ? 'goal' : 'goals'}</span>
                  {habits.length > 0 && <> and <span className="font-semibold text-foreground">{habits.length} {habits.length === 1 ? 'habit' : 'habits'}</span> tracked</>}.
                  {doneTasks > 0 && <> You&apos;ve completed <span className="font-semibold text-foreground">{doneTasks} {doneTasks === 1 ? 'task' : 'tasks'}</span> total.</>}
                  {currentStreak > 0
                    ? <> Your current streak is <span className="font-semibold text-foreground">{currentStreak} days</span> — keep it going!</>
                    : <> Complete a habit today to start your streak!</>}
                </>
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
