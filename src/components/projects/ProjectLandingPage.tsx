import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ProjectLandingPage.module.css';
import CategoryFilter from './CategoryFilter';
import ProjectCard from './ProjectCard';
import type { ProjectData, ProjectCategory } from '../../data/projectTypes';
import { filterProjects, sortByDisplayOrder } from '../../data/projectTypes';

interface ProjectLandingPageProps {
  projects: ProjectData[];
  onProjectSelect: (projectId: string) => void;
}

/** UI filter categories exposed in the Category_Filter toolbar */
const FILTER_CATEGORIES: ProjectCategory[] = [
  'ALL',
  'MECHANICAL',
  'ROBOTICS',
  'SOFTWARE',
  'SYSTEMS',
];

/**
 * ProjectLandingPage renders the editorial project grid with category filtering.
 *
 * Layout: flagship card first at ≥50% width (spans 2 cols), standard cards fill
 * remaining space. Grid is multi-column ≥768px, single column <768px.
 *
 * Card images are lazy-loaded via IntersectionObserver with 1 viewport rootMargin.
 * Filter changes animate cards in/out with opacity + transform (≤400ms via
 * --duration-normal). Reduced-motion is handled by tokens.css setting durations to 0ms.
 */
function ProjectLandingPage({ projects, onProjectSelect }: ProjectLandingPageProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('ALL');
  const [visibleProjects, setVisibleProjects] = useState<ProjectData[]>(() =>
    sortByDisplayOrder(projects)
  );
  const [animationState, setAnimationState] = useState<'idle' | 'leaving' | 'entering'>('idle');
  const gridRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Compute filtered + sorted projects for current filter
  const getFilteredProjects = useCallback(
    (filter: ProjectCategory) => sortByDisplayOrder(filterProjects(projects, filter)),
    [projects]
  );

  // Handle filter changes with enter/leave animation
  useEffect(() => {
    const filtered = getFilteredProjects(activeFilter);

    // If nothing changed, skip animation
    if (
      filtered.length === visibleProjects.length &&
      filtered.every((p, i) => p.id === visibleProjects[i]?.id)
    ) {
      return;
    }

    // Phase 1: leave animation
    setAnimationState('leaving');

    const leaveTimeout = setTimeout(() => {
      // Phase 2: swap data + enter animation
      setVisibleProjects(filtered);
      setAnimationState('entering');

      const enterTimeout = setTimeout(() => {
        setAnimationState('idle');
      }, 50); // Small delay to allow CSS transition to trigger

      return () => clearTimeout(enterTimeout);
    }, 300); // Leave duration < --duration-normal to feel snappy

    return () => clearTimeout(leaveTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, getFilteredProjects]);

  // IntersectionObserver for lazy-loading card images (1 viewport rootMargin)
  // Falls back to eager loading if IntersectionObserver is unavailable.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create observer with 1 viewport (100%) rootMargin
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLElement;
            const lazySrc = img.dataset.src;
            if (lazySrc && img instanceof HTMLImageElement) {
              img.src = lazySrc;
              img.removeAttribute('data-src');
            }
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100%' }
    );

    // Observe all lazy images in the grid
    if (gridRef.current) {
      const lazyImages = gridRef.current.querySelectorAll('img[data-src]');
      lazyImages.forEach((img) => observerRef.current?.observe(img));
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [visibleProjects]);

  // Determine card wrapper class based on animation state
  function getCardWrapperClass(): string {
    switch (animationState) {
      case 'leaving':
        return `${styles.cardWrapper} ${styles.cardLeave}`;
      case 'entering':
        return `${styles.cardWrapper} ${styles.cardEnter}`;
      default:
        return styles.cardWrapper;
    }
  }

  const resultCount = getFilteredProjects(activeFilter).length;

  return (
    <div className={styles.landingPage}>
      <CategoryFilter
        categories={FILTER_CATEGORIES}
        activeCategory={activeFilter}
        onCategoryChange={setActiveFilter}
        resultCount={resultCount}
      />

      <div className={styles.projectGrid} ref={gridRef} role="list">
        {visibleProjects.map((project, index) => (
          <div
            key={project.id}
            className={getCardWrapperClass()}
            role="listitem"
          >
            <ProjectCard
              project={project}
              index={index}
              tier={project.visualTier}
              onClick={() => onProjectSelect(project.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectLandingPage;
export type { ProjectLandingPageProps };
