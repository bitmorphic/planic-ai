'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Sparkles,
  Check,
  Plus,
  CalendarPlus,
  Briefcase,
  Receipt,
  GraduationCap,
  Users,
  RefreshCw,
  Inbox,
} from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/data-context';
import { Email } from '@/lib/types';
import { formatRelative, initials, cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SiGoogle, SiLinear, SiGithub, SiSpotify } from 'react-icons/si';
import { inDays } from '@/lib/utils';

const brandIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  SiGoogle,
  SiLinear,
  SiGithub,
  SiSpotify,
};

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  assignment: { icon: GraduationCap, color: '#4F46E5', label: 'Assignment' },
  interview: { icon: Briefcase, color: '#10B981', label: 'Interview' },
  bill: { icon: Receipt, color: '#F59E0B', label: 'Bill' },
  meeting: { icon: Users, color: '#06B6D4', label: 'Meeting' },
  event: { icon: CalendarPlus, color: '#8B5CF6', label: 'Event' },
  none: { icon: Mail, color: '#64748B', label: 'No task' },
};

export default function GmailPage() {
  const { data: session } = useSession();
  const { emails, addTask, addEmail, mode } = useData();
  const emailList = emails; // Always use context data (demo mode already provides static data via DataProvider)
  const [selected, setSelected] = useState<Email | null>(emailList[0] ?? null);
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const [scanning, setScanning] = useState(false);

  const detected = emailList.filter((e) => e.detectedType !== 'none' && e.extractedTask);
  const unread = emailList.filter((e) => !e.read).length;

  const rescan = async () => {
    if (mode === 'demo') {
      setScanning(true);
      setTimeout(() => {
        setScanning(false);
        toast.success('Inbox scanned', { description: `${detected.length} tasks detected across ${emailList.length} emails` });
      }, 1800);
      return;
    }

    if (!session || !(session as any).accessToken) {
      toast.error('Not authenticated with Google. Please sign out and sign back in.');
      return;
    }

    setScanning(true);
    try {
      // 1. Fetch latest emails from Gmail API
      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5&q=is:unread', {
        headers: { Authorization: `Bearer ${(session as any).accessToken}` }
      });
      if (!res.ok) throw new Error('Failed to fetch from Gmail');
      const data = await res.json();
      
      if (!data.messages || data.messages.length === 0) {
        toast.info('No new unread emails found.');
        setScanning(false);
        return;
      }

      let newTasksCount = 0;

      // 2. Fetch full email for each message
      for (const msg of data.messages) {
        const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
          headers: { Authorization: `Bearer ${(session as any).accessToken}` }
        });
        const msgData = await msgRes.json();
        
        const headers = msgData.payload.headers;
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || '(No subject)';
        const from = headers.find((h: any) => h.name === 'From')?.value || 'Unknown';
        
        let body = msgData.snippet;
        if (msgData.payload.parts) {
          const textPart = msgData.payload.parts.find((p: any) => p.mimeType === 'text/plain');
          if (textPart && textPart.body.data) {
            body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          }
        } else if (msgData.payload.body && msgData.payload.body.data) {
          body = atob(msgData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        }

        // 3. Process with AI Agent
        const agentRes = await fetch('/api/agents/gmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, body, from }),
        });
        
        const agentData = await agentRes.json();
        const extracted = agentData.extracted;
        
        // 4. Save to Firestore
        await addEmail({
          subject,
          from: from.split('<')[0].trim(),
          fromEmail: from.includes('<') ? from.split('<')[1].replace('>', '') : from,
          preview: msgData.snippet || body.substring(0, 100),
          body,
          receivedAt: msgData.internalDate ? new Date(parseInt(msgData.internalDate)).toISOString() : new Date().toISOString(),
          read: false,
          avatarColor: '#' + Math.floor(Math.random()*16777215).toString(16),
          detectedType: extracted?.detectedType || 'none',
          extractedTask: extracted,
        });
        
        if (extracted && extracted.detectedType !== 'none') {
          newTasksCount++;
        }
      }
      
      toast.success('Inbox scanned', { description: `Found ${data.messages.length} emails, detected ${newTasksCount} tasks.` });
    } catch (err) {
      console.error(err);
      toast.error('Failed to scan inbox. Do you have Gmail permissions? Try signing out and back in.');
    } finally {
      setScanning(false);
    }
  };

  const accept = async (email: Email) => {
    if (accepted.has(email.id)) return;
    setAccepted((s) => new Set(s).add(email.id));
    try {
      await addTask({
        title: email.extractedTask?.title || email.subject,
        description: `From: ${email.from} — ${email.preview}`,
        category: email.extractedTask?.category || 'personal',
        priority: email.extractedTask?.priority || 'medium',
        status: 'todo',
        deadline: email.extractedTask?.deadline || inDays(3),
        effortHours: email.extractedTask?.effortHours || 1,
        progress: 0,
        source: 'gmail',
      });
      toast.success('Task created', { description: `"${email.extractedTask?.title || email.subject}" added to your Deadline Radar` });
    } catch {
      toast.error('Failed to create task');
    }
  };

  // Empty state for live users with no emails
  if (emailList.length === 0) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Module 03"
          title="Gmail Intelligence"
          description="Your AI inbox scanner. It reads every email, detects assignments, deadlines, bills, meetings & interviews — and converts them into tasks automatically."
          actions={
            <Button onClick={rescan} disabled={scanning} className="gap-2">
              <RefreshCw className={cn('h-4 w-4', scanning && 'animate-spin')} />
              {scanning ? 'Scanning…' : 'Scan inbox now'}
            </Button>
          }
        />
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">No emails yet</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Connect your Gmail account or scan your inbox to start detecting tasks, deadlines, and interviews automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Module 03"
        title="Gmail Intelligence"
        description="Your AI inbox scanner. It reads every email, detects assignments, deadlines, bills, meetings & interviews — and converts them into tasks automatically."
        actions={
          <Button onClick={rescan} disabled={scanning} className="gap-2">
            <RefreshCw className={cn('h-4 w-4', scanning && 'animate-spin')} />
            {scanning ? 'Scanning…' : 'Scan inbox now'}
          </Button>
        }
      />

      {/* Stats — all derived from real data */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { l: 'Emails scanned', v: String(emailList.length), c: '#06B6D4', icon: Inbox },
          { l: 'Tasks detected', v: String(detected.length), c: '#4F46E5', icon: Sparkles },
          { l: 'Unread', v: String(unread), c: '#F59E0B', icon: Mail },
          { l: 'Auto-accepted', v: String(accepted.size), c: '#10B981', icon: Check },
        ].map((s) => (
          <Card key={s.l}>
            <CardContent className="flex items-center gap-3 pt-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-muted-foreground">
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xl font-bold tabular-nums">{s.v}</div>
                <div className="text-[11px] text-muted-foreground">{s.l}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Inbox list */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> Inbox</span>
              <Badge variant="secondary">{emailList.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 p-2">
            {emailList.map((email) => {
              const cfg = typeConfig[email.detectedType];
              const isActive = selected?.id === email.id;
              return (
                <button
                  key={email.id}
                  onClick={() => setSelected(email)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors',
                    isActive ? 'bg-muted' : 'hover:bg-muted/50'
                  )}
                >
                  <div className="relative shrink-0">
                    {email.iconName && brandIcons[email.iconName] ? (
                      (() => {
                        const BrandIcon = brandIcons[email.iconName];
                        return (
                          <div className="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold text-white" style={{ background: email.avatarColor }}>
                            <BrandIcon className="h-4 w-4" />
                          </div>
                        );
                      })()
                    ) : (
                      <div className="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold text-white" style={{ background: email.avatarColor }}>
                        {initials(email.from)}
                      </div>
                    )}
                    {!email.read && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-foreground ring-2 ring-background" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{email.from}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{formatRelative(email.receivedAt)}</span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{email.subject}</div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium" style={{ background: `${cfg.color}1a`, color: cfg.color }}>
                        <cfg.icon className="h-2.5 w-2.5" /> {cfg.label}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Email detail + extraction */}
        <div className="lg:col-span-3">
          {selected && (
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {selected.iconName && brandIcons[selected.iconName] ? (
                      (() => {
                        const BrandIcon = brandIcons[selected.iconName];
                        return (
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white" style={{ background: selected.avatarColor }}>
                            <BrandIcon className="h-5 w-5" />
                          </div>
                        );
                      })()
                    ) : (
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white" style={{ background: selected.avatarColor }}>
                        {initials(selected.from)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{selected.from}</span>
                        <span className="text-xs text-muted-foreground">&lt;{selected.fromEmail}&gt;</span>
                      </div>
                      <h2 className="mt-1 text-lg font-semibold leading-tight">{selected.subject}</h2>
                      <div className="mt-1 text-xs text-muted-foreground">{formatRelative(selected.receivedAt)}</div>
                    </div>
                  </div>
                  <div className="mt-4 whitespace-pre-wrap border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                    {selected.body}
                  </div>
                </CardContent>
              </Card>

              {/* AI Extraction */}
              {selected.detectedType !== 'none' && selected.extractedTask && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="overflow-hidden">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">AI Task Extraction</div>
                          <div className="text-[11px] text-muted-foreground">Gemini 2.5 detected a {typeConfig[selected.detectedType].label.toLowerCase()}</div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2.5 rounded-lg border border-border bg-card/50 p-4">
                        {[
                          { l: 'Task', v: selected.extractedTask.title },
                          { l: 'Deadline', v: new Date(selected.extractedTask.deadline!).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) },
                          { l: 'Priority', v: selected.extractedTask.priority },
                          { l: 'Category', v: selected.extractedTask.category },
                          { l: 'Estimated effort', v: `${selected.extractedTask.effortHours} hours` },
                        ].map((row) => (
                          <div key={row.l} className="flex items-center justify-between gap-4 text-sm">
                            <span className="text-muted-foreground">{row.l}</span>
                            <span className="font-medium capitalize">{row.v}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex gap-2">
                        {accepted.has(selected.id) ? (
                          <Button disabled className="gap-2">
                            <Check className="h-4 w-4" /> Added to Deadline Radar
                          </Button>
                        ) : (
                          <>
                            <Button onClick={() => accept(selected)} className="gap-2">
                              <Plus className="h-4 w-4" /> Accept & create task
                            </Button>
                            <Button variant="outline">Edit details</Button>
                            <Button variant="ghost">Dismiss</Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
