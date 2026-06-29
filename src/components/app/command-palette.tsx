'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Command, CornerDownLeft } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { NAV_ITEMS } from '@/lib/nav';
import { cn } from '@/lib/utils';

const ACTIONS = [
  { label: 'Create new task', href: '/app/planner', hint: 'N' },
  { label: 'Scan Gmail now', href: '/app/gmail', hint: 'G' },
  { label: 'Trigger Panic Mode', href: '/app/panic', hint: 'P' },
  { label: 'Ask Planic AI', href: '/app/planic', hint: 'F' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const all = [
    ...NAV_ITEMS.map((n) => ({ label: n.label, href: n.href, icon: n.icon, group: 'Navigate' })),
    ...ACTIONS.map((a) => ({ label: a.label, href: a.href, icon: Search, group: 'Actions' })),
  ];

  const filtered = all.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));
  const groups = filtered.reduce<Record<string, typeof filtered>>((acc, item) => {
    (acc[item.group] ||= []).push(item);
    return acc;
  }, {});

  const go = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery('');
    setActive(0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
    if (e.key === 'Enter' && filtered[active]) {
      go(filtered[active].href);
    }
  };

  let runningIndex = -1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[20%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search modules, run actions…"
            className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd>ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="mb-2">
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group}
              </div>
              {items.map((item) => {
                runningIndex++;
                const idx = runningIndex;
                return (
                  <button
                    key={item.label}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => go(item.href)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                      active === idx ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1">{item.label}</span>
                    {active === idx && <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Command className="h-3 w-3" /> Planic AI Command
          </span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd>↵</kbd> select</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
