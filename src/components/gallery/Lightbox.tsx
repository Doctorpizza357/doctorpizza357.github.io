import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { GalleryItem } from '../../data/blenderGallery';
import styles from './Lightbox.module.css';

/**
 * Lightbox — accessible modal for viewing renders with prev/next navigation.
 *
 * Exports the pure index-navigation helpers that back the lightbox's prev/next
 * controls (Req 12.8) plus the full accessible component (focus trap, scroll
 * lock, video controls, load-failure handling).
 */

export interface LightboxProps {
  /** All gallery items available for navigation. */
  items: GalleryItem[];
  /** Index of the currently displayed item. */
  index: number;
  /** Called with the new index when navigating prev/next. */
  onNavigate: (nextIndex: number) => void;
  /** Called to close the lightbox. */
  onClose: () => void;
}

/**
 * Compute the index reached by activating "next".
 *
 * Moves forward one position, clamped to the last item so the result is always
 * in-bounds: `min(i + 1, n - 1)` (Req 12.8, Property 6).
 *
 * @param currentIndex the current in-bounds index in [0, length - 1]
 * @param length the number of items (n ≥ 1)
 * @returns the next in-bounds index
 */
export function nextIndex(currentIndex: number, length: number): number {
  return Math.min(currentIndex + 1, length - 1);
}

/**
 * Compute the index reached by activating "previous".
 *
 * Moves back one position, clamped to the first item so the result is always
 * in-bounds: `max(i - 1, 0)` (Req 12.8, Property 6).
 *
 * @param currentIndex the current in-bounds index in [0, length - 1]
 * @returns the previous in-bounds index
 */
export function prevIndex(currentIndex: number): number {
  return Math.max(currentIndex - 1, 0);
}

/**
 * Whether the current item is the first in gallery order.
 *
 * When true, the "previous" control is disabled (Req 12.8, Property 6).
 *
 * @param currentIndex the current index
 * @returns true iff `currentIndex === 0`
 */
export function isFirst(currentIndex: number): boolean {
  return currentIndex === 0;
}

/**
 * Whether the current item is the last in gallery order.
 *
 * When true, the "next" control is disabled (Req 12.8, Property 6).
 *
 * @param currentIndex the current index
 * @param length the number of items (n ≥ 1)
 * @returns true iff `currentIndex === length - 1`
 */
export function isLast(currentIndex: number, length: number): boolean {
  return currentIndex === length - 1;
}

/** Load timeout after which a still-loading render is treated as failed (Req 12.9). */
const LOAD_TIMEOUT_MS = 10_000;

/**
 * Derive the producing-software caption for a render item.
 *
 * The current gallery data has no dedicated software field, so the caption
 * defaults to "Blender" (Req 12.2).
 */
function captionSoftware(_item: GalleryItem): string {
  return 'Blender';
}

/**
 * Lightbox — accessible full-resolution render viewer (Req 12).
 *
 * Opens on render-item activation showing the full-resolution source; renders
 * `<video controls>` for video items (Req 12.1). Displays the Render_Caption
 * with producing software (Req 12.2). Closes on Escape, the close control, and
 * backdrop click (Req 12.3, 12.4). Locks page scroll while open and restores
 * the scroll position on close, returning focus to the triggering render item
 * (Req 12.5, 12.6). Traps focus with Tab/Shift+Tab wrap (Req 12.7) and provides
 * prev/next controls that swap item + caption and disable at boundaries via the
 * pure helpers above (Req 12.8). On load failure or a 10s timeout it keeps the
 * lightbox open, shows a "could not load" message, and retains the current
 * index (Req 12.9).
 *
 * @param triggerRef optional ref to the element that opened the lightbox; focus
 *   returns to it on close (Req 12.6).
 */
function Lightbox({
  items,
  index,
  onNavigate,
  onClose,
  triggerRef,
}: LightboxProps & { triggerRef?: React.RefObject<HTMLElement | null> }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [hasError, setHasError] = useState(false);

  const item = items[index];
  const atFirst = isFirst(index);
  const atLast = isLast(index, items.length);

  const goPrev = useCallback(() => {
    if (!isFirst(index)) onNavigate(prevIndex(index));
  }, [index, onNavigate]);

  const goNext = useCallback(() => {
    if (!isLast(index, items.length)) onNavigate(nextIndex(index, items.length));
  }, [index, items.length, onNavigate]);

  // Reset error state whenever the displayed item changes (Req 12.9 retains index).
  useEffect(() => {
    setHasError(false);
  }, [index]);

  // Load timeout: if the current item has not loaded within 10s, show the error
  // state while keeping the lightbox open and the current index (Req 12.9).
  useEffect(() => {
    if (hasError) return;
    const timer = window.setTimeout(() => setHasError(true), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [index, hasError]);

  // Lock page scroll while open and restore scroll position on close (Req 12.5),
  // and return focus to the triggering render item on unmount (Req 12.6).
  useEffect(() => {
    const scrollY = window.scrollY;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.scrollTo(0, scrollY);
      triggerRef?.current?.focus();
    };
  }, [triggerRef]);

  // Move initial focus into the lightbox.
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Keyboard handling: Escape closes (Req 12.3); Arrow keys navigate (Req 12.8);
  // Tab/Shift+Tab wrap focus within the lightbox controls (Req 12.7).
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
        return;
      }

      if (e.key === 'Tab') {
        const container = contentRef.current;
        if (!container) return;
        const focusable = Array.from(
          container.querySelectorAll<HTMLElement>(
            'button:not(:disabled), [href], video[controls], [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;

        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goPrev, goNext, onClose]);

  if (!item) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Render viewer: ${item.title}`}
    >
      <button
        ref={closeButtonRef}
        type="button"
        className={styles.close}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close render viewer"
      >
        &times;
      </button>

      <button
        type="button"
        className={`${styles.nav} ${styles.prev}`}
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        disabled={atFirst}
        aria-label="Previous render"
      >
        &#8249;
      </button>

      <button
        type="button"
        className={`${styles.nav} ${styles.next}`}
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        disabled={atLast}
        aria-label="Next render"
      >
        &#8250;
      </button>

      <div
        ref={contentRef}
        className={styles.content}
        onClick={(e) => e.stopPropagation()}
      >
        {hasError ? (
          <div className={styles.error} role="alert">
            This render could not be loaded.
          </div>
        ) : item.type === 'video' ? (
          <video
            key={item.id}
            className={styles.media}
            src={item.src}
            controls
            autoPlay
            playsInline
            aria-label={item.alt}
            onLoadedData={() => setHasError(false)}
            onError={() => setHasError(true)}
          />
        ) : (
          <img
            key={item.id}
            className={styles.media}
            src={item.src}
            alt={item.alt}
            onLoad={() => setHasError(false)}
            onError={() => setHasError(true)}
          />
        )}

        <p className={styles.caption}>
          {item.title}
          <span className={styles.captionSoftware}>{captionSoftware(item)}</span>
        </p>
      </div>
    </div>,
    document.body
  );
}

export default Lightbox;
