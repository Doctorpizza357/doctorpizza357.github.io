export interface ScrollToSectionOptions {
  /** Rendered height of the sticky navbar, used as top offset. */
  offset: number;
  /** When true, jump instantly instead of smooth scrolling. */
  reducedMotion: boolean;
}

/**
 * Computes the absolute scroll target (in document coordinates) so that the
 * element aligns to the top of the viewport minus `offset`.
 *
 * @param top - The element's bounding-rect top (viewport-relative).
 * @param scrollY - The current `window.scrollY`.
 * @param offset - The navbar height used as a top offset.
 * @returns `max(0, top + scrollY - offset)` — never negative.
 */
export function computeScrollTarget(top: number, scrollY: number, offset: number): number {
  return Math.max(0, top + scrollY - offset);
}

/**
 * Scrolls the viewport so the element with `id` aligns to the top of the
 * viewport minus `offset`. No-ops (no throw) when the element is absent.
 * Uses 'smooth' behavior unless reducedMotion is true, in which case 'auto'.
 *
 * Guards `typeof window` for test/SSR safety.
 */
export function scrollToSection(id: string, options: ScrollToSectionOptions): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const element = document.getElementById(id);
  if (!element) {
    // Missing target: take no action and throw no error (Req 1.8).
    return;
  }

  const top = element.getBoundingClientRect().top;
  const target = computeScrollTarget(top, window.scrollY, options.offset);
  const behavior: ScrollBehavior = options.reducedMotion ? 'auto' : 'smooth';

  window.scrollTo({ top: target, behavior });
}
