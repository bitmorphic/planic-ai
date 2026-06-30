'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SiX, SiGithub, SiProducthunt } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';
import { LogoMark } from '@/components/brand/logo-mark';
import { Wordmark } from '@/components/brand/wordmark';
import { cn } from '@/lib/utils';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Command Center', href: '/demo' },
      { label: 'Deadline Radar', href: '/demo/deadlines' },
      { label: 'AI Planner', href: '/demo/planner' },
      { label: 'Planic Mode', href: '/demo/planic' },
    ],
  },
  {
    title: 'Agents',
    links: [
      { label: 'Gmail Intelligence', href: '/demo/gmail' },
      { label: 'Interview Copilot', href: '/demo/interviews' },
      { label: 'Bill Guardian', href: '/demo/bills' },
      { label: 'Productivity DNA', href: '/demo/dna' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const socials = [
  { icon: SiX, label: 'Twitter', href: 'https://x.com/bitmorphic_', color: 'text-foreground' },
  { icon: SiGithub, label: 'GitHub', href: 'https://github.com/bitmorphic', color: 'text-foreground' },
  { icon: FaLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohammad-anas-69089b39b/', color: 'text-[#0A66C2]' },
];

export function Footer() {
  const [memeIndex, setMemeIndex] = useState(0);
  const totalMemes = 4;

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background">
                <LogoMark size={18} className="text-background" />
              </span>
              <Wordmark size="md" />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The AI Accountability Operating System. Built on Gemini, Firebase, and the Google AI stack.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border transition-colors hover:bg-muted"
                >
                  <s.icon className={cn("h-4 w-4", s.color)} />
                </a>
              ))}
            </div>

            {/* Product Hunt Bar */}
            <div className="mt-6 border-t border-border pt-6">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-[#DA552F]/20 bg-[#DA552F]/10 px-3 py-1.5 text-xs font-medium text-[#DA552F] transition-colors hover:bg-[#DA552F]/20"
              >
                <SiProducthunt className="h-4 w-4" />
                Launching soon on Product Hunt
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Meme Column */}
          <div className="flex flex-col items-start pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground opacity-50 mb-4 flex items-center gap-2">
              Mood
              <button 
                onClick={() => setMemeIndex((prev) => (prev + 1) % totalMemes)}
                className="grid h-5 w-5 place-items-center rounded bg-muted text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
                aria-label="Next meme"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </h3>
            <div className="group relative -rotate-3 transition-transform duration-300 hover:rotate-0">
              <img 
                src={`/meme${memeIndex}.png`}
                alt="Planic AI Meme" 
                className="w-36 h-auto rounded-xl shadow-lg border border-border" 
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-end justify-end gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Planic AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
