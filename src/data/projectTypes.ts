/**
 * Project Data Layer — Type definitions, interfaces, and utility functions
 * for the engineering project showcase system.
 *
 * This module defines the data architecture for all portfolio projects,
 * separating content from UI components.
 */

// ─── Category & Media Types ──────────────────────────────────────────────────

/** All project categories including UI filter options and data-only tags */
export type ProjectCategory =
  | 'ALL'
  | 'MECHANICAL'
  | 'ROBOTICS'
  | 'SOFTWARE'
  | 'SYSTEMS'
  | 'AI'
  | 'MATLAB'
  | 'LEADERSHIP'
  | 'CAD';

/** Discriminated media type literals for the Media_System */
export type MediaType =
  | 'image'
  | 'video'
  | 'cad-render'
  | '3d-model'
  | 'gif'
  | 'diagram'
  | 'screenshot'
  | 'pdf'
  | 'embed';

/** Visual weight tier determining card layout prominence */
export type VisualTier = 'flagship' | 'standard';

// ─── Case Study Section Keys ─────────────────────────────────────────────────

/**
 * Standard case study section keys plus extensible string for project-specific
 * sections (e.g., "chassis", "suspension" for RC Vehicle).
 */
export type CaseStudySectionKey =
  | 'problem'
  | 'approach'
  | 'systems'
  | 'iteration'
  | 'decisions'
  | 'current-state'
  | 'lessons-learned'
  | (string & {});

// ─── Interfaces ──────────────────────────────────────────────────────────────

/**
 * A typed media item within the Media_System.
 * Uses a discriminated union on the `type` field.
 */
export interface MediaItem {
  /** Media type discriminator */
  type: MediaType;
  /** Asset path (relative or absolute) */
  src: string;
  /**
   * Descriptive alt text for non-decorative items, or empty string for decorative.
   * @maxLength 125
   */
  alt: string;
  /**
   * Optional caption displayed below the media item.
   * @maxLength 200
   */
  caption?: string;
}

/**
 * A single section within a project's case study narrative.
 */
export interface CaseStudySection {
  /** Section identifier key */
  key: CaseStudySectionKey;
  /** Display heading for the section */
  heading: string;
  /**
   * Section body content. Use PLACEHOLDER: prefix for missing content.
   * @maxLength 5000
   */
  body: string;
  /** Inline media items for this section */
  media?: MediaItem[];
}

/**
 * Complete project data interface for the Project_Data_Layer.
 * All projects in the portfolio conform to this structure.
 */
export interface ProjectData {
  /** Unique project identifier */
  id: string;
  /**
   * Project title.
   * @maxLength 100
   */
  title: string;
  /**
   * Short project description/summary.
   * @maxLength 500
   */
  description: string;
  /**
   * Category tags for filtering and classification.
   * @minItems 1
   * @maxItems 5
   */
  category: ProjectCategory[];
  /**
   * Technology stack used in the project.
   * @minItems 1
   * @maxItems 15
   */
  technologies: string[];
  /** Timeframe of the project (e.g., "2023-2026") */
  timeframe: string;
  /** Role held during the project (e.g., "Mechanical Lead") */
  role: string;
  /**
   * All media items associated with the project.
   * @minItems 0
   * @maxItems 50
   */
  media: MediaItem[];
  /**
   * Display order for landing page layout. Lower values appear first.
   * @minimum 1
   * @maximum 99
   * @type integer
   */
  displayOrder: number;
  /** Visual weight tier for editorial layout */
  visualTier: VisualTier;
  /** Optional repository URL (must be a valid URL) */
  repositoryUrl?: string;
  /** Optional live/external website URL */
  liveUrl?: string;
  /** Optional structured case study sections */
  caseStudySections?: CaseStudySection[];
  /** Optional awards or accolades to render as styled badges */
  awards?: string[];
}

/**
 * Annotation data for labeling features on 3D models.
 */
export interface AnnotationData {
  /** Unique annotation identifier */
  id: string;
  /** Text label for the annotation */
  label: string;
  /** 3D world coordinates [x, y, z] where the annotation points */
  position: [number, number, number];
  /** Optional camera target position for focusing on this annotation */
  cameraTarget?: [number, number, number];
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** Prefix used for Content_Placeholder tokens to mark missing content */
export const PLACEHOLDER_PREFIX = 'PLACEHOLDER:';

// ─── Utility Functions ───────────────────────────────────────────────────────

/**
 * Determines whether a string is a Content_Placeholder token.
 * Returns true if and only if the string starts with the PLACEHOLDER_PREFIX.
 */
export function isPlaceholder(value: string): boolean {
  return value.startsWith(PLACEHOLDER_PREFIX);
}

/**
 * Filters projects by category. If filter is 'ALL', returns all projects unchanged.
 * Otherwise returns only projects whose category array includes the filter value.
 */
export function filterProjects(
  projects: ProjectData[],
  filter: ProjectCategory
): ProjectData[] {
  if (filter === 'ALL') return projects;
  return projects.filter((p) => p.category.includes(filter));
}

/**
 * Sorts projects by displayOrder in ascending order (lower values first).
 * Returns a new array; does not mutate the input.
 */
export function sortByDisplayOrder(projects: ProjectData[]): ProjectData[] {
  return [...projects].sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Clamps a zoom value to the allowed range [0.5, 3.0].
 * Values below 0.5 are clamped to 0.5, values above 3.0 are clamped to 3.0.
 */
export function clampZoom(value: number): number {
  return Math.min(3.0, Math.max(0.5, value));
}

/**
 * Composes an accessible aria-label from project title and description.
 * The result contains the title, is non-empty, and is at most 125 characters.
 */
export function composeAriaLabel(title: string, description: string): string {
  if (!title && !description) return 'Project';
  if (!title) return description.slice(0, 125);
  if (!description) return title.slice(0, 125);

  const separator = ' — ';
  const maxLength = 125;

  // Always include full title if possible
  if (title.length >= maxLength) {
    return title.slice(0, maxLength);
  }

  const remaining = maxLength - title.length - separator.length;
  if (remaining <= 0) {
    return title.slice(0, maxLength);
  }

  const truncatedDescription = description.slice(0, remaining);
  return `${title}${separator}${truncatedDescription}`;
}
