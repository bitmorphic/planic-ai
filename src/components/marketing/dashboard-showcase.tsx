'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Radar,
  Sparkles,
  Flame,
  Mail,
  Receipt,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fadeUp, stagger, viewportReveal } from '@/components/shared/motion';
import { cn } from '@/lib/utils';

const screens = [
  {
    id: 'command',
    label: 'Command Center',
    icon: LayoutDashboard,
    desc: 'Your morning briefing: focus, deadlines, risk radar, and a Planic AI message.',
  },
  {
    id: 'radar',
    label: 'Deadline Radar',
    icon: Radar,
    desc: 'Every deadline scored by urgency. Timeline, kanban, and calendar views.',
  },
  {
    id: 'planic',
    label: 'Planic Mode',
    icon: Sparkles,
    desc: 'Emotional accountability and predicted consequences that drive action.',
  },
];

export function DashboardShowcase() {
  const [active, setActive] = useState('command');

  return (
    <section id="dashboard" className="section border-y border-border bg-surface/30">
      <div className="container">
        <motion.div
          variants={stagger(0, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="eyebrow">
            <span className="eyebrow-dot" /> The dashboard
          </span>
          <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            A command center, not a checklist
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Ten modules. One operating system. Switch between them to see how the AI runs your day.
          </motion.p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {screens.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                active === s.id
                  ? 'border-border-strong bg-foreground text-background'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </motion.div>

        {/* Caption */}
        <motion.p
          key={`${active}-caption`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-sm text-muted-foreground"
        >
          {screens.find((s) => s.id === active)?.desc}
        </motion.p>

        {/* Mockup */}
        <div className="relative mx-auto mt-8 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 overflow-hidden rounded-2xl border border-border bg-card shadow-elev-3"
            >
              {active === 'command' && <CommandMock />}
              {active === 'radar' && <RadarMock />}
              {active === 'planic' && <PlanicMock />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ---------- Mini dashboard mockups ---------- */

function MockFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 border-b border-border px-5 py-3 text-xs text-muted-foreground">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
        <span className="ml-2">{label}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function CommandMock() {
  return (
    <MockFrame label="app.planic.ai / command-center">
      <motion.div variants={stagger(0.2, 0.05)} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-4">
        {[
          { l: 'Productivity', v: '78', s: '+12%', c: 'text-success', icon: TrendingUp },
          { l: 'Critical', v: '2', s: 'now', c: 'text-destructive', icon: Mail },
          { l: 'Bills due', v: '3', s: '₹16k', c: 'text-warning', icon: Receipt },
          { l: 'Streak', v: '12', s: 'days', c: 'text-muted-foreground', icon: Flame },
        ].map((s) => (
          <motion.div variants={fadeUp} key={s.l} className="rounded-xl border border-border bg-card p-3 shadow-sm hover:border-foreground/20 transition-colors">
            <div className="flex items-center justify-between">
              <s.icon className={cn('h-3.5 w-3.5', s.c)} />
              <span className={cn('text-[9px] font-medium', s.c)}>{s.s}</span>
            </div>
            <div className="mt-1.5 font-display text-xl font-bold tabular-nums">{s.v}</div>
            <div className="text-[10px] text-muted-foreground">{s.l}</div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-3 rounded-xl border border-border bg-muted/30 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/[0.03] to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-foreground" />
          <span className="text-xs font-semibold text-foreground">Planic</span>
          <Badge variant="default" className="text-[9px] animate-pulse">ACT NOW</Badge>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Spend 30 focused minutes now. Future You will thank you.
        </p>
      </motion.div>
    </MockFrame>
  );
}

function RadarMock() {
  const rows = [
    { t: 'Submit AI Project', d: '19h', p: 'bg-destructive', w: '85%' },
    { t: 'Google SWE Interview', d: '3d', p: 'bg-foreground', w: '60%' },
    { t: 'Database Assignment', d: '7d', p: 'bg-foreground', w: '35%' },
    { t: 'Newsletter #14', d: '8d', p: 'bg-muted-foreground', w: '20%' },
  ];
  return (
    <MockFrame label="app.planic.ai / deadlines">
      <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <Clock className="h-3 w-3" /> Deadline Radar
      </div>
      <motion.div variants={stagger(0.2, 0.08)} initial="hidden" animate="show" className="space-y-1.5">
        {rows.map((r) => (
          <motion.div variants={fadeUp} key={r.t} className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-2.5 hover:bg-muted/30 transition-colors">
            <span className={cn('h-1.5 w-1.5 rounded-full', r.p)} />
            <span className="flex-1 truncate text-sm font-medium">{r.t}</span>
            <span className="text-[11px] tabular-nums text-muted-foreground">{r.d}</span>
            <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-muted sm:block">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: r.w }}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn('h-full', r.p)}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </MockFrame>
  );
}

function PlanicMock() {
  return (
    <MockFrame label="app.planic.ai / planic">
      <div className="rounded-xl border border-border bg-muted/30 p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">A message from Future You</div>
            <div className="text-[11px] text-muted-foreground">a few moments ago</div>
          </div>
        </div>
        <p className="mt-4 text-pretty text-sm leading-relaxed text-foreground/90">
          &ldquo;This is Future You. It&apos;s 11:47 PM tomorrow. Your AI project is due in 13 minutes and the
          demo video isn&apos;t recorded. Spend 30 focused minutes right now.&rdquo;
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { l: 'Trajectory', v: 'On track', c: 'text-success' },
            { l: 'Predicted miss', v: 'Low risk', c: 'text-success' },
          ].map((m) => (
            <div key={m.l} className="rounded-lg border border-border/60 bg-card/50 p-2.5">
              <div className="text-[10px] text-muted-foreground">{m.l}</div>
              <div className={cn('text-sm font-semibold', m.c)}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}
