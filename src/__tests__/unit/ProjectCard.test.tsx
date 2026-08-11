import { render, screen, fireEvent } from '@testing-library/react';
import ProjectCard, { getFeaturedImage, truncateSummary } from '../../components/projects/ProjectCard';
import type { ProjectData, MediaItem } from '../../data/projectTypes';

const mockMedia: MediaItem[] = [
  { type: 'video', src: '/assets/video.mp4', alt: 'A video' },
  { type: 'image', src: '/assets/img/rc-car.png', alt: 'RC Vehicle render' },
  { type: 'screenshot', src: '/assets/img/screenshot.png', alt: 'App screenshot' },
];

const mockProject: ProjectData = {
  id: 'rc-vehicle',
  title: 'RC Vehicle',
  description: 'A custom-designed remote-controlled vehicle with parametric CAD modeling and 3D-printed components.',
  category: ['MECHANICAL', 'CAD'],
  technologies: ['SolidWorks', 'FDM Printing', '3D Modeling'],
  timeframe: '2024-2025',
  role: 'Lead Designer',
  media: mockMedia,
  displayOrder: 1,
  visualTier: 'flagship',
};

const defaultProps = {
  project: mockProject,
  index: 0,
  tier: 'flagship' as const,
  onClick: vi.fn(),
};

describe('ProjectCard', () => {
  describe('rendering', () => {
    it('renders project number as zero-padded index + 1', () => {
      render(<ProjectCard {...defaultProps} index={0} />);
      expect(screen.getByText('01')).toBeInTheDocument();
    });

    it('renders project title', () => {
      render(<ProjectCard {...defaultProps} />);
      expect(screen.getByRole('heading', { name: 'RC Vehicle' })).toBeInTheDocument();
    });

    it('renders summary truncated to 200 characters', () => {
      const longDesc = 'A'.repeat(250);
      const project = { ...mockProject, description: longDesc };
      render(<ProjectCard {...defaultProps} project={project} />);
      // Should show 200 chars + ellipsis
      const summary = screen.getByText(/^A+…$/);
      expect(summary.textContent!.length).toBe(201); // 200 chars + ellipsis
    });

    it('renders all technology tags', () => {
      render(<ProjectCard {...defaultProps} />);
      expect(screen.getByText('SolidWorks')).toBeInTheDocument();
      expect(screen.getByText('FDM Printing')).toBeInTheDocument();
      expect(screen.getByText('3D Modeling')).toBeInTheDocument();
    });

    it('renders featured image with lazy loading', () => {
      render(<ProjectCard {...defaultProps} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('src', '/assets/img/rc-car.png');
    });

    it('renders placeholder when no image media is available', () => {
      const project = { ...mockProject, media: [{ type: 'video' as const, src: '/v.mp4', alt: 'vid' }] };
      render(<ProjectCard {...defaultProps} project={project} />);
      expect(screen.getByText('No preview available')).toBeInTheDocument();
    });
  });

  describe('tiers', () => {
    it('applies flagship class for flagship tier', () => {
      const { container } = render(<ProjectCard {...defaultProps} tier="flagship" />);
      const card = container.firstElementChild;
      expect(card?.className).toContain('flagship');
    });

    it('applies standard class for standard tier', () => {
      const { container } = render(<ProjectCard {...defaultProps} tier="standard" />);
      const card = container.firstElementChild;
      expect(card?.className).toContain('standard');
    });
  });

  describe('accessibility and interaction', () => {
    it('is focusable with tabIndex 0', () => {
      const { container } = render(<ProjectCard {...defaultProps} />);
      const card = container.firstElementChild as HTMLElement;
      expect(card).toHaveAttribute('tabindex', '0');
    });

    it('has role="button" with aria-label', () => {
      render(<ProjectCard {...defaultProps} />);
      const button = screen.getByRole('button', { name: /View case study for RC Vehicle/i });
      expect(button).toBeInTheDocument();
    });

    it('activates onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<ProjectCard {...defaultProps} onClick={handleClick} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('activates onClick on Enter key', () => {
      const handleClick = vi.fn();
      render(<ProjectCard {...defaultProps} onClick={handleClick} />);
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('activates onClick on Space key', () => {
      const handleClick = vi.fn();
      render(<ProjectCard {...defaultProps} onClick={handleClick} />);
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not activate on other keys', () => {
      const handleClick = vi.fn();
      render(<ProjectCard {...defaultProps} onClick={handleClick} />);
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'a', code: 'KeyA' });
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('getFeaturedImage', () => {
    it('returns the first image-type media item', () => {
      const result = getFeaturedImage(mockMedia);
      expect(result).toEqual(mockMedia[1]); // 'image' type
    });

    it('returns screenshot if no image type', () => {
      const media: MediaItem[] = [
        { type: 'video', src: '/v.mp4', alt: 'vid' },
        { type: 'screenshot', src: '/ss.png', alt: 'screenshot' },
      ];
      expect(getFeaturedImage(media)?.type).toBe('screenshot');
    });

    it('returns cad-render if eligible', () => {
      const media: MediaItem[] = [
        { type: 'cad-render', src: '/cad.png', alt: 'cad' },
      ];
      expect(getFeaturedImage(media)?.type).toBe('cad-render');
    });

    it('returns undefined if no eligible media', () => {
      const media: MediaItem[] = [
        { type: 'video', src: '/v.mp4', alt: 'vid' },
        { type: '3d-model', src: '/m.glb', alt: 'model' },
      ];
      expect(getFeaturedImage(media)).toBeUndefined();
    });
  });

  describe('truncateSummary', () => {
    it('returns full text if within max length', () => {
      expect(truncateSummary('Hello', 200)).toBe('Hello');
    });

    it('truncates and adds ellipsis when over max length', () => {
      const text = 'A'.repeat(210);
      const result = truncateSummary(text, 200);
      expect(result.length).toBe(201); // 200 + ellipsis char
      expect(result.endsWith('…')).toBe(true);
    });

    it('handles exact length without truncation', () => {
      const text = 'B'.repeat(200);
      expect(truncateSummary(text, 200)).toBe(text);
    });
  });
});
