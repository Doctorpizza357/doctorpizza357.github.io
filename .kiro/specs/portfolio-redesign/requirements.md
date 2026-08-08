# Requirements Document

## Introduction

This document defines the requirements for a complete redesign of the Tomas Bentolila portfolio website. The redesign transforms the existing static HTML/CSS/JS portfolio (currently deployed via GitHub Pages) into a narrative-driven, cinematic engineering portfolio built with React + Vite. The core concept is a visual story about becoming an engineer — communicating Tomas's progression from FIRST Robotics and hands-on building into mechanical engineering, CAD, software, and independent engineering projects.

The redesigned site must remain fully statically hostable through GitHub Pages, preserve the existing deployment URL, and present projects as engineering case studies rather than generic card grids.

## Glossary

- **Portfolio_Site**: The complete redesigned portfolio website application built with React and Vite
- **Hero_Section**: The opening full-viewport section that introduces Tomas and establishes the cinematic tone
- **Beginning_Section**: The narrative chapter covering FIRST Robotics origins and early engineering interest
- **Iteration_Section**: A section demonstrating growth and iterative improvement across disciplines
- **Projects_System**: The collection of project case studies presented as in-depth engineering explorations
- **Case_Study**: An individual project presented with context, process, technical details, and outcomes
- **Timeline_Section**: A chronological visualization of Tomas's engineering journey
- **Penn_State_Section**: A section covering academic experience at Penn State
- **Currently_Section**: A section describing current work, interests, and direction
- **Lab_Notes_Section**: A section for informal thoughts, experiments, or smaller observations
- **Contact_Section**: The section providing contact methods and communication channels
- **Navigation_System**: The persistent navigation component enabling section access
- **Animation_Engine**: The GSAP-based animation layer that drives scroll-triggered and narrative animations
- **Content_Layer**: The separated data layer holding all text, images, and metadata independent from presentation components
- **Build_Pipeline**: The Vite-based build toolchain that produces static output for deployment
- **Accent_Color**: The single restrained engineering-inspired color used sparingly against the neutral palette
- **Reduced_Motion_Mode**: The operating state when the user has indicated a preference for reduced motion

## Requirements

### Requirement 1: Static Build and Deployment

**User Story:** As a site owner, I want the redesigned portfolio to deploy through GitHub Pages without any backend, so that hosting remains free and reliable.

#### Acceptance Criteria

1. THE Build_Pipeline SHALL produce a fully static output (HTML, CSS, JS, and assets) deployable to GitHub Pages without server-side processing
2. THE Build_Pipeline SHALL generate all routes as static files compatible with GitHub Pages single-page-app routing via a 404.html fallback
3. THE Portfolio_Site SHALL operate without a backend server, database, or authentication system
4. THE Build_Pipeline SHALL use React with Vite as the component framework and build tool

### Requirement 2: Narrative Homepage Structure

**User Story:** As a visitor, I want the homepage to feel like a continuous story with chapter-like sections, so that I understand Tomas's engineering journey as a cohesive narrative.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render the homepage as a single continuous scrolling page with sections presented in narrative order: Hero_Section, Beginning_Section, Iteration_Section, Projects_System, Timeline_Section, Penn_State_Section, Currently_Section, Lab_Notes_Section, Contact_Section
2. WHEN a visitor scrolls through the page, THE Portfolio_Site SHALL present each section as a distinct chapter with visual transitions that maintain narrative continuity
3. THE Hero_Section SHALL introduce Tomas Bentolila with a full-viewport opening that establishes the cinematic, engineering-focused tone
4. THE Beginning_Section SHALL communicate the FIRST Robotics origin story and early hands-on engineering interest
5. THE Iteration_Section SHALL demonstrate growth and iterative improvement across engineering disciplines
6. THE Penn_State_Section SHALL present the academic experience at Penn State University
7. THE Currently_Section SHALL describe current work, interests, and engineering direction
8. THE Lab_Notes_Section SHALL display informal engineering thoughts, experiments, or smaller observations

### Requirement 3: Visual Design System

**User Story:** As a visitor, I want the visual design to feel like a modern engineering laboratory crossed with editorial web design, so that the site communicates professionalism and technical depth.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL use a color palette consisting of near-black/charcoal as the primary dark tone, off-white as the primary light tone, muted gray for secondary elements, and one Accent_Color used sparingly for emphasis
2. THE Portfolio_Site SHALL use a modern sans-serif typeface for headings and display text
3. THE Portfolio_Site SHALL use a monospace or technical typeface for metadata, labels, and secondary information
4. THE Portfolio_Site SHALL apply visual references to technical drawings, blueprint aesthetics, CAD software interfaces, and industrial design throughout the layout and component styling
5. THE Portfolio_Site SHALL present typography as a major design element with intentional scale, weight, and spacing hierarchy

### Requirement 4: Project Case Study System

**User Story:** As a visitor, I want to explore projects as detailed engineering case studies, so that I understand the depth and process behind each project rather than seeing a generic list.

#### Acceptance Criteria

1. THE Projects_System SHALL present each project as a Case_Study with dedicated space for context, process description, technical details, and visual documentation
2. THE Projects_System SHALL display projects in a format distinct from a generic card grid layout
3. WHEN a visitor selects a project, THE Projects_System SHALL reveal the full Case_Study content with engineering-focused presentation
4. THE Projects_System SHALL preserve references to all existing projects: Pathfinding Visualizer, Tic-Tac-Toe, Sorting Algorithm Visualizer, Pizza Browser, Auto Typer, Map Path Finding, Directory Sorter, Network Traffic Analyzer, Folder Encrypter, Radical Simplifier, and Heap Tree Visualizer
5. THE Projects_System SHALL link each Case_Study to its corresponding GitHub repository

### Requirement 5: Animation and Motion Design

**User Story:** As a visitor, I want animations that support the narrative and feel intentional, so that the experience feels cinematic without being distracting.

#### Acceptance Criteria

1. THE Animation_Engine SHALL use GSAP for scroll-triggered animations, timeline-based sequences, and element transitions
2. WHEN the Animation_Engine triggers animations, THE Portfolio_Site SHALL ensure each animation supports the narrative purpose of the section rather than existing purely for decoration
3. WHERE Three.js is used, THE Portfolio_Site SHALL limit 3D elements to contexts where spatial visualization adds meaningful communication value
4. WHILE Reduced_Motion_Mode is active, THE Animation_Engine SHALL disable or minimize all non-essential animations and transitions
5. THE Animation_Engine SHALL not block page interaction or prevent content from being accessible during animation sequences

### Requirement 6: Responsive Design

**User Story:** As a visitor on any device, I want the portfolio to adapt to my screen size, so that the experience is optimized for desktop, laptop, tablet, and mobile viewports.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL adapt its layout and typography for desktop viewports (1200px and above), laptop viewports (992px to 1199px), tablet viewports (768px to 991px), and mobile viewports (below 768px)
2. THE Navigation_System SHALL transform its presentation to remain usable across all supported viewport sizes
3. THE Projects_System SHALL adjust Case_Study layouts to maintain readability and visual quality on all supported viewports
4. THE Portfolio_Site SHALL render all text at readable sizes without requiring horizontal scrolling on any supported viewport

### Requirement 7: Accessibility

**User Story:** As a visitor using assistive technology or alternative input methods, I want the portfolio to be accessible, so that I can navigate and consume all content regardless of ability.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL use semantic HTML elements (nav, main, section, article, header, footer, heading hierarchy) to convey document structure
2. THE Portfolio_Site SHALL support full keyboard navigation for all interactive elements including the Navigation_System and Projects_System
3. WHILE Reduced_Motion_Mode is active, THE Portfolio_Site SHALL respect the prefers-reduced-motion media query by disabling or reducing all animations
4. THE Portfolio_Site SHALL provide meaningful alt text for all informational images and empty alt attributes for decorative images
5. THE Portfolio_Site SHALL maintain a minimum color contrast ratio of 4.5:1 for normal text and 3:1 for large text against their respective backgrounds

### Requirement 8: Performance Optimization

**User Story:** As a visitor, I want the site to load quickly on static hosting, so that the experience feels responsive even on slower connections.

#### Acceptance Criteria

1. THE Build_Pipeline SHALL produce optimized bundles with code splitting, tree shaking, and asset compression
2. THE Portfolio_Site SHALL lazy-load images and heavy assets that are below the initial viewport
3. THE Portfolio_Site SHALL load the Hero_Section content and achieve First Contentful Paint without waiting for animation libraries or below-fold assets
4. IF a visitor has a slow connection, THEN THE Portfolio_Site SHALL remain navigable and display text content before all images and animations complete loading

### Requirement 9: Content Separation

**User Story:** As a site maintainer, I want content separated from presentation components, so that I can update project information, text, and metadata without modifying component code.

#### Acceptance Criteria

1. THE Content_Layer SHALL store all text content, project data, timeline entries, and metadata in dedicated data files separate from React component files
2. THE Content_Layer SHALL define a structured format for Case_Study data including title, description, technical details, images, and repository URL
3. WHEN the Content_Layer data is updated, THE Portfolio_Site SHALL reflect the changes without requiring modifications to component logic or styling

### Requirement 10: Navigation System

**User Story:** As a visitor, I want persistent navigation that lets me jump to any section, so that I can explore the story non-linearly if I choose.

#### Acceptance Criteria

1. THE Navigation_System SHALL provide access to all major sections of the Portfolio_Site
2. WHEN a visitor selects a navigation item, THE Navigation_System SHALL scroll the page to the corresponding section
3. WHILE a visitor scrolls through the page, THE Navigation_System SHALL indicate which section is currently in view
4. THE Navigation_System SHALL remain accessible without obstructing content on all supported viewports

### Requirement 11: Timeline Visualization

**User Story:** As a visitor, I want to see a chronological timeline of Tomas's engineering journey, so that I can understand the progression and key milestones.

#### Acceptance Criteria

1. THE Timeline_Section SHALL display engineering milestones in chronological order
2. THE Timeline_Section SHALL visually communicate progression and growth across entries
3. THE Timeline_Section SHALL present entries using content exclusively from the Content_Layer without invented achievements, awards, or positions

### Requirement 12: Contact Section

**User Story:** As a visitor, I want clear contact options, so that I can reach out for collaboration or opportunities.

#### Acceptance Criteria

1. THE Contact_Section SHALL display contact methods including email (tomasbentolila@gmail.com) and relevant social links
2. THE Contact_Section SHALL provide direct links to GitHub (doctorpizza357), and other active social profiles
3. THE Contact_Section SHALL present contact information without requiring a backend form submission system

### Requirement 13: SEO and Metadata

**User Story:** As a site owner, I want proper SEO metadata, so that the portfolio is discoverable through search engines and presents well when shared.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL include appropriate meta title, description, and Open Graph tags for social sharing
2. THE Portfolio_Site SHALL generate semantic HTML that search engines can index for relevant engineering and portfolio keywords
3. THE Portfolio_Site SHALL include a favicon that reflects the engineering-focused brand identity

### Requirement 14: Content Accuracy

**User Story:** As a site owner, I want all displayed content to be accurate, so that the portfolio represents genuine experience and projects.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display only verified projects, skills, experiences, and achievements present in the Content_Layer
2. THE Portfolio_Site SHALL NOT display invented awards, job positions, certifications, or skills not provided by the site owner
3. THE Content_Layer SHALL serve as the single source of truth for all factual claims displayed on the Portfolio_Site

### Requirement 15: Migration Safety

**User Story:** As a site owner, I want a safe migration from the existing site, so that I can roll back if needed and existing assets are preserved.

#### Acceptance Criteria

1. THE Build_Pipeline SHALL preserve or migrate all existing image assets from the current repository (assets/img/) for use in the redesigned site
2. THE Build_Pipeline SHALL preserve the existing resume PDF (assets/pdf/Tomas Bentolila Resume.pdf) accessible from the redesigned site
3. WHEN the redesigned site is deployed, THE Portfolio_Site SHALL maintain compatibility with the existing GitHub Pages URL structure
4. THE Build_Pipeline SHALL support a deployment strategy that allows rollback to the previous site version through git history

### Requirement 16: Easter Eggs

**User Story:** As a visitor, I want to discover hidden interactive elements, so that the experience feels personal and rewards exploration.

#### Acceptance Criteria

1. WHERE easter eggs are implemented, THE Portfolio_Site SHALL ensure they do not interfere with primary navigation or content accessibility
2. WHERE easter eggs are implemented, THE Portfolio_Site SHALL ensure they remain discoverable through interaction without blocking standard page flow
3. WHERE easter eggs are implemented, THE Portfolio_Site SHALL ensure they degrade gracefully when Reduced_Motion_Mode is active
