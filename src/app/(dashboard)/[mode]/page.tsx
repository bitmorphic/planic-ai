'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  Radar,
  Briefcase,
  ArrowRight,
  Clock,
  CalendarClock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScoreRing } from '@/components/shared/score-ring';
import { Counter } from '@/components/shared/counter';
import { TaskCard } from '@/components/app/task-card';
import { UrgencyMeter } from '@/components/shared/priority';
import { fadeUp, stagger, viewportReveal } from '@/components/shared/motion';
import { useData } from '@/contexts/data-context';
import { urgencyScore, formatTime, formatDate, formatRelative, cn } from '@/lib/utils';
import { SiGoogle, SiLinear } from 'react-icons/si';

const brandIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  SiGoogle,
  SiLinear,
};

export default function CommandCenterPage() {
  const { tasks, user, messages, interviews, bills, calendarEvents } = useData();
  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  
  // Local implementations of helpers using context data
  const upcoming = [...tasks].filter(t => t.status !== 'done').sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 5);
  const critical = tasks.filter((t) => t.priority === 'critical' && t.status !== 'done');
  const planicMsg = messages[0];
  const nextInterview = interviews[0] || null;
  const billsTotal = bills.filter(b => b.status !== 'paid').reduce((s, b) => s + b.amount, 0);
  const nextEvent = calendarEvents[0] || null;

  const doneTasks = tasks.filter(t => t.status === 'done');
  const pendingBills = bills.filter(b => b.status !== 'paid');

  // Generate smart suggestions from real data
  const suggestions = [
    critical.length > 0 && { id: '1', type: 'warning', title: `${critical.length} critical task${critical.length > 1 ? 's' : ''} overdue`, description: `${critical.map(t => t.title).slice(0, 2).join(', ')} need your attention today.` },
    pendingBills.length > 0 && { id: '2', type: 'schedule', title: `${pendingBills.length} bill${pendingBills.length > 1 ? 's' : ''} pending`, description: `₹${billsTotal.toLocaleString()} in unpaid bills. Review in Bills tracker.` },
    doneTasks.length > 0 && { id: '3', type: 'insight', title: 'Keep the momentum!', description: `You've completed ${doneTasks.length} task${doneTasks.length > 1 ? 's' : ''} so far. Keep pushing!` },
    upcoming.length === 0 && { id: '4', type: 'focus', title: 'Start planning your week', description: 'No tasks yet. Add your first deadline in the Deadline Radar.' },
  ].filter(Boolean) as { id: string; type: string; title: string; description: string }[];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* ---------- Page heading ---------- */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          {greeting}, {user.name.split(' ')[0]} · {formatDate(today, { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-[2rem]">
          {critical.length} critical items need you today
        </h1>
      </motion.div>

      {/* ---------- KPI strip ---------- */}
      <motion.div
        variants={stagger(0, 0.06)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <KpiCard delay={0} icon={TrendingUp} label="Accountability Score" value={<Counter value={user.productivityScore} />} delta={doneTasks.length > 0 ? `${doneTasks.length} done total` : 'No tasks yet'} tone="success" />
        <KpiCard delay={0.06} icon={Radar} label="Active Deadlines" value={<Counter value={upcoming.length} />} delta={critical.length > 0 ? `${critical.length} critical` : 'All clear'} tone={critical.length > 0 ? 'danger' : 'success'} />
        <KpiCard delay={0.12} icon={CalendarClock} label="Bills Pending" value={<Counter value={billsTotal} prefix="₹" />} delta={pendingBills.length > 0 ? `${pendingBills.length} unpaid` : 'All paid!'} tone={pendingBills.length > 0 ? 'warning' : 'success'} />
        <KpiCard delay={0.18} icon={Flame} label="Focus Streak" value={<Counter value={user.streak} suffix="d" />} delta={user.streak > 0 ? 'Keep it going!' : 'Start today!'} tone="default" />
      </motion.div>

      {/* ---------- Main 12-col grid ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT — col-span-2 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Planic AI callout */}
          {planicMsg && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" viewport={viewportReveal}>
            <Card className="border-border bg-muted/30">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-foreground text-background">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{planicMsg.title}</span>
                    <Badge variant="danger">Act now</Badge>
                  </div>
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{planicMsg.body}</p>
                  <div className="mt-3 flex gap-2">
                    <Link href="/app/planic">
                      <Button size="sm" className="gap-1.5">Read message <ArrowRight className="h-3.5 w-3.5" /></Button>
                    </Link>
                    <Button size="sm" variant="ghost">Snooze 1h</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          )}

          {/* Today's Focus */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-card-title">Today&apos;s Focus</CardTitle>
                <p className="mt-1 text-meta text-muted-foreground">Prioritized by urgency × effort × peak hours</p>
              </div>
              <Link href="/app/deadlines">
                <Button variant="ghost" size="sm" className="gap-1">All <ArrowRight className="h-3.5 w-3.5" /></Button>
              </Link>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {upcoming.length > 0 ? upcoming.slice(0, 4).map((t) => (
                <TaskCard key={t.id} task={t} compact />
              )) : (
                <div className="col-span-2 flex flex-col items-center gap-2 py-8 text-center">
                  <p className="text-sm font-semibold">You&apos;re all clear!</p>
                  <p className="text-xs text-muted-foreground">No upcoming tasks. Add one in Deadline Radar.</p>
                  <Link href="/app/deadlines"><Button size="sm" variant="outline">Add a task</Button></Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deadline Risk Radar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-card-title">
                <Radar className="h-4 w-4 text-muted-foreground" /> Deadline Risk Radar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {[...upcoming].slice(0, 5).map((t) => {
                const urgency = urgencyScore(t.deadline, t.priority);
                return (
                  <Link href="/app/deadlines" key={t.id} className="block rounded-lg p-2 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{t.title}</div>
                        <div className="mt-1.5"><UrgencyMeter value={urgency} /></div>
                      </div>
                      <span className={cn('w-10 shrink-0 text-right text-xs font-semibold tabular-nums', urgency > 80 ? 'text-destructive' : urgency > 50 ? 'text-warning' : 'text-muted-foreground')}>
                        {urgency}%
                      </span>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT — col-span-1 */}
        <div className="space-y-6">
          {/* Focus score */}
          <Card>
            <CardContent className="flex flex-col items-center pt-6">
              <ScoreRing value={user.focusScore} size={132} label="Focus Score" color="hsl(var(--foreground))" />
              <p className="mt-4 text-center text-meta text-muted-foreground">
                {user.focusScore >= 70 ? 'Strong focus today. Protect this momentum.' : user.focusScore >= 40 ? 'Building momentum. Keep going!' : 'Just getting started — add tasks to track focus.'}
              </p>
              <div className="mt-4 grid w-full grid-cols-3 gap-2 text-center">
                {[
                  { l: 'Tasks done', v: doneTasks.length.toString() },
                  { l: 'Pending', v: upcoming.length.toString() },
                  { l: 'Next event', v: nextEvent ? formatTime(nextEvent.start) : '—' },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg border border-border bg-surface p-2">
                    <div className="text-sm font-bold tabular-nums">{s.v}</div>
                    <div className="text-[10px] text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-card-title">
                <Sparkles className="h-4 w-4 text-muted-foreground" /> AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {suggestions.slice(0, 4).map((s) => {
                const toneMap: Record<string, string> = {
                  warning: 'text-destructive',
                  schedule: 'text-accent',
                  focus: 'text-foreground',
                  opportunity: 'text-success',
                  insight: 'text-foreground',
                };
                return (
                  <div
                    key={s.id}
                    className="group flex gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:bg-muted/50"
                  >
                    <AlertTriangle className={cn('h-4 w-4 shrink-0 mt-0.5', toneMap[s.type] ?? 'text-muted-foreground')} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold">{s.title}</div>
                      <div className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{s.description}</div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Next interview */}
          {nextInterview && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-card-title">
                  <Briefcase className="h-4 w-4 text-muted-foreground" /> Next Interview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {nextInterview.iconName && brandIcons[nextInterview.iconName] ? (
                    (() => {
                      const BrandIcon = brandIcons[nextInterview.iconName];
                      return (
                        <div className="grid h-11 w-11 place-items-center rounded-lg text-base font-bold text-white" style={{ background: nextInterview.logoColor }}>
                          <BrandIcon className="h-5 w-5" />
                        </div>
                      );
                    })()
                  ) : (
                    <div className="grid h-11 w-11 place-items-center rounded-lg text-base font-bold text-white" style={{ background: nextInterview.logoColor }}>
                      {nextInterview.company[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{nextInterview.company}</div>
                    <div className="truncate text-xs text-muted-foreground">{nextInterview.role}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {formatRelative(nextInterview.date)} · {nextInterview.round}
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                    <span>Prep progress</span>
                    <span className="font-medium text-warning">{nextInterview.prepProgress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-warning" style={{ width: `${nextInterview.prepProgress}%` }} />
                  </div>
                </div>
                <Link href="/app/interviews">
                  <Button variant="outline" size="sm" className="mt-3 w-full gap-1">
                    Open Copilot <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- KPI card — flat, monochrome, single tone accent ---------- */
function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  tone,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  delta: string;
  tone: 'success' | 'danger' | 'warning' | 'default';
  delay: number;
}) {
  const toneText = {
    success: 'text-success',
    danger: 'text-destructive',
    warning: 'text-warning',
    default: 'text-muted-foreground',
  }[tone];
  return (
    <motion.div variants={fadeUp}>
      <Card interactive className="h-full">
        <CardContent className="pt-5">
          <div className="flex items-center justify-between">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className={cn('text-[11px] font-medium', toneText)}>{delta}</span>
          </div>
          <div className="mt-3 font-display text-2xl font-bold tabular-nums">{value}</div>
          <div className="text-meta text-muted-foreground">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
