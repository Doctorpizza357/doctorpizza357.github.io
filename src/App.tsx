import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AnimationProvider } from '@/animation/AnimationProvider';
import Layout from '@/components/Layout/Layout';
import HeroSection from '@/components/sections/HeroSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import BlenderGallery from '@/components/gallery/BlenderGallery';
import ContactSection from '@/components/sections/ContactSection';
import { EasterEggToast } from '@/components/ui/EasterEggToast';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useHashNavigation } from '@/hooks/useHashNavigation';
import { useEasterEgg } from '@/hooks/useEasterEgg';
import type { SectionMeta } from '@/components/Navigation/NavigationSystem';

// Register GSAP plugins at module level
gsap.registerPlugin(ScrollTrigger);

/**
 * Streamlined: Hero -> Projects -> Contact
 * Projects are the story. Let the work speak.
 *
 * URL hash sync:
 *   #hero, #projects, #projects/rc-vehicle, #gallery, #contact
 */
const ALL_SECTIONS: SectionMeta[] = [
  { id: 'hero', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'gallery', label: 'Renders' },
  { id: 'contact', label: 'Contact' },
];

function App() {
  const sectionIds = useMemo(() => ALL_SECTIONS.map((s) => s.id), []);
  const activeSection = useActiveSection(sectionIds);
  const [projectsResetSignal, setProjectsResetSignal] = useState(0);
  const initialNavDone = useRef(false);

  const { initialSection, initialProjectId, setProjectHash, clearProjectHash } =
    useHashNavigation(activeSection);

  const { isTriggered: easterEggTriggered, dismiss: dismissEasterEgg } =
    useEasterEgg();

  const handleNavigate = useCallback((sectionId: string) => {
    if (sectionId === 'projects') {
      setProjectsResetSignal((prev) => prev + 1);
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Handle initial navigation from URL hash on mount
  useEffect(() => {
    if (initialNavDone.current) return;
    initialNavDone.current = true;

    if (!initialSection) return;

    // Wait for DOM to be ready, then scroll and set project hash if needed
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(initialSection);
        if (el) {
          el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
        }
        // If there's a project to open, set its hash tracker
        if (initialProjectId) {
          setProjectHash(initialProjectId);
        }
      }, 200);
    });
  }, [initialSection, initialProjectId, setProjectHash]);

  return (
    <AnimationProvider>
      <Layout
        sections={ALL_SECTIONS}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      >
        <HeroSection
          name="Tomas Bentolila"
          tagline="Mechanical Engineering · Penn State 2030"
        />
        <ProjectsSection
          resetSignal={projectsResetSignal}
          initialProjectId={initialProjectId}
          onProjectView={setProjectHash}
          onProjectClose={clearProjectHash}
        />
        <BlenderGallery />
        <ContactSection />
      </Layout>
      <EasterEggToast
        visible={easterEggTriggered}
        onDismiss={dismissEasterEgg}
      />
    </AnimationProvider>
  );
}

export default App;
