import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollAnimationConfig {
  trigger: string | HTMLElement;
  start?: string;        // default: "top 80%"
  end?: string;          // default: "bottom 20%"
  scrub?: boolean | number;
  animation: gsap.TweenVars;
  reducedMotionFallback?: gsap.TweenVars; // instant state with duration: 0
}

export function useScrollAnimation(
  config: ScrollAnimationConfig,
  scope?: React.RefObject<HTMLElement | null>
) {
  const isReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const scopeRef = scope ?? containerRef;

  useGSAP(
    () => {
      const {
        trigger,
        start = 'top 80%',
        end = 'bottom 20%',
        scrub,
        animation,
        reducedMotionFallback,
      } = config;

      if (isReducedMotion) {
        // Preserve final visual state with instant application (duration 0)
        const fallback = reducedMotionFallback ?? { ...animation, duration: 0 };
        gsap.set(trigger, fallback);
        return;
      }

      gsap.to(trigger, {
        ...animation,
        scrollTrigger: {
          trigger,
          start,
          end,
          scrub: scrub ?? false,
        },
      });
    },
    { scope: scopeRef, dependencies: [isReducedMotion, config] }
  );

  return { containerRef, isReducedMotion };
}
