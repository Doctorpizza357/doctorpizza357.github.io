import { useRef, useState, useEffect } from 'react';

interface UseLazyLoadOptions {
  /** Distance from viewport to start loading. Default: '200px' */
  rootMargin?: string;
  /** Visibility threshold to trigger load (0–1). Default: 0 */
  threshold?: number;
  /** If true, content is shown immediately (e.g., for above-fold elements). Default: false */
  disabled?: boolean;
}

interface UseLazyLoadResult<T extends HTMLElement> {
  /** Ref to attach to the container element you want to observe */
  ref: React.RefObject<T | null>;
  /** Whether the element has entered (or is near) the viewport */
  isVisible: boolean;
}

/**
 * Programmatic lazy loading hook using Intersection Observer.
 *
 * Returns a ref to attach to a DOM element and an `isVisible` flag that becomes
 * true once the element is within `rootMargin` of the viewport. Once triggered,
 * visibility is permanent (no unloading on scroll away).
 *
 * Falls back to showing content immediately if IntersectionObserver is unavailable
 * (e.g., older browsers or SSR environments).
 *
 * Usage:
 * ```tsx
 * const { ref, isVisible } = useLazyLoad<HTMLDivElement>();
 * return (
 *   <div ref={ref}>
 *     {isVisible && <img src={heavyImage} alt="..." />}
 *   </div>
 * );
 * ```
 */
export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  options: UseLazyLoadOptions = {}
): UseLazyLoadResult<T> {
  const { rootMargin = '200px', threshold = 0, disabled = false } = options;
  const ref = useRef<T | null>(null);

  // If disabled or IntersectionObserver is not available, show immediately
  const shouldShowImmediately =
    disabled ||
    typeof window === 'undefined' ||
    typeof IntersectionObserver === 'undefined';

  const [isVisible, setIsVisible] = useState(shouldShowImmediately);

  useEffect(() => {
    // If already visible or should show immediately, nothing to observe
    if (isVisible || shouldShowImmediately) {
      if (!isVisible) setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, isVisible, shouldShowImmediately]);

  return { ref, isVisible };
}
