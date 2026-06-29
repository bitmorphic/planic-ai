'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, LogOut } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/nav';
import { Logo } from '@/components/marketing/header';
import { useSession, signOut } from 'next-auth/react';
import { cn, initials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-surface">
      {/* Brand */}
      <Link href={pathname?.startsWith('/demo') ? '/demo' : '/app'} className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <Logo />
        <div className="leading-tight">
          <div className="font-display text-sm font-semibold tracking-tight">
            Planic<span className="text-muted-foreground">AI</span>
          </div>
          <div className="text-[10px] text-muted-foreground">Accountability OS</div>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="Modules">
        <div className="px-2 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
          Modules
        </div>
        {NAV_ITEMS.map((item) => {
          const isDemo = pathname?.startsWith('/demo');
          const resolvedHref = isDemo ? item.href.replace('/app', '/demo') : item.href;
          const active = pathname === resolvedHref;
          return (
            <Link
              key={item.href}
              href={resolvedHref}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-foreground"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <item.icon className={cn('h-4 w-4 shrink-0', active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'grid h-5 min-w-5 place-items-center rounded px-1 text-[10px] font-semibold tabular-nums',
                    item.badge === '!'
                      ? 'bg-destructive/15 text-destructive'
                      : active
                        ? 'bg-muted text-foreground'
                        : 'bg-muted text-muted-foreground'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        {session ? (
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted text-left"
          >
            <Avatar>
              <AvatarImage src={session.user?.image || undefined} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {initials(session.user?.name || 'User')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{session.user?.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">{session.user?.email}</div>
            </div>
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </button>
        ) : (
          <Link href="/login" className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted">
            <Avatar>
              <AvatarFallback className="bg-muted text-muted-foreground">
                {initials('Guest')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">Guest</div>
              <div className="truncate text-[11px] text-muted-foreground">Sign in to start</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}
      </div>
    </aside>
  );
}
