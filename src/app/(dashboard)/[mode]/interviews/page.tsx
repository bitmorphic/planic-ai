'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Check,
  Building2,
  Code2,
  Mic,
  FileText,
  CalendarClock,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AddInterviewDialog } from '@/components/app/add-interview-dialog';
import { useData } from '@/contexts/data-context';
import { Interview } from '@/lib/types';
import { formatRelative, formatDate, cn } from '@/lib/utils';
import { SiGoogle, SiLinear } from 'react-icons/si';
import { toast } from 'sonner';

const brandIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  SiGoogle,
  SiLinear,
};

export default function InterviewPage() {
  const { interviews, updateInterview, deleteInterview } = useData();
  const interviewList = interviews;

  const [selected, setSelected] = useState<Interview | null>(interviewList[0] ?? null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Interview | undefined>();

  const openAdd = () => { setEditItem(undefined); setDialogOpen(true); };

  const toggleCheckItem = async (interview: Interview, checkId: string) => {
    const updated = interview.checklist.map(c =>
      c.id === checkId ? { ...c, done: !c.done } : c
    );
    const prepProgress = Math.round((updated.filter(c => c.done).length / updated.length) * 100);
    await updateInterview(interview.id, { checklist: updated, prepProgress });
    // Update selected view optimistically
    setSelected(prev => prev && prev.id === interview.id ? { ...prev, checklist: updated, prepProgress } : prev);
    toast.success(updated.find(c => c.id === checkId)?.done ? 'Step completed! ✓' : 'Step unchecked');
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Module 07"
        title="Interview Copilot"
        description="When the AI detects an interview email, it builds a complete prep plan — company research, DSA practice, mock sessions, and a checklist."
        actions={
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Add interview
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Interview list */}
        <div className="space-y-3">
          {interviewList.map((iv, i) => (
            <motion.div key={iv.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <button
                onClick={() => setSelected(iv)}
                className={cn(
                  'w-full rounded-xl border p-4 text-left transition-all',
                  selected?.id === iv.id ? 'border-border-strong bg-muted' : 'border-border bg-card hover:bg-muted/40'
                )}
              >
                <div className="flex items-center gap-3">
                  {iv.iconName && brandIcons[iv.iconName] ? (
                    (() => {
                      const BrandIcon = brandIcons[iv.iconName!];
                      return (
                        <div className="grid h-11 w-11 place-items-center rounded-xl text-lg font-bold text-white" style={{ background: iv.logoColor }}>
                          <BrandIcon className="h-5 w-5" />
                        </div>
                      );
                    })()
                  ) : (
                    <div className="grid h-11 w-11 place-items-center rounded-xl text-lg font-bold text-white" style={{ background: iv.logoColor }}>
                      {iv.company[0]}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{iv.company}</div>
                    <div className="truncate text-xs text-muted-foreground">{iv.role}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarClock className="h-3 w-3" /> {formatRelative(iv.date)}</span>
                  <span className="font-medium" style={{ color: iv.prepProgress < 40 ? '#EF4444' : iv.prepProgress < 70 ? '#F59E0B' : '#10B981' }}>{iv.prepProgress}%</span>
                </div>
                <Progress value={iv.prepProgress} className="mt-1.5 h-1" indicatorClassName={iv.prepProgress < 40 ? 'bg-destructive' : iv.prepProgress < 70 ? 'bg-warning' : 'bg-success'} />
              </button>
            </motion.div>
          ))}

          <button
            onClick={openAdd}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm text-muted-foreground transition-colors hover:bg-muted/40"
          >
            <Plus className="h-4 w-4" /> Add interview
          </button>

          {interviewList.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No interviews yet. Add one to start prep.
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected && (
            <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {selected.iconName && brandIcons[selected.iconName] ? (
                      (() => {
                        const BrandIcon = brandIcons[selected.iconName!];
                        return (
                          <div className="grid h-14 w-14 place-items-center rounded-2xl text-2xl font-bold text-white" style={{ background: selected.logoColor }}>
                            <BrandIcon className="h-7 w-7" />
                          </div>
                        );
                      })()
                    ) : (
                      <div className="grid h-14 w-14 place-items-center rounded-2xl text-2xl font-bold text-white" style={{ background: selected.logoColor }}>
                        {selected.company[0]}
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">{selected.company}</h2>
                      <p className="text-sm text-muted-foreground">{selected.role}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant="default" className="gap-1"><Briefcase className="h-3 w-3" /> {selected.round}</Badge>
                        <Badge variant="warning" className="gap-1"><CalendarClock className="h-3 w-3" /> {formatDate(selected.date, { weekday: 'short', month: 'short', day: 'numeric' })}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prep checklist — now interactive */}
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Check className="h-4 w-4 text-success" /> Preparation Checklist
                  </CardTitle>
                  <p className="text-[11px] text-muted-foreground">
                    {selected.checklist.filter((c) => c.done).length} of {selected.checklist.length} complete
                  </p>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {selected.checklist.map((c, i) => (
                    <motion.button
                      key={c.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => toggleCheckItem(selected, c.id)}
                      className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-muted/40"
                    >
                      <div className={cn('grid h-5 w-5 place-items-center rounded-full border-2 transition-colors', c.done ? 'border-success bg-success text-white' : 'border-muted-foreground/40 hover:border-success/50')}>
                        {c.done && <Check className="h-3 w-3" />}
                      </div>
                      <span className={cn('text-sm', c.done && 'text-muted-foreground line-through')}>{c.label}</span>
                    </motion.button>
                  ))}
                </CardContent>
              </Card>

              {/* Company research */}
              {selected.research && (
                <Card className="mb-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Building2 className="h-4 w-4 text-accent" /> AI-Generated Company Research
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selected.research.map((r, i) => (
                      <div key={i} className="rounded-lg border border-border bg-card/50 p-3">
                        <div className="text-sm font-semibold">{r.title}</div>
                        <p className="mt-1 text-xs text-muted-foreground">{r.summary}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Action cards */}
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Code2, label: 'DSA Practice', desc: '5 problems', color: '#4F46E5' },
                  { icon: Mic, label: 'Mock Interview', desc: 'Book a session', color: '#EC4899' },
                  { icon: FileText, label: 'Resume Review', desc: 'AI feedback', color: '#06B6D4' },
                ].map((a) => (
                  <button key={a.label} className="group rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-border-strong">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <a.icon className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-sm font-semibold">{a.label}</div>
                    <div className="text-[11px] text-muted-foreground">{a.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <AddInterviewDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editInterview={editItem}
      />
    </div>
  );
}
