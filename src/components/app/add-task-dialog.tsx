'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/data-context';
import { toast } from 'sonner';
import type { Task, Priority, Category, TaskStatus } from '@/lib/types';
import { inDays } from '@/lib/utils';

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  editTask?: Task;
}

const CATEGORIES: Category[] = ['assignment', 'meeting', 'interview', 'bill', 'goal', 'project', 'personal', 'event'];
const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'critical'];

export function AddTaskDialog({ open, onClose, editTask }: AddTaskDialogProps) {
  const { addTask, updateTask, mode } = useData();

  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [category, setCategory] = useState<Category>(editTask?.category || 'personal');
  const [priority, setPriority] = useState<Priority>(editTask?.priority || 'medium');
  const [deadline, setDeadline] = useState(
    editTask?.deadline ? editTask.deadline.slice(0, 16) : ''
  );
  const [effortHours, setEffortHours] = useState(editTask?.effortHours?.toString() || '1');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    setSaving(true);
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        priority,
        status: 'todo' as TaskStatus,
        deadline: new Date(deadline).toISOString(),
        effortHours: parseFloat(effortHours) || 1,
        progress: 0,
        source: 'manual' as const,
      };

      if (editTask) {
        await updateTask(editTask.id, taskData);
        toast.success('Task updated');
      } else {
        await addTask(taskData);
        toast.success('Task added', { description: title.trim() });
      }
      onClose();
    } catch (err) {
      toast.error('Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const priorityColors: Record<Priority, string> = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-warning/15 text-warning',
    high: 'bg-destructive/15 text-destructive',
    critical: 'bg-destructive text-white',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-base font-semibold">
            {editTask ? 'Edit Task' : 'Add Task'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Deadline + Effort */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Deadline *</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Effort (hours)</label>
              <input
                type="number"
                min="0.1"
                max="100"
                step="0.5"
                value={effortHours}
                onChange={e => setEffortHours(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring capitalize"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 rounded-lg border py-1.5 text-xs font-semibold capitalize transition-all ${
                    priority === p
                      ? `${priorityColors[p]} border-transparent`
                      : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Demo mode notice */}
          {mode === 'demo' && (
            <p className="rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
              Demo mode — data won't be saved. Sign in to save tasks.
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Saving…' : editTask ? 'Update task' : 'Add task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
