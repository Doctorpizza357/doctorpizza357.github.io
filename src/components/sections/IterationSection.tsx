import { sections } from '../../data/sections';
import SectionWrapper from '../ui/SectionWrapper';
import styles from './NarrativeSection.module.css';

function IterationSection() {
  const content = sections.iteration;

  if (!content) return null;

  return (
    <SectionWrapper id={content.id}>
      <div className={styles.section}>
        {content.title && <h2 className={styles.title}>{content.title}</h2>}
        <p className={styles.body}>{content.body}</p>
        {content.images && content.images.length > 0 && (
          <div className={styles.images}>
            {content.images.map((image) => (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                className={styles.image}
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export default IterationSection;
