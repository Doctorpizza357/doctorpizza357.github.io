import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './ProjectModal.module.css';
import type { ProjectData } from '../../data/projectTypes';

interface ProjectModalProps {
  project: ProjectData;
  onClose: () => void;
  onLearnMore: () => void;
}

/**
 * ProjectModal — A simple overlay modal showing project summary.
 * Clicking "Learn More" navigates to the full case study.
 * Clicking the backdrop or X closes the modal.
 */
function ProjectModal({ project, onClose, onLearnMore }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Escape key to close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseRef.current();
    }
    document.addEventListener('keydown', handleKey);
    // Prevent background scroll by disabling on html element
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Focus trap — preventScroll stops browser from scrolling to the modal
  useEffect(() => {
    modalRef.current?.focus({ preventScroll: true });
  }, []);

  // Get featured image
  const featuredImage = project.media.find(
    (m) => m.type === 'image' || m.type === 'screenshot' || m.type === 'cad-render'
  );

  return createPortal(
    <div className={styles.backdrop} onClick={onClose} aria-hidden="false">
      <div
        className={styles.modal}
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* Image */}
        {featuredImage && (
          <div className={styles.imageContainer}>
            <img
              src={featuredImage.src}
              alt={featuredImage.alt}
              className={styles.image}
            />
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>
          <h3 id="modal-title" className={styles.title}>{project.title}</h3>
          <p className={styles.description}>{project.description}</p>

          <div className={styles.meta}>
            <span className={styles.metaItem}>{project.timeframe}</span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.metaItem}>{project.role}</span>
          </div>

          <div className={styles.technologies}>
            {project.technologies.slice(0, 5).map((tech) => (
              <span key={tech} className={styles.techTag}>{tech}</span>
            ))}
            {project.technologies.length > 5 && (
              <span className={styles.techTag}>+{project.technologies.length - 5}</span>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.learnMoreButton}
              onClick={onLearnMore}
            >
              Learn More →
            </button>
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                className={styles.repoLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ProjectModal;
