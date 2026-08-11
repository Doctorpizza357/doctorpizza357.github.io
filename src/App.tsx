import { useCallback, useMemo } from 'react';
import { HashRouter } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AnimationProvider } from '@/animation/AnimationProvider';
import Layout from '@/components/Layout/Layout';
import HeroSection from '@/components/sections/HeroSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import { EasterEggToast } from '@/components/ui/EasterEggToast';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useEasterEgg } from '@/hooks/useEasterEgg';
import type { SectionMeta } from '@/components/Navigation/NavigationSystem';

// Register GSAP plugins at module level
gsap.registerPlugin(ScrollTrigger);

/**
 * Streamlined: Hero → Projects → Contact
 * Projects are the story. Let the work speak.
 */
const ALL_SECTIONS: SectionMeta[] = [
  { id: 'hero', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

function App() {
  const sectionIds = useMemo(() => ALL_SECTIONS.map((s) => s.id), []);
  const activeSection = useActiveSection(sectionIds);

  const { isTriggered: easterEggTriggered, dismiss: dismissEasterEgg } =
    useEasterEgg();

  const handleNavigate = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <HashRouter>
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
          <ProjectsSection />
          <ContactSection />
        </Layout>
        <EasterEggToast
          visible={easterEggTriggered}
          onDismiss={dismissEasterEgg}
        />
      </AnimationProvider>
    </HashRouter>
  );
}

export default App;
