import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Syncs the URL hash with the current page state.
 *
 * URL patterns:
 *   #hero           — Hero section
 *   #projects       — Projects landing page
 *   #projects/rc-vehicle — Case study for a specific project
 *   #gallery        — Blender gallery
 *   #contact        — Contact section
 *
 * On page load, parses the hash to determine initial state.
 * While scrolling, updates the hash to reflect the active section.
 * Does NOT trigger scrolling when updating the hash (prevents loops).
 */

interface HashNavState {
  /** The initial section to scroll to on mount */
  initialSection: string | null;
  /** If the URL targets a specific project case study */
  initialProjectId: string | null;
}

/**
 * Parse the current hash into section + optional project ID.
 */
function parseHash(): HashNavState {
  const raw = window.location.hash.replace(/^#\/?/, '');
  if (!raw) return { initialSection: null, initialProjectId: null };

  const parts = raw.split('/');
  const section = parts[0] || null;
  const projectId = parts.length > 1 ? parts[1] : null;

  return { initialSection: section, initialProjectId: projectId };
}

export function useHashNavigation(activeSection: string) {
  const [initialState] = useState<HashNavState>(() => parseHash());
  const isUpdatingHash = useRef(false);
  const lastHash = useRef('');
  const activeProjectId = useRef<string | null>(null);

  // Update hash when active section changes (from scrolling)
  useEffect(() => {
    // Don't update during initial navigation or programmatic changes
    if (isUpdatingHash.current) return;

    // If we're in a project case study and section is still "projects", keep the project hash
    if (activeSection === 'projects' && activeProjectId.current) {
      const projectHash = `projects/${activeProjectId.current}`;
      if (projectHash !== lastHash.current) {
        lastHash.current = projectHash;
        window.history.replaceState(null, '', `#${projectHash}`);
      }
      return;
    }

    const newHash = activeSection === 'hero' ? '' : activeSection;
    if (newHash === lastHash.current) return;

    lastHash.current = newHash;
    // Use replaceState to avoid polluting browser history on every scroll
    const url = newHash ? `#${newHash}` : window.location.pathname + window.location.search;
    window.history.replaceState(null, '', url);
  }, [activeSection]);

  /**
   * Set hash for a specific project (deep link).
   * Called when entering a case study view.
   */
  const setProjectHash = useCallback((projectId: string) => {
    activeProjectId.current = projectId;
    const hash = `#projects/${projectId}`;
    lastHash.current = `projects/${projectId}`;
    window.history.pushState(null, '', hash);
  }, []);

  /**
   * Clear project hash (back to section level).
   * Called when leaving a case study view.
   */
  const clearProjectHash = useCallback(() => {
    activeProjectId.current = null;
    lastHash.current = 'projects';
    window.history.pushState(null, '', '#projects');
  }, []);

  /**
   * Mark that we're about to do initial navigation (prevents hash update loop).
   */
  const markInitialNavDone = useCallback(() => {
    isUpdatingHash.current = false;
  }, []);

  // Suppress hash updates during initial mount navigation
  useEffect(() => {
    if (initialState.initialSection) {
      isUpdatingHash.current = true;
      // Allow hash updates after a short delay (initial scroll settles)
      const timer = setTimeout(() => {
        isUpdatingHash.current = false;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    initialSection: initialState.initialSection,
    initialProjectId: initialState.initialProjectId,
    setProjectHash,
    clearProjectHash,
    markInitialNavDone,
  };
}
