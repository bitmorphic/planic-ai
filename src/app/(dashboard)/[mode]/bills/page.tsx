'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Receipt,
  Zap,
  Home,
  Smartphone,
  Globe,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  Check,
  RefreshCw,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Counter } from '@/components/shared/counter';
import { AddBillDialog } from '@/components/app/add-bill-dialog';
import { useData } from '@/contexts/data-context';
import { Bill } from '@/lib/types';
import { formatRelative, cn } from '@/lib/utils';
import { SiSpotify, SiFigma, SiNamecheap } from 'react-icons/si';
import { toast } from 'sonner';

const brandIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  SiSpotify,
  SiFigma,
  SiNamecheap,
};

const categoryConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  electricity: { icon: Zap, color: '#F59E0B' },
  rent: { icon: Home, color: '#4F46E5' },
  subscription: { icon: RefreshCw, color: '#EC4899' },
  phone: { icon: Smartphone, color: '#06B6D4' },
  internet: { icon: Globe, color: '#8B5CF6' },
  insurance: { icon: ShieldCheck, color: '#10B981' },
  other: { icon: Receipt, color: '#64748B' },
};

const statusConfig: Record<string, { variant: 'default' | 'warning' | 'danger' | 'success'; label: string }> = {
  upcoming: { variant: 'default', label: 'Upcoming' },
  due: { variant: 'warning', label: 'Due soon' },
  paid: { variant: 'success', label: 'Paid' },
  overdue: { variant: 'danger', label: 'Overdue' },
};

export default function BillsPage() {
  const { bills, updateBill, deleteBill } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editBill, setEditBill] = useState<Bill | undefined>();

  const sorted = [...bills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const overdue = bills.filter((b) => b.status === 'overdue');
  const total = bills.filter((b) => b.status !== 'paid').reduce((s, b) => s + b.amount, 0);
  const monthlyRecurring = bills.filter((b) => b.recurring === 'monthly').reduce((s, b) => s + b.amount, 0);

  const handleMarkPaid = async (bill: Bill) => {
    await updateBill(bill.id, { status: 'paid' });
    toast.success(`${bill.name} marked as paid ✓`);
  };

  const openAdd = () => { setEditBill(undefined); setDialogOpen(true); };
  const openEdit = (b: Bill) => { setEditBill(b); setDialogOpen(true); };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Module 08"
        title="Bill Guardian"
        description="The AI watches every recurring payment — electricity, rent, subscriptions, phone — remembers them, and escalates urgency before late fees hit."
        actions={
          <div className="flex items-center gap-2">
            <Button className="gap-2" onClick={openAdd}>
              <Plus className="h-4 w-4" /> Add bill
            </Button>
          </div>
        }
      />

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-warning/30">
          <CardContent className="pt-5">
            <div className="text-xs text-muted-foreground">Total due (7 days)</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">
              <Counter value={total} />
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-warning">
              <AlertTriangle className="h-3 w-3" /> {bills.filter((b) => b.status !== 'paid').length} bills
            </div>
          </CardContent>
        </Card>
        <Card className={cn('border-destructive/30', overdue.length > 0 && 'bg-destructive/5')}>
          <CardContent className="pt-5">
            <div className="text-xs text-muted-foreground">Overdue</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-destructive">{overdue.length}</div>
            <div className="mt-1 text-[11px] text-destructive">Action needed now</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="text-xs text-muted-foreground">Monthly recurring</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">
              <Counter value={monthlyRecurring} />
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
              <RefreshCw className="h-3 w-3" /> {bills.filter((b) => b.recurring === 'monthly').length} subscriptions
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="text-xs text-muted-foreground">On autopay</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{bills.filter((b) => b.autoPay).length}</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-success">
              <Check className="h-3 w-3" /> Safe from late fees
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk alert */}
      {overdue.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
          <div className="text-sm">
            <span className="font-semibold text-destructive">Bill Guardian alert:</span>{' '}
            <span className="text-muted-foreground">
              {overdue[0].name} ({overdue[0].provider}) is <span className="font-medium text-destructive">overdue by {Math.max(1, Math.ceil((Date.now() - new Date(overdue[0].dueDate).getTime()) / 86400000))} day{Math.ceil((Date.now() - new Date(overdue[0].dueDate).getTime()) / 86400000) !== 1 ? 's' : ''}</span>. Late fees may apply. Pay now to avoid escalation.
            </span>
          </div>
        </motion.div>
      )}

      {/* Bills list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Bills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sorted.map((bill, i) => {
            const cfg = categoryConfig[bill.category];
            const sc = statusConfig[bill.status];
            return (
              <motion.div
                key={bill.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  'group flex items-center gap-4 rounded-xl border p-4 transition-colors cursor-pointer',
                  bill.status === 'overdue' ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-card/40 hover:bg-muted/40'
                )}
                onClick={() => openEdit(bill)}
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                  {bill.iconName && brandIcons[bill.iconName] ? (
                    (() => {
                      const BrandIcon = brandIcons[bill.iconName!];
                      return <BrandIcon className="h-5 w-5 text-foreground" />;
                    })()
                  ) : (
                    <cfg.icon className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{bill.name}</span>
                    {bill.autoPay && (
                      <Badge variant="success" className="gap-1 text-[9px]"><RefreshCw className="h-2.5 w-2.5" /> Auto</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{bill.provider} · {bill.recurring}</div>
                </div>
                <div className="hidden text-right sm:block">
                  <div className="text-sm font-bold tabular-nums">{bill.currency} {bill.amount.toLocaleString()}</div>
                  <div className="text-[11px] text-muted-foreground">{formatRelative(bill.dueDate)}</div>
                </div>
                <Badge variant={sc.variant}>{sc.label}</Badge>
                <Button
                  size="sm"
                  variant={bill.status === 'paid' ? 'outline' : 'default'}
                  disabled={bill.status === 'paid'}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); handleMarkPaid(bill); }}
                >
                  {bill.status === 'paid' ? <Check className="h-3.5 w-3.5" /> : 'Mark paid'}
                </Button>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {bills.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="font-semibold">No bills tracked yet</p>
          <p className="text-sm text-muted-foreground">Add your first bill to start tracking</p>
          <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" /> Add bill</Button>
        </div>
      )}

      <AddBillDialog open={dialogOpen} onClose={() => setDialogOpen(false)} editBill={editBill} />
    </div>
  );
}
