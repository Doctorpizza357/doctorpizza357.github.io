# Implementation Plan: Portfolio Redesign

## Overview

This plan implements the narrative-driven React + Vite portfolio redesign incrementally. It starts with project scaffolding and the content data layer, then builds the component system, animation engine, navigation, and finishes with build optimization, deployment configuration, and asset migration. Each task builds on prior work so there is no orphaned code.

## Tasks

- [x] 1. Project scaffolding and configuration
  - [x] 1.1 Initialize Vite + React + TypeScript project
    - Create a new Vite project with the React-TS template in the repository root
    - Install core dependencies: react, react-dom, react-router-dom, gsap, @gsap/react
    - Install dev dependencies: typescript, vitest, @testing-library/react, @testing-library/jest-dom, jsdom, fast-check, vite-plugin-image-optimizer
    - Configure `tsconfig.json` with strict mode and path aliases
    - _Requirements: 1.1, 1.4_

  - [x] 1.2 Configure Vite for GitHub Pages deployment
    - Set `base` in `vite.config.ts` to match the GitHub Pages URL path
    - Configure `react()` and `ViteImageOptimizer` plugins
    - Set up `rollupOptions.output.manualChunks` for gsap and react bundles
    - Create `public/404.html` with redirect to `index.html` for SPA routing
    - _Requirements: 1.1, 1.2, 1.5, 8.1_

  - [x] 1.3 Set up design token system and global styles
    - Create `src/styles/tokens.css` with CSS custom properties (colors, typography scale, spacing, animation durations, focus ring)
    - Create `src/styles/global.css` with CSS reset, base styles, and reduced-motion media query overrides
    - Create `src/styles/typography.css` with font declarations for Inter (display) and JetBrains Mono (monospace)
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

  - [x] 1.4 Create project directory structure
    - Create all directories per the design: `src/components/Layout`, `src/components/Navigation`, `src/components/sections`, `src/components/projects`, `src/components/timeline`, `src/components/ui`, `src/animation`, `src/data`, `src/hooks`, `src/styles`, `src/assets`, `src/utils`, `src/__tests__/properties`, `src/__tests__/unit`, `src/__tests__/integration`, `src/test-utils`
    - _Requirements: 9.1_

- [x] 2. Content data layer
  - [x] 2.1 Define TypeScript interfaces for the content layer
    - Create `src/data/types.ts` with interfaces: `CaseStudyData`, `CaseStudySection`, `TimelineEntryData`, `LabNoteData`, `SectionContent`, `ContactMethod`, `SocialLink`, `SiteMetadata`
    - Enforce required/optional fields as specified in the design
    - _Requirements: 9.2, 9.4, 9.5_

  - [x] 2.2 Create projects data file
    - Create `src/data/projects.ts` exporting `CaseStudyData[]` with all 11 existing projects: Pathfinding Visualizer, Tic-Tac-Toe, Sorting Algorithm Visualizer, Pizza Browser, Auto Typer, Map Path Finding, Directory Sorter, Network Traffic Analyzer, Folder Encrypter, Radical Simplifier, Heap Tree Visualizer
    - Include placeholder case study sections (context, process, technical details) to be filled in later
    - Map existing images from `assets/img/` to each project
    - _Requirements: 4.4, 9.1, 14.1, 14.3_

  - [x] 2.3 Create timeline, sections, contacts, and metadata data files
    - Create `src/data/timeline.ts` with minimum 3 `TimelineEntryData` entries in chronological order
    - Create `src/data/sections.ts` with `SectionContent` for beginning, iteration, pennState, currently, and labNotes (some may be null)
    - Create `src/data/contacts.ts` with email (tomasbentolila@gmail.com), GitHub (doctorpizza357), Twitter/X (doctorpizza357), Instagram (tomasbentolila), and Discord entries
    - Create `src/data/metadata.ts` with `SiteMetadata` (title ≤60 chars, description ≤160 chars, OG image, base URL, favicon sizes)
    - _Requirements: 9.1, 9.4, 9.5, 11.4, 12.1, 13.1_

  - [x]* 2.4 Write property tests for content schema validation
    - **Property 12: Content data schema validation**
    - Use fast-check to generate arbitrary `CaseStudyData`, `TimelineEntryData`, and `LabNoteData` objects and verify TypeScript type compliance and required field presence
    - **Validates: Requirements 9.2, 9.4, 9.5**

  - [x]* 2.5 Write property test for metadata length constraints
    - **Property 17: Metadata length constraints**
    - Use fast-check to verify `SiteMetadata` title ≤60 chars and description ≤160 chars
    - **Validates: Requirements 13.1**

- [x] 3. Animation engine and hooks
  - [x] 3.1 Implement reduced motion detection hook
    - Create `src/hooks/useReducedMotion.ts` that returns a boolean based on `prefers-reduced-motion: reduce` media query
    - Listen for changes to the media query and update state reactively
    - _Requirements: 5.4, 5.6, 7.3_

  - [x] 3.2 Implement animation provider and scroll animation hook
    - Create `src/animation/AnimationProvider.tsx` with context providing `isReducedMotion`, `registerAnimation`, and `contextSafe`
    - Create `src/animation/useScrollAnimation.ts` that wraps GSAP ScrollTrigger with the `useGSAP` hook for automatic cleanup
    - When reduced motion is active, apply duration 0ms (instant state changes) preserving final visual states
    - _Requirements: 5.1, 5.2, 5.4, 5.5_

  - [x] 3.3 Create animation presets
    - Create `src/animation/presets.ts` with reusable animation configs (fade-in, slide-up, stagger-children, parallax)
    - Ensure all preset durations are capped at 2000ms
    - Include reduced motion fallbacks for each preset
    - _Requirements: 5.1, 5.5_

  - [x]* 3.4 Write property tests for animation constraints
    - **Property 7: Reduced motion disables all movement animations**
    - **Property 8: Animation duration cap**
    - Verify all animation presets respect the 2000ms cap and reduced motion disables transforms/movements
    - **Validates: Requirements 5.4, 5.5, 7.3**

- [x] 4. Core layout and navigation
  - [x] 4.1 Implement Layout component
    - Create `src/components/Layout/Layout.tsx` and `Layout.module.css`
    - Wrap children with NavigationSystem and Footer
    - NavigationSystem and Layout are outside the error boundary
    - _Requirements: 2.1, 7.1_

  - [x] 4.2 Implement NavigationSystem component
    - Create `src/components/Navigation/NavigationSystem.tsx` and `NavItem.tsx` with `Navigation.module.css`
    - Render navigation items for all sections in narrative order
    - Support fixed positioning without overlapping main content
    - Implement mobile-responsive transformation (hamburger menu or sidebar) with 44x44px minimum tap targets
    - Support keyboard navigation (tab, Enter, Space)
    - Visually highlight the active section navigation item
    - _Requirements: 6.2, 10.1, 10.2, 10.4, 10.5_

  - [x] 4.3 Implement useActiveSection hook
    - Create `src/hooks/useActiveSection.ts` using Intersection Observer with 0.5 threshold
    - Return exactly one active section ID at any scroll position
    - Provide graceful fallback if Intersection Observer is unsupported (first section active by default)
    - _Requirements: 10.3_

  - [x] 4.4 Implement SectionWrapper UI component
    - Create `src/components/ui/SectionWrapper.tsx` with scroll animation integration
    - Apply GSAP fade-in animation via `useGSAP` hook (skip entirely if reduced motion)
    - Ensure semantic `<section>` element with proper `id` attribute
    - _Requirements: 2.2, 5.2, 7.1_

  - [x]* 4.5 Write property tests for navigation
    - **Property 13: Navigation items reflect available sections in narrative order**
    - **Property 14: Single active navigation item**
    - Use fast-check to generate subsets of sections and verify navigation rendering and active state
    - **Validates: Requirements 10.1, 10.3**

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Homepage sections implementation
  - [x] 6.1 Implement HeroSection
    - Create `src/components/sections/HeroSection.tsx` with 100vh min-height, name, tagline, and visual element
    - Apply the engineering-inspired visual motifs (grid overlay or technical annotations)
    - Ensure hero title is at least 3x body text size using the design token scale
    - _Requirements: 2.3, 3.4, 3.5_

  - [x] 6.2 Implement narrative content sections
    - Create `src/components/sections/BeginningSection.tsx`, `IterationSection.tsx`, `PennStateSection.tsx`, `CurrentlySection.tsx`, `LabNotesSection.tsx`
    - Each reads content from the Content_Layer via the corresponding data file
    - Each returns `null` if its content is null/undefined (no empty placeholders)
    - Use `SectionWrapper` for consistent animation and semantic structure
    - _Requirements: 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 14.1, 14.4_

  - [x]* 6.3 Write property tests for section content rendering
    - **Property 1: Section content rendering**
    - **Property 2: Null content omission**
    - Use fast-check to generate arbitrary `SectionContent` values (including null) and verify render behavior
    - **Validates: Requirements 2.4, 2.5, 2.6, 2.7, 2.8, 2.9**

- [x] 7. Projects and case study system
  - [x] 7.1 Implement ProjectList component
    - Create `src/components/projects/ProjectList.tsx` and `Projects.module.css`
    - Display projects in a format distinct from a generic card grid (e.g., stacked editorial layout)
    - Show title and summary for each project
    - Allow selection of a project to open its full case study
    - _Requirements: 4.2, 4.3_

  - [x] 7.2 Implement CaseStudyView component
    - Create `src/components/projects/CaseStudyView.tsx`
    - Render four sections: context, process, technical details, visual documentation
    - Conditionally render GitHub repo link only when `repositoryUrl` is defined
    - Omit optional fields (description, images, caseStudySections) when undefined without placeholders
    - Provide a visible close/back control to return to project listing
    - _Requirements: 4.1, 4.3, 4.5, 4.6, 14.4_

  - [x] 7.3 Implement ProjectsSection container
    - Create `src/components/sections/ProjectsSection.tsx`
    - Manage state between list view and case study view
    - Integrate with SectionWrapper for animation
    - _Requirements: 4.2, 4.3_

  - [x]* 7.4 Write property tests for the case study system
    - **Property 3: Case study structure completeness**
    - **Property 4: Project listing displays title and summary**
    - **Property 5: Case study selection reveals full content**
    - **Property 6: Repository link conditional rendering**
    - **Property 18: Optional field omission**
    - Use fast-check to generate arbitrary `CaseStudyData` with varying optional fields
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.5, 4.6, 14.4**

- [x] 8. Timeline and contact sections
  - [x] 8.1 Implement TimelineSection and TimelineEntry
    - Create `src/components/sections/TimelineSection.tsx` and `src/components/timeline/TimelineEntry.tsx` with `Timeline.module.css`
    - Display entries in chronological order (sort by date)
    - Use directional layout (vertical) with visible date labels per entry
    - Render minimum 3 entries from Content_Layer
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [x] 8.2 Implement ContactSection
    - Create `src/components/sections/ContactSection.tsx`
    - Render email as `mailto:` link, social links with `target="_blank"` and `rel="noopener noreferrer"`
    - Include resume PDF download/view link
    - No backend form — direct links only
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 15.2_

  - [x]* 8.3 Write property tests for timeline and contacts
    - **Property 15: Timeline chronological ordering**
    - **Property 16: Social links open in new tab**
    - Use fast-check to generate arbitrary timeline entries and verify sort order; verify social link attributes
    - **Validates: Requirements 11.1, 12.2**

- [x] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. App wiring, routing, and SEO
  - [x] 10.1 Wire App component with HashRouter and all sections
    - Create `src/App.tsx` with HashRouter, Layout, and all section components in narrative order
    - Conditionally render sections based on content availability (omit null sections)
    - Integrate AnimationProvider at root level
    - Register GSAP plugins (ScrollTrigger) at app entry
    - _Requirements: 2.1, 2.9, 1.3_

  - [x] 10.2 Implement SEO metadata in index.html
    - Add meta title (≤60 chars), meta description (≤160 chars)
    - Add Open Graph tags (og:title, og:description, og:image, og:url, og:type)
    - Add canonical URL pointing to the GitHub Pages deployment URL
    - Add favicon links (32x32 and 180x180)
    - Use semantic HTML structure with single h1
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 10.3 Implement error boundary
    - Create a top-level React Error Boundary wrapping main content (not Navigation/Layout)
    - On error: log to console, render nothing for the failed section, other sections continue
    - _Requirements: 2.9_

- [x] 11. Accessibility, responsiveness, and visual polish
  - [x] 11.1 Implement accessibility features across all components
    - Ensure semantic HTML (nav, main, section, article, header, footer) with single h1 and no skipped heading ranks
    - Add visible focus indicators (2px outline) to all focusable elements
    - Add descriptive alt text (≤125 chars) for informational images, empty alt for decorative
    - Ensure accessible names via labels/ARIA for all controls without visible text
    - Verify minimum contrast ratio compliance in token colors (4.5:1 normal, 3:1 large)
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 7.6_

  - [x] 11.2 Implement responsive layouts
    - Add responsive breakpoints: desktop (≥1200px), laptop (992–1199px), tablet (768–991px), mobile (<768px)
    - Ensure body text minimum 16px, secondary text minimum 14px
    - Ensure images and media scale fluidly within containers, no horizontal overflow
    - Verify 44x44px tap targets on tablet/mobile
    - _Requirements: 6.1, 6.3, 6.4, 6.5_

  - [x]* 11.3 Write property tests for accessibility
    - **Property 9: Heading hierarchy validity**
    - **Property 10: Image alt text constraints**
    - **Property 11: Color contrast compliance**
    - Use fast-check to verify heading structure, alt text lengths, and contrast ratios
    - **Validates: Requirements 7.1, 7.4, 7.5**

- [x] 12. Performance optimization and asset migration
  - [x] 12.1 Implement lazy loading for below-fold images and assets
    - Create `src/hooks/useLazyLoad.ts` using Intersection Observer
    - Apply lazy loading to all images >50KB below the initial viewport
    - Ensure Hero_Section loads without waiting for below-fold assets
    - _Requirements: 8.2, 8.3_

  - [x] 12.2 Migrate existing assets and implement asset verification
    - Copy all images from `assets/img/` to `src/assets/img/`
    - Copy resume PDF from `assets/pdf/` to `src/assets/pdf/`
    - Copy favicons from `assets/favicons/` to `src/assets/favicons/`
    - Create `src/utils/assetVerification.ts` that checks all source assets exist in build output and fails the build if any are missing
    - _Requirements: 15.1, 15.2, 15.5_

  - [x] 12.3 Configure image optimization in build pipeline
    - Configure `vite-plugin-image-optimizer` for WebP/AVIF output with fallbacks
    - Verify no single JS bundle exceeds 150KB gzipped via manual chunks config
    - _Requirements: 8.1, 8.5_

  - [x]* 12.4 Write property test for asset verification
    - **Property 19: Asset verification completeness**
    - Use fast-check to generate sets of expected vs. actual files and verify the verification function reports missing assets
    - **Validates: Requirements 15.5**

- [x] 13. Easter eggs and final touches
  - [x] 13.1 Implement easter egg system
    - Create `src/hooks/useEasterEgg.ts` for detecting deliberate interactions (click sequences, key combos)
    - Ensure easter eggs do not alter tab order, obstruct focusable elements, or remove content from accessibility tree
    - Provide visible acknowledgment within 1 second, dismissable without page reload
    - Respect reduced motion (static visual changes only when active)
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [x] 13.2 Configure GitHub Actions deployment workflow
    - Create `.github/workflows/deploy.yml` to build on push to main and deploy to `gh-pages` branch
    - Ensure deployment branch is separate from source branch
    - Pre-redesign site remains in git history for rollback
    - _Requirements: 1.1, 15.3, 15.4_

- [x] 14. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The design uses TypeScript throughout — all implementation should use `.ts`/`.tsx` extensions
- Content must come exclusively from the Content_Layer data files — no hardcoded text in components
- All 11 existing projects must be preserved in the projects data file
- The existing site remains revertible via git history on the gh-pages branch

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "3.1"] },
    { "id": 4, "tasks": ["2.4", "2.5", "3.2"] },
    { "id": 5, "tasks": ["3.3", "4.1", "4.3"] },
    { "id": 6, "tasks": ["3.4", "4.2", "4.4"] },
    { "id": 7, "tasks": ["4.5", "6.1", "6.2"] },
    { "id": 8, "tasks": ["6.3", "7.1", "8.1", "8.2"] },
    { "id": 9, "tasks": ["7.2"] },
    { "id": 10, "tasks": ["7.3", "7.4", "8.3"] },
    { "id": 11, "tasks": ["10.1", "10.2", "10.3"] },
    { "id": 12, "tasks": ["11.1", "11.2", "12.1", "12.2"] },
    { "id": 13, "tasks": ["11.3", "12.3", "12.4"] },
    { "id": 14, "tasks": ["13.1", "13.2"] }
  ]
}
```
