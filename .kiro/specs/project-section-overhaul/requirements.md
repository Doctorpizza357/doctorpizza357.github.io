# Requirements Document

## Introduction

This document specifies the requirements for overhauling the Projects section of the portfolio website. The existing Projects section presents a flat list of older Java projects with minimal case study content. The overhaul transforms it into a professional engineering project showcase that demonstrates problem-solving approach, system design thinking, iteration processes, and technical depth. The section targets engineering recruiters, university professors, and internship reviewers. The remainder of the portfolio (hero, navigation, visual identity, footer, other sections, GitHub Pages deployment) remains unchanged.

## Glossary

- **Project_Section**: The portfolio section (id="projects") that displays all engineering projects with filtering, editorial layout, and case study navigation
- **Project_Card**: An editorial-style card component displaying a single project's metadata, imagery, and category within the Project_Section landing page
- **Case_Study_View**: A detailed project page presenting the full engineering narrative for a single project, including problem context, approach, systems, iteration, decisions, current state, and lessons learned
- **Model_Viewer**: A reusable React component that renders interactive 3D models (GLB/GLTF format) using Three.js with studio lighting, pointer interaction, and accessibility support
- **Category_Filter**: An animated filtering interface that allows users to view projects by category (ALL, MECHANICAL, ROBOTICS, SOFTWARE, SYSTEMS)
- **Project_Data_Layer**: A centralized TypeScript data structure that separates project content from UI components, containing all project metadata, media references, and case study narratives
- **Media_System**: The infrastructure supporting multiple media types (images, videos, CAD renders, 3D models, GIFs, diagrams, screenshots, PDFs) within project case studies
- **Engineering_Annotation**: A visual overlay on 3D models consisting of thin connecting lines and restrained typography that labels key features of a mechanical design
- **Content_Placeholder**: A clearly marked text token (e.g., `[ADD DESIGN RATIONALE]`) used where real content is not yet available, preventing fabrication
- **Flagship_Project**: The RC Vehicle project, which serves as the reference implementation for the case study system and receives the most detailed treatment
- **Three_JS_Resources**: WebGL contexts, geometries, materials, textures, and renderers allocated by the Model_Viewer that must be explicitly disposed when no longer needed

## Requirements

### Requirement 1: Project Data Architecture

**User Story:** As a developer maintaining the portfolio, I want project content separated from UI components in a centralized data structure, so that I can update project information without modifying component code.

#### Acceptance Criteria

1. THE Project_Data_Layer SHALL define a TypeScript interface for project data containing the following required fields: id (string, unique), title (string, max 100 characters), description (string, max 500 characters), category (array of strings, 1 to 5 items), technologies (array of strings, 1 to 15 items), timeframe (string), role (string), media (array of typed media items, 0 to 50 items), and display order (integer, 1 to 99); and the following optional fields: case study sections, and repository URL (string, valid URL format)
2. THE Project_Data_Layer SHALL store all six projects (FRC Team 116, RC Vehicle, Wankel Rotary Engine, STEM PathfindR, Mission Control, Personal Server) as structured data conforming to the defined interface, with all required fields populated with non-empty values
3. THE Project_Data_Layer SHALL define each media item as a typed discriminated union containing: a type field with one of the literal values "image", "video", "cad-render", "3d-model", "gif", "diagram", "screenshot", or "pdf"; a src field (string, asset path); an alt field (string, max 125 characters, descriptive text for non-decorative items or empty string for decorative items); and an optional caption field (string, max 200 characters)
4. THE Project_Data_Layer SHALL define case study sections as a fixed-order array where each entry maps to one of the following keys in this sequence: problem, approach, systems, iteration, decisions, current-state, and lessons-learned; each section containing a heading (string) and body (string, max 5000 characters)
5. IF a project data field that is required by the interface contains an empty string, null, or undefined value, THEN THE Project_Data_Layer SHALL use a Content_Placeholder token (a string literal prefixed with "PLACEHOLDER:") in place of fabricated text, so that missing content is identifiable programmatically
6. THE Project_Data_Layer SHALL order projects for display by the numeric display order field in ascending order, where a lower value appears first

### Requirement 2: Project Landing Page Layout

**User Story:** As a visitor viewing the portfolio, I want to see projects presented in an editorial layout with strong visual hierarchy, so that I can quickly understand the scope and variety of engineering work.

#### Acceptance Criteria

1. THE Project_Section SHALL display projects in an editorial layout using at least 2 distinct visual weight tiers, where the Flagship_Project occupies at minimum 50% of the container width and remaining projects occupy no more than 50% of the container width each, so that visual hierarchy communicates project importance without a uniform grid
2. THE Project_Section SHALL display a project number, title, summary description (maximum 200 characters), technology list, and a featured image with a minimum rendered dimension of 300px on its longest side (or a 3D model preview of equivalent area) on each Project_Card
3. THE Project_Section SHALL render the Flagship_Project (RC Vehicle) as the first project in visual reading order and at the largest visual weight tier on the landing page
4. WHEN a user clicks or keyboard-activates (Enter or Space key) a Project_Card, THE Project_Section SHALL navigate to the Case_Study_View for that project within 300ms
5. THE Project_Section SHALL preserve the existing site section structure by rendering within the id="projects" section wrapper
6. THE Project_Section SHALL assign each project a visual weight tier defined in the Project_Data_Layer, ensuring that the layout renders projects ordered by tier (highest weight first) and that at least the Flagship_Project is assigned the highest tier

### Requirement 3: Category Filtering

**User Story:** As a visitor exploring the portfolio, I want to filter projects by discipline category, so that I can focus on the type of engineering work most relevant to my interests.

#### Acceptance Criteria

1. THE Category_Filter SHALL provide filter options for: ALL, MECHANICAL, ROBOTICS, SOFTWARE, and SYSTEMS
2. WHEN a user selects a category, THE Category_Filter SHALL display only projects whose tags include the selected category, hiding all non-matching projects with animated layout transitions lasting no longer than 400 milliseconds
3. THE Category_Filter SHALL default to the ALL category showing every project on initial page load
4. WHEN the ALL category is selected, THE Category_Filter SHALL display all projects defined in the Project_Data_Layer regardless of their category tags
5. THE Category_Filter SHALL animate Project_Cards entering and leaving the view with layout transitions lasting no longer than 400 milliseconds
6. THE Category_Filter SHALL visually distinguish the currently active filter option from the inactive options so that exactly one filter option appears selected at any time
7. WHILE the user has prefers-reduced-motion enabled, THE Category_Filter SHALL show and hide projects instantly (0ms duration) without animated transitions, while preserving the final layout state
8. WHEN a user selects a category and a project is tagged with multiple categories including the selected one, THE Category_Filter SHALL display that project in the filtered results

### Requirement 4: Reusable 3D Model Viewer

**User Story:** As a visitor viewing mechanical projects, I want to interact with 3D models of engineering designs, so that I can examine the work from multiple angles and appreciate the mechanical complexity.

#### Acceptance Criteria

1. THE Model_Viewer SHALL load and render 3D models in GLB or GLTF format within 10 seconds on a simulated 4G connection, and SHALL accept model files up to 20 MB in size
2. THE Model_Viewer SHALL apply soft studio lighting with a dark neutral environment, subtle shadows, and clean materials consistent with a technical visualization aesthetic (matte/semi-gloss surface appearance, no specular bloom or post-processing effects)
3. WHILE no user pointer or touch interaction has occurred for 2 seconds or more, THE Model_Viewer SHALL auto-rotate the loaded model around the vertical axis at a constant speed between 4 and 10 degrees per second
4. WHEN a user interacts with the Model_Viewer via pointer drag or touch, THE Model_Viewer SHALL allow orbit rotation of the model, and WHEN a user performs pinch or scroll input, THE Model_Viewer SHALL zoom the camera within a range of 0.5x to 3x the default viewing distance, preventing zoom beyond these limits
5. WHILE the Model_Viewer is loading a 3D model, THE Model_Viewer SHALL display a visible loading indicator (spinner or progress bar) in place of the 3D canvas
6. IF a 3D model fails to load or exceeds the 10-second loading timeout, THEN THE Model_Viewer SHALL display the fallback image provided in the project data in place of the 3D canvas
7. IF a 3D model fails to load and no fallback image is defined in the project data, THEN THE Model_Viewer SHALL display a static placeholder indicating the model is unavailable without rendering a broken image or empty container
8. THE Model_Viewer SHALL provide an accessible title and description for screen readers via aria-label attributes, sourced from the project title and summary fields in the Project_Data_Layer
9. WHEN the user has prefers-reduced-motion enabled, THE Model_Viewer SHALL disable auto-rotation and transition animations, displaying the model in a static default orientation
10. THE Model_Viewer SHALL support Engineering_Annotations rendered as lines of 1–2 CSS pixels in width connecting model feature points to text labels using the monospace/technical typeface defined in the design token system
11. WHILE the Model_Viewer is not visible in the viewport (0% intersection), THE Model_Viewer SHALL pause rendering and animation to conserve resources, and SHALL resume rendering when the component re-enters the viewport

### Requirement 5: Case Study Structure

**User Story:** As a recruiter or professor evaluating the portfolio, I want to see a structured engineering narrative for each project, so that I can understand how the student approaches problems, designs systems, and iterates on solutions.

#### Acceptance Criteria

1. THE Case_Study_View SHALL present project case study sections in the order they appear in the project's caseStudySections array, rendering each section with its heading and body content as a distinct content block
2. THE Case_Study_View SHALL display project metadata at the top including the project title, category tags, timeframe, role, and technology list sourced from the Project_Data_Layer
3. THE Case_Study_View SHALL embed media items (images, videos, 3D models, diagrams) inline within case study sections at positions specified in the project data, with each image displayed at a maximum width equal to its container and maintaining its original aspect ratio
4. WHEN a project has a 3D model defined in its media array, THE Case_Study_View SHALL render the Model_Viewer component for that model within the appropriate case study section
5. THE Case_Study_View SHALL provide a visible navigation control (button or link) labeled to indicate returning to the project listing, which navigates the visitor back to the Project_Section landing view
6. IF a project's caseStudySections array is empty or undefined, THEN THE Case_Study_View SHALL still render the project metadata (title, summary, technologies) and images (if present) without displaying an empty sections container or error state

### Requirement 6: RC Vehicle Flagship Implementation

**User Story:** As the portfolio owner, I want the RC Vehicle project to serve as the most complete and polished case study, so that it demonstrates the full capability of the project showcase system.

#### Acceptance Criteria

1. THE Case_Study_View for the RC Vehicle SHALL include an interactive Model_Viewer displaying the RC car chassis and suspension system 3D model in GLB or GLTF format
2. THE Case_Study_View for the RC Vehicle SHALL include Engineering_Annotations labeling at minimum four mechanical features: chassis, suspension, steering, and wheel, each connected to the corresponding model region by a thin line terminating at a text label
3. THE Case_Study_View for the RC Vehicle SHALL present the iterative parametric modeling process in the iteration section with at least 3 distinct version entries (e.g., Version 01, Version 02, Version 03), each describing what changed from the previous version
4. THE Project_Data_Layer SHALL define the RC Vehicle with category tags MECHANICAL and CAD
5. IF content for a RC Vehicle case study section is unavailable, THEN THE Project_Data_Layer SHALL use Content_Placeholder tokens with descriptive labels (e.g., `[ADD SUSPENSION DESIGN RATIONALE]`)
6. THE Project_Data_Layer SHALL define the RC Vehicle case study sections in the following order: problem, approach, chassis, suspension, design iteration, engineering decisions, current state, and lessons learned

### Requirement 7: Performance Optimization

**User Story:** As a visitor on any device, I want the Projects section to load quickly and run smoothly, so that the experience feels professional regardless of network speed or device capability.

#### Acceptance Criteria

1. THE Project_Section SHALL lazy-load all media assets (images, videos, 3D models) using IntersectionObserver such that asset fetching begins only when the element is within one viewport-height (100% rootMargin) of the visible viewport edge
2. THE Project_Section SHALL use optimized image formats (WebP or AVIF with fallback) and compression at a quality setting no higher than 80 for all project imagery
3. WHEN a Model_Viewer instance is removed from the DOM or navigated away from, THE Model_Viewer SHALL dispose all Three_JS_Resources (geometries, materials, textures, WebGL context) before the component unmounts
4. WHEN an animation or 3D renderer reaches 0% intersection with the viewport, THE Project_Section SHALL pause that animation or render loop, and SHALL resume it when the element re-enters the viewport at greater than 0% intersection
5. WHEN the user navigates to a Case_Study_View containing a 3D model, THE Project_Section SHALL load the 3D model file at that point, and SHALL NOT load any 3D model file on the landing page or project listing view
6. IF a 3D model file fails to load or exceeds a 15-second load timeout, THEN THE Project_Section SHALL display a static fallback image for that model and SHALL NOT block interaction with the rest of the Case_Study_View

### Requirement 8: Accessibility

**User Story:** As a visitor using assistive technology, I want the Projects section to be fully navigable and understandable, so that I can access all project information regardless of ability.

#### Acceptance Criteria

1. THE Model_Viewer SHALL provide a text alternative via an accessible name (aria-label) that includes the project name and a description of what the 3D model represents (maximum 125 characters), and a fallback static image with equivalent alt text for users who cannot perceive the 3D content
2. WHILE the user has prefers-reduced-motion enabled, THE Project_Section SHALL disable all animations including card transitions, auto-rotation, parallax effects, and any scroll-triggered motion, displaying only static final-state visuals
3. THE Category_Filter SHALL be operable via keyboard using Tab navigation and Enter or Space activation, and WHEN a filter is activated, THE Category_Filter SHALL announce the updated result count to assistive technologies via a live region (e.g., aria-live="polite")
4. THE Project_Card components SHALL be focusable and activatable via keyboard with visible focus indicators of at least 2px solid outline with sufficient contrast against the background
5. THE Case_Study_View SHALL use semantic heading hierarchy (h2 for project title, h3 for section headings) for screen reader navigation
6. THE Project_Section SHALL maintain a minimum color contrast ratio of 4.5:1 for normal text (below 18px, or below 14px bold) and 3:1 for large text (18px and above, or 14px bold and above) against its background
7. WHEN a visitor opens a Case_Study_View via keyboard or pointer, THE Project_Section SHALL move focus to the Case_Study heading, and WHEN the visitor closes the Case_Study_View, THE Project_Section SHALL return focus to the Project_Card that initiated the action

### Requirement 9: Responsive Design

**User Story:** As a visitor on a mobile device, I want the Projects section to adapt gracefully to smaller screens, so that I can explore projects with touch interactions on any device.

#### Acceptance Criteria

1. WHILE the viewport width is below 768 pixels, THE Project_Section SHALL display project cards in a single-column layout, and WHILE the viewport width is 768 pixels or above, THE Project_Section SHALL display project cards in a multi-column layout of 2 or more columns
2. WHILE the viewport width is below 768 pixels, THE Model_Viewer SHALL support single-finger orbit to rotate the model and pinch-to-zoom with a zoom range bounded between 0.5x and 3x of the default model scale
3. WHILE the viewport width is below 768 pixels, THE Project_Section SHALL limit CSS and JavaScript animations to opacity and transform transitions only and SHALL disable parallax scroll effects entirely
4. IF the Model_Viewer detects that WebGL is unavailable or the 3D model fails to initialize within 5 seconds on a mobile device, THEN THE Model_Viewer SHALL display a static fallback image representing the project and SHALL hide the 3D canvas element
5. WHILE the viewport width is below 768 pixels, THE Project_Card components SHALL render text at a minimum font size of 14 pixels and SHALL ensure all interactive elements (links, buttons) have a touch-target size of at least 44 by 44 pixels

### Requirement 10: Project Transition Animation

**User Story:** As a visitor navigating between the project list and a case study, I want smooth intentional transitions, so that the navigation feels polished and I maintain spatial context.

#### Acceptance Criteria

1. WHEN a user activates a Project_Card, THE Project_Section SHALL animate the transition to Case_Study_View by first fading out the project list, then fading in the Case_Study_View content, with each phase completing sequentially
2. WHEN a user activates the back navigation in Case_Study_View, THE Project_Section SHALL animate the transition back to the project list and restore the scroll position to within 5 pixels of the previously selected Project_Card's vertical offset
3. THE Project_Section SHALL complete both forward (list-to-case-study) and reverse (case-study-to-list) transitions within 600 milliseconds total duration each
4. WHILE a transition animation is in progress, IF the user activates another navigation action, THEN THE Project_Section SHALL cancel the current animation and immediately complete the newly requested transition
5. WHEN the user has prefers-reduced-motion enabled, THE Project_Section SHALL skip all animated transitions and apply the target view state instantly with no intermediate frames

### Requirement 11: Site Preservation

**User Story:** As the portfolio owner, I want the Projects section overhaul to integrate seamlessly with the existing site, so that the overall design coherence and deployment configuration remain intact.

#### Acceptance Criteria

1. THE Project_Section SHALL render a container element with id="projects" so that site-wide navigation scrolls to the correct location using the existing smooth-scroll mechanism
2. THE Project_Section SHALL exclusively use CSS custom properties defined in the site's tokens.css (--color-*, --font-*, --text-*, --content-max-width, --content-padding, --section-gap) for all typography, color, and spacing values, introducing no hardcoded color or font values
3. THE Project_Section SHALL produce zero build errors and render correctly when deployed to GitHub Pages via the existing deploy.yml workflow using HashRouter, with all internal navigation and asset paths resolving without 404 errors
4. THE Project_Section SHALL not modify or remove any existing sections (hero, beginning, iteration, timeline, penn-state, currently, lab-notes, contact) and SHALL preserve the section order defined in ALL_SECTIONS within App.tsx
5. THE Project_Section SHALL register scroll-triggered animations exclusively through the existing AnimationProvider context (registerAnimation, contextSafe) and GSAP/ScrollTrigger setup, introducing no additional animation libraries
6. IF the prefers-reduced-motion media query is active, THEN THE Project_Section SHALL skip all motion-based animations and apply instant final-state rendering consistent with the reducedMotionFallback pattern used by the AnimationProvider

### Requirement 12: Wankel Rotary Engine Project

**User Story:** As a visitor exploring mechanical projects, I want to view the Wankel Rotary Engine as an interactive 3D visualization, so that I can appreciate the mechanical understanding and CAD modeling skill demonstrated.

#### Acceptance Criteria

1. THE Case_Study_View for the Wankel Rotary Engine SHALL render the Model_Viewer component with a 3D model asset (GLB or GLTF) defined in the project data, reusing the same Model_Viewer component used by the RC Vehicle project
2. THE Project_Data_Layer SHALL define the Wankel Rotary Engine with category tags MECHANICAL and CAD, role "Personal Project", and technologies including CAD modeling
3. THE Case_Study_View for the Wankel Rotary Engine SHALL display at least 3 Engineering_Annotations identifying the rotor, housing, and eccentric shaft components of the engine model
4. WHEN content for a Wankel Rotary Engine case study section is unavailable, THE Project_Data_Layer SHALL use Content_Placeholder tokens and SHALL NOT include fabricated performance claims or engineering validation statements
5. THE Case_Study_View for the Wankel Rotary Engine SHALL present media items in a sequence progressing from the complete engine assembly to individual components (housing, rotor, eccentric shaft) and back to assembly context
6. WHERE rotor animation is enabled, THE Model_Viewer for the Wankel Rotary Engine SHALL demonstrate the epitrochoidal rotor motion within the housing

### Requirement 13: FRC Team 116 Project

**User Story:** As a visitor evaluating leadership and robotics experience, I want to see the FRC project presented as a comprehensive robotics and leadership case study, so that I understand the team contribution, competition results, and mechanical work.

#### Acceptance Criteria

1. THE Project_Data_Layer SHALL define the FRC Team 116 project with category tags ROBOTICS, MECHANICAL, and LEADERSHIP, with role "Mechanical Lead", timeframe "2023-2026", and technologies including Onshape, CAD, Fabrication, and Prototyping
2. THE Case_Study_View for FRC Team 116 SHALL render as identifiable content elements: the 2025 REEFSCAPE season context, the 16th out of 112 teams ranking in Chesapeake District, and team captain selection for the upcoming season
3. THE Case_Study_View for FRC Team 116 SHALL render media items including build photos, CAD renders, and competition imagery from the project's media array, with at least one image type from each of those categories when assets are available
4. WHEN content for a FRC Team 116 case study section is unavailable, THE Project_Data_Layer SHALL use Content_Placeholder tokens
5. THE Project_Data_Layer SHALL define the FRC Team 116 case study sections following the narrative structure: the challenge, the robot, mechanical systems, design-prototype-test-iterate cycle, competition, and lessons learned

### Requirement 14: STEM PathfindR Project

**User Story:** As a visitor interested in software engineering and AI, I want to see the STEM PathfindR project showcased with its hackathon achievement and technical architecture, so that I understand the AI/cloud engineering capabilities demonstrated.

#### Acceptance Criteria

1. THE Project_Data_Layer SHALL define STEM PathfindR with category tags SOFTWARE and AI, with technologies including AWS Bedrock, Python, Docker, and Git, role "Developer", and timeframe "2026"
2. THE Case_Study_View for STEM PathfindR SHALL render the First Place overall and Best Use of AI awards at AWS AI Hackathon 2026 as visually distinct elements (e.g., styled badges or callouts) within the project metadata or problem section
3. THE Case_Study_View for STEM PathfindR SHALL present case study sections covering: the problem (students choosing careers without experience), the idea (interactive AI career exploration), system architecture, AI simulations, interview preparation, technical implementation, and result
4. WHEN content for a STEM PathfindR case study section is unavailable, THE Project_Data_Layer SHALL use Content_Placeholder tokens
5. THE Media_System for STEM PathfindR SHALL support screenshots and architecture diagrams within the case study sections

### Requirement 15: Mission Control Project

**User Story:** As a visitor interested in simulation and data visualization, I want to see the Mission Control project highlighting interface design and systems thinking, so that I understand the MATLAB engineering capabilities demonstrated.

#### Acceptance Criteria

1. THE Project_Data_Layer SHALL define Mission Control with category tags SOFTWARE and MATLAB, with technologies including MATLAB, and role and timeframe fields populated or marked with Content_Placeholder tokens
2. THE Case_Study_View for Mission Control SHALL include dedicated content within the case study sections covering interface design decisions, simulation architecture, data visualization methods, and systems thinking approach
3. THE Media_System for Mission Control SHALL include at least 1 screenshot of the MATLAB interface and at least 1 diagram of the simulation outputs or system architecture
4. WHEN content for a Mission Control case study section is unavailable, THE Project_Data_Layer SHALL use Content_Placeholder tokens
5. WHEN the Case_Study_View for Mission Control displays simulation data or outputs, THE Case_Study_View SHALL include a visible label indicating the data is simulated and not sourced from a live system

### Requirement 16: Personal Server Project

**User Story:** As a visitor interested in systems engineering, I want to see the Personal Server project presented as an infrastructure case study, so that I understand the self-hosted systems administration and networking experience.

#### Acceptance Criteria

1. THE Project_Data_Layer SHALL define Personal Server with category tags SYSTEMS and SOFTWARE, with technologies including Ubuntu, Docker, Portainer, Nextcloud, Plex, Grafana, Prometheus, Tailscale, Linux, and Networking, and role "Personal Project"
2. THE Case_Study_View for Personal Server SHALL present case study sections following the narrative structure: the problem (running infrastructure on limited hardware), the system (architecture overview), containers (service composition), monitoring (Grafana/Prometheus), networking (Tailscale, reverse proxy, Docker networks), and lessons learned
3. THE Media_System for Personal Server SHALL support at least 1 architecture diagram showing the service topology and container relationships
4. WHEN content for a Personal Server case study section is unavailable, THE Project_Data_Layer SHALL use Content_Placeholder tokens
