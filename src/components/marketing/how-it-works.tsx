'use client';

import { motion } from 'framer-motion';
import {
  Mail,
  ScanSearch,
  ListTree,
  CalendarClock,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { fadeUp, stagger, viewportReveal } from '@/components/shared/motion';

const steps = [
  { icon: Mail, title: 'Email arrives', desc: 'An assignment, interview, or bill lands in your inbox.' },
  { icon: ScanSearch, title: 'AI extraction', desc: 'Gemini classifies it and pulls the deadline, priority & effort.' },
  { icon: ListTree, title: 'Task breakdown', desc: 'The planner splits it into prioritized, dependency-ordered steps.' },
  { icon: CalendarClock, title: 'Calendar scheduling', desc: 'Work is placed in your peak focus hours automatically.' },
  { icon: Eye, title: 'Planic AI monitoring', desc: 'Velocity is tracked. Drift toward a miss is caught days early.' },
  { icon: CheckCircle2, title: 'Task completed', desc: 'You ship on time. Streak intact. Future You thanks you.' },
];

export function HowItWorks() {
  return (
    <section id="how" className="section">
      <div className="container">
        <motion.div
          variants={stagger(0, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span variants={fadeUp} className="eyebrow">
            <span className="eyebrow-dot" /> How it works
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl"
          >
            From inbox to done — autonomously
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Six steps. Zero manual tracking. Watch how a single email becomes a completed commitment.
          </motion.p>
        </motion.div>

        {/* Flow — vertical on mobile, horizontal on desktop */}
        <motion.ol
          variants={stagger(0.3, 0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="mt-16 grid gap-4 md:grid-cols-6 md:gap-0"
        >
          {steps.map((s, i) => (
            <motion.li key={s.title} variants={fadeUp} className="relative md:px-2">
              {/* Connector — horizontal on desktop, animated draw */}
              {i < steps.length - 1 && (
                <span className="absolute left-1/2 top-7 hidden h-px w-full md:block">
                  <motion.span
                    className="block h-px w-full origin-left bg-gradient-to-r from-border-strong to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={viewportReveal}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.12 }}
                  />
                </span>
              )}

              <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div
                  className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card text-muted-foreground"
                >
                  <s.icon className="h-6 w-6" />
                  {/* step number */}
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-background text-[10px] font-bold tabular-nums ring-1 ring-border">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-semibold">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground md:max-w-[12rem]">
                  {s.desc}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        {/* Mobile vertical connector line */}
        <div className="mx-auto mt-8 h-px w-2/3 bg-gradient-to-r from-transparent via-border-strong to-transparent md:hidden" />
      </div>
    </section>
  );
}
