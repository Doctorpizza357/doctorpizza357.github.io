import styles from './ProjectCard.module.css';
import type { ProjectData, MediaItem } from '../../data/projectTypes';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  tier: 'flagship' | 'standard';
  onClick: () => void;
}

/** Image-type media types eligible for featured image */
const IMAGE_MEDIA_TYPES: ReadonlyArray<MediaItem['type']> = [
  'image',
  'screenshot',
  'cad-render',
];

/**
 * Returns the first image-type media item from a project's media array,
 * or undefined if none exists.
 */
function getFeaturedImage(media: MediaItem[]): MediaItem | undefined {
  return media.find((item) => IMAGE_MEDIA_TYPES.includes(item.type));
}

/**
 * Truncates a string to a maximum length, appending an ellipsis if truncated.
 */
function truncateSummary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * ProjectCard renders a single project in the editorial grid layout.
 * Supports flagship (≥50% container width, larger visual weight) and
 * standard (single grid cell) tiers.
 *
 * Focusable with visible focus ring. Activates on click, Enter, or Space.
 * Featured image is lazy-loaded with a minimum 300px dimension.
 */
function ProjectCard({ project, index, tier, onClick }: ProjectCardProps) {
  const featuredImage = getFeaturedImage(project.media);
  const projectNumber = String(index + 1).padStart(2, '0');
  const summary = truncateSummary(project.description, 200);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  }

  return (
    <div
      className={`${styles.card} ${styles[tier]}`}
      tabIndex={0}
      role="button"
      aria-label={`View case study for ${project.title}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.imageContainer}>
        {featuredImage ? (
          <img
            className={styles.featuredImage}
            src={featuredImage.src}
            alt={featuredImage.alt || `Featured image for ${project.title}`}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true">
            No preview available
          </div>
        )}
      </div>

      <div className={styles.content}>
        <span className={styles.projectNumber}>{projectNumber}</span>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.summary}>{summary}</p>
        <div className={styles.technologies}>
          {project.technologies.map((tech) => (
            <span key={tech} className={styles.techTag}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
export { getFeaturedImage, truncateSummary };
export type { ProjectCardProps };
