import { cn } from '@/lib/utils';

/**
 * Planic AI — Brand Pattern
 * Subtle background texture inspired by timelines + neural nodes + progress.
 * A grid of connector lines with node dots, drawn as inline SVG so it
 * inherits theme tokens. Ultra-low opacity by default.
 */
export function BrandPattern({
  className,
  opacity = 0.5,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      style={{ opacity }}
    >
      <defs>
        <pattern
          id="fy-brand-pattern"
          width="56"
          height="56"
          patternUnits="userSpaceOnUse"
          patternTransform="translate(0 0)"
        >
          {/* timeline grid lines */}
          <g stroke="hsl(var(--foreground))" strokeOpacity="0.06" strokeWidth="1" fill="none">
            <path d="M0 28 H56 M28 0 V56" />
            <path d="M0 0 L56 56 M56 0 L0 56" strokeOpacity="0.03" />
          </g>
          {/* neural / progress nodes */}
          <g fill="hsl(var(--primary))" fillOpacity="0.5">
            <circle cx="28" cy="28" r="1.6" />
          </g>
          <g fill="hsl(var(--accent))" fillOpacity="0.45">
            <circle cx="0" cy="0" r="1.2" />
            <circle cx="56" cy="56" r="1.2" />
            <circle cx="56" cy="0" r="1.2" />
            <circle cx="0" cy="56" r="1.2" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#fy-brand-pattern)" />
    </svg>
  );
}
