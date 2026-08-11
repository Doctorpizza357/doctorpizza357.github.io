import styles from './CategoryFilter.module.css';
import type { ProjectCategory } from '../../data/projectTypes';

interface CategoryFilterProps {
  categories: ProjectCategory[];
  activeCategory: ProjectCategory;
  onCategoryChange: (category: ProjectCategory) => void;
  resultCount: number;
}

/**
 * CategoryFilter renders filter buttons for project categories.
 * Exactly one filter is active at a time (default: ALL).
 * Announces result count changes via aria-live region.
 * Fully keyboard-navigable (Tab + Enter/Space activation).
 */
function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  resultCount,
}: CategoryFilterProps) {
  return (
    <div className={styles.filterContainer} role="toolbar" aria-label="Filter projects by category">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`${styles.filterButton}${category === activeCategory ? ` ${styles.active}` : ''}`}
          aria-pressed={category === activeCategory}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
      <div
        className={styles.liveRegion}
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {`${resultCount} project${resultCount === 1 ? '' : 's'} shown`}
      </div>
    </div>
  );
}

export default CategoryFilter;
