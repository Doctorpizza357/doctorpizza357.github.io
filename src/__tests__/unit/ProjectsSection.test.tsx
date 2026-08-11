import { fireEvent, render, screen } from '@testing-library/react';
import ProjectsSection from '../../components/sections/ProjectsSection';

describe('ProjectsSection', () => {
  it('returns to the landing project list when the reset signal changes', () => {
    const { rerender } = render(<ProjectsSection resetSignal={0} />);

    fireEvent.click(screen.getByRole('button', { name: /view case study for/i }));

    expect(screen.getByRole('button', { name: /back to projects/i })).toBeInTheDocument();

    rerender(<ProjectsSection resetSignal={1} />);

    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view case study for/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /back to projects/i })).not.toBeInTheDocument();
  });
});
