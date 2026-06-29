'use client';

import { motion } from 'framer-motion';
import { Sparkles, Flame, Mail, Receipt, Clock } from 'lucide-react';
import { LogoMark } from '@/components/brand/logo-mark';

/**
 * The animated dashboard mockup shown in the hero.
 * A miniature "command center" with live-ish UI elements:
 * AI activity indicator, count-up stats, deadline radar, timeline.
 *
 * Monochromatic Graphite: no aurora, no gradient icons, no floating glass cards.
 */
export function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 overflow-hidden rounded-2xl border border-border bg-card shadow-elev-3"
      >
        {/* Window top bar */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <LogoMark size={14} />
            <span className="hidden sm:inline">app.planic.ai / command-center</span>
            <span className="sm:hidden">command-center</span>
          </div>
          <div className="w-12" />
        </div>

        <div className="grid grid-cols-12 gap-3 p-4">
          {/* Sidebar */}
          <div className="col-span-3 hidden flex-col gap-1 md:flex">
            <div className="mb-1 px-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
              Modules
            </div>
            {[
              { l: 'Command Center', a: true },
              { l: 'Deadline Radar', a: false },
              { l: 'Gmail Intelligence', a: false },
              { l: 'AI Planner', a: false },
              { l: 'Planic Mode', a: false },
              { l: 'Productivity DNA', a: false },
            ].map((i) => (
              <div
                key={i.l}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  i.a ? 'bg-muted text-foreground' : 'text-muted-foreground'
                }`}
              >
                <span className={`h-1 w-1 rounded-full ${i.a ? 'bg-foreground' : 'bg-muted-foreground/40'}`} />
                {i.l}
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="col-span-12 space-y-3 md:col-span-9">
            {/* AI activity banner */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative overflow-hidden rounded-xl border border-border bg-muted/50 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-foreground text-background">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">Planic</span>
                    <span className="rounded bg-foreground/10 px-1.5 py-0.5 text-[9px] font-medium text-foreground animate-pulse">
                      ACT NOW
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    This is Future You. Tomorrow at midnight you&apos;ll wish you started earlier. Spend{' '}
                    <span className="font-semibold text-foreground">30 minutes now.</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { l: 'Productivity', v: '78', s: '+12%', icon: Flame },
                { l: 'Critical', v: '2', s: 'need focus', icon: Mail },
                { l: 'Bills due', v: '3', s: '₹16k', icon: Receipt },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="rounded-xl border border-border bg-card p-3"
                >
                  <div className="flex items-center justify-between">
                    <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[9px] font-medium text-muted-foreground">{s.s}</span>
                  </div>
                  <div className="mt-1.5 font-display text-xl font-bold tabular-nums">{s.v}</div>
                  <div className="text-[10px] text-muted-foreground">{s.l}</div>
                </motion.div>
              ))}
            </div>

            {/* Timeline / Deadline radar */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <Clock className="h-3 w-3" /> Deadline Radar
                </span>
                <span className="text-[9px] text-muted-foreground">AI-sorted by risk</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { t: 'Submit AI Project', d: '19h', p: 'bg-destructive', w: '85%' },
                  { t: 'Google SWE Interview', d: '3d', p: 'bg-foreground', w: '60%' },
                  { t: 'Electricity Bill', d: '38h', p: 'bg-foreground', w: '55%' },
                ].map((row, i) => (
                  <motion.div
                    key={row.t}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-3 rounded-lg p-1.5"
                  >
                    <div className={`h-1.5 w-1.5 rounded-full ${row.p}`} />
                    <span className="flex-1 truncate text-xs font-medium">{row.t}</span>
                    <span className="text-[10px] tabular-nums text-muted-foreground">{row.d}</span>
                    <div className="hidden h-1 w-16 overflow-hidden rounded-full bg-muted sm:block">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: row.w }}
                        transition={{ duration: 1, delay: 1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full ${row.p}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
