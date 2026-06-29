import { cn } from '@/lib/utils';

/**
 * Planic AI — Logo Mark (Monochrome Graphite / Geometric P)
 *
 * Concept: A minimalist, brutalist "P" made of 5 solid geometric blocks
 * connected at their diagonals.
 *
 * Drawn on a 32x32 grid.
 * - 3x4 block grid. Each block is 8x8 pixels.
 * - Centered horizontally.
 */

export type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({
  size = 32,
  className,
}: LogoMarkProps) {
  // We use text-foreground to enforce the monochrome graphite philosophy (black on light, white on dark)
  const color = 'currentColor';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn('shrink-0 text-foreground', className)}
      role="img"
      aria-label="Planic AI"
    >
      {/* Top block */}
      <rect x="12" y="0" width="8" height="8" fill={color} />
      {/* Left block of the bowl */}
      <rect x="4" y="8" width="8" height="8" fill={color} />
      {/* Right block of the bowl */}
      <rect x="20" y="8" width="8" height="8" fill={color} />
      {/* Bottom block of the bowl */}
      <rect x="12" y="16" width="8" height="8" fill={color} />
      {/* Stem block */}
      <rect x="4" y="24" width="8" height="8" fill={color} />
    </svg>
  );
}
