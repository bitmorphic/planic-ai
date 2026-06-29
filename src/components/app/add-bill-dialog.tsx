'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/data-context';
import { toast } from 'sonner';
import type { Bill } from '@/lib/types';

interface AddBillDialogProps {
  open: boolean;
  onClose: () => void;
  editBill?: Bill;
}

const CATEGORIES: Bill['category'][] = ['electricity', 'rent', 'subscription', 'phone', 'internet', 'insurance', 'other'];
const RECURRING: Bill['recurring'][] = ['monthly', 'yearly', 'weekly', 'one-time'];

export function AddBillDialog({ open, onClose, editBill }: AddBillDialogProps) {
  const { addBill, updateBill, mode } = useData();

  const [name, setName] = useState(editBill?.name || '');
  const [provider, setProvider] = useState(editBill?.provider || '');
  const [amount, setAmount] = useState(editBill?.amount?.toString() || '');
  const [currency, setCurrency] = useState(editBill?.currency || '₹');
  const [dueDate, setDueDate] = useState(editBill?.dueDate ? editBill.dueDate.slice(0, 10) : '');
  const [category, setCategory] = useState<Bill['category']>(editBill?.category || 'other');
  const [recurring, setRecurring] = useState<Bill['recurring']>(editBill?.recurring || 'monthly');
  const [autoPay, setAutoPay] = useState(editBill?.autoPay || false);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount || !dueDate) return;

    setSaving(true);
    try {
      const billData: Omit<Bill, 'id'> = {
        name: name.trim(),
        provider: provider.trim() || name.trim(),
        amount: parseFloat(amount),
        currency,
        dueDate: new Date(dueDate).toISOString(),
        recurring,
        category,
        status: 'upcoming',
        autoPay,
        riskLevel: 'low',
      };

      if (editBill) {
        await updateBill(editBill.id, billData);
        toast.success('Bill updated');
      } else {
        await addBill(billData);
        toast.success('Bill added', { description: `${currency}${amount} — ${name}` });
      }
      onClose();
    } catch (err) {
      toast.error('Failed to save bill');
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
            {editBill ? 'Edit Bill' : 'Add Bill'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Bill name *</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Electricity Bill"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                required autoFocus
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Provider</label>
              <input
                value={provider}
                onChange={e => setProvider(e.target.value)}
                placeholder="BSES, Spotify…"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Amount *</label>
              <div className="flex gap-1">
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>₹</option>
                  <option>$</option>
                  <option>€</option>
                  <option>£</option>
                </select>
                <input
                  type="number" min="0" step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="500"
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Due date *</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Bill['category'])}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring capitalize"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Recurring</label>
              <select
                value={recurring}
                onChange={e => setRecurring(e.target.value as Bill['recurring'])}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring capitalize"
              >
                {RECURRING.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoPay}
              onChange={e => setAutoPay(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <span className="text-sm text-muted-foreground">Auto-pay enabled</span>
          </label>

          {mode === 'demo' && (
            <p className="rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
              Demo mode — data won't be saved. Sign in to add bills.
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Saving…' : editBill ? 'Update bill' : 'Add bill'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
