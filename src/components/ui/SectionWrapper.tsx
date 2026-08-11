import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
}

function SectionWrapper({ children, id }: SectionWrapperProps) {
  const container = useRef<HTMLElement>(null);
  const isReduced = useReducedMotion();

  useGSAP(() => {
    if (isReduced) return;

    const el = container.current;
    if (!el) return;

    // Skip animation for the hero section (already visible on load)
    if (id === 'hero') return;

    // Simple section fade + slide on scroll
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 40%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: container, dependencies: [isReduced] });

  return (
    <section ref={container} id={id}>
      {children}
    </section>
  );
}

export default SectionWrapper;
