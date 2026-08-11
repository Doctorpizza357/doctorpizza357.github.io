import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProjectLandingPage from './ProjectLandingPage';
import type { ProjectData } from '../../data/projectTypes';

/** Minimal project data factories for testing */
function makeProject(overrides: Partial<ProjectData> = {}): ProjectData {
  return {
    id: 'test-project',
    title: 'Test Project',
    description: 'A test project description for unit testing purposes.',
    category: ['MECHANICAL'],
    technologies: ['SolidWorks', 'CAD'],
    timeframe: '2024',
    role: 'Engineer',
    media: [],
    displayOrder: 1,
    visualTier: 'standard',
    ...overrides,
  };
}

const flagshipProject = makeProject({
  id: 'flagship',
  title: 'Flagship Project',
  category: ['MECHANICAL', 'CAD'],
  displayOrder: 1,
  visualTier: 'flagship',
});

const standardProject1 = makeProject({
  id: 'standard-1',
  title: 'Standard One',
  category: ['ROBOTICS'],
  displayOrder: 2,
  visualTier: 'standard',
});

const standardProject2 = makeProject({
  id: 'standard-2',
  title: 'Standard Two',
  category: ['SOFTWARE'],
  displayOrder: 3,
  visualTier: 'standard',
});

const allProjects = [flagshipProject, standardProject1, standardProject2];

describe('ProjectLandingPage', () => {
  it('renders CategoryFilter with all filter options', () => {
    render(
      <ProjectLandingPage projects={allProjects} onProjectSelect={vi.fn()} />
    );

    expect(screen.getByRole('button', { name: 'ALL' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'MECHANICAL' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ROBOTICS' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SOFTWARE' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SYSTEMS' })).toBeInTheDocument();
  });

  it('renders all projects when ALL filter is active (default)', () => {
    render(
      <ProjectLandingPage projects={allProjects} onProjectSelect={vi.fn()} />
    );

    expect(screen.getByText('Flagship Project')).toBeInTheDocument();
    expect(screen.getByText('Standard One')).toBeInTheDocument();
    expect(screen.getByText('Standard Two')).toBeInTheDocument();
  });

  it('displays projects sorted by displayOrder', () => {
    const reversed = [standardProject2, flagshipProject, standardProject1];
    render(
      <ProjectLandingPage projects={reversed} onProjectSelect={vi.fn()} />
    );

    const cards = screen.getAllByRole('listitem');
    expect(cards).toHaveLength(3);
    // Flagship (order 1) should be first
    expect(cards[0]).toHaveTextContent('Flagship Project');
    expect(cards[1]).toHaveTextContent('Standard One');
    expect(cards[2]).toHaveTextContent('Standard Two');
  });

  it('calls onProjectSelect with the correct project id when card is clicked', () => {
    const onSelect = vi.fn();
    render(
      <ProjectLandingPage projects={allProjects} onProjectSelect={onSelect} />
    );

    const card = screen.getByLabelText('View case study for Standard One');
    fireEvent.click(card);
    expect(onSelect).toHaveBeenCalledWith('standard-1');
  });

  it('filters projects when a category is selected', async () => {
    vi.useFakeTimers();
    render(
      <ProjectLandingPage projects={allProjects} onProjectSelect={vi.fn()} />
    );

    // Click ROBOTICS filter
    fireEvent.click(screen.getByRole('button', { name: 'ROBOTICS' }));

    // Advance timers past the leave phase (300ms) + enter phase (50ms)
    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    // After filter, only the ROBOTICS project should be visible
    expect(screen.getByText('Standard One')).toBeInTheDocument();
    expect(screen.queryByText('Flagship Project')).not.toBeInTheDocument();
    expect(screen.queryByText('Standard Two')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('shows correct result count in live region', () => {
    render(
      <ProjectLandingPage projects={allProjects} onProjectSelect={vi.fn()} />
    );

    expect(screen.getByRole('status')).toHaveTextContent('3 projects shown');
  });

  it('renders the grid with role="list" for accessibility', () => {
    render(
      <ProjectLandingPage projects={allProjects} onProjectSelect={vi.fn()} />
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});
