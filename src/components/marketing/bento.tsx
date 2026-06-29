'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mail,
  ScanLine,
  Mic,
  Workflow,
  CalendarClock,
  Briefcase,
  Receipt,
  Sparkles,
  Siren,
  Dna,
  Brain,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Radar,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fadeUp, stagger, viewportReveal, scaleIn } from '@/components/shared/motion';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail, ScanLine, Mic, Workflow, CalendarClock, Briefcase, Receipt, Sparkles, Siren, Dna,
};

const agents = [
  { icon: 'Mail', name: 'Gmail Intelligence' },
  { icon: 'ScanLine', name: 'Vision Task' },
  { icon: 'Mic', name: 'Voice Capture' },
  { icon: 'Workflow', name: 'AI Planner' },
  { icon: 'CalendarClock', name: 'Calendar' },
  { icon: 'Briefcase', name: 'Interview Copilot' },
  { icon: 'Receipt', name: 'Bill Guardian' },
  { icon: 'Sparkles', name: 'Planic AI' },
  { icon: 'Siren', name: 'Panic Mode' },
  { icon: 'Dna', name: 'Productivity DNA' },
];

export function Bento() {
  return (
    <section id="product" className="section">
      <div className="container">
        <motion.div
          variants={stagger(0, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="eyebrow">
            <span className="eyebrow-dot" /> The product
          </span>
          <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Everything you need to never miss again
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Ten specialized agents, one operating system. Capture, plan, schedule, predict, intervene.
          </motion.p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={stagger(0.2, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* ---- Hero feature: predicts failure (large, 2x2) ---- */}
          <motion.div variants={scaleIn} className="sm:col-span-2">
            <Card interactive className="group h-full overflow-hidden">
              <CardContent className="flex h-full flex-col p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-muted-foreground">
                  <Radar className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">Predicts failure, days ahead</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Productivity DNA tracks your velocity, peak hours, and procrastination patterns.
                  When your trajectory won&apos;t meet a deadline, the AI flags it and reschedules work.
                </p>
                {/* Forecast-style visual */}
                <div className="mt-auto pt-6">
                  <ForecastMini />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ---- 10 AI agents tile cluster (2x2) ---- */}
          <motion.div variants={scaleIn} className="sm:col-span-2">
            <Card interactive className="group h-full overflow-hidden">
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">10 AI agents, always on</h3>
                  <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    swarm
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Each agent has one obsession. Together they run around the clock.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  {agents.map((a) => {
                    const Icon = iconMap[a.icon] ?? Sparkles;
                    return (
                      <div
                        key={a.name}
                        className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/20 px-2.5 py-2 transition-colors hover:bg-muted/50"
                      >
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="truncate text-xs font-medium">{a.name}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ---- Active accountability ---- */}
          <BentoTile
            icon={ShieldCheck}
            title="Active accountability"
            desc="Not passive reminders you swipe away. Planic AI messages that make starting feel unavoidable — without toxicity."
          />
          {/* ---- Learns your patterns ---- */}
          <BentoTile
            icon={Brain}
            title="Learns your patterns"
            desc="Finds your peak hours and continuously optimizes your schedule. 40% faster in the right window."
          />
          {/* ---- Deadline radar ---- */}
          <BentoTile
            icon={Clock}
            title="Deadline radar"
            desc="Every upcoming deadline with an urgency score, timeline, kanban, and risk prediction."
          />
          {/* ---- Launch tile ---- */}
          <motion.div variants={scaleIn}>
            <Link href="/app">
              <Card interactive className="group h-full overflow-hidden">
                <CardContent className="flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-muted-foreground">
                      <Brain className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold">Predictive AI</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Planic learns your habits, predicts procrastination, and intervenes before you miss a deadline.
                    </p>
                  </div>
                  <span className="mt-4 flex items-center gap-1 text-sm font-medium text-foreground">
                    Experience it now <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function BentoTile({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <motion.div variants={scaleIn}>
      <Card interactive className="group h-full">
        <CardContent className="p-6">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/** Mini forecast chart visual for the hero bento tile. */
function ForecastMini() {
  const bars = [38, 52, 61, 47, 70, 55, 82];
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>On-time trajectory</span>
        <span className="font-medium text-foreground">trending up</span>
      </div>
      <div className="mt-3 flex h-20 items-end gap-2">
        {bars.map((b, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${b}%` }}
            viewport={viewportReveal}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'flex-1 rounded-t-sm',
              i === bars.length - 1 ? 'bg-foreground' : 'bg-foreground/30'
            )}
          />
        ))}
      </div>
    </div>
  );
}
