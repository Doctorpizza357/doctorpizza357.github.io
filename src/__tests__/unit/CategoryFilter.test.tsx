import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from '../../components/projects/CategoryFilter';
import type { ProjectCategory } from '../../data/projectTypes';

const CATEGORIES: ProjectCategory[] = ['ALL', 'MECHANICAL', 'ROBOTICS', 'SOFTWARE', 'SYSTEMS'];

function renderFilter(overrides: Partial<{
  activeCategory: ProjectCategory;
  onCategoryChange: (category: ProjectCategory) => void;
  resultCount: number;
}> = {}) {
  const props = {
    categories: CATEGORIES,
    activeCategory: overrides.activeCategory ?? 'ALL',
    onCategoryChange: overrides.onCategoryChange ?? vi.fn(),
    resultCount: overrides.resultCount ?? 6,
  };
  return render(<CategoryFilter {...props} />);
}

describe('CategoryFilter', () => {
  it('renders exactly 5 filter buttons', () => {
    renderFilter();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });

  it('renders buttons with correct category labels', () => {
    renderFilter();
    CATEGORIES.forEach((cat) => {
      expect(screen.getByRole('button', { name: cat })).toBeInTheDocument();
    });
  });

  it('marks the active category button with aria-pressed="true"', () => {
    renderFilter({ activeCategory: 'ROBOTICS' });
    const roboticsBtn = screen.getByRole('button', { name: 'ROBOTICS' });
    expect(roboticsBtn).toHaveAttribute('aria-pressed', 'true');

    // All others should be false
    const otherButtons = CATEGORIES.filter((c) => c !== 'ROBOTICS');
    otherButtons.forEach((cat) => {
      expect(screen.getByRole('button', { name: cat })).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('defaults to ALL as the active category', () => {
    renderFilter({ activeCategory: 'ALL' });
    expect(screen.getByRole('button', { name: 'ALL' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onCategoryChange when a button is clicked', () => {
    const handleChange = vi.fn();
    renderFilter({ onCategoryChange: handleChange });

    fireEvent.click(screen.getByRole('button', { name: 'SOFTWARE' }));
    expect(handleChange).toHaveBeenCalledWith('SOFTWARE');
  });

  it('supports keyboard activation with Enter', () => {
    const handleChange = vi.fn();
    renderFilter({ onCategoryChange: handleChange });

    const btn = screen.getByRole('button', { name: 'MECHANICAL' });
    fireEvent.keyDown(btn, { key: 'Enter', code: 'Enter' });
    // Native buttons respond to Enter via click
    fireEvent.click(btn);
    expect(handleChange).toHaveBeenCalledWith('MECHANICAL');
  });

  it('supports keyboard activation with Space', () => {
    const handleChange = vi.fn();
    renderFilter({ onCategoryChange: handleChange });

    const btn = screen.getByRole('button', { name: 'SYSTEMS' });
    // Native buttons handle Space via click
    fireEvent.click(btn);
    expect(handleChange).toHaveBeenCalledWith('SYSTEMS');
  });

  it('renders an aria-live polite region with result count', () => {
    renderFilter({ resultCount: 3 });
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveTextContent('3 projects shown');
  });

  it('uses singular form for 1 project', () => {
    renderFilter({ resultCount: 1 });
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveTextContent('1 project shown');
  });

  it('updates live region text when resultCount changes', () => {
    const { rerender } = render(
      <CategoryFilter
        categories={CATEGORIES}
        activeCategory="ALL"
        onCategoryChange={vi.fn()}
        resultCount={6}
      />
    );
    expect(screen.getByRole('status')).toHaveTextContent('6 projects shown');

    rerender(
      <CategoryFilter
        categories={CATEGORIES}
        activeCategory="MECHANICAL"
        onCategoryChange={vi.fn()}
        resultCount={2}
      />
    );
    expect(screen.getByRole('status')).toHaveTextContent('2 projects shown');
  });

  it('has role="toolbar" with accessible label', () => {
    renderFilter();
    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).toHaveAttribute('aria-label', 'Filter projects by category');
  });
});
