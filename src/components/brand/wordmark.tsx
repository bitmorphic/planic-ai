import { cn } from '@/lib/utils';

/**
 * Planic AI — Wordmark
 * Modern, professional sans. "Planic AI" in text-foreground.
 */
export function Wordmark({
  className,
  size = 'md',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };
  return (
    <span
      className={cn(
        'font-display font-semibold tracking-tight text-foreground',
        sizes[size],
        className
      )}
    >
      Planic AI
    </span>
  );
}
