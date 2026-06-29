'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Siren,
  Clock,
  Check,
  X,
  Zap,
  Target,
  AlertOctagon,
  TrendingDown,
} from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/data-context';
import { hoursUntil, cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function PanicPage() {
  const { tasks, updateTask, mode } = useData();
  const [done, setDone] = useState<Set<string>>(new Set());
  const [now, setNow] = useState(Date.now());

  // Live countdown
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Find the most urgent non-done task dynamically
  const panicTask = [...tasks]
    .filter(t => t.status !== 'done')
    .sort((a, b) => {
      // Sort by: critical first, then by soonest deadline
      const aPrio = a.priority === 'critical' ? 0 : a.priority === 'high' ? 1 : 2;
      const bPrio = b.priority === 'critical' ? 0 : b.priority === 'high' ? 1 : 2;
      if (aPrio !== bPrio) return aPrio - bPrio;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    })[0];

  const msLeft = panicTask ? new Date(panicTask.deadline).getTime() - now : 0;
  const hoursLeft = Math.max(0, msLeft / 3_600_000);
  const h = Math.floor(hoursLeft);
  const m = Math.floor((hoursLeft - h) * 60);
  const s = Math.floor(((hoursLeft - h) * 60 - m) * 60);

  // Build survival plan from task's subtasks, or fallback items
  const focusOn = panicTask?.subtasks
    ? panicTask.subtasks
        .filter(st => !st.done)
        .slice(0, 4)
        .map(st => ({ id: st.id, title: st.title, effort: st.effortHours || 1, why: 'Subtask required for completion.' }))
    : [
        { id: 'r1', title: 'Complete the core requirement', effort: 2, why: 'The minimum deliverable. Cannot skip.' },
        { id: 'r2', title: 'Review and test your work', effort: 0.5, why: 'Catch critical errors before submitting.' },
        { id: 'r3', title: 'Submit / deliver', effort: 0.25, why: 'Mechanical — just ship it.' },
      ];

  const drop = [
    { id: 'd1', title: 'Refactor or over-engineer', why: 'Working code > clean code right now' },
    { id: 'd2', title: 'Add extra features', why: 'Scope creep kills deadlines.' },
    { id: 'd3', title: 'Perfect the presentation', why: 'Done beats perfect every time.' },
  ];

  const rescueHours = focusOn.filter(r => !done.has(r.id)).reduce((s, r) => s + r.effort, 0);

  const toggleItem = async (id: string) => {
    setDone(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const markTaskDone = async () => {
    if (!panicTask) return;
    await updateTask(panicTask.id, { status: 'done', progress: 100 });
    toast.success('Task completed! 🎉 Panic Mode deactivated.');
  };

  if (!panicTask) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageHeader eyebrow="Module 06" title="Panic Mode" description="Emergency rescue planner for your most critical deadline." />
        <div className="mt-20 flex flex-col items-center gap-4 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-success/10 text-success">
            <Check className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold">You're in the clear!</h2>
          <p className="text-muted-foreground">No critical or urgent tasks right now. Add tasks in Deadline Radar to track them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Module 06"
        title="Panic Mode"
        description="Deadline under 24 hours. The AI has built you an emergency rescue plan — focus only on what ships, drop everything else."
        actions={
          <Badge variant="danger" className="gap-1.5 animate-pulse">
            <Siren className="h-3 w-3" /> CRITICAL
          </Badge>
        }
      />

      {/* Countdown hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-6 overflow-hidden rounded-2xl border border-destructive/30 bg-destructive/[0.05] p-8"
      >
        <div className="relative flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-destructive">
            <AlertOctagon className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Time remaining</span>
          </div>
          <div className="mt-3 flex items-center gap-1 font-mono text-6xl font-bold tabular-nums sm:text-7xl">
            <TimeBlock value={h} label="hours" />
            <span className="text-destructive">:</span>
            <TimeBlock value={m} label="min" />
            <span className="text-destructive">:</span>
            <TimeBlock value={s} label="sec" />
          </div>
          <div className="mt-4 max-w-xl text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{panicTask.title}</span> · {panicTask.progress}% complete
          </div>
          <Button size="sm" variant="outline" className="mt-4 gap-2 text-xs" onClick={markTaskDone}>
            <Check className="h-3.5 w-3.5" /> Mark as complete
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Survival plan */}
        <Card className="border-success/30 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-success" /> Survival Plan — Do ONLY this
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">Estimated completion: <span className="font-semibold text-success">{rescueHours.toFixed(1)}h</span> · fits in your time remaining</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {focusOn.map((r, i) => {
              const isDone = done.has(r.id);
              return (
                <motion.button
                  key={r.id}
                  layout
                  onClick={() => toggleItem(r.id)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all',
                    isDone ? 'border-success/40 bg-success/5' : 'border-border bg-card/40 hover:border-success/30'
                  )}
                >
                  <div className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors', isDone ? 'border-success bg-success text-white' : 'border-muted-foreground/40')}>
                    {isDone && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={cn('text-sm font-medium', isDone && 'text-muted-foreground line-through')}>{r.title}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">{r.why}</div>
                  </div>
                  <Badge variant="success" className="gap-1 text-[9px]">
                    <Clock className="h-2.5 w-2.5" /> {r.effort}h
                  </Badge>
                </motion.button>
              );
            })}
          </CardContent>
        </Card>

        {/* Drop list */}
        <Card className="border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
              <TrendingDown className="h-4 w-4" /> Drop / Defer
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">Nice-to-haves. Cut them ruthlessly.</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {drop.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-2.5 opacity-70"
              >
                <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div>
                  <div className="text-xs font-medium line-through">{d.title}</div>
                  <div className="text-[10px] text-muted-foreground">{d.why}</div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Strategy banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">AI strategy: Ship the minimum, nothing more.</div>
            <div className="text-xs text-muted-foreground">
              {h}h {m}m left · {rescueHours.toFixed(1)}h of critical work remains. Start the timer and stay locked in.
            </div>
          </div>
        </div>
        <Button size="lg" className="gap-2" onClick={() => toast.info('Focus timer started — stay locked in!')}>
          <Zap className="h-4 w-4" /> Start focus timer
        </Button>
      </motion.div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="tabular-nums">{String(value).padStart(2, '0')}</span>
      <span className="mt-1 text-[10px] font-normal uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}
