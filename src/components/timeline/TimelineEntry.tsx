import type { TimelineEntryData } from '../../data/types';
import styles from './Timeline.module.css';

interface TimelineEntryProps {
  entry: TimelineEntryData;
}

function TimelineEntry({ entry }: TimelineEntryProps) {
  return (
    <div className={styles.entry}>
      <div className={styles.marker} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.date}>{entry.date}</span>
        <h3 className={styles.entryTitle}>{entry.title}</h3>
        <p className={styles.description}>{entry.description}</p>
      </div>
    </div>
  );
}

export default TimelineEntry;
