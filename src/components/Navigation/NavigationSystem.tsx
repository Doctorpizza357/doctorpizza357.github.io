import { type FC, useState, useCallback, useEffect, useRef } from 'react';
import NavItem from './NavItem';
import styles from './Navigation.module.css';

export interface SectionMeta {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface NavigationSystemProps {
  sections: SectionMeta[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

/**
 * NavigationSystem — Persistent navigation for all portfolio sections.
 *
 * Desktop (≥1200px): Fixed sidebar with dot indicators + visible labels.
 * Laptop (992–1199px): Fixed sidebar with dot indicators, labels on hover.
 * Tablet (768–991px): Hamburger button that opens a slide-in drawer.
 * Mobile (<768px): Hamburger button that opens a slide-in drawer.
 *
 * Features:
 * - Fixed positioning that doesn't overlap main content
 * - Active section visual highlight (accent color)
 * - Keyboard navigation (Tab, Enter, Space)
 * - 44x44px minimum tap targets on all viewports
 * - Smooth scroll via onNavigate callback
 * - Focus trap in mobile drawer when open
 */
const NavigationSystem: FC<NavigationSystemProps> = ({
  sections,
  activeSection,
  onNavigate,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const handleNavigate = useCallback(
    (sectionId: string) => {
      onNavigate(sectionId);
      // Close drawer on mobile after navigating
      setIsDrawerOpen(false);
    },
    [onNavigate]
  );

  // Close drawer on Escape key
  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        hamburgerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  // Trap focus inside drawer when open
  useEffect(() => {
    if (!isDrawerOpen || !drawerRef.current) return;

    const drawer = drawerRef.current;
    const focusableElements = drawer.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', handleTabTrap);
    return () => document.removeEventListener('keydown', handleTabTrap);
  }, [isDrawerOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  return (
    <>
      {/* Desktop sidebar navigation */}
      <nav className={styles.nav} aria-label="Main navigation">
        <ul className={styles.navList} role="list">
          {sections.map((section) => (
            <NavItem
              key={section.id}
              id={section.id}
              label={section.label}
              icon={section.icon}
              isActive={activeSection === section.id}
              onClick={handleNavigate}
              variant="sidebar"
            />
          ))}
        </ul>
      </nav>

      {/* Mobile hamburger button */}
      <button
        ref={hamburgerRef}
        type="button"
        className={`${styles.hamburger} ${isDrawerOpen ? styles.hamburgerOpen : ''}`}
        onClick={toggleDrawer}
        aria-expanded={isDrawerOpen}
        aria-controls="nav-drawer"
        aria-label={isDrawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        <span className={styles.hamburgerIcon} aria-hidden="true">
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </span>
      </button>

      {/* Mobile overlay */}
      <div
        className={`${styles.overlay} ${isDrawerOpen ? styles.overlayVisible : ''}`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        id="nav-drawer"
        className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal={isDrawerOpen}
        aria-label="Navigation menu"
      >
        <nav aria-label="Main navigation">
          <ul className={styles.drawerList} role="list">
            {sections.map((section) => (
              <NavItem
                key={section.id}
                id={section.id}
                label={section.label}
                icon={section.icon}
                isActive={activeSection === section.id}
                onClick={handleNavigate}
                variant="drawer"
              />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default NavigationSystem;
