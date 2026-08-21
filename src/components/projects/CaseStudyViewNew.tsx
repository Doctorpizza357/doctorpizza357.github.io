import type { RefObject } from 'react';
import styles from './CaseStudyView.module.css';
import type { ProjectData } from '../../data/projectTypes';
import MediaEmbed from './MediaEmbed';

interface CaseStudyViewProps {
  project: ProjectData;
  onBack: () => void;
  /** Optional ref to the h2 heading for focus management */
  headingRef?: RefObject<HTMLHeadingElement>;
}

/**
 * CaseStudyView renders the full case study for a project.
 *
 * Displays a metadata header (title as h2, category tags, timeframe, role,
 * technologies) followed by case study sections in data-array order with
 * h3 headings. Media items are embedded inline within their respective sections.
 *
 * If caseStudySections is empty or undefined, only the metadata header is rendered.
 * A "Back to Projects" button provides navigation back to the landing page.
 *
 * Accepts an optional headingRef for focus management — when provided, the h2
 * heading receives programmatic focus on case study open.
 */
function CaseStudyViewNew({ project, onBack, headingRef }: CaseStudyViewProps) {
  const { title, category, timeframe, role, technologies, caseStudySections, awards } =
    project;

  return (
    <article className={styles.caseStudy}>
      <button
        type="button"
        className={styles.backButton}
        onClick={onBack}
      >
        ← Back to Projects
      </button>

      {/* Metadata Header */}
      <header className={styles.metadataHeader}>
        <h2
          className={styles.title}
          ref={headingRef}
          tabIndex={-1}
          style={{ outline: 'none' }}
        >
          {title}
        </h2>

        <div className={styles.metaRow}>
          <div className={styles.categories}>
            {category.map((cat) => (
              <span key={cat} className={styles.categoryTag}>
                {cat}
              </span>
            ))}
          </div>

          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Timeframe:</span>
            {timeframe}
          </span>

          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Role:</span>
            {role}
          </span>
        </div>

        <div className={styles.technologies}>
          {technologies.map((tech) => (
            <span key={tech} className={styles.techTag}>
              {tech}
            </span>
          ))}
        </div>

        {awards && awards.length > 0 && (
          <div className={styles.awards}>
            {awards.map((award) => (
              <span key={award} className={styles.awardBadge}>
                <span className={styles.awardIcon} aria-hidden="true">🏆</span>
                {award}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Project-level media (3D models, videos only — static images shown on card) */}
      {project.media && project.media.length > 0 && (
        <div className={styles.sectionMedia}>
          {project.media
            .filter((m) => m.type === '3d-model' || m.type === 'video')
            .map((media, mediaIndex) => (
            <div key={`project-media-${mediaIndex}`}>
              <MediaEmbed media={media} />
            </div>
          ))}
        </div>
      )}

      {/* Case Study Sections */}
      {caseStudySections && caseStudySections.length > 0 && (
        <div>
          {caseStudySections.map((section) => (
            <section key={section.key} className={styles.section}>
              <h3 className={styles.sectionHeading}>{section.heading}</h3>
              <p className={styles.sectionBody}>{section.body}</p>

              {section.media && section.media.length > 0 && (
                <div className={styles.sectionMedia}>
                  {section.media.map((media, mediaIndex) => (
                    <div key={`${section.key}-media-${mediaIndex}`}>
                      <MediaEmbed media={media} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </article>
  );
}

export default CaseStudyViewNew;
export type { CaseStudyViewProps };
