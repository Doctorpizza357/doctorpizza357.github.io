# Requirements Document

## Introduction

This document specifies the requirements for modernizing the portfolio website's user interface into a clean, structured, production-grade engineering portfolio with a product-design aesthetic (Linear / Vercel reference style). The modernization replaces the existing left floating dot navigation and animated floating constellation hero layout with a top sticky navbar, a focused typographic hero, a card-based projects grid, structured case study detail pages, and a lightbox-enabled renders gallery.

This spec builds on and extends the prior `project-section-overhaul` spec. That spec established the Project_Data_Layer, the Model_Viewer, category filtering, case study structure, accessibility, responsiveness, and performance behavior for the projects experience. This spec supersedes the UI direction of that work: it defines the new site-wide navigation, hero, visual language, and card presentation, while preserving the underlying project data architecture, filtering behavior, and accessibility guarantees already specified. Where this document and `project-section-overhaul` overlap, this document governs the visual presentation and layout, and the prior spec governs the data model and interaction internals unless explicitly restated here.

The application is a Vite + React + TypeScript single-page application deployed to GitHub Pages using HashRouter. All visual values are sourced from the centralized design token system (`src/styles/tokens.css`).

## Glossary

- **System**: The portfolio web application as a whole, comprising all sections, navigation, and styling.
- **Top_Navbar**: The sticky navigation bar fixed to the top of the viewport, replacing the prior left floating dot menu, containing the site wordmark and primary navigation links.
- **Wordmark**: The text label "Tomas Bentolila" displayed at the left of the Top_Navbar.
- **Nav_Link**: An individual navigation control within the Top_Navbar (Projects, Renders, About, Resume, Contact).
- **Resume_Link**: The Nav_Link and hero action control that opens the resume PDF located at the resume asset path.
- **Hero_Section**: The introductory section (id="hero") presenting the primary heading, subtitle, focus tags, and action buttons.
- **Focus_Tags**: A short set of discipline labels displayed in the Hero_Section (Mechanical Design, CAD/FEA, Robotics).
- **Primary_Action_Button**: The filled hero button labeled "View Work" that navigates to the Projects_Section.
- **Secondary_Action_Button**: The outline hero button labeled "Resume" that opens the resume PDF.
- **Projects_Section**: The section (id="projects") displaying the category filters and the grid of Project_Cards.
- **Category_Filter**: The filtering control providing the options All, Mechanical, Robotics, Software, and Systems.
- **Project_Card**: A card component in the Projects_Section grid displaying a project preview image, title, technical summary, and technology pills.
- **Tech_Pill**: A small labeled tag within a Project_Card or case study representing a technology or tool (e.g., Onshape, Fusion 360, FEA, 3D Printing).
- **Case_Study_View**: A detailed project page presenting a single project's engineering documentation structure.
- **Quick_Spec_Bar**: A metadata bar at the top of the Case_Study_View displaying tools used and CAD files/repository link.
- **Back_Link**: A navigation control in the Case_Study_View labeled to return to the Projects_Section.
- **Renders_Gallery**: The section (id="gallery") presenting a responsive grid of 3D renders.
- **Render_Item**: A single render (image or video) within the Renders_Gallery.
- **Lightbox**: A modal overlay that displays a Render_Item at full resolution with a caption.
- **Render_Caption**: The text caption on a Lightbox describing the software or engine used to produce the render.
- **Design_Tokens**: The centralized CSS custom properties defined in `src/styles/tokens.css` used for color, typography, and spacing values.
- **Reduced_Motion**: The state in which the user's `prefers-reduced-motion` media query evaluates to `reduce`.

## Requirements

### Requirement 1: Top Sticky Navigation Bar

**User Story:** As a visitor, I want a persistent top navigation bar, so that I can reach any section of the portfolio from anywhere on the page.

#### Acceptance Criteria

1. THE Top_Navbar SHALL replace the left floating dot navigation, and THE System SHALL NOT render the left floating dot navigation.
2. THE Top_Navbar SHALL remain fixed to the top edge of the viewport while the user scrolls the page.
3. THE Top_Navbar SHALL display the Wordmark "Tomas Bentolila" aligned to the left edge of the Top_Navbar content area.
4. THE Top_Navbar SHALL display the following Nav_Links aligned to the right edge of the Top_Navbar content area in this order: Projects, Renders, About, Resume, Contact.
5. WHEN a user activates the Projects, Renders, or Contact Nav_Link via pointer click or keyboard (Enter or Space), THE System SHALL scroll the viewport so that the corresponding section (id="projects", id="gallery", or id="contact" respectively) aligns to the top of the viewport with a top offset equal to the rendered height of the Top_Navbar, so that the section heading is not obscured by the Top_Navbar.
6. WHEN a user activates the Wordmark via pointer click or keyboard (Enter or Space), THE System SHALL scroll the viewport to the Hero_Section (id="hero").
7. THE System SHALL perform Nav_Link and Wordmark scrolling with smooth scroll behavior, and WHILE Reduced_Motion is active, THE System SHALL perform the scroll instantly to the final position.
8. IF a Nav_Link's target section is not present in the document, THEN THE System SHALL take no scroll action and SHALL NOT throw an error.
9. WHEN a user activates the Resume_Link, THE System SHALL open the resume PDF located at the resume asset path in a new browser tab.
10. THE Top_Navbar SHALL apply a glassmorphism appearance consisting of a backdrop blur of at least 8 pixels, a translucent dark background with an alpha value between 0.6 and 0.85, and a bottom border of 1 pixel width using the border color token.
11. THE System SHALL determine the active section as the section whose top edge is nearest to, but not below, the Top_Navbar bottom edge, and THE Top_Navbar SHALL apply a visually distinct active state to the Nav_Link corresponding to that section such that exactly one Nav_Link appears active at a time.

### Requirement 2: Top Navigation Accessibility and Keyboard Operation

**User Story:** As a visitor using assistive technology, I want the top navigation to be fully operable by keyboard and understandable by screen readers, so that I can navigate the portfolio regardless of ability.

#### Acceptance Criteria

1. THE Top_Navbar SHALL be contained within a `<nav>` landmark element with an accessible name.
2. THE Nav_Links and Wordmark SHALL be operable via keyboard using Tab navigation and Enter activation.
3. WHEN a Nav_Link or the Wordmark receives keyboard focus, THE System SHALL display a visible focus indicator of at least 2 pixels outline width with a contrast ratio of at least 3:1 against the Top_Navbar background.
4. THE Nav_Links and Wordmark SHALL each present a touch-target size of at least 44 by 44 CSS pixels.
5. THE Top_Navbar SHALL maintain a color contrast ratio of at least 4.5:1 for Nav_Link text against the Top_Navbar background.
6. WHERE the Resume_Link opens a resource in a new tab, THE Resume_Link SHALL include an accessible indication that it opens in a new tab.

### Requirement 3: Hero Section Content and Typography

**User Story:** As a visitor, I want a clean, focused hero section, so that I immediately understand who the portfolio owner is and what they do.

#### Acceptance Criteria

1. THE Hero_Section SHALL render a single level-1 heading containing the text "Tomas Bentolila".
2. THE Hero_Section SHALL render a subtitle containing the text "Mechanical Engineering • Penn State".
3. THE Hero_Section SHALL display the Focus_Tags "Mechanical Design", "CAD/FEA", and "Robotics".
4. THE Hero_Section SHALL NOT display the previously misspelled descriptor text "Mehchanical Engineering, Coding, Robotics".
5. THE Hero_Section SHALL apply the display font family and header letter-spacing values defined in Design_Tokens to the level-1 heading.
6. THE Hero_Section SHALL present a typographic hierarchy in which the level-1 heading renders at a larger computed font size than the subtitle, and the subtitle renders at a larger or equal computed font size than the Focus_Tags.

### Requirement 4: Hero Section Actions

**User Story:** As a visitor, I want clear call-to-action buttons in the hero, so that I can jump to the work or open the resume immediately.

#### Acceptance Criteria

1. THE Hero_Section SHALL display a Primary_Action_Button labeled "View Work".
2. WHEN a user activates the Primary_Action_Button, THE System SHALL scroll the viewport to the Projects_Section (id="projects").
3. THE Hero_Section SHALL display a Secondary_Action_Button labeled "Resume" rendered with an outline style distinct from the filled Primary_Action_Button.
4. WHEN a user activates the Secondary_Action_Button, THE System SHALL open the resume PDF located at the resume asset path in a new browser tab.
5. THE Primary_Action_Button and Secondary_Action_Button SHALL each be operable via keyboard using Tab navigation and Enter activation, and SHALL display a visible focus indicator of at least 2 pixels outline width when focused.
6. THE Primary_Action_Button and Secondary_Action_Button SHALL each present a touch-target size of at least 44 by 44 CSS pixels.

### Requirement 5: Hero Section Background

**User Story:** As a visitor, I want a calm, matte background in the hero, so that the content stays the focus without distracting animation.

#### Acceptance Criteria

1. THE Hero_Section SHALL render a matte dark background using a base color defined in Design_Tokens within the range of #090a0f to #0f1117.
2. THE System SHALL NOT render the animated floating particle constellation in the Hero_Section.
3. THE Hero_Section SHALL render either a static technical coordinate grid overlay at an opacity no greater than 0.15 or a solid background containing no animated elements.
4. WHILE Reduced_Motion is active, THE Hero_Section SHALL render no motion-based animation.

### Requirement 6: Projects Grid Layout

**User Story:** As a visitor, I want to browse projects in a clean card grid, so that I can quickly scan the range of engineering work.

#### Acceptance Criteria

1. WHILE the viewport width is 1024 pixels or greater, THE Projects_Section SHALL arrange Project_Cards in a grid of 3 columns.
2. WHILE the viewport width is at least 768 pixels and less than 1024 pixels, THE Projects_Section SHALL arrange Project_Cards in a grid of 2 columns.
3. WHILE the viewport width is less than 768 pixels, THE Projects_Section SHALL arrange Project_Cards in a single column.
4. THE Projects_Section SHALL render each Project_Card within the id="projects" section wrapper, preserving the existing site section anchor.
5. THE Projects_Section SHALL source all color, typography, and spacing values from Design_Tokens, introducing no hardcoded color or font values.

### Requirement 7: Project Card Content and Interaction

**User Story:** As a visitor, I want each project card to summarize the project at a glance, so that I can decide which case studies to open.

#### Acceptance Criteria

1. THE Project_Card SHALL display a project preview image rendered at a 16:9 aspect ratio.
2. THE Project_Card SHALL display the project title.
3. THE Project_Card SHALL display a technical summary of the project of no more than 200 characters.
4. THE Project_Card SHALL display Tech_Pills representing the project's technologies, sourced from the project's technology list in the Project_Data_Layer.
5. WHEN a user hovers a pointer over a Project_Card, THE Project_Card SHALL apply a border highlight using the accent color token and translate the preview image upward by between 2 and 8 pixels.
6. WHEN a user activates a Project_Card via pointer click or keyboard (Enter or Space), THE System SHALL navigate to the Case_Study_View for that project.
7. THE Project_Card SHALL be focusable via keyboard and SHALL display a visible focus indicator of at least 2 pixels outline width when focused.
8. WHILE Reduced_Motion is active, THE Project_Card SHALL apply the border highlight without the image translation animation.

### Requirement 8: Category Filtering

**User Story:** As a visitor, I want to filter projects by discipline, so that I can focus on the type of engineering work relevant to me.

#### Acceptance Criteria

1. THE Category_Filter SHALL provide the filter options All, Mechanical, Robotics, Software, and Systems.
2. THE Category_Filter SHALL default to the All option showing every project on initial page load.
3. WHEN a user selects a category other than All, THE Category_Filter SHALL display only Project_Cards whose category tags include the selected category and hide all non-matching Project_Cards.
4. WHEN a user selects the All option, THE Category_Filter SHALL display every project defined in the Project_Data_Layer.
5. THE Category_Filter SHALL visually distinguish the currently active option from inactive options so that exactly one option appears active at a time.
6. WHILE Reduced_Motion is active, THE Category_Filter SHALL show and hide Project_Cards with a transition duration of 0 milliseconds while preserving the final layout state.

### Requirement 9: Case Study Header and Metadata

**User Story:** As a recruiter evaluating a project, I want a structured case study header with quick specifications, so that I can immediately see the project's role, timeline, and tools.

#### Acceptance Criteria

1. THE Case_Study_View SHALL display the project title as a heading at the top of the view.
2. THE Case_Study_View SHALL display the project role and timeline sourced from the Project_Data_Layer.
3. THE Case_Study_View SHALL display a Quick_Spec_Bar containing the tools used, sourced from the project's technology list.
4. WHERE a project defines a repository or CAD files URL, THE Quick_Spec_Bar SHALL display a link to that URL that opens in a new browser tab.
5. THE Case_Study_View SHALL display a Back_Link labeled "← Back to Projects".
6. WHEN a user activates the Back_Link, THE System SHALL navigate back to the Projects_Section landing view.
7. THE Back_Link SHALL be operable via keyboard using Tab navigation and Enter activation.

### Requirement 10: Case Study Content Structure

**User Story:** As a professor reviewing engineering work, I want each case study to follow a standard engineering documentation structure, so that I can evaluate the design process consistently.

#### Acceptance Criteria

1. THE Case_Study_View SHALL render content sections in the following order when the corresponding content is present in the Project_Data_Layer: Problem Overview, Design & CAD Modeling, Prototyping & Fabrication, and Outcome/Specifications.
2. THE Case_Study_View SHALL render each content section with a section heading and section body.
3. THE Case_Study_View SHALL use a semantic heading hierarchy in which the project title uses a higher-level heading than the content section headings.
4. IF a project defines no content sections, THEN THE Case_Study_View SHALL render the project header and metadata without displaying an empty content section container.
5. THE Case_Study_View SHALL embed media items within their associated content sections at a maximum width equal to the section container while maintaining each image's original aspect ratio.

### Requirement 11: Renders Gallery Layout

**User Story:** As a visitor, I want to browse 3D renders in a clean responsive grid, so that I can appreciate the visual work with consistent spacing.

#### Acceptance Criteria

1. THE Renders_Gallery SHALL render Render_Items within the id="gallery" section wrapper.
2. THE Renders_Gallery SHALL arrange Render_Items in a responsive grid with uniform gutter spacing sourced from Design_Tokens between all adjacent Render_Items.
3. WHILE the viewport width is less than 768 pixels, THE Renders_Gallery SHALL arrange Render_Items in a single column.
4. THE Renders_Gallery SHALL lazy-load each Render_Item image such that image fetching begins when the item is within one viewport height of the visible viewport edge.

### Requirement 12: Renders Gallery Lightbox

**User Story:** As a visitor, I want to open a render at full resolution in a lightbox, so that I can view details and see which software produced it.

#### Acceptance Criteria

1. WHEN a user activates a Render_Item via pointer click or keyboard (Enter or Space), THE System SHALL open a Lightbox displaying that Render_Item at its full-resolution source, and WHERE the Render_Item is a video render, THE System SHALL provide playback controls (play, pause, and seek) within the Lightbox.
2. WHILE the Lightbox is open, THE System SHALL display a Render_Caption containing the name of the software or engine that produced the render.
3. WHEN a user presses the Escape key while the Lightbox is open, THE System SHALL close the Lightbox.
4. WHEN a user activates the Lightbox close control or the region outside the Render_Item boundary, THE System SHALL close the Lightbox.
5. WHILE the Lightbox is open, THE System SHALL prevent scrolling of the underlying page content and restore the underlying page scroll position when the Lightbox closes.
6. WHEN the Lightbox closes, THE System SHALL return keyboard focus to the Render_Item that opened the Lightbox.
7. WHILE the Lightbox is open, THE System SHALL constrain keyboard focus to the interactive controls within the Lightbox, such that pressing Tab from the last focusable control moves focus to the first focusable control and pressing Shift+Tab from the first focusable control moves focus to the last.
8. WHEN a user activates the Lightbox next or previous navigation control via pointer click or keyboard (Enter, Space, or Arrow keys) while the Lightbox is open, THE System SHALL replace the displayed Render_Item and Render_Caption with the adjacent Render_Item in gallery order, and WHERE the current Render_Item is the first or last in gallery order, THE System SHALL disable the previous or next control respectively.
9. IF a Render_Item's full-resolution source fails to load within 10 seconds, THEN THE System SHALL keep the Lightbox open, display an indication that the render could not be loaded, and retain the active Render_Item selection so the user can navigate or close the Lightbox.

### Requirement 13: Visual Styling and Theme Tokens

**User Story:** As the portfolio owner, I want a consistent dark product-design theme driven by tokens, so that the interface looks cohesive and is easy to maintain.

#### Acceptance Criteria

1. THE Design_Tokens SHALL define a base background color of #090a0f.
2. THE Design_Tokens SHALL define a card surface color of #161b22.
3. THE Design_Tokens SHALL define a subtle border color of #30363d.
4. THE Design_Tokens SHALL define an accent color in the cobalt or steel blue family used for active states and interactive Tech_Pills.
5. THE Design_Tokens SHALL define the primary heading font family as Inter or a system sans-serif font stack, and a tight header letter-spacing value.
6. THE Top_Navbar, Hero_Section, Projects_Section, Project_Card, Case_Study_View, and Renders_Gallery SHALL source all color, typography, and spacing values exclusively from Design_Tokens, introducing no hardcoded color or font values.
7. THE System SHALL maintain a color contrast ratio of at least 4.5:1 for normal-size text and at least 3:1 for large-size text against the surface on which the text is rendered.

### Requirement 14: Site Preservation and Deployment

**User Story:** As the portfolio owner, I want the modernization to integrate with the existing app and deployment, so that navigation, data, and hosting continue to work without regression.

#### Acceptance Criteria

1. THE System SHALL preserve the Project_Data_Layer, Model_Viewer, category filtering behavior, and case study data model defined in the `project-section-overhaul` spec, reusing that data as the source for Project_Cards and Case_Study_Views.
2. THE System SHALL render section anchors id="hero", id="projects", id="gallery", and id="contact" so that Top_Navbar navigation resolves to the correct sections.
3. THE System SHALL produce zero build errors and render correctly when deployed to GitHub Pages via the existing deploy workflow using HashRouter, with all internal navigation and asset paths resolving without 404 errors.
4. WHILE Reduced_Motion is active, THE System SHALL disable all motion-based animations across the Top_Navbar, Hero_Section, Projects_Section, Project_Card hover states, and Renders_Gallery, applying instant final-state rendering.
