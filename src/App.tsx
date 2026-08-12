import { useCallback, useMemo, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AnimationProvider } from '@/animation/AnimationProvider';
import Layout from '@/components/Layout/Layout';
import HeroSection from '@/components/sections/HeroSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import BlenderGallery from '@/components/gallery/BlenderGallery';
import ContactSection from '@/components/sections/ContactSection';
import { EasterEggToast } from '@/components/ui/EasterEggToast';
import CustomCursor from '@/components/ui/CustomCursor';
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
  { id: 'gallery', label: 'Renders' },
  { id: 'contact', label: 'Contact' },
];

function App() {
  const sectionIds = useMemo(() => ALL_SECTIONS.map((s) => s.id), []);
  const activeSection = useActiveSection(sectionIds);
  const [projectsResetSignal, setProjectsResetSignal] = useState(0);

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
          <ProjectsSection resetSignal={projectsResetSignal} />
          <BlenderGallery />
          <ContactSection />
        </Layout>
        <CustomCursor />
        <EasterEggToast
          visible={easterEggTriggered}
          onDismiss={dismissEasterEgg}
        />
      </AnimationProvider>
    </HashRouter>
  );
}

export default App;
