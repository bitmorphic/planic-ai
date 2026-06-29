'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, CalendarDays, KanbanSquare, ListTree, Plus, Trash2, Pencil } from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/app/task-card';
import { PriorityBadge, UrgencyMeter, CountdownChip } from '@/components/shared/priority';
import { AddTaskDialog } from '@/components/app/add-task-dialog';
import { useData } from '@/contexts/data-context';
import { Task } from '@/lib/types';
import { urgencyScore, formatDate, cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function DeadlineRadarPage() {
  const { tasks, updateTask, deleteTask } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>();

  const openAdd = () => { setEditTask(undefined); setDialogOpen(true); };
  const openEdit = (t: Task) => { setEditTask(t); setDialogOpen(true); };

  const handleStatusToggle = async (task: Task) => {
    const next = task.status === 'done' ? 'todo' : 'done';
    await updateTask(task.id, { status: next, progress: next === 'done' ? 100 : task.progress });
    toast.success(next === 'done' ? 'Task completed! 🎉' : 'Task reopened');
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    toast.success('Task deleted');
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Module 02"
        title="Deadline Radar"
        description="Every upcoming commitment, ranked by predicted risk. The AI flags deadlines you're on track to miss — days before you'd notice."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="danger" className="gap-1.5">
              <Radar className="h-3 w-3" /> {tasks.filter((t) => urgencyScore(t.deadline, t.priority) > 75 && t.status !== 'done').length} high-risk
            </Badge>
            <Button onClick={openAdd} className="gap-2">
              <Plus className="h-4 w-4" /> Add task
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline" className="gap-1.5"><ListTree className="h-4 w-4" /> Timeline</TabsTrigger>
          <TabsTrigger value="kanban" className="gap-1.5"><KanbanSquare className="h-4 w-4" /> Kanban</TabsTrigger>
          <TabsTrigger value="calendar" className="gap-1.5"><CalendarDays className="h-4 w-4" /> Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <TimelineView onEdit={openEdit} onStatusToggle={handleStatusToggle} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value="kanban" className="mt-6">
          <KanbanView onEdit={openEdit} onStatusToggle={handleStatusToggle} />
        </TabsContent>
        <TabsContent value="calendar" className="mt-6">
          <CalendarView />
        </TabsContent>
      </Tabs>

      {tasks.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <Radar className="h-7 w-7" />
          </div>
          <div>
            <p className="font-semibold">No deadlines yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Add your first task to start tracking</p>
          </div>
          <Button onClick={openAdd} className="gap-2 mt-2">
            <Plus className="h-4 w-4" /> Add your first task
          </Button>
        </div>
      )}

      <AddTaskDialog open={dialogOpen} onClose={() => setDialogOpen(false)} editTask={editTask} />
    </div>
  );
}

function TimelineView({
  onEdit,
  onStatusToggle,
  onDelete,
}: {
  onEdit: (t: Task) => void;
  onStatusToggle: (t: Task) => void;
  onDelete: (id: string) => void;
}) {
  const { tasks } = useData();
  const sorted = [...tasks]
    .filter((t) => t.status !== 'done')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const groups = sorted.reduce<Record<string, Task[]>>((acc, t) => {
    const key = formatDate(t.deadline, { weekday: 'long', month: 'short', day: 'numeric' });
    (acc[key] ||= []).push(t);
    return acc;
  }, {});

  if (sorted.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">All clear — no upcoming deadlines.</p>;
  }

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([day, dayTasks], gi) => (
        <div key={day}>
          <div className="mb-3 flex items-center gap-3">
            <h3 className="text-sm font-semibold">{day}</h3>
            <div className="h-px flex-1 bg-border" />
            <Badge variant="secondary" className="text-[10px]">{dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}</Badge>
          </div>
          <div className="space-y-2">
            {dayTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: gi * 0.04 + i * 0.04 }}
                className="group relative"
              >
                <TaskCard task={task} />
                <div className="absolute right-3 top-3 hidden gap-1 group-hover:flex">
                  <button
                    onClick={() => onEdit(task)}
                    className="grid h-6 w-6 place-items-center rounded border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onStatusToggle(task)}
                    className="grid h-6 w-6 place-items-center rounded border border-border bg-background text-muted-foreground transition-colors hover:text-success"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="grid h-6 w-6 place-items-center rounded border border-border bg-background text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function KanbanView({ onEdit, onStatusToggle }: { onEdit: (t: Task) => void; onStatusToggle: (t: Task) => void }) {
  const { tasks } = useData();
  const cols: { key: Task['status']; label: string; color: string }[] = [
    { key: 'todo', label: 'To Do', color: '#64748B' },
    { key: 'in_progress', label: 'In Progress', color: '#4F46E5' },
    { key: 'overdue', label: 'Overdue', color: '#EF4444' },
    { key: 'done', label: 'Done', color: '#10B981' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cols.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div key={col.key}>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: col.color }} />
              <span className="text-xs font-semibold">{col.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">{colTasks.length}</span>
            </div>
            <div className="space-y-2 rounded-xl border border-border bg-muted/20 p-2 min-h-[120px]">
              {colTasks.map((task) => (
                <div key={task.id} className="group relative cursor-pointer" onClick={() => onEdit(task)}>
                  <Card interactive className="overflow-hidden">
                    <CardContent className="p-3">
                      <p className="text-xs font-medium leading-snug">{task.title}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <PriorityBadge priority={task.priority} />
                        <CountdownChip deadline={task.deadline} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
              {colTasks.length === 0 && (
                <p className="py-4 text-center text-[11px] text-muted-foreground">Empty</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CalendarView() {
  const { tasks } = useData();
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-2">
      {days.map((day) => {
        const key = day.toDateString();
        const dayTasks = tasks.filter(
          (t) => new Date(t.deadline).toDateString() === key && t.status !== 'done'
        );
        const isToday = day.toDateString() === today.toDateString();
        return (
          <div key={key} className={cn('flex gap-4 rounded-xl border p-3', isToday ? 'border-foreground/20 bg-muted/40' : 'border-border')}>
            <div className={cn('w-14 shrink-0 text-center', isToday && 'text-foreground')}>
              <div className="text-[10px] uppercase text-muted-foreground">{day.toLocaleDateString('en', { weekday: 'short' })}</div>
              <div className={cn('text-xl font-bold tabular-nums', isToday ? 'text-foreground' : 'text-muted-foreground')}>{day.getDate()}</div>
            </div>
            <div className="flex-1 space-y-1.5">
              {dayTasks.length === 0 ? (
                <p className="text-[11px] text-muted-foreground">No deadlines</p>
              ) : (
                dayTasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-2.5 py-1.5">
                    <PriorityBadge priority={t.priority} />
                    <span className="flex-1 truncate text-xs font-medium">{t.title}</span>
                    <UrgencyMeter value={urgencyScore(t.deadline, t.priority)} className="w-16" />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
