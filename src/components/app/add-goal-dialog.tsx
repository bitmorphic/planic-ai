'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/data-context';
import { toast } from 'sonner';
import type { Goal, Milestone, Category } from '@/lib/types';
import { inDays } from '@/lib/utils';

interface AddGoalDialogProps {
  open: boolean;
  onClose: () => void;
  editGoal?: Goal;
}

const CATEGORIES: Category[] = ['goal', 'assignment', 'project', 'personal', 'habit'];

export function AddGoalDialog({ open, onClose, editGoal }: AddGoalDialogProps) {
  const { addGoal, updateGoal, mode } = useData();

  const [title, setTitle] = useState(editGoal?.title || '');
  const [description, setDescription] = useState(editGoal?.description || '');
  const [category, setCategory] = useState<Category>(editGoal?.category || 'goal');
  const [targetDate, setTargetDate] = useState(
    editGoal?.targetDate ? editGoal.targetDate.slice(0, 10) : ''
  );
  const [milestones, setMilestones] = useState<Omit<Milestone, 'id'>[]>(
    editGoal?.milestones?.map(m => ({ title: m.title, done: m.done })) || [{ title: '', done: false }]
  );
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const addMilestone = () => setMilestones(m => [...m, { title: '', done: false }]);
  const removeMilestone = (i: number) => setMilestones(m => m.filter((_, idx) => idx !== i));
  const updateMilestoneTitle = (i: number, t: string) => setMilestones(m => m.map((ms, idx) => idx === i ? { ...ms, title: t } : ms));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      const goalData: Omit<Goal, 'id'> = {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        targetDate: targetDate ? new Date(targetDate).toISOString() : inDays(30),
        progress: 0,
        milestones: milestones
          .filter(m => m.title.trim())
          .map((m, i) => ({ id: `m${Date.now()}-${i}`, title: m.title.trim(), done: m.done })),
        streak: 0,
      };

      if (editGoal) {
        await updateGoal(editGoal.id, goalData);
        toast.success('Goal updated');
      } else {
        await addGoal(goalData);
        toast.success('Goal created!', { description: title.trim() });
      }
      onClose();
    } catch (err) {
      toast.error('Failed to save goal');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-base font-semibold">
            {editGoal ? 'Edit Goal' : 'New Goal'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Goal title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What do you want to achieve?"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              required autoFocus
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Why does this matter to you?"
              rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring capitalize"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Target date</label>
              <input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Milestones */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Milestones</label>
              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={m.title}
                    onChange={e => updateMilestoneTitle(i, e.target.value)}
                    placeholder={`Milestone ${i + 1}`}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(i)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {mode === 'demo' && (
            <p className="rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
              Demo mode — data won't be saved. Sign in to create goals.
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Saving…' : editGoal ? 'Update goal' : 'Create goal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
