import { useState, useEffect, useCallback, useRef } from 'react';

const TRIGGER_SEQUENCE = 'pizza';

export interface UseEasterEggResult {
  isTriggered: boolean;
  dismiss: () => void;
}

/**
 * Detects a secret key sequence ("pizza") typed anywhere on the page.
 * When triggered, sets `isTriggered` to true within 1 second.
 * The easter egg can be dismissed via `dismiss()` without page reload.
 *
 * Accessibility guarantees:
 * - Does not alter tab order or obstruct focusable elements
 * - Does not remove content from the accessibility tree
 * - Respects reduced motion (consumers should use static visuals only)
 * - Does not prevent scrolling, navigation, or section access
 */
export function useEasterEgg(): UseEasterEggResult {
  const [isTriggered, setIsTriggered] = useState(false);
  const bufferRef = useRef('');

  const dismiss = useCallback(() => {
    setIsTriggered(false);
  }, []);

  useEffect(() => {
    if (isTriggered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only track single printable characters, ignore modifier combos
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1) return;

      bufferRef.current += e.key.toLowerCase();

      // Keep buffer trimmed to only what's needed
      if (bufferRef.current.length > TRIGGER_SEQUENCE.length) {
        bufferRef.current = bufferRef.current.slice(-TRIGGER_SEQUENCE.length);
      }

      if (bufferRef.current === TRIGGER_SEQUENCE) {
        setIsTriggered(true);
        bufferRef.current = '';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isTriggered]);

  // Dismiss on Escape or click anywhere
  useEffect(() => {
    if (!isTriggered) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss();
      }
    };

    const handleClick = () => {
      dismiss();
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClick);
    };
  }, [isTriggered, dismiss]);

  return { isTriggered, dismiss };
}
