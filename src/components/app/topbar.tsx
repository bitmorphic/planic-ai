'use client';

import { usePathname } from 'next/navigation';
import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession, signOut } from 'next-auth/react';
import { initials } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/nav';

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const current = NAV_ITEMS.find((n) => n.href === pathname) ?? NAV_ITEMS[0];

  const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
      {/* Mobile menu */}
      <button
        onClick={onMenu}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Breadcrumb / module title */}
      <div className="hidden shrink-0 sm:block">
        <div className="text-[11px] text-muted-foreground">Module {current.module}</div>
        <h1 className="-mt-0.5 font-display text-base font-semibold leading-tight">{current.label}</h1>
      </div>

      {/* Search — sits in the middle, takes available space but capped */}
      <div className="ml-auto flex max-w-md flex-1 justify-end md:ml-6 md:mr-auto">
        <button
          onClick={openSearch}
          className="hidden h-9 w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search or jump to…</span>
          <kbd>⌘K</kbd>
        </button>
        {/* Mobile search icon */}
        <Button variant="ghost" size="icon-sm" onClick={openSearch} className="md:hidden" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Actions — single right-aligned cluster */}
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <button
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive ring-2 ring-background" />
        </button>
        <button onClick={() => session ? signOut({ callbackUrl: '/' }) : null} className="transition-opacity hover:opacity-80">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              {initials(session?.user?.name || 'User')}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
}
