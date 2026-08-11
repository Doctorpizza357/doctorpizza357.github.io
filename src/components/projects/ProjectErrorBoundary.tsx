import { Component, type ReactNode, type ErrorInfo } from 'react';

/**
 * Props for the base ErrorBoundary class component.
 */
interface ErrorBoundaryProps {
  /** Fallback UI rendered when an error is caught */
  fallback: (error: Error, reset: () => void) => ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Base ErrorBoundary class component.
 *
 * React requires class components for error boundaries. This provides a
 * reusable base that catches errors from child components, logs them in
 * development, and delegates rendering to a fallback render function.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught error:', error);
      console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    }
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Specialized Error Boundary: ModelViewerBoundary
// ---------------------------------------------------------------------------

interface ModelViewerBoundaryProps {
  /** Optional fallback image URL to display when the 3D viewer crashes */
  fallbackImage?: string;
  /** Alt text for the fallback image */
  projectTitle?: string;
  children: ReactNode;
}

/**
 * ModelViewerBoundary — wraps ModelViewer.
 *
 * On error, renders the fallback image if provided, or a styled
 * "Model unavailable" placeholder.
 */
function ModelViewerBoundary({ fallbackImage, projectTitle, children }: ModelViewerBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={() => (
        <div style={modelFallbackStyles.container}>
          {fallbackImage ? (
            <img
              src={fallbackImage}
              alt={`${projectTitle ?? 'Project'} — static preview`}
              style={modelFallbackStyles.image}
            />
          ) : (
            <div style={modelFallbackStyles.placeholder}>
              <span aria-hidden="true" style={modelFallbackStyles.icon}>⚠</span>
              <span style={modelFallbackStyles.text}>Model unavailable</span>
            </div>
          )}
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

const modelFallbackStyles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    aspectRatio: '16 / 9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-secondary)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--color-text-secondary)',
  },
  icon: {
    fontSize: '2rem',
  },
  text: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-meta)',
  },
};

// ---------------------------------------------------------------------------
// Specialized Error Boundary: CaseStudyBoundary
// ---------------------------------------------------------------------------

interface CaseStudyBoundaryProps {
  /** Callback invoked when user clicks the "Back to Projects" button */
  onBack: () => void;
  children: ReactNode;
}

/**
 * CaseStudyBoundary — wraps CaseStudyViewNew.
 *
 * On error, renders an error message with a "Back to Projects" button
 * so the user can navigate away from the broken view.
 */
function CaseStudyBoundary({ onBack, children }: CaseStudyBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={() => (
        <div style={caseStudyFallbackStyles.container}>
          <div style={caseStudyFallbackStyles.content}>
            <span aria-hidden="true" style={caseStudyFallbackStyles.icon}>⚠</span>
            <h2 style={caseStudyFallbackStyles.heading}>Unable to load case study</h2>
            <p style={caseStudyFallbackStyles.message}>
              Something went wrong while rendering this project. Please try again.
            </p>
            <button
              type="button"
              onClick={onBack}
              style={caseStudyFallbackStyles.button}
            >
              ← Back to Projects
            </button>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

const caseStudyFallbackStyles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--content-padding)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1rem',
    textAlign: 'center' as const,
    maxWidth: '400px',
  },
  icon: {
    fontSize: '2.5rem',
  },
  heading: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-subsection)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  message: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-text-secondary)',
    margin: 0,
    lineHeight: 1.5,
  },
  button: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-accent)',
    backgroundColor: 'transparent',
    border: '1px solid var(--color-accent)',
    borderRadius: '6px',
    padding: '0.625rem 1.25rem',
    cursor: 'pointer',
    transition: 'background-color var(--duration-fast) var(--ease-out)',
    marginTop: '0.5rem',
    minHeight: '44px',
    minWidth: '44px',
  },
};

// ---------------------------------------------------------------------------
// Specialized Error Boundary: LandingPageBoundary
// ---------------------------------------------------------------------------

interface LandingPageBoundaryProps {
  /** List of projects to render as a simplified fallback list */
  projects: Array<{ id: string; title: string }>;
  /** Callback when a project is selected from the simplified list */
  onProjectSelect?: (projectId: string) => void;
  children: ReactNode;
}

/**
 * LandingPageBoundary — wraps ProjectLandingPage.
 *
 * On error, renders a simplified list of project titles so the user
 * can still navigate to individual case studies.
 */
function LandingPageBoundary({ projects, onProjectSelect, children }: LandingPageBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={() => (
        <div style={landingFallbackStyles.container}>
          <p style={landingFallbackStyles.message}>
            Something went wrong loading the project grid.
          </p>
          <ul style={landingFallbackStyles.list}>
            {projects.map((project) => (
              <li key={project.id} style={landingFallbackStyles.listItem}>
                {onProjectSelect ? (
                  <button
                    type="button"
                    onClick={() => onProjectSelect(project.id)}
                    style={landingFallbackStyles.projectButton}
                  >
                    {project.title}
                  </button>
                ) : (
                  <span style={landingFallbackStyles.projectTitle}>{project.title}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

const landingFallbackStyles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    padding: 'var(--content-padding)',
    maxWidth: 'var(--content-max-width)',
    margin: '0 auto',
  },
  message: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-text-secondary)',
    marginBottom: '1.5rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  listItem: {
    padding: 0,
  },
  projectButton: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-accent)',
    backgroundColor: 'var(--color-bg-secondary)',
    border: 'none',
    borderRadius: '6px',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left' as const,
    transition: 'background-color var(--duration-fast) var(--ease-out)',
    minHeight: '44px',
  },
  projectTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-text-primary)',
    padding: '0.75rem 1rem',
    display: 'block',
    backgroundColor: 'var(--color-bg-secondary)',
    borderRadius: '6px',
  },
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { ErrorBoundary, ModelViewerBoundary, CaseStudyBoundary, LandingPageBoundary };
export type {
  ErrorBoundaryProps,
  ModelViewerBoundaryProps,
  CaseStudyBoundaryProps,
  LandingPageBoundaryProps,
};
