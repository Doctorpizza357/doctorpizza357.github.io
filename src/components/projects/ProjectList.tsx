import type { CaseStudyData } from '../../data/types';
import styles from './Projects.module.css';

interface ProjectListProps {
  projects: CaseStudyData[];
  onSelectProject: (project: CaseStudyData) => void;
}

function ProjectList({ projects, onSelectProject }: ProjectListProps) {
  return (
    <div className={styles.list}>
      {projects.map((project, index) => (
        <article
          key={project.id}
          className={styles.entry}
          role="button"
          tabIndex={0}
          onClick={() => onSelectProject(project)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectProject(project);
            }
          }}
          aria-label={`View case study: ${project.title}`}
        >
          <span className={styles.index} aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className={styles.entryContent}>
            <h3 className={styles.entryTitle}>{project.title}</h3>
            <p className={styles.entrySummary}>{project.summary}</p>

            {project.technologies.length > 0 && (
              <ul className={styles.techList} aria-label="Technologies used">
                {project.technologies.map((tech) => (
                  <li key={tech} className={styles.techTag}>
                    {tech}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </article>
      ))}
    </div>
  );
}

export default ProjectList;
