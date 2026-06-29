'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroMockup } from '@/components/marketing/hero-mockup';
import { fadeUp, stagger } from '@/components/shared/motion';
import { GoogleLogo } from '@/components/brand/google-logo';

const trustItems = ['Free for students', 'No credit card', 'Google-grade security'];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-36 sm:pt-44">
      {/* Subtle top wash — the only hero flourish */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-10%] -z-10 h-[480px] w-[760px] max-w-[90vw] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, hsl(var(--foreground) / 0.06), transparent)' }}
      />

      <div className="container">
        <motion.div
          variants={stagger(0, 0.12)}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-4xl text-center"
        >
          {/* Tagline */}
          <motion.div variants={fadeUp}>
            <div className="mb-7 flex items-center justify-center gap-2.5 text-sm font-bold uppercase tracking-[0.2em]">
              <span className="eyebrow-dot" />
              <span className="text-muted-foreground/70">Stop planning,</span>
              <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Start executing.</span>
            </div>
          </motion.div>

          {/* Headline — display face, single accent word, no gradient */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-balance text-5xl font-bold leading-[1.04] tracking-[-0.035em] sm:text-6xl md:text-7xl"
          >
            The AI Accountability
            <br />
            <span className="text-muted-foreground">Operating System</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl"
          >
            Planic AI isn&apos;t another task manager. It&apos;s your AI executive assistant — it
            reads your inbox, plans your work, predicts failure, and{' '}
            <span className="font-semibold text-foreground">intervenes before you miss what matters.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/demo" className="w-full sm:w-auto">
              <Button size="xl" className="group w-full gap-2 bg-foreground text-background hover:bg-foreground/90 sm:w-auto">
                <Sparkles className="h-4 w-4" />
                See Demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="xl" variant="outline" className="w-full gap-2 sm:w-auto">
                <GoogleLogo className="h-4 w-4" />
                Sign in to experience
              </Button>
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.ul
            variants={fadeUp}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
          >
            {trustItems.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <span className="text-muted-foreground">·</span>
                {t}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Product preview */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mt-16"
        >
          <HeroMockup />
        </motion.div>
      </div>
    </section>
  );
}
