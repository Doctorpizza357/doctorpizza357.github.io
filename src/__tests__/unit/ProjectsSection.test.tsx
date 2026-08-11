import { fireEvent, render, screen } from '@testing-library/react';
import ProjectsSection from '../../components/sections/ProjectsSection';

describe('ProjectsSection', () => {
  it('returns to the landing project list when the reset signal changes', () => {
    const { rerender } = render(<ProjectsSection resetSignal={0} />);

    // Click project card to open the modal
    fireEvent.click(screen.getByRole('button', { name: /view case study for rc vehicle/i }));

    // Click "Learn More" in the modal to navigate to the case study view
    fireEvent.click(screen.getByRole('button', { name: /learn more/i }));

    expect(screen.getByRole('button', { name: /back to projects/i })).toBeInTheDocument();

    rerender(<ProjectsSection resetSignal={1} />);

    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view case study for rc vehicle/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /back to projects/i })).not.toBeInTheDocument();
  });
});
