import type { Variants, Transition } from 'framer-motion';

/**
 * Shared Framer Motion building blocks.
 * Used across the landing + app for consistent, reduced-motion-safe motion.
 */

const PREFERS_REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Shared timing curve — a refined "ease-out-expo-ish" feel. */
export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const smoothSpring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

/** Fade + rise. The workhorse entrance variant. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

/** Fade only (no translation) — for layered/sibling reveals. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: easeOutExpo } },
};

/** Scale-in for cards / mockups. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: easeOutExpo } },
};

/** Parent container that staggers its children. */
export function stagger(delayChildren = 0, staggerChildren = 0.08): Variants {
  return {
    hidden: {},
    show: {
      transition: { delayChildren, staggerChildren },
    },
  };
}

/** Standard viewport config for `whileInView`. */
export const viewportReveal = { once: true, margin: '-80px' } as const;
