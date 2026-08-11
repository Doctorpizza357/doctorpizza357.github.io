import type { FC, KeyboardEvent } from 'react';
import styles from './Navigation.module.css';

interface NavItemProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: (sectionId: string) => void;
  /** Variant controls which style set to use */
  variant?: 'sidebar' | 'drawer';
}

/**
 * NavItem — A single navigation item rendered as a button.
 * Supports keyboard activation via Enter/Space.
 * Minimum 44x44px tap target for accessibility.
 */
const NavItem: FC<NavItemProps> = ({
  id,
  label,
  icon,
  isActive,
  onClick,
  variant = 'sidebar',
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(id);
    }
  };

  if (variant === 'drawer') {
    return (
      <li>
        <button
          type="button"
          className={`${styles.drawerItem} ${isActive ? styles.drawerItemActive : ''}`}
          onClick={() => onClick(id)}
          onKeyDown={handleKeyDown}
          aria-current={isActive ? 'page' : undefined}
          aria-label={`Navigate to ${label}`}
        >
          {icon ?? <span className={styles.drawerItemDot} aria-hidden="true" />}
          <span>{label}</span>
        </button>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        onClick={() => onClick(id)}
        onKeyDown={handleKeyDown}
        aria-current={isActive ? 'page' : undefined}
        aria-label={`Navigate to ${label}`}
        title={label}
      >
        {icon ?? <span className={styles.navItemDot} aria-hidden="true" />}
        <span className={styles.navItemLabel}>{label}</span>
      </button>
    </li>
  );
};

export default NavItem;
