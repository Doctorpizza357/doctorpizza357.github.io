import type { CaseStudyData } from '../../data/types';
import styles from './Projects.module.css';

interface CaseStudyViewProps {
  project: CaseStudyData;
  onClose: () => void;
}

function CaseStudyView({ project, onClose }: CaseStudyViewProps) {
  return (
    <article className={styles.caseStudy} aria-label={`Case study: ${project.title}`}>
      <button
        className={styles.backButton}
        onClick={onClose}
        type="button"
        aria-label="Back to Projects"
      >
        ← Back to Projects
      </button>

      <header className={styles.caseStudyHeader}>
        <h3 className={styles.caseStudyTitle}>{project.title}</h3>
        <p className={styles.caseStudySummary}>{project.summary}</p>

        {project.description && (
          <p className={styles.caseStudyDescription}>{project.description}</p>
        )}

        <ul className={styles.techList} aria-label="Technologies used">
          {project.technologies.map((tech) => (
            <li key={tech} className={styles.techTag}>
              {tech}
            </li>
          ))}
        </ul>

        {project.repositoryUrl && (
          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repoLink}
          >
            View on GitHub →
          </a>
        )}
      </header>

      {project.caseStudySections && project.caseStudySections.length > 0 && (
        <div className={styles.caseStudySections}>
          {project.caseStudySections.map((section) => (
            <section key={section.heading} className={styles.caseStudySection}>
              <h4 className={styles.sectionHeading}>{section.heading}</h4>
              <p className={styles.sectionBody}>{section.body}</p>
            </section>
          ))}
        </div>
      )}

      {project.images && project.images.length > 0 && (
        <div className={styles.imageGallery} role="group" aria-label={`Screenshots of ${project.title}`}>
          {project.images.map((src) => (
            <img
              key={src}
              src={src}
              alt={`Screenshot of ${project.title}`}
              className={styles.galleryImage}
              loading="lazy"
            />
          ))}
        </div>
      )}
    </article>
  );
}

export default CaseStudyView;
