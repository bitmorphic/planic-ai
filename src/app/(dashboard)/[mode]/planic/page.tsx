'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScoreRing } from '@/components/shared/score-ring';
import { useData } from '@/contexts/data-context';
import { formatRelative, cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { PlanicMessage } from '@/lib/types';

const toneConfig = {
  regret:      { color: '#EF4444', bg: 'bg-destructive/[0.05]', label: 'Fear of regret',  icon: TrendingDown },
  motivation:  { color: '#10B981', bg: 'bg-success/[0.05]',     label: 'Motivation',       icon: TrendingUp },
  warning:     { color: '#F59E0B', bg: 'bg-warning/[0.05]',     label: 'Warning',          icon: AlertTriangle },
  celebration: { color: '#8B5CF6', bg: 'bg-muted/30',          label: 'Celebration',      icon: Sparkles },
};

export default function PlanicPage() {
  const { tasks, bills, user, messages: firestoreMsgs } = useData();

  // Always use context data — DataProvider handles demo vs live
  const baseMessages: PlanicMessage[] = firestoreMsgs;

  const [filter, setFilter] = useState<'all' | 'regret' | 'motivation' | 'warning'>('all');
  const [messages, setMessages] = useState<PlanicMessage[]>(baseMessages);
  const [generating, setGenerating] = useState(false);
  const [startedNow, setStartedNow] = useState(false);

  useEffect(() => {
    setMessages(baseMessages);
  }, [firestoreMsgs]);

  const filteredMessages = messages.filter(m => filter === 'all' || m.tone === filter);

  const now = Date.now();
  const criticalTasks = tasks
    .filter(t => t.status !== 'done' && t.priority === 'critical')
    .slice(0, 3);
  const completedToday = tasks.filter(t =>
    t.status === 'done' &&
    new Date(t.deadline).toDateString() === new Date().toDateString()
  ).length;

  const generateNewMessage = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/agents/planic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          bills,
          completedToday,
          streak: user.streak,
          userName: user.name,
        }),
      });

      if (!res.ok) throw new Error('Failed');

      const data = await res.json();
      const newMsg: PlanicMessage = {
        id: `ai-${Date.now()}`,
        tone: data.message.tone,
        title: data.message.title,
        body: data.message.body,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [newMsg, ...prev]);
      toast.success('New message from Planic AI');
    } catch {
      toast.error('Failed to generate message. Check API key.');
    } finally {
      setGenerating(false);
    }
  };

  const heroMsg = messages[0];

  // Computed consequences from real data
  const consequences = [
    ...criticalTasks.map(t => ({
      task: t.title.slice(0, 35) + (t.title.length > 35 ? '…' : ''),
      risk: 'miss',
      impact: `Deadline ${formatRelative(t.deadline)}. Priority: ${t.priority}. Currently ${t.progress}% done.`,
      probability: Math.min(95, 100 - t.progress),
    })),
    ...bills
      .filter(b => b.status !== 'paid')
      .slice(0, 2)
      .map(b => ({
        task: b.name,
        risk: 'late',
        impact: `${b.currency}${b.amount} due ${formatRelative(b.dueDate)}. Late fees may apply.`,
        probability: b.status === 'overdue' ? 90 : 55,
      })),
  ].slice(0, 4);

  const completionForecast = tasks.length > 0
    ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Module 05"
        title="Planic Mode"
        description="Your emotional accountability engine. Planic AI shows you the vivid consequences of inaction — and channels them into immediate momentum. Motivating, never toxic."
      />

      {/* Hero message */}
      {heroMsg && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-muted/30 p-8"
        >
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-foreground text-background">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-bold">A message from Future You</div>
                <div className="text-xs text-muted-foreground">{formatRelative(heroMsg.createdAt)}</div>
              </div>
            </div>
            <p className="mt-5 max-w-3xl text-pretty text-lg leading-relaxed text-foreground/90">
              &ldquo;{heroMsg.body}&rdquo;
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button className="gap-2" onClick={() => setStartedNow(true)}>
                {startedNow ? '✓ You started!' : <>Start now <ArrowRight className="h-4 w-4" /></>}
              </Button>
              <Button variant="outline" onClick={() => toast.info('Reminder set for 5 minutes.')}>
                I&apos;ll do it in 5 min
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Messages feed */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'regret', 'motivation', 'warning'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors',
                  filter === f ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:bg-muted'
                )}
              >
                {f === 'all' ? 'All messages' : toneConfig[f].label}
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto gap-1.5"
              onClick={generateNewMessage}
              disabled={generating}
            >
              {generating
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <RefreshCw className="h-3.5 w-3.5" />}
              Generate new
            </Button>
          </div>

          {filteredMessages.map((msg, i) => {
            const cfg = toneConfig[msg.tone];
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className={cn('relative overflow-hidden', cfg.bg)}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${cfg.color}1a`, color: cfg.color }}>
                        <cfg.icon className="h-4 w-4" />
                      </div>
                      <Badge style={{ background: `${cfg.color}1a`, color: cfg.color }} className="border-transparent">{cfg.label}</Badge>
                      <span className="ml-auto text-[11px] text-muted-foreground">{formatRelative(msg.createdAt)}</span>
                    </div>
                    <h3 className="mt-3 font-semibold">{msg.title}</h3>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">&ldquo;{msg.body}&rdquo;</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {filteredMessages.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No messages in this category. Click &quot;Generate new&quot; to create one.
            </div>
          )}
        </div>

        {/* Right: Predicted consequences + forecast */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-warning" /> Predicted Consequences
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">If you don&apos;t act, here&apos;s what happens</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {consequences.length > 0 ? consequences.map((c, i) => (
                <motion.div
                  key={c.task}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-lg border border-border bg-card/50 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium">{c.task}</span>
                    <span className={cn('text-xs font-bold', c.probability > 70 ? 'text-destructive' : c.probability > 50 ? 'text-warning' : 'text-muted-foreground')}>
                      {c.probability}%
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{c.impact}</p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className={cn('h-full rounded-full', c.probability > 70 ? 'bg-destructive' : 'bg-warning')}
                      initial={{ width: 0 }}
                      animate={{ width: `${c.probability}%` }}
                      transition={{ delay: i * 0.08 + 0.2, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              )) : (
                <p className="py-4 text-center text-sm text-success">✓ No critical risks detected right now!</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Future Self Forecast</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ScoreRing value={completionForecast} size={120} label="Trajectory" sublabel="on track" color="hsl(var(--success))" />
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {completionForecast >= 70
                  ? `At current velocity, you're tracking well. Keep the momentum going!`
                  : `You have ${tasks.filter(t => t.status !== 'done').length} tasks pending. Future You is counting on you.`
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
