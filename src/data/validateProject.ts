/**
 * Runtime validation for ProjectData objects.
 * Validates all field constraints defined in the design document
 * and returns structured results with field-level errors.
 */

import type { ProjectData, ProjectCategory, MediaType, VisualTier } from './projectTypes';

// ─── Validation Result Types ─────────────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// ─── Valid Enum Values ───────────────────────────────────────────────────────

const VALID_CATEGORIES: ProjectCategory[] = [
  'ALL', 'MECHANICAL', 'ROBOTICS', 'SOFTWARE', 'SYSTEMS',
  'AI', 'MATLAB', 'LEADERSHIP', 'CAD',
];

const VALID_MEDIA_TYPES: MediaType[] = [
  'image', 'video', 'cad-render', '3d-model', 'gif', 'diagram', 'screenshot', 'pdf',
];

const VALID_VISUAL_TIERS: VisualTier[] = ['flagship', 'standard'];

// ─── Validation Function ─────────────────────────────────────────────────────

/**
 * Validates a ProjectData object against all field constraints.
 * Returns a structured result indicating whether the data is valid
 * and an array of field-level errors if not.
 */
export function validateProjectData(project: ProjectData): ValidationResult {
  const errors: ValidationError[] = [];

  // id: non-empty string
  if (typeof project.id !== 'string' || project.id.length === 0) {
    errors.push({ field: 'id', message: 'id must be a non-empty string' });
  }

  // title: 1–100 chars
  if (typeof project.title !== 'string' || project.title.length < 1 || project.title.length > 100) {
    errors.push({ field: 'title', message: 'title must be between 1 and 100 characters' });
  }

  // description: 1–500 chars
  if (typeof project.description !== 'string' || project.description.length < 1 || project.description.length > 500) {
    errors.push({ field: 'description', message: 'description must be between 1 and 500 characters' });
  }

  // category: array with 1–5 items, each must be a valid ProjectCategory
  if (!Array.isArray(project.category)) {
    errors.push({ field: 'category', message: 'category must be an array' });
  } else {
    if (project.category.length < 1 || project.category.length > 5) {
      errors.push({ field: 'category', message: 'category must have between 1 and 5 items' });
    }
    for (let i = 0; i < project.category.length; i++) {
      if (!VALID_CATEGORIES.includes(project.category[i])) {
        errors.push({
          field: `category[${i}]`,
          message: `category[${i}] must be a valid ProjectCategory`,
        });
      }
    }
  }

  // technologies: array with 1–15 items, each non-empty string
  if (!Array.isArray(project.technologies)) {
    errors.push({ field: 'technologies', message: 'technologies must be an array' });
  } else {
    if (project.technologies.length < 1 || project.technologies.length > 15) {
      errors.push({ field: 'technologies', message: 'technologies must have between 1 and 15 items' });
    }
    for (let i = 0; i < project.technologies.length; i++) {
      if (typeof project.technologies[i] !== 'string' || project.technologies[i].length === 0) {
        errors.push({
          field: `technologies[${i}]`,
          message: `technologies[${i}] must be a non-empty string`,
        });
      }
    }
  }

  // displayOrder: integer between 1–99 inclusive
  if (
    typeof project.displayOrder !== 'number' ||
    !Number.isInteger(project.displayOrder) ||
    project.displayOrder < 1 ||
    project.displayOrder > 99
  ) {
    errors.push({ field: 'displayOrder', message: 'displayOrder must be an integer between 1 and 99' });
  }

  // visualTier: must be 'flagship' or 'standard'
  if (!VALID_VISUAL_TIERS.includes(project.visualTier)) {
    errors.push({ field: 'visualTier', message: "visualTier must be 'flagship' or 'standard'" });
  }

  // media: array with 0–50 items
  if (!Array.isArray(project.media)) {
    errors.push({ field: 'media', message: 'media must be an array' });
  } else {
    if (project.media.length > 50) {
      errors.push({ field: 'media', message: 'media must have at most 50 items' });
    }
    for (let i = 0; i < project.media.length; i++) {
      const item = project.media[i];

      // type must be a valid MediaType
      if (!VALID_MEDIA_TYPES.includes(item.type)) {
        errors.push({
          field: `media[${i}].type`,
          message: `media[${i}].type must be a valid MediaType`,
        });
      }

      // alt ≤125 chars
      if (typeof item.alt !== 'string' || item.alt.length > 125) {
        errors.push({
          field: `media[${i}].alt`,
          message: `media[${i}].alt must be a string of at most 125 characters`,
        });
      }

      // caption (if present) ≤200 chars
      if (item.caption !== undefined) {
        if (typeof item.caption !== 'string' || item.caption.length > 200) {
          errors.push({
            field: `media[${i}].caption`,
            message: `media[${i}].caption must be a string of at most 200 characters`,
          });
        }
      }
    }
  }

  // caseStudySections (if present): each section's body ≤5000 chars
  if (project.caseStudySections !== undefined) {
    if (!Array.isArray(project.caseStudySections)) {
      errors.push({ field: 'caseStudySections', message: 'caseStudySections must be an array' });
    } else {
      for (let i = 0; i < project.caseStudySections.length; i++) {
        const section = project.caseStudySections[i];

        if (typeof section.body !== 'string' || section.body.length > 5000) {
          errors.push({
            field: `caseStudySections[${i}].body`,
            message: `caseStudySections[${i}].body must be a string of at most 5000 characters`,
          });
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
