import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './CustomCursor.module.css';

/**
 * Selectors for elements that trigger the "hover" cursor expansion.
 * Covers buttons, links, and card-like interactive elements.
 */
const HOVER_SELECTORS = [
  'a',
  'button',
  '[role="button"]',
  '[data-cursor="hover"]',
].join(',');

/**
 * Selectors for text input elements that trigger the "text" cursor morph.
 */
const TEXT_SELECTORS = ['input[type="text"]', 'textarea', '[contenteditable]'].join(',');

/**
 * Magnetic pull radius (px) — how close the cursor needs to be to an
 * interactive element before the magnetic snap effect kicks in.
 */
const MAGNETIC_RADIUS = 80;

/**
 * Magnetic pull strength (0–1). Higher = cursor snaps harder toward the element center.
 */
const MAGNETIC_STRENGTH = 0.3;

interface CursorState {
  hover: boolean;
  active: boolean;
  text: boolean;
}

/**
 * CustomCursor — A smooth custom cursor with magnetic hover effects.
 *
 * Features:
 * - Smooth position interpolation (lerp) for the outer ring
 * - Instant position for the inner dot
 * - Expands on interactive elements (links, buttons, cards)
 * - Magnetic pull toward nearby interactive elements
 * - Text-input morph (vertical bar)
 * - Squeeze effect on click
 * - Hidden on touch devices and reduced-motion preference
 * - Does not interfere with accessibility (pointer-events: none)
 */
function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>({
    hover: false,
    active: false,
    text: false,
  });

  // Position refs for RAF-based updates (no re-renders)
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);

  /**
   * Finds the closest interactive element within MAGNETIC_RADIUS and returns
   * its center point + distance, or null if nothing is close enough.
   */
  const findMagneticTarget = useCallback((x: number, y: number): { cx: number; cy: number; dist: number } | null => {
    const elements = document.querySelectorAll(HOVER_SELECTORS);
    let closest: { cx: number; cy: number; dist: number } | null = null;

    for (const el of elements) {
      const rect = (el as HTMLElement).getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(x - cx, y - cy);

      if (dist < MAGNETIC_RADIUS && (!closest || dist < closest.dist)) {
        closest = { cx, cy, dist };
      }
    }

    return closest;
  }, []);

  // Animation loop — lerps the ring toward the mouse (or magnetic target)
  const animate = useCallback(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;

    if (ring && dot) {
      const { x: mx, y: my } = mousePos.current;

      // Check for magnetic target
      const target = findMagneticTarget(mx, my);
      let targetX = mx;
      let targetY = my;

      if (target) {
        // Pull cursor toward element center based on proximity
        const pull = (1 - target.dist / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH;
        targetX = mx + (target.cx - mx) * pull;
        targetY = my + (target.cy - my) * pull;
      }

      // Lerp the ring position (smooth trailing)
      ringPos.current.x += (targetX - ringPos.current.x) * 0.15;
      ringPos.current.y += (targetY - ringPos.current.y) * 0.15;

      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [findMagneticTarget]);

  useEffect(() => {
    // Don't render cursor on touch devices
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReduced) return;

    // Hide default cursor globally
    document.documentElement.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);

    const handleMouseDown = () => setCursorState((s) => ({ ...s, active: true }));
    const handleMouseUp = () => setCursorState((s) => ({ ...s, active: false }));

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(HOVER_SELECTORS)) {
        setCursorState((s) => ({ ...s, hover: true }));
      } else if (target.closest(TEXT_SELECTORS)) {
        setCursorState((s) => ({ ...s, text: true }));
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(HOVER_SELECTORS)) {
        setCursorState((s) => ({ ...s, hover: false }));
      } else if (target.closest(TEXT_SELECTORS)) {
        setCursorState((s) => ({ ...s, text: false }));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Start animation loop
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animate, visible]);

  // Build class names
  const ringClasses = [
    styles.cursor,
    visible && styles.cursorVisible,
    cursorState.hover && styles.cursorHover,
    cursorState.active && styles.cursorActive,
    cursorState.text && styles.cursorText,
  ]
    .filter(Boolean)
    .join(' ');

  const dotClasses = [styles.cursorDot, visible && styles.cursorDotVisible]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div ref={ringRef} className={ringClasses} aria-hidden="true" />
      <div ref={dotRef} className={dotClasses} aria-hidden="true" />
    </>
  );
}

export default CustomCursor;
