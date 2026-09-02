# Implementation Plan: Portfolio UI Modernization

## Overview

This plan implements the modernized portfolio UI (top sticky navbar, matte typographic hero, responsive card grid, structured case studies, and an accessible renders lightbox) as a Vite + React 18 + TypeScript SPA. Work is sequenced to establish the token foundation and pure logic helpers first, then build components on top of them, and finally wire everything into `App`/`Layout` and verify the deployment build. The existing project data layer, filtering utilities, and `ModelViewer` are preserved and reused.

Property-based tests (fast-check) target the pure-logic surfaces defined in the design's Correctness Properties. Example/unit tests cover component behavior and accessibility, and smoke/static tests cover token- and CSS-driven requirements. Test sub-tasks are marked optional with `*`.

## Tasks

- [x] 1. Establish design tokens and shared foundations
  - [x] 1.1 Extend `tokens.css` with the product-design theme tokens
    - Add `--color-bg-base: #090a0f`, `--color-surface-card: #161b22`, `--color-border: #30363d`, and a cobalt/steel-blue `--color-accent`
    - Add `--font-display` (Inter/system sans stack) and tight `--header-letter-spacing`
    - Add `--navbar-blur` (≥8px), `--navbar-bg` (alpha 0.6–0.85), `--navbar-height` fallback, and `--gallery-gutter`
    - Preserve existing tokens and the `prefers-reduced-motion` duration overrides
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 1.10, 11.2_

  - [ ]* 1.2 Write smoke/static tests for token values and contrast
    - Assert base/surface/border/accent hex values, Inter display stack, and tight header letter-spacing
    - Assert navbar blur ≥8px and background alpha within 0.6–0.85
    - Compute contrast ratios for text-on-surface and nav-text-on-navbar pairs (≥4.5:1 normal, ≥3:1 large)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.7, 2.5, 1.10_

- [x] 2. Implement pure scroll and active-section logic
  - [x] 2.1 Create the `scrollToSection` helper with an extracted pure target computation
    - Add `src/utils/scrollToSection.ts` exporting `computeScrollTarget(top, scrollY, offset)` returning `max(0, top + scrollY - offset)`
    - Implement `scrollToSection(id, { offset, reducedMotion })` that no-ops (no throw) when the element is absent and chooses `'smooth'` vs `'auto'` behavior
    - Guard `typeof window` for test/SSR safety
    - _Requirements: 1.5, 1.7, 1.8_

  - [ ]* 2.2 Write property test for scroll target computation and missing-target safety
    - **Property 1: Scroll target computation and missing-target safety**
    - **Validates: Requirements 1.5, 1.8**

  - [x] 2.3 Extract a pure `selectActiveSection` helper from active-section logic
    - Add `selectActiveSection(offsets, scrollY, navbarHeight)` (co-located with `useActiveSection`) returning exactly one section id whose top edge is nearest to but not below the navbar bottom edge
    - Refactor `useActiveSection` to use the pure helper without changing observed behavior
    - _Requirements: 1.11_

  - [ ]* 2.4 Write property test for exactly-one active section selection
    - **Property 2: Exactly one active section is selected**
    - **Validates: Requirements 1.11**

- [x] 3. Build the Top Navigation Bar
  - [x] 3.1 Implement the `TopNavbar` component and its styles
    - Add `src/components/Navigation/TopNavbar.tsx` rendering `<header>` (sticky, `top:0`) containing `<nav aria-label="Primary">`
    - Render the wordmark at the left and Nav_Links (Projects, Renders, About, Resume, Contact) right-aligned in order
    - Report rendered height via `ResizeObserver` and write it to `--navbar-height`; dispatch scroll requests through `scrollToSection`
    - Render the Resume link as `<a target="_blank" rel="noopener noreferrer">` with a visually-hidden "(opens in new tab)" indication
    - Apply the active class to exactly one link derived from `activeSection`; apply glassmorphism, ≥2px focus ring, and ≥44×44px targets via tokens
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.9, 1.10, 1.11, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 3.2 Write unit tests for `TopNavbar`
    - Assert `<nav>` with accessible name, wordmark + links in order, resume anchor attributes and new-tab indication
    - Assert wordmark activates scroll to `hero`, nav link click calls the scroll helper with the correct id, and reduced-motion selects instant behavior
    - _Requirements: 1.3, 1.4, 1.6, 1.9, 2.1, 2.6, 1.7_

- [x] 4. Restyle the Hero Section
  - [x] 4.1 Rebuild `HeroSection` content, actions, and matte background
    - Render a single `<h1>` "Tomas Bentolila", subtitle "Mechanical Engineering • Penn State", and Focus_Tags (Mechanical Design, CAD/FEA, Robotics)
    - Remove `HeroVisual`/particle constellation and the misspelled descriptor text; apply matte base background (optional static grid overlay ≤0.15 opacity, no animation)
    - Apply `--font-display` and `--header-letter-spacing` to the H1; enforce H1 > subtitle ≥ focus-tags font sizing
    - Add filled "View Work" `Primary_Action_Button` (scrolls to `projects`) and outline "Resume" `Secondary_Action_Button` (`<a target="_blank" rel="noopener noreferrer">`), both keyboard operable with ≥2px focus ring and ≥44×44px targets
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4_

  - [ ]* 4.2 Write unit tests for `HeroSection`
    - Assert exactly one `<h1>` with the name, subtitle and focus tags present, misspelled descriptor absent, no particle element
    - Assert View Work scrolls to `projects` and Resume anchor has correct new-tab attributes
    - _Requirements: 3.1, 3.4, 4.2, 4.4, 5.2_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Restyle the Projects grid and cards
  - [x] 6.1 Apply responsive 3/2/1-column grid and card styling
    - Set grid `grid-template-columns` to `repeat(3,1fr)` (≥1024px), `repeat(2,1fr)` (768–1023px), `1fr` (<768px), keeping cards inside the `id="projects"` `SectionWrapper`
    - Style `ProjectCard`: 16:9 preview image, title, ≤200-char summary via existing `truncateSummary`, tech pills from `project.technologies`
    - Add hover accent border + `translateY(-2px…-8px)` image lift, gating the transform behind `prefers-reduced-motion` while keeping the border transition; ensure focusable card with ≥2px focus ring
    - Source all values from tokens (no hardcoded colors/fonts)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_

  - [ ]* 6.2 Write property test for summary length invariant
    - **Property 3: Project card summary length invariant**
    - **Validates: Requirements 7.3**

  - [ ]* 6.3 Write unit tests for `ProjectCard` presentation
    - Assert 16:9 image container, title, tech pills from `technologies`, focusable `role="button"`, activation on click/Enter/Space
    - _Requirements: 7.1, 7.2, 7.4, 7.6, 7.7_

  - [ ]* 6.4 Write property test for category filtering contract
    - **Property 4: Category filtering contract**
    - **Validates: Requirements 8.2, 8.3, 8.4**

  - [ ]* 6.5 Write unit tests for `CategoryFilter`/landing page filtering
    - Assert five filter options, exactly one active at a time, and that selecting a category updates shown cards on real data
    - _Requirements: 8.1, 8.5, 8.6_

- [x] 7. Restructure the Case Study view
  - [x] 7.1 Implement canonical section ordering helper
    - Add a pure `orderCaseStudySections(sections)` helper co-located with `CaseStudyView` using the `SECTION_ORDER` rank map and a stable sort
    - Return only present sections in canonical order (Problem Overview → Design & CAD Modeling → Prototyping & Fabrication → Outcome/Specifications), preserving data order within equal rank and never adding/dropping sections
    - _Requirements: 10.1_

  - [ ]* 7.2 Write property test for case study canonical ordering
    - **Property 5: Case study section canonical ordering**
    - **Validates: Requirements 10.1**

  - [x] 7.3 Build `QuickSpecBar` and restructure `CaseStudyView`
    - Add `src/components/projects/QuickSpecBar.tsx` rendering tool pills from `project.technologies` and a conditional resource link (repo/CAD URL) opening in a new tab
    - Render project title as `<h2>`, role/timeframe from data, section headings as `<h3>`, and use `orderCaseStudySections` for content ordering
    - Add "← Back to Projects" `Back_Link` (keyboard operable, invokes `onBack`); omit the sections container entirely when no sections are present
    - Constrain media embeds to `max-width:100%` with `height:auto` to preserve aspect ratio
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 7.4 Write unit tests for `CaseStudyView`/`QuickSpecBar`
    - Assert title as `<h2>`, section headings as `<h3>`, role/timeframe, tool pills, keyboard-activated back link, repo link only when URL defined, and no empty section container when sections absent (edge case)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.7, 10.3, 10.4_

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Build the Renders Gallery and Lightbox
  - [x] 9.1 Implement lightbox index navigation helpers
    - Add pure `nextIndex`/`prevIndex` and first/last boundary predicates in `src/components/gallery/Lightbox.tsx`
    - `next` → `min(i+1, n-1)` disabled iff `i = n-1`; `prev` → `max(i-1, 0)` disabled iff `i = 0`; result always in-bounds
    - _Requirements: 12.8_

  - [ ]* 9.2 Write property test for lightbox index navigation and boundary disabling
    - **Property 6: Lightbox index navigation with boundary disabling**
    - **Validates: Requirements 12.8**

  - [x] 9.3 Restyle `RendersGallery` grid with lazy loading
    - Evolve `BlenderGallery` into `src/components/gallery/RendersGallery.tsx` reading `blenderGallery` data inside the `id="gallery"` `SectionWrapper`
    - Apply responsive grid with uniform `--gallery-gutter`; single column `<768px`; lazy-load images via `loading="lazy"`/`useLazyLoad` with `rootMargin: '100vh'`
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [x] 9.4 Implement the accessible `Lightbox` component
    - Open on render-item click/Enter/Space with full-resolution source; render `<video controls>` (play/pause/seek) for video items
    - Display `Render_Caption` with producing software; close on Escape, close control, and backdrop click
    - Lock page scroll while open and restore scroll position on close; return focus to the triggering render item
    - Implement a focus trap (Tab/Shift+Tab wrap first↔last) and prev/next controls (click/Enter/Space/Arrow) that swap item + caption and disable at boundaries
    - Handle load failure/10s timeout by keeping the lightbox open, showing a "could not load" message, and retaining the current index
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9_

  - [ ]* 9.5 Write unit tests for `RendersGallery`/`Lightbox`
    - Assert grid single-column rule, lazy-load attributes, open on click/Enter/Space with full-res src, video `controls`, caption software text
    - Assert Escape/close/backdrop close, scroll lock + restore, focus return to trigger, focus-trap wrap, and load-failure/timeout keeps lightbox open with retained index (edge case)
    - _Requirements: 11.3, 11.4, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.9_

- [x] 10. Integrate components and finalize deployment
  - [x] 10.1 Wire `TopNavbar`, hero, and gallery into `Layout`/`App`
    - Render `TopNavbar` in `Layout` (replacing the left floating dot navigation) and pass `NAV_LINKS`, `activeSection`, wordmark, and `resumeHref`
    - Ensure section anchors `id="hero"`, `id="projects"`, `id="gallery"`, and `id="contact"` are present and wire `RendersGallery` into the main content
    - Confirm the "About" link resolves to an existing anchor and relies on the missing-target no-op guard otherwise
    - Ensure all motion-based animations are disabled under reduced motion across navbar, hero, projects, card hover, and gallery
    - _Requirements: 1.1, 14.1, 14.2, 14.4_

  - [x] 10.2 Verify the production build and asset paths
    - Run `tsc -b && vite build` and the `verify-assets` step; resolve any build errors and 404-prone asset paths (including `resumeHref`) under HashRouter/GitHub Pages base
    - _Requirements: 14.3_

  - [ ]* 10.3 Write integration/smoke tests for anchors, reduced motion, and breakpoints
    - Assert section anchors resolve for navbar navigation and that the dot navigation is not rendered
    - Assert `prefers-reduced-motion` zeroes animation durations across surfaces; assert grid breakpoint rules (3/2/1) and gallery single-column rule
    - _Requirements: 1.1, 6.1, 6.2, 6.3, 11.3, 14.2, 14.4_

- [x] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP.
- Each task references specific requirements (granular clauses) for traceability.
- Checkpoints ensure incremental validation of the modernized surfaces.
- Property tests (fast-check) validate the universal correctness properties from the design; each lives under `src/__tests__/properties/` and is tagged `// Feature: portfolio-ui-modernization, Property {n}: {property text}`.
- Unit and smoke/static tests validate component behavior, accessibility, and token/CSS-driven requirements that jsdom cannot layout-resolve.
- The existing `ProjectData` model, `filterProjects`/`sortByDisplayOrder`, `truncateSummary`, and `ModelViewer` are preserved and reused.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "2.3", "7.1", "9.1"] },
    { "id": 1, "tasks": ["1.2", "2.2", "2.4", "3.1", "4.1", "6.1", "7.3", "9.3", "9.4"] },
    { "id": 2, "tasks": ["3.2", "4.2", "6.2", "6.3", "6.4", "6.5", "7.2", "7.4", "9.2", "9.5", "10.1"] },
    { "id": 3, "tasks": ["10.2"] },
    { "id": 4, "tasks": ["10.3"] }
  ]
}
```
