import React, { createContext, useContext, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { ScrollAnimationConfig } from './useScrollAnimation';

gsap.registerPlugin(ScrollTrigger);

export interface AnimationContextValue {
  isReducedMotion: boolean;
  registerAnimation: (config: ScrollAnimationConfig) => void;
  contextSafe: (fn: () => void) => () => void;
}

const AnimationContext = createContext<AnimationContextValue | null>(null);

interface AnimationProviderProps {
  children: React.ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();

  const { contextSafe } = useGSAP(
    () => {
      // GSAP context is set up — ScrollTrigger cleanup is automatic via useGSAP
    },
    { scope: containerRef }
  );

  const registerAnimation = useCallback(
    (config: ScrollAnimationConfig) => {
      const { trigger, start = 'top 80%', end = 'bottom 20%', scrub, animation, reducedMotionFallback } = config;

      if (isReducedMotion) {
        // Apply instant state change (duration 0) preserving final visual state
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
    [isReducedMotion]
  );

  const wrappedContextSafe = useCallback(
    (fn: () => void): (() => void) => {
      return contextSafe(fn);
    },
    [contextSafe]
  );

  return (
    <AnimationContext.Provider
      value={{
        isReducedMotion,
        registerAnimation,
        contextSafe: wrappedContextSafe,
      }}
    >
      <div ref={containerRef}>{children}</div>
    </AnimationContext.Provider>
  );
}

export function useAnimationContext(): AnimationContextValue {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within an AnimationProvider');
  }
  return context;
}
