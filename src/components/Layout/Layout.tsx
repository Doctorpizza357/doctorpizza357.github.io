import type { FC, ReactNode } from 'react';
import NavigationSystem from '../Navigation/NavigationSystem';
import type { SectionMeta } from '../Navigation/NavigationSystem';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  sections: SectionMeta[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

/**
 * Layout component — wraps the entire application content.
 * Provides skip-link, navigation, main content area, and footer.
 * NavigationSystem and Layout sit outside the error boundary
 * so navigation always works even if a section component fails.
 */
const Layout: FC<LayoutProps> = ({ children, sections, activeSection, onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.layout}>
      {/* Skip link for keyboard accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation — always visible, outside error boundary */}
      <NavigationSystem
        sections={sections}
        activeSection={activeSection}
        onNavigate={onNavigate}
      />

      {/* Main content area */}
      <main id="main-content" className={styles.main}>
        {children}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <ul className={styles.footerLinks} role="list">
            <li>
              <a
                href="https://github.com/doctorpizza357"
                className={styles.footerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/doctorpizza357"
                className={styles.footerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter / X
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/tomasbentolila"
                className={styles.footerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="mailto:tomasbentolila@gmail.com"
                className={styles.footerLink}
              >
                Email
              </a>
            </li>
          </ul>
          <p className={styles.copyright}>
            &copy; {currentYear} Tomas Bentolila
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
