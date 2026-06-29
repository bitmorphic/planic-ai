'use client';

import { motion } from 'framer-motion';
import { fadeUp, viewportReveal } from '@/components/shared/motion';

/**
 * Tech stack logos — real brand colors, smooth infinite marquee.
 * Real brand colors, smooth infinite marquee.
 */

const techs = [
  { name: 'Gemini', logo: <GeminiLogo /> },
  { name: 'Firebase', logo: <FirebaseLogo /> },
  { name: 'Google Cloud', logo: <GoogleCloudLogo /> },
  { name: 'Vertex AI', logo: <VertexLogo /> },
  { name: 'Gmail', logo: <GmailLogo /> },
  { name: 'Next.js', logo: <NextLogo /> },
  { name: 'TypeScript', logo: <TsLogo /> },
  { name: 'Framer Motion', logo: <FramerLogo /> },
];

export function TechLogos() {
  return (
    <section className="border-y border-border bg-surface/50 py-14 overflow-hidden">
      <div className="container">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
        >
          Built on the Google AI stack
        </motion.p>
      </div>

      {/* Infinite marquee */}
      <div className="relative mt-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportReveal}
          transition={{ duration: 0.8 }}
          className="flex animate-marquee"
        >
          <div className="flex shrink-0 items-center gap-14 px-7">
            {techs.map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-3"
                title={t.name}
              >
                {t.logo}
              </div>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-14 px-7" aria-hidden>
            {techs.map((t) => (
              <div
                key={`${t.name}-dup`}
                className="flex items-center gap-3"
              >
                {t.logo}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Real brand-colored SVG glyphs ---------- */

function GeminiLogo() {
  return (
    <svg width="110" height="28" viewBox="0 0 110 28" fill="none" aria-label="Gemini">
      <path d="M14 2C14.5 8.5 19.5 13.5 26 14C19.5 14.5 14.5 19.5 14 26C13.5 19.5 8.5 14.5 2 14C8.5 13.5 13.5 8.5 14 2Z" fill="#4285F4" />
      <text x="32" y="19" className="fill-foreground font-sans text-[14px] font-semibold tracking-tight">Gemini</text>
    </svg>
  );
}

function FirebaseLogo() {
  return (
    <svg width="110" height="28" viewBox="0 0 110 28" fill="none" aria-label="Firebase">
      <path d="M8 22L11 4L15 12L8 22Z" fill="#FFA000" />
      <path d="M15 12L11 4L14.5 3L19 10L15 12Z" fill="#F57C00" />
      <path d="M8 22L19 10L22 13L14.5 25L8 22Z" fill="#FFCA28" />
      <text x="28" y="19" className="fill-foreground font-sans text-[14px] font-semibold tracking-tight">Firebase</text>
    </svg>
  );
}

function GoogleCloudLogo() {
  return (
    <svg width="140" height="28" viewBox="0 0 140 28" fill="none" aria-label="Google Cloud">
      <path d="M17.5 8L20 4H12L9.5 8H17.5Z" fill="#EA4335" />
      <path d="M9.5 8L4 18H9L14.5 8H9.5Z" fill="#4285F4" />
      <path d="M14.5 8L9 18H19L24.5 8H14.5Z" fill="#34A853" />
      <path d="M24.5 8L19 18H24L26 14L24.5 8Z" fill="#FBBC05" />
      <text x="32" y="19" className="fill-foreground font-sans text-[13px] font-semibold tracking-tight">Google Cloud</text>
    </svg>
  );
}

function VertexLogo() {
  return (
    <svg width="106" height="28" viewBox="0 0 106 28" fill="none" aria-label="Vertex AI">
      <path d="M14 4L4 24H24L14 4Z" fill="#34A853" />
      <circle cx="14" cy="17" r="3" fill="white" />
      <text x="30" y="19" className="fill-foreground font-sans text-[14px] font-semibold tracking-tight">Vertex AI</text>
    </svg>
  );
}

function GmailLogo() {
  return (
    <svg width="90" height="28" viewBox="0 0 90 28" fill="none" aria-label="Gmail">
      <rect x="3" y="7" width="22" height="14" rx="2" fill="#EA4335" />
      <path d="M3 7L14 16L25 7" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      <text x="30" y="19" className="fill-foreground font-sans text-[14px] font-semibold tracking-tight">Gmail</text>
    </svg>
  );
}

function NextLogo() {
  return (
    <svg width="96" height="28" viewBox="0 0 96 28" fill="none" aria-label="Next.js">
      <circle cx="14" cy="14" r="11" className="fill-foreground" />
      <path d="M10 9V19M10 9L21 22" stroke="hsl(var(--background))" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="9" x2="18" y2="15" stroke="hsl(var(--background))" strokeWidth="2" strokeLinecap="round" />
      <text x="30" y="19" className="fill-foreground font-sans text-[14px] font-semibold tracking-tight">Next.js</text>
    </svg>
  );
}

function TsLogo() {
  return (
    <svg width="120" height="28" viewBox="0 0 120 28" fill="none" aria-label="TypeScript">
      <rect x="2" y="4" width="24" height="20" rx="4" fill="#3178C6" />
      <text x="14" y="19" textAnchor="middle" className="font-sans text-[12px] font-bold" fill="white">TS</text>
      <text x="32" y="19" className="fill-foreground font-sans text-[13px] font-semibold tracking-tight">TypeScript</text>
    </svg>
  );
}

function FramerLogo() {
  return (
    <svg width="136" height="28" viewBox="0 0 136 28" fill="none" aria-label="Framer Motion">
      <path d="M4 4H24V12H14L4 4Z" fill="#05F" />
      <path d="M4 12H14L24 20H4V12Z" fill="#05F" fillOpacity="0.7" />
      <path d="M4 20H14L4 28V20Z" fill="#05F" fillOpacity="0.4" />
      <text x="30" y="19" className="fill-foreground font-sans text-[13px] font-semibold tracking-tight">Framer Motion</text>
    </svg>
  );
}
