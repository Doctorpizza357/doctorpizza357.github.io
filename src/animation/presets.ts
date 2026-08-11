import type { ScrollAnimationConfig } from './useScrollAnimation';

/**
 * Reusable animation presets for scroll-triggered animations.
 * All durations are capped at 2000ms (hard requirement).
 * Each preset includes a reduced motion fallback that applies
 * the final state instantly (duration: 0, no transforms/movements).
 */

/**
 * Fade-in preset: opacity transitions from 0 to 1.
 * Default duration: 800ms.
 */
export function fadeIn(
  trigger: string | HTMLElement,
  options?: { duration?: number; start?: string; end?: string }
): ScrollAnimationConfig {
  const duration = Math.min(options?.duration ?? 0.8, 2);

  return {
    trigger,
    start: options?.start ?? 'top 80%',
    end: options?.end ?? 'bottom 20%',
    animation: {
      opacity: 1,
      duration,
      ease: 'power2.out',
    },
    reducedMotionFallback: {
      opacity: 1,
      duration: 0,
    },
  };
}

/**
 * Slide-up preset: element translates from y: 60 with opacity 0 to y: 0, opacity 1.
 * Default duration: 800ms.
 */
export function slideUp(
  trigger: string | HTMLElement,
  options?: { duration?: number; start?: string; end?: string }
): ScrollAnimationConfig {
  const duration = Math.min(options?.duration ?? 0.8, 2);

  return {
    trigger,
    start: options?.start ?? 'top 80%',
    end: options?.end ?? 'bottom 20%',
    animation: {
      opacity: 1,
      y: 0,
      duration,
      ease: 'power2.out',
    },
    reducedMotionFallback: {
      opacity: 1,
      y: 0,
      duration: 0,
    },
  };
}

/**
 * Stagger-children preset: staggers child element animations with a delay between each.
 * Default duration per child: 600ms. Default stagger: 150ms.
 * Note: The `trigger` should be the parent container; `stagger` is included in the animation vars.
 */
export function staggerChildren(
  trigger: string | HTMLElement,
  options?: {
    duration?: number;
    stagger?: number;
    start?: string;
    end?: string;
  }
): ScrollAnimationConfig {
  const duration = Math.min(options?.duration ?? 0.6, 2);
  const stagger = Math.min(options?.stagger ?? 0.15, 2);

  return {
    trigger,
    start: options?.start ?? 'top 80%',
    end: options?.end ?? 'bottom 20%',
    animation: {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power2.out',
    },
    reducedMotionFallback: {
      opacity: 1,
      y: 0,
      duration: 0,
      stagger: 0,
    },
  };
}

/**
 * Parallax preset: element moves at a slower rate relative to scroll (scrub-based).
 * Default duration: 1s. Scrub is enabled by default for scroll-linked movement.
 */
export function parallax(
  trigger: string | HTMLElement,
  options?: {
    duration?: number;
    speed?: number;
    start?: string;
    end?: string;
    scrub?: boolean | number;
  }
): ScrollAnimationConfig {
  const duration = Math.min(options?.duration ?? 1, 2);
  const speed = options?.speed ?? 0.5;
  // Parallax offset: how far the element travels relative to scroll
  const yOffset = 100 * speed;

  return {
    trigger,
    start: options?.start ?? 'top bottom',
    end: options?.end ?? 'bottom top',
    scrub: options?.scrub ?? true,
    animation: {
      y: -yOffset,
      duration,
      ease: 'none',
    },
    reducedMotionFallback: {
      y: 0,
      duration: 0,
    },
  };
}

/**
 * All presets as a collection for iteration/testing.
 */
export const allPresets = { fadeIn, slideUp, staggerChildren, parallax } as const;
