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
2. THE Build_Pipeline SHALL generate a 404.html file that redirects to the main application entry point, enabling client-side routing on GitHub Pages without server configuration
3. THE Portfolio_Site SHALL operate without a backend server, database, or authentication system
4. THE Build_Pipeline SHALL use React with Vite as the component framework and build tool
5. THE Build_Pipeline SHALL configure the Vite base path to match the GitHub Pages deployment URL path so that all asset references resolve correctly in production

### Requirement 2: Narrative Homepage Structure

**User Story:** As a visitor, I want the homepage to feel like a continuous story with chapter-like sections, so that I understand Tomas's engineering journey as a cohesive narrative.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render the homepage as a single continuous scrolling page with sections presented in narrative order: Hero_Section, Beginning_Section, Iteration_Section, Projects_System, Timeline_Section, Penn_State_Section, Currently_Section, Lab_Notes_Section, Contact_Section
2. WHEN a visitor scrolls through the page, THE Portfolio_Site SHALL present each section as a distinct chapter separated by visible spacing or visual dividers, with each section occupying at least the full viewport height or containing enough content to fill a meaningful scroll segment
3. THE Hero_Section SHALL introduce Tomas Bentolila with a minimum viewport-height opening (100vh) containing at minimum the name, a role or tagline, and a visual element that establishes the engineering-focused theme
4. THE Beginning_Section SHALL display content describing the FIRST Robotics origin story and early hands-on engineering interest, sourced from the Content_Layer
5. THE Iteration_Section SHALL display content demonstrating growth and iterative improvement across engineering disciplines, sourced from the Content_Layer
6. THE Penn_State_Section SHALL display content presenting the academic experience at Penn State University, sourced from the Content_Layer
7. THE Currently_Section SHALL display content describing current work, interests, and engineering direction, sourced from the Content_Layer
8. THE Lab_Notes_Section SHALL display informal engineering thoughts, experiments, or smaller observations, sourced from the Content_Layer
9. IF a section has no corresponding content available in the Content_Layer, THEN THE Portfolio_Site SHALL omit that section from the rendered page without leaving an empty placeholder or breaking the narrative order of remaining sections

### Requirement 3: Visual Design System

**User Story:** As a visitor, I want the visual design to feel like a modern engineering laboratory crossed with editorial web design, so that the site communicates professionalism and technical depth.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL use a color palette consisting of near-black/charcoal (#1a1a1a–#2a2a2a range) as the primary dark tone, off-white (#f5f5f5–#fafafa range) as the primary light tone, muted gray (#6b6b6b–#9a9a9a range) for secondary elements, and one Accent_Color applied to no more than 10% of visible interface elements per viewport
2. THE Portfolio_Site SHALL use a modern sans-serif typeface for headings and display text with at least 4 distinct type sizes forming a clear hierarchy (hero title, section title, subsection title, body)
3. THE Portfolio_Site SHALL use a monospace or technical typeface for metadata, labels, dates, project numbers, and secondary information
4. THE Portfolio_Site SHALL incorporate at least two visual motifs drawn from technical drawings, blueprint aesthetics, CAD software interfaces, or industrial design (such as grid overlays, technical line annotations, dimension markers, or schematic-style dividers)
5. THE Portfolio_Site SHALL present typography as a major design element with intentional scale, weight, and spacing hierarchy where the hero title is at least 3x the body text size

### Requirement 4: Project Case Study System

**User Story:** As a visitor, I want to explore projects as detailed engineering case studies, so that I understand the depth and process behind each project rather than seeing a generic list.

#### Acceptance Criteria

1. THE Projects_System SHALL present each project as a Case_Study with four distinct content sections: context (problem and motivation), process description (approach and methodology), technical details (technologies and implementation decisions), and visual documentation (screenshots or diagrams)
2. THE Projects_System SHALL display projects in a format distinct from a generic card grid layout, showing a project title and brief summary for each entry to allow visitors to identify and select projects of interest
3. WHEN a visitor selects a project, THE Projects_System SHALL reveal the full Case_Study content styled consistently with the Portfolio_Site visual design system and SHALL provide a visible control to return to the project listing
4. THE Projects_System SHALL preserve references to all existing projects: Pathfinding Visualizer, Tic-Tac-Toe, Sorting Algorithm Visualizer, Pizza Browser, Auto Typer, Map Path Finding, Directory Sorter, Network Traffic Analyzer, Folder Encrypter, Radical Simplifier, and Heap Tree Visualizer
5. THE Projects_System SHALL link each Case_Study to its corresponding GitHub repository
6. IF a Case_Study does not have a GitHub repository URL defined in the Content_Layer, THEN THE Projects_System SHALL omit the repository link for that Case_Study without displaying a broken or empty link

### Requirement 5: Animation and Motion Design

**User Story:** As a visitor, I want animations that support the narrative and feel intentional, so that the experience feels cinematic without being distracting.

#### Acceptance Criteria

1. THE Animation_Engine SHALL use GSAP for scroll-triggered animations, timeline-based sequences, and element transitions
2. WHEN the Animation_Engine triggers animations, THE Portfolio_Site SHALL ensure each animation is directly tied to a content state change (element entering viewport, user interaction, or section transition) rather than looping or playing independently of user context
3. WHERE Three.js is used, THE Portfolio_Site SHALL limit 3D elements to sections that represent spatial data or dimensional relationships (e.g., project architecture, mechanical visualization) and SHALL NOT use 3D elements for purely decorative purposes such as background particles or ambient effects
4. WHILE Reduced_Motion_Mode is active, THE Animation_Engine SHALL replace all opacity, transform, and movement animations with instant state changes (duration of 0ms), while preserving final visual states so that content remains visible in its end position
5. THE Animation_Engine SHALL not block page interaction or prevent content from being accessible during animation sequences, and no individual animation SHALL exceed a duration of 2 seconds
6. WHEN the user's operating system or browser has the prefers-reduced-motion: reduce media query active, THE Animation_Engine SHALL activate Reduced_Motion_Mode

### Requirement 6: Responsive Design

**User Story:** As a visitor on any device, I want the portfolio to adapt to my screen size, so that the experience is optimized for desktop, laptop, tablet, and mobile viewports.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL adapt its layout and typography for desktop viewports (1200px and above), laptop viewports (992px to 1199px), tablet viewports (768px to 991px), and mobile viewports (below 768px)
2. THE Navigation_System SHALL transform its presentation across viewport sizes such that all navigation items remain reachable, interactive elements maintain a minimum tap target size of 44x44 CSS pixels on tablet and mobile viewports, and no navigation item is hidden without an accessible mechanism to reveal it
3. THE Projects_System SHALL adjust Case_Study layouts so that text content reflows to fit the viewport width, images scale proportionally without cropping essential content, and no Case_Study element overflows its container on any supported viewport
4. THE Portfolio_Site SHALL render all body text at a minimum of 16 CSS pixels and all secondary/metadata text at a minimum of 14 CSS pixels, without requiring horizontal scrolling on any supported viewport
5. THE Portfolio_Site SHALL ensure all images, embedded media, and visual assets scale fluidly within their containers and do not exceed the viewport width on any supported viewport

### Requirement 7: Accessibility

**User Story:** As a visitor using assistive technology or alternative input methods, I want the portfolio to be accessible, so that I can navigate and consume all content regardless of ability.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL use semantic HTML elements (nav, main, section, article, header, footer) to convey document structure, with a single h1 per page and heading levels that do not skip ranks
2. THE Portfolio_Site SHALL support keyboard navigation for all interactive elements including the Navigation_System and Projects_System, such that each element can receive focus, be activated, and be dismissed using only the keyboard, with a visible focus indicator of at least 2px outline on every focusable element
3. WHILE Reduced_Motion_Mode is active, THE Portfolio_Site SHALL remove all motion-based animations (transforms, position changes, scaling) and permit only opacity and color transitions
4. THE Portfolio_Site SHALL provide alt text describing the informational content of each non-decorative image (maximum 125 characters) and empty alt attributes for decorative images
5. THE Portfolio_Site SHALL maintain a minimum color contrast ratio of 4.5:1 for normal text and 3:1 for large text (18px and above, or 14px and above if bold) against their respective backgrounds
6. THE Portfolio_Site SHALL provide accessible names via visible labels or ARIA attributes for all interactive controls that lack visible text content, such that screen readers announce each control's purpose

### Requirement 8: Performance Optimization

**User Story:** As a visitor, I want the site to load quickly on static hosting, so that the experience feels responsive even on slower connections.

#### Acceptance Criteria

1. THE Build_Pipeline SHALL produce optimized bundles with code splitting, tree shaking, and asset compression such that no single JavaScript bundle exceeds 150 KB gzipped
2. THE Portfolio_Site SHALL lazy-load all images and assets larger than 50 KB that are positioned below the initial viewport
3. THE Portfolio_Site SHALL load the Hero_Section content and achieve First Contentful Paint within 1.5 seconds on a simulated 4G connection (Lighthouse default throttling) without waiting for animation libraries or below-fold assets
4. IF a visitor has a slow connection (simulated 3G: 1.6 Mbps download, 750 ms RTT), THEN THE Portfolio_Site SHALL render the Navigation_System and all text content in a scrollable, interactive state within 5 seconds, before all images and animations complete loading
5. THE Build_Pipeline SHALL serve images in modern formats (WebP or AVIF with fallback) and apply compression to all image assets to reduce total image payload

### Requirement 9: Content Separation

**User Story:** As a site maintainer, I want content separated from presentation components, so that I can update project information, text, and metadata without modifying component code.

#### Acceptance Criteria

1. THE Content_Layer SHALL store all text content, project data, timeline entries, and metadata in dedicated data files (JSON or TypeScript data modules) located in a single data directory separate from React component files
2. THE Content_Layer SHALL define a structured format for Case_Study data including required fields: title (string), summary (string), technologies (array of strings), and optional fields: description (string), images (array of file paths), repositoryUrl (string), and caseStudySections (array of section objects with heading and body)
3. WHEN the Content_Layer data is updated, THE Portfolio_Site SHALL reflect the changes after a rebuild without requiring modifications to component logic or styling
4. THE Content_Layer SHALL define a structured format for timeline entries including required fields: date (string), title (string), and description (string)
5. THE Content_Layer SHALL define a structured format for lab notes entries including required fields: date (string) and content (string)

### Requirement 10: Navigation System

**User Story:** As a visitor, I want persistent navigation that lets me jump to any section, so that I can explore the story non-linearly if I choose.

#### Acceptance Criteria

1. THE Navigation_System SHALL provide navigation items for each section defined in the narrative order: Hero_Section, Beginning_Section, Iteration_Section, Projects_System, Timeline_Section, Penn_State_Section, Currently_Section, Lab_Notes_Section, and Contact_Section
2. WHEN a visitor selects a navigation item, THE Navigation_System SHALL smooth-scroll the page to the top of the corresponding section
3. WHILE a visitor scrolls through the page, THE Navigation_System SHALL visually distinguish the navigation item corresponding to the section currently occupying the majority of the viewport, with exactly one item indicated as active at any time
4. THE Navigation_System SHALL remain visible in a fixed position on all supported viewports without overlapping or hiding the main content area that the visitor is reading
5. IF a visitor navigates using keyboard tab order, THEN THE Navigation_System SHALL allow focus to move through all navigation items and activate the focused item on Enter or Space key press

### Requirement 11: Timeline Visualization

**User Story:** As a visitor, I want to see a chronological timeline of Tomas's engineering journey, so that I can understand the progression and key milestones.

#### Acceptance Criteria

1. THE Timeline_Section SHALL display engineering milestones in chronological order, where each entry includes at minimum a date or time period and a description of the milestone
2. THE Timeline_Section SHALL present entries in a directional layout (vertical or horizontal) with date labels visible per entry, so that the sequence and progression across time are unambiguous to the visitor
3. THE Timeline_Section SHALL present entries using content exclusively from the Content_Layer without invented achievements, awards, or positions
4. THE Timeline_Section SHALL display a minimum of 3 timeline entries to establish a meaningful chronological progression

### Requirement 12: Contact Section

**User Story:** As a visitor, I want clear contact options, so that I can reach out for collaboration or opportunities.

#### Acceptance Criteria

1. THE Contact_Section SHALL display contact methods including an email link (tomasbentolila@gmail.com) using a mailto: href, and social links to GitHub (doctorpizza357), Twitter/X (doctorpizza357), Instagram (tomasbentolila), and Discord
2. WHEN a visitor clicks a social profile link, THE Contact_Section SHALL open the link in a new browser tab
3. WHEN a visitor clicks the email link, THE Contact_Section SHALL initiate the visitor's default mail client via mailto: protocol
4. THE Contact_Section SHALL present contact information using direct links and displayed contact details without requiring a backend form submission system

### Requirement 13: SEO and Metadata

**User Story:** As a site owner, I want proper SEO metadata, so that the portfolio is discoverable through search engines and presents well when shared.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL include a meta title of no more than 60 characters and a meta description of no more than 160 characters in the HTML document head
2. THE Portfolio_Site SHALL include Open Graph tags (og:title, og:description, og:image, og:url, og:type) so that social platforms display a preview with title, description, and image when the URL is shared
3. THE Portfolio_Site SHALL use semantic HTML elements (h1 through h6 in correct hierarchy, nav, main, section, article) and include a single h1 element per page containing the site owner's name or primary identifier
4. THE Portfolio_Site SHALL include a favicon referenced in the HTML head via link elements, provided in at least 32x32 and 180x180 pixel sizes
5. THE Portfolio_Site SHALL include a canonical URL meta tag in the HTML head pointing to the primary GitHub Pages deployment URL

### Requirement 14: Content Accuracy

**User Story:** As a site owner, I want all displayed content to be accurate, so that the portfolio represents genuine experience and projects.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render text content, project descriptions, skills, and achievements exclusively from values defined in the Content_Layer data files
2. THE Portfolio_Site SHALL NOT display awards, job positions, certifications, professional titles, or skills not explicitly defined in the Content_Layer
3. THE Content_Layer SHALL serve as the single source of truth for all factual claims displayed on the Portfolio_Site, and no component SHALL contain hardcoded factual content (project names, dates, descriptions, or achievements) outside the Content_Layer
4. IF a Content_Layer field for a project, timeline entry, or section is empty or undefined, THEN THE Portfolio_Site SHALL omit that field from display rather than rendering placeholder or fabricated text

### Requirement 15: Migration Safety

**User Story:** As a site owner, I want a safe migration from the existing site, so that I can roll back if needed and existing assets are preserved.

#### Acceptance Criteria

1. THE Build_Pipeline SHALL include all existing image assets from the current repository (assets/img/) in the production build output, maintaining each file's original filename and serving them as accessible resources within the redesigned site
2. THE Build_Pipeline SHALL include the existing resume PDF (assets/pdf/Tomas Bentolila Resume.pdf) in the production build output and THE Portfolio_Site SHALL provide a visible download or view link to the resume from at least one page section
3. WHEN the redesigned site is deployed, THE Portfolio_Site SHALL be served from the same GitHub Pages base URL (repository GitHub Pages domain and path) as the existing site, ensuring the site root resolves to the redesigned homepage
4. THE Build_Pipeline SHALL deploy the redesigned site on a branch separate from the main source branch, and the pre-redesign site state SHALL remain available in git history so that reverting the deployment branch to a prior commit restores the previous site version
5. IF the build output is missing any image file present in the source assets/img/ directory or the resume PDF from assets/pdf/, THEN THE Build_Pipeline SHALL fail the build and report which assets are missing

### Requirement 16: Easter Eggs

**User Story:** As a visitor, I want to discover hidden interactive elements, so that the experience feels personal and rewards exploration.

#### Acceptance Criteria

1. WHERE easter eggs are implemented, THE Portfolio_Site SHALL ensure they do not alter the keyboard tab order, obstruct focusable elements, or remove content from the accessibility tree
2. WHERE easter eggs are implemented, THE Portfolio_Site SHALL ensure they are triggered only by deliberate user interactions (such as click sequences, key combinations, or hover patterns) and do not prevent scrolling, navigation, or access to any section content
3. WHERE easter eggs are implemented, WHILE Reduced_Motion_Mode is active, THE Portfolio_Site SHALL replace animated easter egg effects with static visual changes or no visible response, without displaying motion-based transitions
4. WHERE easter eggs are implemented, WHEN a visitor triggers an easter egg, THE Portfolio_Site SHALL provide a visible or audible acknowledgment within 1 second and allow the visitor to dismiss or close any resulting overlay or visual effect without requiring a page reload
