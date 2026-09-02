import { type FC, useCallback, useLayoutEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scrollToSection } from '@/utils/scrollToSection';
import styles from './TopNavbar.module.css';

export interface NavLinkMeta {
  /** DOM id to scroll to, or 'resume' for the external PDF link. */
  target: string;
  label: string;
  /** True for the resume link, which opens the PDF in a new tab. */
  external?: boolean;
}

export interface TopNavbarProps {
  /** Ordered nav links: Projects, Renders, About, Resume, Contact. */
  links: NavLinkMeta[];
  /** Active section id from useActiveSection. */
  activeSection: string;
  /** Wordmark text, e.g. "Tomas Bentolila". */
  wordmark: string;
  /** Path to the resume PDF asset. */
  resumeHref: string;
}

/** DOM id the wordmark scrolls to (Req 1.6). */
const HERO_ID = 'hero';

/**
 * TopNavbar — sticky glassmorphism navigation bar.
 *
 * Replaces the left floating dot navigation (Req 1.1). Renders a sticky
 * `<header>` containing a `<nav aria-label="Primary">` with the wordmark at the
 * left and the primary nav links right-aligned in order (Req 1.2–1.4).
 *
 * The bar reports its own rendered height into the `--navbar-height` CSS
 * variable via a `ResizeObserver` so `scrollToSection` and `scroll-margin-top`
 * use the current offset (Req 1.5). Section scroll requests are dispatched
 * through `scrollToSection`, which chooses smooth vs instant behavior based on
 * reduced motion and safely no-ops for missing targets (Req 1.7, 1.8).
 *
 * The Resume link opens the PDF in a new tab with a visually-hidden
 * "(opens in new tab)" indication (Req 1.9, 2.6). Exactly one link carries the
 * active class, derived from `activeSection` (Req 1.11).
 */
const TopNavbar: FC<TopNavbarProps> = ({ links, activeSection, wordmark, resumeHref }) => {
  const reducedMotion = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);

  /** Reads the current navbar height (px) for use as the scroll offset. */
  const getOffset = useCallback((): number => {
    return headerRef.current?.getBoundingClientRect().height ?? 0;
  }, []);

  // Report the rendered height into --navbar-height so the scroll offset and
  // scroll-margin-top fallback stay in sync with the actual bar height (Req 1.5).
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const header = headerRef.current;
    if (!header) return;

    const writeHeight = () => {
      const height = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--navbar-height', `${height}px`);
    };

    writeHeight();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(writeHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const handleNavigate = useCallback(
    (target: string) => {
      scrollToSection(target, { offset: getOffset(), reducedMotion });
    },
    [getOffset, reducedMotion]
  );

  const handleWordmark = useCallback(() => {
    scrollToSection(HERO_ID, { offset: getOffset(), reducedMotion });
  }, [getOffset, reducedMotion]);

  return (
    <header ref={headerRef} className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
        <button type="button" className={styles.wordmark} onClick={handleWordmark}>
          {wordmark}
        </button>

        <ul className={styles.linkList} role="list">
          {links.map((link) => {
            if (link.external) {
              return (
                <li key={link.target} className={styles.linkItem}>
                  <a
                    className={styles.link}
                    href={resumeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                    <span className={styles.visuallyHidden}> (opens in new tab)</span>
                  </a>
                </li>
              );
            }

            const isActive = activeSection === link.target;
            return (
              <li key={link.target} className={styles.linkItem}>
                <button
                  type="button"
                  className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => handleNavigate(link.target)}
                >
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default TopNavbar;
