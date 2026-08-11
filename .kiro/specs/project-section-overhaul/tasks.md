# Implementation Plan: Project Section Overhaul

## Overview

This plan transforms the portfolio's Projects section from a flat list into a professional engineering showcase. Implementation proceeds in phases: data layer first, then core components, then 3D/media systems, transitions, and finally project-specific content. Each task builds on the previous, and Three.js is introduced only after the component shell is complete.

## Tasks

- [x] 1. Define data layer types and validation
  - [x] 1.1 Create ProjectData interfaces and types
    - Create `src/data/projectTypes.ts` with `ProjectData`, `MediaItem`, `CaseStudySection`, `ProjectCategory`, `MediaType`, `VisualTier`, and `AnnotationData` interfaces/types
    - Define the discriminated union for media types, `CaseStudySectionKey`, and all field constraints as JSDoc comments
    - Export `PLACEHOLDER_PREFIX` constant and `isPlaceholder` utility function
    - Export `filterProjects` and `sortByDisplayOrder` utility functions
    - Export `clampZoom` utility function (clamps to 0.5–3.0 range)
    - Export `composeAriaLabel` utility function (title + description, max 125 chars)
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6_

  - [x] 1.2 Implement runtime validation functions
    - Create `src/data/validateProject.ts` with `validateProjectData` function
    - Validate all field constraints: title 1–100 chars, description 1–500 chars, category 1–5 items, technologies 1–15 non-empty strings, displayOrder integer 1–99, media alt ≤125 chars, caption ≤200 chars, section body ≤5000 chars
    - Return structured validation result with field-level errors
    - _Requirements: 1.1, 1.3, 1.4_

  - [x]* 1.3 Write property tests for data validation (Property 1)
    - **Property 1: Data Validation Enforces All Field Constraints**
    - **Validates: Requirements 1.1, 1.3, 1.4**
    - Create `src/__tests__/projectData.property.test.ts`
    - Use fast-check to generate random valid and invalid ProjectData objects
    - Assert validation accepts all valid objects and rejects all invalid ones

  - [x]* 1.4 Write property tests for placeholder detection (Property 2)
    - **Property 2: Placeholder Detection**
    - **Validates: Requirements 1.5**
    - In `src/__tests__/projectData.property.test.ts`
    - Generate random strings with and without `PLACEHOLDER:` prefix
    - Assert `isPlaceholder` returns true iff string starts with prefix

  - [x]* 1.5 Write property tests for display order sorting (Property 3)
    - **Property 3: Display Order Sorting**
    - **Validates: Requirements 1.6, 2.6**
    - In `src/__tests__/projectData.property.test.ts`
    - Generate random arrays of ProjectData with distinct displayOrder values
    - Assert sorted output is monotonically non-decreasing and contains same elements

  - [x]* 1.6 Write property tests for category filtering (Properties 5 & 6)
    - **Property 5: Category Filter Returns Only Matching Projects**
    - **Property 6: ALL Filter Is Identity**
    - **Validates: Requirements 3.2, 3.4, 3.8**
    - In `src/__tests__/projectData.property.test.ts`
    - Generate random project arrays and category selections
    - Assert ALL returns identical input; other categories return only matching projects with no false negatives

  - [x]* 1.7 Write property tests for zoom clamping (Property 7)
    - **Property 7: Zoom Clamping**
    - **Validates: Requirements 4.4, 9.2**
    - Create `src/__tests__/components/ModelViewer.property.test.ts`
    - Generate random floats including negatives, zero, large values
    - Assert output always in [0.5, 3.0] and values within range are unchanged

  - [x]* 1.8 Write property tests for accessible label composition (Property 8)
    - **Property 8: Accessible Label Composition**
    - **Validates: Requirements 4.8, 8.1**
    - In `src/__tests__/components/ModelViewer.property.test.ts`
    - Generate random title (1–100 chars) and description (1–500 chars) strings
    - Assert composed label ≤125 chars, non-empty, contains title

- [x] 2. Create project data for all six projects
  - [x] 2.1 Define all six projects conforming to ProjectData interface
    - Create `src/data/projectsNew.ts` with the six projects: RC Vehicle, Wankel Rotary Engine, FRC Team 116, STEM PathfindR, Mission Control, Personal Server
    - Populate all required fields (id, title, description, category, technologies, timeframe, role, media, displayOrder, visualTier)
    - Use `PLACEHOLDER:` tokens for unavailable case study content
    - Define RC Vehicle case study sections: problem, approach, chassis, suspension, design iteration, engineering decisions, current state, lessons learned
    - Define FRC Team 116 sections: challenge, robot, mechanical systems, design-prototype-test-iterate, competition, lessons learned
    - Define STEM PathfindR sections: problem, idea, system architecture, AI simulations, interview preparation, technical implementation, result
    - Define Personal Server sections: problem, system, containers, monitoring, networking, lessons learned
    - _Requirements: 1.2, 1.5, 6.4, 6.5, 6.6, 13.1, 13.5, 14.1, 15.1, 16.1, 16.2_

  - [x]* 2.2 Write unit tests validating all six projects pass validation
    - Create `src/__tests__/projectData.test.ts`
    - Assert each project passes `validateProjectData`
    - Assert unique IDs across all projects
    - Assert displayOrder values are integers 1–99
    - _Requirements: 1.1, 1.2_

- [x] 3. Checkpoint - Data layer complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement CategoryFilter component
  - [x] 4.1 Create CategoryFilter component
    - Create `src/components/projects/CategoryFilter.tsx` and `CategoryFilter.module.css`
    - Render five filter buttons: ALL, MECHANICAL, ROBOTICS, SOFTWARE, SYSTEMS
    - Apply active state styling to current selection (exactly one active at a time)
    - Add `aria-live="polite"` region announcing result count on change
    - Support keyboard navigation (Tab + Enter/Space activation)
    - Use design tokens from tokens.css for all styling
    - Default to ALL on initial render
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 8.3_

  - [x]* 4.2 Write unit tests for CategoryFilter
    - Create `src/__tests__/components/CategoryFilter.test.tsx`
    - Test all 5 buttons render, active state toggles, keyboard activation
    - Test aria-live region updates with result count
    - Test prefers-reduced-motion disables animations
    - _Requirements: 3.1, 3.6, 8.3_

- [x] 5. Implement ProjectCard component
  - [x] 5.1 Create ProjectCard component with flagship and standard tiers
    - Create `src/components/projects/ProjectCard.tsx` and `ProjectCard.module.css`
    - Render project number, title, summary (max 200 chars), technologies, featured image
    - Flagship tier: ≥50% container width, larger visual weight
    - Standard tier: standard grid cell
    - Focusable (`tabIndex={0}`) with visible focus ring (≥2px solid outline)
    - Activates on click, Enter, or Space
    - Apply lazy loading to featured image via `loading="lazy"`
    - Minimum image dimension 300px on longest side
    - Use design tokens exclusively
    - _Requirements: 2.1, 2.2, 2.3, 2.6, 8.4, 9.5_

  - [x]* 5.2 Write property test for ProjectCard rendering (Property 4)
    - **Property 4: ProjectCard Renders All Required Fields**
    - **Validates: Requirements 2.2**
    - Create `src/__tests__/components/ProjectCard.property.test.tsx`
    - Generate random valid ProjectData, render ProjectCard
    - Assert output contains title, description (truncated), tech tag, and image/placeholder

  - [x]* 5.3 Write unit tests for ProjectCard
    - In `src/__tests__/components/ProjectCard.test.tsx`
    - Test flagship vs standard sizing classes
    - Test keyboard activation (Enter/Space)
    - Test focus indicator visibility
    - Test touch target minimum 44x44px on mobile
    - _Requirements: 2.1, 8.4, 9.5_

- [x] 6. Implement ProjectLandingPage with editorial grid layout
  - [x] 6.1 Create ProjectLandingPage component
    - Create `src/components/projects/ProjectLandingPage.tsx` and `ProjectLandingPage.module.css`
    - Compose CategoryFilter and ProjectCard grid
    - Apply editorial layout: flagship card first at ≥50% width, standard cards in remaining space
    - Responsive: single column <768px, multi-column ≥768px
    - Animate card enter/leave on filter change (opacity + transform, ≤400ms)
    - Respect `prefers-reduced-motion` (instant transitions)
    - Apply IntersectionObserver lazy loading for card images (1 viewport rootMargin)
    - _Requirements: 2.1, 2.3, 2.6, 3.2, 3.5, 3.7, 7.1, 9.1, 9.3_

  - [x]* 6.2 Write unit tests for ProjectLandingPage
    - Create `src/__tests__/components/ProjectLandingPage.test.tsx`
    - Test editorial layout structure (flagship first, correct width classes)
    - Test filter integration (category change filters cards)
    - Test responsive breakpoint behavior
    - _Requirements: 2.1, 3.2, 9.1_

- [x] 7. Implement CaseStudyView component
  - [x] 7.1 Create CaseStudyView component (new version)
    - Create `src/components/projects/CaseStudyViewNew.tsx` and `CaseStudyView.module.css`
    - Render metadata header: title (h2), category tags, timeframe, role, technologies
    - Render case study sections in data-array order with h3 headings
    - Embed media items inline within their respective sections
    - Provide back navigation button with label "Back to Projects"
    - Handle empty/undefined caseStudySections gracefully (render metadata only)
    - Use semantic heading hierarchy (h2 for title, h3 for sections)
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 8.5_

  - [x]* 7.2 Write property test for case study section order (Property 9)
    - **Property 9: Case Study Section Order Preservation**
    - **Validates: Requirements 5.1**
    - Create `src/__tests__/components/CaseStudyView.property.test.tsx`
    - Generate random section arrays, render component
    - Assert DOM section order matches data array order

  - [x]* 7.3 Write property test for metadata completeness (Property 10)
    - **Property 10: Case Study Metadata Completeness**
    - **Validates: Requirements 5.2**
    - In `src/__tests__/components/CaseStudyView.property.test.tsx`
    - Generate random ProjectData, render CaseStudyView
    - Assert rendered output contains title, category, timeframe, role, technology

  - [x]* 7.4 Write property test for media in correct section (Property 11)
    - **Property 11: Media Embedded Within Correct Section**
    - **Validates: Requirements 5.3**
    - In `src/__tests__/components/CaseStudyView.property.test.tsx`
    - Generate random sections with media arrays
    - Assert each section's DOM subtree contains only its own media sources

  - [x]* 7.5 Write property test for heading hierarchy (Property 12)
    - **Property 12: Semantic Heading Hierarchy**
    - **Validates: Requirements 8.5**
    - In `src/__tests__/components/CaseStudyView.property.test.tsx`
    - Generate random ProjectData with sections
    - Assert title is h2, section headings are h3, no level skipped

- [x] 8. Checkpoint - Core components complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement ModelViewer component (Three.js)
  - [x] 9.1 Install Three.js and set up ModelViewer shell
    - Add `three` and `@types/three` as dependencies
    - Create `src/components/projects/ModelViewer.tsx` and `ModelViewer.module.css`
    - Implement dynamic import of Three.js (`import("three")`) for code splitting
    - Render loading spinner during Three.js bundle and model load
    - Set up canvas container with proper sizing and `aria-label` from props
    - Handle WebGL unavailability: show fallback image, hide canvas
    - _Requirements: 4.1, 4.5, 4.8, 7.5, 9.4_

  - [x] 9.2 Implement 3D scene setup and model loading
    - Set up scene with studio lighting: ambient light + 2 directional lights (key + fill) + subtle shadows
    - Dark neutral environment background
    - Load GLB/GLTF using `GLTFLoader` with 10-second timeout and AbortController
    - On load failure or timeout: display fallback image if available, else styled "Model unavailable" placeholder
    - Matte/semi-gloss material appearance, no specular bloom or post-processing
    - _Requirements: 4.1, 4.2, 4.6, 4.7, 7.6_

  - [x] 9.3 Implement orbit controls and auto-rotation
    - Add OrbitControls for pointer drag orbit and scroll/pinch zoom
    - Clamp zoom range to 0.5x–3.0x using `clampZoom` utility
    - Auto-rotate at 6 deg/s when idle ≥2 seconds
    - Disable auto-rotation on pointer interaction, resume after 2s idle
    - Mobile: single-finger orbit, pinch-to-zoom
    - Respect `prefers-reduced-motion`: disable auto-rotation, display static model
    - _Requirements: 4.3, 4.4, 4.9, 9.2_

  - [x] 9.4 Implement annotation rendering
    - Render Engineering_Annotations as CSS overlay labels positioned via 3D→2D projection
    - Connect annotations to model points with thin lines (1–2px width)
    - Use monospace/technical typeface from design tokens
    - Update annotation positions on camera movement
    - _Requirements: 4.10, 6.2, 12.3_

  - [x] 9.5 Implement IntersectionObserver visibility management
    - Pause render loop and animation when ModelViewer is at 0% viewport intersection
    - Resume render loop when component re-enters viewport (>0% intersection)
    - Use IntersectionObserver with default threshold
    - _Requirements: 4.11, 7.4_

  - [x] 9.6 Implement Three.js resource disposal
    - On component unmount: traverse scene and dispose all geometries, materials, textures
    - Call `renderer.dispose()` and `renderer.forceContextLoss()`
    - Clean up OrbitControls and event listeners
    - _Requirements: 7.3_

  - [x]* 9.7 Write unit tests for ModelViewer
    - Create `src/__tests__/components/ModelViewer.test.tsx`
    - Mock Three.js module for unit testing
    - Test loading spinner visibility during load
    - Test fallback image on load failure
    - Test fallback placeholder when no image defined
    - Test dispose called on unmount
    - Test aria-label contains project title and description
    - Test auto-rotation disabled when prefers-reduced-motion active
    - _Requirements: 4.5, 4.6, 4.7, 4.8, 4.9, 7.3, 8.1_

- [x] 10. Implement MediaEmbed component
  - [x] 10.1 Create MediaEmbed component
    - Create `src/components/projects/MediaEmbed.tsx` and `MediaEmbed.module.css`
    - Render appropriate element per media type: `<img>` for image/screenshot/diagram/cad-render/gif, `<video>` for video, ModelViewer for 3d-model, `<iframe>` for PDF
    - Apply lazy loading via IntersectionObserver (1 viewport rootMargin)
    - Maintain aspect ratio, max-width 100% of container
    - Use optimized image formats (WebP/AVIF with fallback via `<picture>`)
    - Include alt text and optional caption
    - _Requirements: 5.3, 7.1, 7.2_

  - [x]* 10.2 Write unit tests for MediaEmbed
    - Create `src/__tests__/components/MediaEmbed.test.tsx`
    - Test each media type renders correct element
    - Test lazy loading behavior (IntersectionObserver mock)
    - Test alt text and caption rendering
    - _Requirements: 5.3, 7.1_

- [x] 11. Implement view transitions and ProjectsSection orchestration
  - [x] 11.1 Refactor ProjectsSection as view state orchestrator
    - Rewrite `src/components/sections/ProjectsSection.tsx`
    - Implement `ProjectViewState` discriminated union (landing | case-study with projectId + returnScrollY)
    - Render `ProjectLandingPage` in landing state, new `CaseStudyView` in case-study state
    - Replace old imports: use new ProjectData type, new projectsNew data, new components
    - Preserve `SectionWrapper` with `id="projects"`
    - Preserve section position in ALL_SECTIONS ordering in App.tsx
    - _Requirements: 2.4, 11.1, 11.4, 11.5_

  - [x] 11.2 Implement GSAP transition animations
    - Use `contextSafe` from AnimationProvider for all GSAP calls
    - Forward transition: fade out project list → fade in case study (sequential, ≤600ms total)
    - Reverse transition: fade out case study → fade in project list → restore scroll position (≤600ms total)
    - Cancel in-progress animation if new navigation action occurs
    - Respect `prefers-reduced-motion`: skip animations, apply instant state change
    - Implement scroll position storage on card click and restoration within 5px on back
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 11.5, 11.6_

  - [x] 11.3 Implement focus management
    - On case study open: move focus to case study h2 heading
    - On back navigation: return focus to the ProjectCard that initiated the action
    - Store reference to triggering card element
    - _Requirements: 8.7_

  - [x]* 11.4 Write property test for scroll position restoration (Property 13)
    - **Property 13: Scroll Position Restoration**
    - **Validates: Requirements 10.2**
    - Create `src/__tests__/components/ProjectsSection.property.test.tsx`
    - Generate random non-negative scroll position integers
    - Assert restored position is within 5px of stored value

  - [x]* 11.5 Write unit tests for transitions and focus management
    - In `src/__tests__/components/ProjectsSection.test.tsx`
    - Mock GSAP timelines, test phase ordering
    - Test focus moves to heading on open, returns to card on close
    - Test prefers-reduced-motion skips animations
    - Test transition completes ≤600ms
    - _Requirements: 10.1, 10.3, 10.5, 8.7_

- [x] 12. Implement error boundaries
  - [x] 12.1 Create error boundary components
    - Create `src/components/projects/ProjectErrorBoundary.tsx`
    - Implement three boundary variants: ModelViewerBoundary (renders fallback image), CaseStudyBoundary (renders error message + back button), LandingPageBoundary (renders simplified project list)
    - Wrap ModelViewer, CaseStudyView, and ProjectLandingPage with respective boundaries
    - _Requirements: Design error handling specification_

- [x] 13. Checkpoint - All components wired together
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Implement project-specific features
  - [x] 14.1 RC Vehicle flagship implementation
    - Ensure RC Vehicle data includes 3D model GLB reference in media array
    - Add at minimum 4 Engineering_Annotations: chassis, suspension, steering, wheel
    - Verify iteration section has ≥3 version entries
    - Verify case study sections ordered: problem, approach, chassis, suspension, design iteration, engineering decisions, current state, lessons learned
    - _Requirements: 6.1, 6.2, 6.3, 6.6_

  - [x] 14.2 Wankel Rotary Engine implementation
    - Ensure Wankel Engine data includes 3D model GLB reference
    - Add ≥3 Engineering_Annotations: rotor, housing, eccentric shaft
    - Configure epitrochoidal animation data (if applicable, controlled by media item config)
    - Verify media sequence: assembly → individual components → assembly context
    - _Requirements: 12.1, 12.3, 12.5, 12.6_

  - [x] 14.3 FRC Team 116 implementation
    - Verify content includes: 2025 REEFSCAPE, 16th/112 ranking, team captain selection
    - Verify media array includes build photos, CAD renders, competition imagery references
    - _Requirements: 13.2, 13.3_

  - [x] 14.4 STEM PathfindR implementation
    - Render hackathon awards (First Place, Best Use of AI) as styled badges/callouts
    - Ensure awards appear within project metadata or problem section
    - Verify media supports screenshots and architecture diagrams
    - _Requirements: 14.2, 14.5_

  - [x] 14.5 Mission Control implementation
    - Verify case study covers interface design, simulation architecture, data visualization, systems thinking
    - Verify media includes ≥1 MATLAB screenshot and ≥1 diagram
    - Ensure simulation data displays "Simulated data" label
    - _Requirements: 15.2, 15.3, 15.5_

  - [x] 14.6 Personal Server implementation
    - Verify case study follows: problem, system, containers, monitoring, networking, lessons learned
    - Verify media includes ≥1 architecture diagram
    - _Requirements: 16.2, 16.3_

  - [x]* 14.7 Write unit tests for project-specific requirements
    - Create `src/__tests__/components/projectSpecific.test.tsx`
    - Test RC Vehicle: 4 annotations present, 3 version entries, correct section order
    - Test Wankel Engine: 3 annotations present
    - Test STEM PathfindR: awards rendered with badge/callout styling
    - Test Mission Control: simulated data label present
    - _Requirements: 6.2, 6.3, 12.3, 14.2, 15.5_

- [x] 15. Responsive design and accessibility polish
  - [x] 15.1 Implement responsive layout rules
    - Ensure single-column layout below 768px, multi-column ≥768px
    - On mobile: limit animations to opacity + transform only, disable parallax
    - Enforce minimum 14px font size on mobile
    - Enforce ≥44x44px touch targets for all interactive elements
    - Apply optimized image loading (WebP/AVIF with fallback, quality ≤80)
    - _Requirements: 9.1, 9.3, 9.5, 7.2_

  - [x] 15.2 Verify accessibility compliance
    - Ensure 4.5:1 contrast ratio for normal text, 3:1 for large text
    - Verify all interactive elements have visible focus indicators (≥2px outline)
    - Verify aria-live region on CategoryFilter announces result counts
    - Verify semantic heading hierarchy across all views
    - Verify all images have appropriate alt text (descriptive or empty for decorative)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x]* 15.3 Write accessibility unit tests
    - Create `src/__tests__/components/accessibility.test.tsx`
    - Test focus indicators on ProjectCard
    - Test aria-live announcements on filter change
    - Test heading hierarchy in CaseStudyView
    - Test ModelViewer aria-label content
    - _Requirements: 8.1, 8.3, 8.4, 8.5_

- [x] 16. Site integration and preservation verification
  - [x] 16.1 Verify site preservation constraints
    - Confirm `id="projects"` on container element
    - Confirm all styling uses CSS custom properties from tokens.css exclusively
    - Confirm no new animation libraries added (GSAP + ScrollTrigger only)
    - Confirm existing sections (hero, beginning, iteration, timeline, penn-state, currently, lab-notes, contact) unmodified
    - Confirm ALL_SECTIONS order preserved in App.tsx
    - Register scroll-triggered animations via AnimationProvider context
    - Verify HashRouter compatibility: all navigation and asset paths resolve without 404s
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [x]* 16.2 Write integration tests for site preservation
    - Create `src/__tests__/integration/sitePreservation.test.tsx`
    - Test id="projects" present in rendered output
    - Test no hardcoded colors or fonts (scan CSS module output)
    - Test build succeeds without errors (run `tsc -b`)
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 17. Final checkpoint - Full integration verified
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties defined in the design
- Unit tests validate specific examples and edge cases
- Three.js is introduced in task 9 only after the component shell is stable
- The old ProjectList.tsx, CaseStudyView.tsx, and projects.ts remain until task 11.1 replaces ProjectsSection — then they can be removed or archived
- All components use CSS Modules and design tokens exclusively — no hardcoded values
- The ModelViewer uses dynamic imports so Three.js never loads on the landing page

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2", "4.1"] },
    { "id": 4, "tasks": ["4.2", "5.1"] },
    { "id": 5, "tasks": ["5.2", "5.3", "6.1"] },
    { "id": 6, "tasks": ["6.2", "7.1"] },
    { "id": 7, "tasks": ["7.2", "7.3", "7.4", "7.5", "9.1", "10.1"] },
    { "id": 8, "tasks": ["9.2", "9.3", "10.2"] },
    { "id": 9, "tasks": ["9.4", "9.5"] },
    { "id": 10, "tasks": ["9.6", "9.7"] },
    { "id": 11, "tasks": ["11.1"] },
    { "id": 12, "tasks": ["11.2", "11.3", "12.1"] },
    { "id": 13, "tasks": ["11.4", "11.5"] },
    { "id": 14, "tasks": ["14.1", "14.2", "14.3", "14.4", "14.5", "14.6"] },
    { "id": 15, "tasks": ["14.7", "15.1", "15.2"] },
    { "id": 16, "tasks": ["15.3", "16.1"] },
    { "id": 17, "tasks": ["16.2"] }
  ]
}
```
