import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './EasterEggToast.module.css';

interface EasterEggToastProps {
  visible: boolean;
  onDismiss: () => void;
}

/**
 * A lightweight toast notification displayed when the easter egg is triggered.
 *
 * Accessibility:
 * - Uses role="status" with aria-live="polite" so screen readers announce it
 * - Does not alter tab order (no focusable elements inside)
 * - Does not obstruct any focusable elements (positioned in bottom-right corner)
 * - Does not remove content from the accessibility tree
 * - pointer-events: none on the container means it cannot block interaction with the page
 * - Respects reduced motion: no animations when prefers-reduced-motion is active
 */
export function EasterEggToast({ visible, onDismiss }: EasterEggToastProps) {
  const reducedMotion = useReducedMotion();

  if (!visible) return null;

  return (
    <div
      className={`${styles.toast} ${reducedMotion ? styles.noMotion : styles.withMotion}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      onClick={onDismiss}
    >
      <span className={styles.emoji} aria-hidden="true">🍕</span>
      <span className={styles.message}>You found the secret pizza!</span>
      <span className={styles.hint}>Click anywhere or press Esc to dismiss</span>
    </div>
  );
}
