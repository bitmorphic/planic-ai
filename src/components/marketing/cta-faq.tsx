'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandPattern } from '@/components/brand/brand-pattern';
import { GoogleLogo } from '@/components/brand/google-logo';
import { fadeUp, stagger, viewportReveal } from '@/components/shared/motion';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'How does Planic AI know my deadlines?',
    a: 'It connects to Gmail and Google Calendar. Gemini reads your emails, classifies them, and extracts deadlines, priorities, and effort estimates automatically — then mirrors everything in your Deadline Radar.',
  },
  {
    q: 'Is "Planic Mode" just push notifications?',
    a: 'No. It writes vivid, emotionally-grounded messages from the perspective of tomorrow-you — previewing regret and channeling it into immediate action. Tested to outperform standard reminders at driving starts.',
  },
  {
    q: 'What happens if I fall behind on a task?',
    a: 'Productivity DNA tracks your velocity. When your trajectory won\'t meet a deadline, the AI flags it early, surfaces a Survival Plan in Panic Mode, and can reschedule your work into peak focus hours.',
  },
  {
    q: 'Is my data private and secure?',
    a: 'Yes. Built on Google-grade security with Firebase Auth, encrypted storage, and processing on Google Cloud. Your emails and calendar data are never stored beyond what\'s needed to serve you.',
  },
  {
    q: 'Do I need to manage tasks manually?',
    a: 'Only when you want to. Capture via voice, vision (scan a photo), or just let Gmail Intelligence do it. The AI Planner breaks goals into steps and places them on your calendar.',
  },
];

export function CtaFaq() {
  return (
    <>
      {/* ---------- Section 9 — Final CTA ---------- */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportReveal}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border border-border bg-foreground px-6 py-20 text-center shadow-elev-3 sm:px-12"
          >
            <BrandPattern opacity={0.35} />
            <div className="relative z-10 mx-auto max-w-2xl">
              <span className="eyebrow justify-center text-background/60">
                <span className="h-1 w-1 rounded-full bg-background/60" /> Start now
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-background sm:text-5xl">
                Meet the version of you that{' '}
                <span className="underline decoration-background/30 underline-offset-4">never misses.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg text-background/70">
                See the interactive demo or sign in to let the AI accountability OS take over. Free for students — no
                credit card, no setup.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/demo" className="w-full sm:w-auto">
                  <Button size="xl" className="group w-full gap-2 bg-background text-foreground hover:bg-background/90 sm:w-auto">
                    <Sparkles className="h-4 w-4" />
                    See Demo
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="xl" variant="outline" className="w-full gap-2 border-background/20 text-background hover:bg-background/10 sm:w-auto">
                    <GoogleLogo className="h-4 w-4" />
                    Sign in to experience
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="section pt-4">
        <div className="container">
          <motion.div
            variants={stagger(0, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={viewportReveal}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="eyebrow justify-center">
              <span className="eyebrow-dot" /> FAQ
            </span>
            <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              System Inquiries
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger(0.2, 0.08)}
            initial="hidden"
            whileInView="show"
            viewport={viewportReveal}
            className="mx-auto mt-10 max-w-3xl space-y-3"
          >
            {faqs.map((f, i) => (
              <FaqRow key={i} q={f.q} a={f.a} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        'overflow-hidden rounded-xl border bg-card transition-colors',
        open ? 'border-border-strong' : 'border-border'
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold sm:text-base">{q}</span>
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
          {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
