import { timeline } from '../../data/timeline';
import SectionWrapper from '../ui/SectionWrapper';
import TimelineEntry from '../timeline/TimelineEntry';
import styles from '../timeline/Timeline.module.css';

function TimelineSection() {
  // Sort entries in chronological order by date
  const sortedEntries = [...timeline].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  // Requirement 11.4: minimum 3 entries required
  if (sortedEntries.length < 3) return null;

  return (
    <SectionWrapper id="timeline">
      <div className={styles.timeline}>
        <h2 className={styles.title}>Timeline</h2>
        <div className={styles.line} aria-hidden="true" />
        {sortedEntries.map((entry) => (
          <TimelineEntry key={entry.date} entry={entry} />
        ))}
      </div>
    </SectionWrapper>
  );
}

export default TimelineSection;
