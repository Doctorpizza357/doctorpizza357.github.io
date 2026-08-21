import { useState, useCallback, useRef, useEffect } from 'react';
import { projects } from '../../data/projectsNew';
import ProjectLandingPage from '../projects/ProjectLandingPage';
import CaseStudyViewNew from '../projects/CaseStudyViewNew';
import ProjectModal from '../projects/ProjectModal';
import SectionWrapper from '../ui/SectionWrapper';
import {
  CaseStudyBoundary,
  LandingPageBoundary,
} from '../projects/ProjectErrorBoundary';

type ProjectViewState =
  | { view: 'landing' }
  | { view: 'case-study'; projectId: string; returnScrollY: number };

interface ProjectsSectionProps {
  resetSignal?: number;
  initialProjectId?: string | null;
  onProjectView?: (projectId: string) => void;
  onProjectClose?: () => void;
}

function ProjectsSection({ resetSignal = 0, initialProjectId, onProjectView, onProjectClose }: ProjectsSectionProps) {
  const [viewState, setViewState] = useState<ProjectViewState>({ view: 'landing' });
  const [modalProjectId, setModalProjectId] = useState<string | null>(null);

  const triggeringCardRef = useRef<HTMLElement | null>(null);
  const caseStudyHeadingRef = useRef<HTMLHeadingElement>(null!);
  const isReturningToLanding = useRef(false);
  const prevResetSignal = useRef(resetSignal);

  // Handle initial deep-link to a project case study (runs once on mount)
  useEffect(() => {
    if (initialProjectId && projects.find((p) => p.id === initialProjectId)) {
      // Small delay to ensure this runs after any reset effects
      setTimeout(() => {
        setViewState({ view: 'case-study', projectId: initialProjectId, returnScrollY: 0 });
      }, 50);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Card click → open modal (no scroll change)
  const handleProjectSelect = useCallback((projectId: string) => {
    triggeringCardRef.current = document.activeElement as HTMLElement | null;
    setModalProjectId(projectId);
  }, []);

  // Modal "Learn More" -> navigate to case study
  const handleLearnMore = useCallback(() => {
    if (!modalProjectId) return;
    const scrollY = window.scrollY;
    setModalProjectId(null);
    setViewState({ view: 'case-study', projectId: modalProjectId, returnScrollY: scrollY });
    onProjectView?.(modalProjectId);
    // Scroll to top of case study content with a small offset
    requestAnimationFrame(() => {
      const section = document.getElementById('projects');
      if (section) {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: sectionTop + 10, behavior: 'instant' as ScrollBehavior });
      }
    });
  }, [modalProjectId, onProjectView]);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setModalProjectId(null);
  }, []);

  // Back from case study -- restore position instantly
  const handleBack = useCallback(() => {
    if (viewState.view === 'case-study') {
      const { returnScrollY } = viewState;
      isReturningToLanding.current = true;
      setViewState({ view: 'landing' });
      onProjectClose?.();
      requestAnimationFrame(() => {
        window.scrollTo({ top: returnScrollY, behavior: 'instant' as ScrollBehavior });
      });
    }
  }, [viewState, onProjectClose]);

  // Focus management
  useEffect(() => {
    if (viewState.view === 'case-study' && caseStudyHeadingRef.current) {
      requestAnimationFrame(() => {
        caseStudyHeadingRef.current?.focus();
      });
    }
  }, [viewState]);

  // Reset when navigating to projects via nav (resetSignal changes)
  useEffect(() => {
    // Only reset if the signal actually changed (not on initial mount)
    if (resetSignal !== prevResetSignal.current) {
      prevResetSignal.current = resetSignal;
      setViewState({ view: 'landing' });
      setModalProjectId(null);
      onProjectClose?.();
    }
  }, [resetSignal, onProjectClose]);

  useEffect(() => {
    if (viewState.view === 'landing' && isReturningToLanding.current) {
      isReturningToLanding.current = false;
      requestAnimationFrame(() => {
        if (triggeringCardRef.current && document.contains(triggeringCardRef.current)) {
          triggeringCardRef.current.focus();
        }
      });
    }
  }, [viewState]);

  const modalProject = modalProjectId
    ? projects.find((p) => p.id === modalProjectId) ?? null
    : null;

  return (
    <SectionWrapper id="projects">
      {viewState.view === 'landing' ? (
        <>
          <h2
            tabIndex={-1}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-section-title)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              margin: '0 0 2rem',
              maxWidth: 'var(--content-max-width)',
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: '0 var(--content-padding)',
              outline: 'none',
            }}
          >
            Projects
          </h2>
          <LandingPageBoundary
            projects={projects}
            onProjectSelect={handleProjectSelect}
          >
            <ProjectLandingPage
              projects={projects}
              onProjectSelect={handleProjectSelect}
            />
          </LandingPageBoundary>
        </>
      ) : (
        <CaseStudyBoundary onBack={handleBack}>
          <CaseStudyViewNew
            project={projects.find((p) => p.id === viewState.projectId)!}
            onBack={handleBack}
            headingRef={caseStudyHeadingRef}
          />
        </CaseStudyBoundary>
      )}

      {/* Quick-view modal */}
      {modalProject && (
        <ProjectModal
          project={modalProject}
          onClose={handleCloseModal}
          onLearnMore={handleLearnMore}
        />
      )}
    </SectionWrapper>
  );
}

export default ProjectsSection;
export type { ProjectViewState };
