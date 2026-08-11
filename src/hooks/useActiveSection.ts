import { useState, useEffect } from 'react';

/**
 * Detects which section is currently active based on viewport visibility.
 * Uses Intersection Observer with a low threshold and tracks which section
 * is most visible. Works for sections of all sizes — tall sections that
 * never reach 50% visibility still get detected.
 */
export function useActiveSection(sectionIds: string[]): string {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Track visibility ratios for each section
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }

        // Find the section with the highest visibility
        let maxRatio = 0;
        let maxId = sectionIds[0];
        for (const [id, ratio] of ratios) {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            maxId = id;
          }
        }

        if (maxRatio > 0) {
          setActiveSection(maxId);
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeSection;
}
