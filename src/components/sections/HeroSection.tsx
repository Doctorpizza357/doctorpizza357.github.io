import SectionWrapper from '../ui/SectionWrapper';
import HeroVisual from '../ui/HeroVisual';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  name: string;
  tagline: string;
  visualElement?: React.ReactNode;
}

function HeroSection({ name, tagline, visualElement }: HeroSectionProps) {
  return (
    <SectionWrapper id="hero">
      <div className={styles.hero}>
        {/* Engineering grid overlay */}
        <div className={styles.gridOverlay} aria-hidden="true" />

        {/* Animated particle constellation */}
        <HeroVisual />

        {/* Accent reference point */}
        <span className={styles.accentDot} aria-hidden="true" />

        {/* Main content */}
        <header className={styles.content}>
          <p className={styles.intro}>Portfolio</p>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.tagline}>{tagline}</p>
          <p className={styles.descriptor}>
            I design things that move, break, and get better.
          </p>
          {visualElement && (
            <div className={styles.visualElement}>{visualElement}</div>
          )}
        </header>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator} aria-hidden="true">
          <span className={styles.scrollLine} />
          <span className={styles.scrollLabel}>Scroll</span>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default HeroSection;
