'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Workflow,
  Sparkles,
  Send,
  Loader2,
  Check,
  Clock,
  CalendarPlus,
  GitBranch,
} from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useData } from '@/contexts/data-context';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PlanStep {
  id: string;
  title: string;
  phase: string;
  priority: 'high' | 'medium' | 'low';
  effortHours: number;
  dependencies?: string[];
}

const SAMPLE_PLAN: PlanStep[] = [
  { id: '1', title: 'Research & scope the project', phase: 'Discovery', priority: 'high', effortHours: 2 },
  { id: '2', title: 'Define MVP feature set', phase: 'Discovery', priority: 'high', effortHours: 1, dependencies: ['1'] },
  { id: '3', title: 'Design system + UI mockups', phase: 'Design', priority: 'high', effortHours: 4, dependencies: ['2'] },
  { id: '4', title: 'Set up Next.js + Firebase scaffold', phase: 'Build', priority: 'high', effortHours: 2, dependencies: ['3'] },
  { id: '5', title: 'Build frontend components', phase: 'Build', priority: 'high', effortHours: 8, dependencies: ['4'] },
  { id: '6', title: 'Integrate AI agents (Gemini)', phase: 'Build', priority: 'high', effortHours: 6, dependencies: ['4'] },
  { id: '7', title: 'Write tests + QA pass', phase: 'Polish', priority: 'medium', effortHours: 3, dependencies: ['5', '6'] },
  { id: '8', title: 'Deploy to Cloud Run', phase: 'Ship', priority: 'high', effortHours: 1, dependencies: ['7'] },
  { id: '9', title: 'Prepare demo + pitch', phase: 'Ship', priority: 'high', effortHours: 3, dependencies: ['8'] },
];

const phaseColors: Record<string, string> = {
  Discovery: '#06B6D4',
  Design: '#8B5CF6',
  Build: '#4F46E5',
  Polish: '#F59E0B',
  Ship: '#10B981',
};

export default function PlannerPage() {
  const { addTask, mode } = useData();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanStep[]>(mode === 'demo' ? SAMPLE_PLAN : []);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [aiGenerated, setAiGenerated] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/agents/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: prompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 401) {
          toast.error('Sign in required', { description: 'Please sign in to use the AI Planner.' });
        } else {
          throw new Error(err.error || 'Failed to generate plan');
        }
        return;
      }

      const data = await res.json();
      setPlan(data.steps);
      setDone(new Set());
      setAiGenerated(true);
      toast.success('AI plan generated!', {
        description: `${data.steps.length} steps · ${data.totalEffort.toFixed(1)}h total effort`
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      toast.error('Failed to generate plan', { description: msg });
      // Fallback to sample plan
      setPlan(SAMPLE_PLAN);
      setDone(new Set());
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id: string) => {
    setDone((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const scheduleAll = async () => {
    const pendingSteps = plan.filter(p => !done.has(p.id));
    if (pendingSteps.length === 0) {
      toast.info('All steps already marked as done!');
      return;
    }

    const now = Date.now();
    let offsetHours = 1;

    const creates = pendingSteps.map(step => {
      const deadline = new Date(now + offsetHours * 3_600_000).toISOString();
      offsetHours += step.effortHours + 0.5; // 30min buffer between tasks
      return addTask({
        title: step.title,
        category: 'project',
        priority: step.priority === 'high' ? 'high' : step.priority === 'medium' ? 'medium' : 'low',
        status: 'todo',
        deadline,
        effortHours: step.effortHours,
        progress: 0,
        source: 'planner',
      });
    });

    try {
      await Promise.all(creates);
      toast.success('Plan scheduled!', {
        description: `${pendingSteps.length} tasks added to your Deadline Radar`
      });
    } catch {
      toast.error('Failed to schedule some tasks');
    }
  };

  const totalEffort = plan.reduce((s, p) => s + p.effortHours, 0);
  const doneEffort = plan.filter((p) => done.has(p.id)).reduce((s, p) => s + p.effortHours, 0);
  const progress = Math.round((doneEffort / totalEffort) * 100);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Module 04"
        title="AI Planner"
        description="Give the AI a goal. It breaks it into phases, tasks, dependencies, and effort estimates — then schedules each step in your peak hours."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Prompt + plan output */}
        <div className="space-y-4 lg:col-span-2">
          {/* Prompt input */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Describe a goal or project</span>
                {aiGenerated && (
                  <Badge variant="success" className="ml-auto text-[10px]">AI Generated</Badge>
                )}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); generate(); }} className="mt-3 flex gap-2">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Build a hackathon project in 48 hours"
                  className="h-11 flex-1 rounded-lg border border-input bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {loading ? 'Thinking…' : 'Generate plan'}
                </Button>
              </form>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['Build a hackathon project', 'Prepare for Google interview', 'Write my thesis', 'Launch a SaaS MVP'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPrompt(s)}
                    className="rounded-full border border-border bg-card/50 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan timeline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <Workflow className="h-4 w-4 text-muted-foreground" /> Execution Plan
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {totalEffort}h total
              </div>
            </CardHeader>
            <CardContent>
              {/* Progress */}
              <div className="mb-5">
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>

              {/* Steps grouped by phase */}
              {Object.entries(
                plan.reduce<Record<string, PlanStep[]>>((acc, s) => {
                  (acc[s.phase] ||= []).push(s);
                  return acc;
                }, {})
              ).map(([phase, steps]) => (
                <div key={phase} className="mb-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: phaseColors[phase] || '#64748B' }} />
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: phaseColors[phase] || '#64748B' }}>{phase}</span>
                    <span className="text-[10px] text-muted-foreground">{steps.reduce((s, p) => s + p.effortHours, 0)}h</span>
                  </div>
                  <div className="space-y-1.5">
                    {steps.map((step) => {
                      const isDone = done.has(step.id);
                      return (
                        <motion.button
                          key={step.id}
                          layout
                          onClick={() => toggle(step.id)}
                          className={cn(
                            'group flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-all',
                            isDone ? 'border-success/30 bg-success/5' : 'border-border bg-card/40 hover:bg-muted/40'
                          )}
                        >
                          <div className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors', isDone ? 'border-success bg-success text-white' : 'border-muted-foreground/40')}>
                            {isDone && <Check className="h-3 w-3" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className={cn('text-sm font-medium', isDone && 'text-muted-foreground line-through')}>{step.title}</div>
                            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                              <Clock className="h-3 w-3" /> {step.effortHours}h
                              {step.dependencies && step.dependencies.length > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <GitBranch className="h-3 w-3" /> deps: {step.dependencies.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge variant={step.priority === 'high' ? 'danger' : step.priority === 'medium' ? 'warning' : 'secondary'} className="text-[9px]">
                            {step.priority}
                          </Badge>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Priority matrix + summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Priority Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square w-full">
                <div className="absolute left-0 top-0 h-full w-px bg-border" />
                <div className="absolute bottom-0 left-0 h-px w-full bg-border" />
                <div className="absolute left-2 top-1 text-[10px] text-muted-foreground">Urgent</div>
                <div className="absolute bottom-2 right-1 text-[10px] text-muted-foreground">Important</div>
                <div className="absolute left-2 top-1/4 rounded bg-destructive/10 px-1.5 py-0.5 text-[9px] font-medium text-destructive">DO NOW</div>
                <div className="absolute right-2 top-1/4 rounded bg-warning/10 px-1.5 py-0.5 text-[9px] font-medium text-warning">SCHEDULE</div>
                <div className="absolute bottom-8 left-2 rounded bg-accent/10 px-1.5 py-0.5 text-[9px] font-medium text-accent">DELEGATE</div>
                <div className="absolute bottom-8 right-2 rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">DROP</div>
                {plan.map((step, i) => {
                  const x = step.priority === 'high' ? 70 + Math.random() * 20 : step.priority === 'medium' ? 40 + Math.random() * 20 : 15 + Math.random() * 20;
                  const y = i < plan.length / 2 ? 15 + (i / plan.length) * 40 : 50 + ((i - plan.length / 2) / plan.length) * 35;
                  const color = phaseColors[step.phase] || '#64748B';
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.08, type: 'spring' }}
                      className="group absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full ring-4 ring-background"
                      style={{ left: `${x}%`, top: `${y}%`, background: color }}
                    >
                      <span className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap rounded bg-card px-1.5 py-0.5 text-[9px] opacity-0 shadow transition-opacity group-hover:opacity-100">
                        {step.title.slice(0, 25)}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Plan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { l: 'Total steps', v: String(plan.length) },
                { l: 'Estimated effort', v: `${totalEffort}h` },
                { l: 'Phases', v: String(new Set(plan.map((p) => p.phase)).size) },
                { l: 'Completed', v: `${done.size}/${plan.length}` },
                { l: 'AI generated', v: aiGenerated ? 'Yes ✓' : 'Sample plan' },
              ].map((r) => (
                <div key={r.l} className="flex justify-between">
                  <span className="text-muted-foreground">{r.l}</span>
                  <span className="font-semibold">{r.v}</span>
                </div>
              ))}
              <Button className="mt-2 w-full gap-2" onClick={scheduleAll}>
                <CalendarPlus className="h-4 w-4" /> Add all to Deadline Radar
              </Button>
              {mode === 'demo' && (
                <p className="text-center text-[11px] text-muted-foreground">
                  Demo mode — sign in to save tasks
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
