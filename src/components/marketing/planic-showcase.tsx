'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingDown, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fadeUp, stagger, viewportReveal, scaleIn } from '@/components/shared/motion';
import { cn } from '@/lib/utils';

const consequences = [
  { task: 'AI Project', risk: 'miss', impact: 'Grade drops A → B. Lose scholarship consideration.', probability: 82, tone: 'danger' },
  { task: 'Google Interview', risk: 'underprepare', impact: 'Fail technical round. 6-month wait to reapply.', probability: 64, tone: 'warning' },
];

export function PlanicShowcase() {
  return (
    <section className="section">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: narrative */}
          <motion.div
            variants={stagger(0, 0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewportReveal}
          >
            <span className="eyebrow">
              <span className="eyebrow-dot" /> Planic Mode
            </span>
            <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              The version of you that never misses
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 max-w-xl text-lg text-muted-foreground">
              Planic AI writes messages that create a vivid preview of regret — then channels it into
              immediate action. Motivating, never toxic. It&apos;s accountability that actually works.
            </motion.p>
            <motion.ul variants={fadeUp} className="mt-6 space-y-3">
              {[
                'Emotional accountability grounded in your real deadlines',
                'Predicted consequences with honest probability scores',
                'Trajectory forecasts that update as your velocity changes',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {t}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right: message + consequences mock */}
          <motion.div
            variants={stagger(0.2, 0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewportReveal}
            className="space-y-4"
          >
            {/* The message */}
            <motion.div variants={scaleIn}>
              <Card className="relative overflow-hidden border-border bg-muted/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">A message from tomorrow night</div>
                      <div className="text-[11px] text-muted-foreground">regret · a moment ago</div>
                    </div>
                  </div>
                  <p className="mt-4 text-pretty text-sm leading-relaxed text-foreground/90">
                    &ldquo;This is Future You. It&apos;s 11:47 PM tomorrow. Your AI project is due in 13 minutes
                    and the demo video isn&apos;t recorded. Your chest is tight. You&apos;re whispering{' '}
                    <span className="italic">&lsquo;why didn&apos;t I start yesterday?&rsquo;</span> Spend 30
                    focused minutes right now.&rdquo;
                  </p>
                  <Button size="sm" className="mt-4 gap-1.5">
                    Start now <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Predicted consequences */}
            <motion.div variants={scaleIn}>
              <Card>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <AlertTriangle className="h-4 w-4 text-warning" /> Predicted consequences
                  </div>
                  <div className="space-y-3">
                    {consequences.map((c) => (
                      <div key={c.task} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{c.task}</span>
                          <span
                            className={cn(
                              'text-xs font-bold',
                              c.probability > 70 ? 'text-destructive' : 'text-warning'
                            )}
                          >
                            {c.probability}%
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{c.impact}</p>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className={cn('h-full rounded-full', c.probability > 70 ? 'bg-destructive' : 'bg-warning')}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${c.probability}%` }}
                            viewport={viewportReveal}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
