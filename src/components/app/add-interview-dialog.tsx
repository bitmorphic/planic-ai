'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/data-context';
import { toast } from 'sonner';
import type { Interview } from '@/lib/types';
import { inDays } from '@/lib/utils';

interface AddInterviewDialogProps {
  open: boolean;
  onClose: () => void;
  editInterview?: Interview;
}

const ROUNDS = ['Phone Screen', 'Technical Round', 'System Design', 'HR Round', 'Final Round', 'On-site'];
const LOGO_COLORS = ['#4F46E5', '#10B981', '#EF4444', '#F59E0B', '#06B6D4', '#8B5CF6', '#EC4899'];

export function AddInterviewDialog({ open, onClose, editInterview }: AddInterviewDialogProps) {
  const { addInterview, updateInterview, mode } = useData();

  const [company, setCompany] = useState(editInterview?.company || '');
  const [role, setRole] = useState(editInterview?.role || '');
  const [round, setRound] = useState(editInterview?.round || 'Technical Round');
  const [date, setDate] = useState(
    editInterview?.date ? editInterview.date.slice(0, 16) : ''
  );
  const [logoColor, setLogoColor] = useState(editInterview?.logoColor || '#4F46E5');
  const [checklist, setChecklist] = useState(
    editInterview?.checklist?.map(c => c.label) || ['Research the company', 'Practice DSA problems', 'Prepare STAR stories']
  );
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const addCheckItem = () => setChecklist(c => [...c, '']);
  const removeCheckItem = (i: number) => setChecklist(c => c.filter((_, idx) => idx !== i));
  const updateCheckItem = (i: number, v: string) => setChecklist(c => c.map((item, idx) => idx === i ? v : item));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    setSaving(true);
    try {
      const interviewData: Omit<Interview, 'id'> = {
        company: company.trim(),
        role: role.trim(),
        date: date ? new Date(date).toISOString() : inDays(7),
        round,
        logoColor,
        prepProgress: 0,
        checklist: checklist
          .filter(c => c.trim())
          .map((label, i) => ({ id: `c${Date.now()}-${i}`, label: label.trim(), done: false })),
      };

      if (editInterview) {
        await updateInterview(editInterview.id, interviewData);
        toast.success('Interview updated');
      } else {
        await addInterview(interviewData);
        toast.success('Interview added!', { description: `${company} — ${role}` });
      }
      onClose();
    } catch (err) {
      toast.error('Failed to save interview');
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
            {editInterview ? 'Edit Interview' : 'Add Interview'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Company *</label>
              <input
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Google, Amazon…"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                required autoFocus
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Role *</label>
              <input
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="Software Engineer"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Interview date</label>
              <input
                type="datetime-local"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Round</label>
              <select
                value={round}
                onChange={e => setRound(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {ROUNDS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Icon color</label>
            <div className="flex gap-2">
              {LOGO_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setLogoColor(c)}
                  className={`h-7 w-7 rounded-full transition-transform ${logoColor === c ? 'scale-125 ring-2 ring-foreground ring-offset-2' : 'hover:scale-110'}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Prep checklist</label>
              <button
                type="button"
                onClick={addCheckItem}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={item}
                    onChange={e => updateCheckItem(i, e.target.value)}
                    placeholder={`Prep item ${i + 1}`}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  {checklist.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCheckItem(i)}
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
              Demo mode — data won't be saved. Sign in to track interviews.
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Saving…' : editInterview ? 'Update' : 'Add interview'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
