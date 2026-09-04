import { ProjectData, AnnotationData } from './projectTypes';

/**
 * Engineering project showcase data.
 *
 * All portfolio projects defined as structured data conforming to the
 * ProjectData interface. Content is separated from UI components so that
 * updates require no component code changes.
 *
 * Projects are ordered by displayOrder (ascending). The RC Vehicle is the
 * flagship project and receives the most detailed case study treatment.
 */

export const rcVehicleAnnotations: AnnotationData[] = [
  { id: 'chassis', label: 'Chassis Frame', position: [0, 0.05, 0], cameraTarget: [0, 0.05, 0.3] },
  { id: 'suspension', label: 'Suspension Arm', position: [0.12, 0.03, 0.08], cameraTarget: [0.12, 0.05, 0.2] },
  { id: 'steering', label: 'Steering Linkage', position: [0, 0.04, 0.15], cameraTarget: [0, 0.06, 0.25] },
  { id: 'wheel', label: 'Wheel Assembly', position: [0.15, 0.02, 0.1], cameraTarget: [0.15, 0.04, 0.2] },
];

export const projects: ProjectData[] = [
  // ─── RC Vehicle (Flagship) — ordered after Personal Server ───────────────────
  {
    id: 'rc-vehicle',
    title: 'RC Vehicle',
    description:
      'Custom-designed radio-controlled vehicle with parametric CAD chassis, independent suspension geometry, and iterative mechanical refinement across multiple design generations.',
    category: ['MECHANICAL', 'CAD'],
    technologies: ['Onshape', 'CAD Modeling', 'FEA', 'Parametric Design', '3D Printing', 'Suspension Geometry'],
    timeframe: '2025-2026',
    role: 'Personal Project',
    media: [
      { type: '3d-model', src: '/assets/models/rc-vehicle.glb', alt: 'Interactive 3D model of the RC vehicle chassis and suspension assembly', caption: 'RC Vehicle - full assembly, Version 03' },
      { type: 'cad-render', src: '/assets/img/rc-vehicle-render.png', alt: 'CAD render of RC vehicle showing chassis and suspension layout', caption: 'Final design render' },
    ],
    displayOrder: 6,
    visualTier: 'flagship',
    caseStudySections: [
      { key: 'problem', heading: 'The Problem', body: 'Off-the-shelf RC cars compromise on suspension geometry, chassis rigidity, and component accessibility. I wanted a vehicle where every dimension was intentional - designed from scratch in CAD with full parametric control over the geometry, so changes to one subsystem propagate cleanly through the rest of the assembly.' },
      { key: 'approach', heading: 'Approach', body: 'Started with a top-down design methodology: defined the wheelbase, track width, and ground clearance targets first, then derived the chassis and suspension geometry to meet those constraints. Every part is parametrically linked so changing a single dimension (like ride height) automatically updates the suspension arms, shock mounts, and chassis clearances.' },
      { key: 'chassis', heading: 'Chassis Design', body: 'The chassis uses a ladder-frame topology with integrated mounting points for all subsystems. Material was selected for a balance of stiffness and weight - the frame is designed to be 3D printed in PETG for prototyping and eventually CNC-machined in aluminum for the final version. Cross-members are positioned to minimize torsional flex under cornering loads.', media: [{ type: 'cad-render', src: '/assets/img/rc-vehicle-chassis.png', alt: 'CAD render of the RC vehicle chassis frame', caption: 'Chassis frame - parametric design' }] },
      { key: 'suspension', heading: 'Suspension System', body: 'Independent double-wishbone suspension on all four corners. The geometry was designed to minimize camber change through the travel range, keeping the tire contact patch consistent under compression and rebound. Shock mounting points were iterated to achieve progressive spring rates without adding complexity.', media: [{ type: 'cad-render', src: '/assets/img/rc-vehicle-suspension.png', alt: 'Close-up of double-wishbone suspension geometry', caption: 'Independent suspension geometry' }] },
      { key: 'decisions', heading: 'Engineering Decisions', body: 'Chose double-wishbone over MacPherson strut for better camber control at the cost of complexity. Selected PETG over PLA for impact resistance during testing. Used M3 hardware throughout for serviceability. Designed the battery tray as a stressed member to save weight while adding rigidity to the lower chassis.' },
      { key: 'current-state', heading: 'Current State', body: 'Version 03 is complete in CAD. Currently printing prototype chassis sections to validate fitment and assembly sequence. Next steps include completing the drivetrain integration, testing suspension travel under load, and preparing the design for aluminum CNC machining.' },
      { key: 'lessons-learned', heading: 'Lessons Learned', body: 'Parametric modeling pays off massively when iterating - a single dimension change that would require rebuilding dozens of features in direct modeling takes seconds. Start with the hardest constraints first (packaging, kinematics) and let the easy geometry follow. Always design for the manufacturing process you intend to use, not the one you wish you had.' },
    ],
  },

  // ─── 2. FRC Team 116 ─────────────────────────────────────────────────────────
  {
    id: 'frc-116',
    title: 'FRC Team 116',
    description:
      'Mechanical lead and team captain for FIRST Robotics Competition Team 116. Designed, prototyped, and fabricated competition robots across multiple seasons, finishing 16th out of 112 teams in Chesapeake District.',
    category: ['ROBOTICS', 'MECHANICAL', 'LEADERSHIP'],
    technologies: ['Fusion360', 'CAD', 'Fabrication', 'Prototyping', 'Java', 'CNC', 'Sheet Metal'],
    timeframe: '2023-2026',
    role: 'Mechanical Lead',
    liveUrl: 'https://www.herndonrobotics.org/',
    media: [
      { type: 'image', src: '/assets/img/frc-116-robot.jpg', alt: 'FRC Team 116 competition robot on the field', caption: '2025 REEFSCAPE competition robot' },
      { type: 'cad-render', src: '/assets/img/frc-116-cad.png', alt: 'CAD render of the 2026 competition robot', caption: 'Full robot CAD assembly' },
      { type: 'image', src: '/assets/img/frc-116-team.jpg', alt: 'Team 116 at competition', caption: 'Team at Chesapeake District event' },
    ],
    displayOrder: 3,
    visualTier: 'standard',
    caseStudySections: [
  {
    key: 'challenge',
    heading: 'The Challenge',
    body: 'The 2026 REBUILT season challenged teams to collect and rapidly score fuel into an active hub while navigating a field with trenches, bumps, and a climbing tower. Our design had to prioritize high-throughput fuel handling while remaining compact, reliable, and capable of moving quickly across the field. As part of the mechanical team, I worked on translating our game strategy into a competition-ready robot through CAD, prototyping, fabrication, and testing.'
  },
  {
    key: 'robot',
    heading: 'The Robot',
    body: 'Our 2026 robot was designed around a swerve drivetrain and a high-capacity fuel handling system. Four independent swerve modules provided precise omnidirectional movement, while the center of the robot housed the primary fuel collection, storage, indexing, and scoring mechanisms. The architecture kept the major mechanisms inside a rigid structural frame while leaving the perimeter open for drivetrain access and maintenance.',
    media: [
      {
        type: 'cad-render',
        src: '/assets/img/frc-116-cad.png',
        alt: 'CAD model of Team 116 Epsilon Delta 2026 REBUILT competition robot',
        caption: '2026 REBUILT robot - mechanical CAD overview'
      }
    ]
  },
  {
    key: 'mechanical-systems',
    heading: 'Mechanical Systems',
    body: 'The robot combines four swerve modules with a centralized fuel-handling system. Fuel is collected and transferred into the robot before being organized through the internal storage and indexing system. A powered launcher at the upper portion of the robot provides the final scoring stage, with the mechanism positioned to maintain a consistent path from storage to the hub. The frame and mechanisms were arranged around serviceability, keeping critical components accessible while maximizing usable internal volume.'
  },
  {
    key: 'design-prototype-test-iterate',
    heading: 'Design → Prototype → Test → Iterate',
    body: 'The robot evolved through an iterative engineering process. We used CAD to validate mechanism geometry and packaging, then built physical prototypes to identify issues that were difficult to predict digitally. Testing focused on fuel flow, indexing reliability, launcher consistency, and mechanical interference. Each iteration fed directly back into the CAD model, allowing us to refine the mechanisms while keeping the overall robot architecture intact.',
  },
  {
    key: 'competition',
    heading: 'Competition',
    body: 'The finished robot competed in the 2026 REBUILT season, where reliability and cycle efficiency were critical. Our design was built around quickly collecting, controlling, and scoring large quantities of fuel while maintaining the mobility needed to navigate the field. The season also reinforced the importance of designing mechanisms that can be diagnosed, repaired, and adjusted quickly between matches.',
  },
  {
    key: 'lessons-learned',
    heading: 'Lessons Learned',
    body: 'The 2026 season reinforced that a successful competition robot is more than a collection of high-performing mechanisms. Packaging, serviceability, reliability, and iteration speed can be just as important as peak performance. Designing around the entire system - from fuel acquisition through scoring - helped me better understand how individual mechanical decisions affect the robot as a whole.'
  }
]
  },

  // ─── 4. STEM PathfindR ────────────────────────────────────────────────────────
  {
    id: 'stem-pathfindr',
    title: 'STEM PathfindR',
    description:
      'AI-powered career exploration platform. Won First Place and Best Use of AI at the AWS AI Hackathon 2026 by using AWS Bedrock to create interactive career simulations for students.',
    category: ['SOFTWARE', 'AI'],
    technologies: ['AWS Bedrock', 'Python', 'Docker', 'Git', 'React', 'TypeScript'],
    timeframe: '2026',
    role: 'Developer',
    awards: ['First Place Overall - AWS AI Hackathon 2026', 'Best Use of AI - AWS AI Hackathon 2026'],
    repositoryUrl: 'https://github.com/Doctorpizza357/AWS',
    media: [
      { type: 'screenshot', src: '/assets/img/stem-pathfindr-ui.png', alt: 'STEM PathfindR application interface showing career simulation', caption: 'Career simulation interface' },
    ],
    displayOrder: 4,
    visualTier: 'standard',
    caseStudySections: [
      { key: 'problem', heading: 'The Problem', body: 'Students choose career paths based on brief descriptions and personality quizzes that tell them nothing about what the work actually feels like day-to-day. A student might pick "software engineering" without understanding the difference between frontend, backend, embedded, or ML engineering - then find out years later they chose wrong.' },
      { key: 'idea', heading: 'The Idea', body: 'What if students could experience a day in the life of any STEM career through AI-powered interactive simulations? Not a video or article, but an actual conversation-driven experience where they solve real problems, make decisions, and get feedback - all powered by large language models that understand the nuances of each role.' },
      { key: 'system-architecture', heading: 'System Architecture', body: 'The platform uses AWS Bedrock as the AI backbone, with a Python API layer handling session management, prompt engineering, and conversation state. The frontend is a React/TypeScript SPA that presents the simulation as an interactive chat-like experience. Everything runs in Docker containers for consistent deployment.', media: [{ type: 'diagram', src: '/assets/img/stem-pathfindr-architecture.png', alt: 'System architecture showing service interactions', caption: 'Service architecture overview' }] },
      { key: 'ai-simulations', heading: 'AI Simulations', body: 'Each career simulation uses carefully crafted system prompts that establish the role context, typical challenges, and decision points. The AI adapts to student responses - if they make a design decision, it presents realistic consequences. Simulations cover mechanical engineering, software development, data science, and biomedical research with distinct conversation flows for each.' },
      { key: 'interview-preparation', heading: 'Interview Preparation', body: 'Beyond career exploration, the platform includes an AI-powered mock interview mode. Students practice answering behavioral and technical questions for their target role, receiving real-time feedback on answer structure, technical accuracy, and communication clarity. The system generates role-appropriate questions based on the career they explored.' },
      { key: 'result', heading: 'Result', body: 'Won First Place overall and Best Use of AI at the AWS AI Hackathon 2026. Judges recognized the platform for its innovative application of generative AI to solve a real problem - bridging the gap between career awareness and career experience for students who have never had exposure to technical roles.' },
    ],
  },

  // ─── 5. Personal Server ───────────────────────────────────────────────────────
  {
    id: 'personal-server',
    title: 'Personal Server',
    description:
      'Self-hosted infrastructure running 10+ containerized services on Ubuntu - Nextcloud, Plex, Grafana/Prometheus monitoring, and secure remote access via Tailscale VPN.',
    category: ['SYSTEMS', 'SOFTWARE'],
    technologies: ['Ubuntu', 'Docker', 'Portainer', 'Nextcloud', 'Plex', 'Grafana', 'Prometheus', 'Tailscale', 'Linux', 'Networking'],
    timeframe: '2023-Present',
    role: 'Personal Project',
    media: [
      { type: 'screenshot', src: '/assets/img/personal-server-grafana.png', alt: 'Grafana monitoring dashboard showing system metrics', caption: 'Monitoring dashboard' },
    ],
    displayOrder: 5,
    visualTier: 'standard',
    caseStudySections: [
      { key: 'problem', heading: 'The Problem', body: 'Cloud storage subscriptions add up fast, media streaming services keep raising prices, and I wanted full control over my data. The challenge: run a reliable multi-service infrastructure on a single machine with limited hardware, accessible from anywhere, without a static IP or port forwarding.' },
      { key: 'system', heading: 'The System', body: 'Running on an Ubuntu Server box with Docker as the container runtime and Portainer for management. Every service runs in its own container with defined resource limits, shared Docker networks for inter-service communication, and bind mounts for persistent data. The system boots to a fully operational state without manual intervention.', media: [] },
      { key: 'containers', heading: 'Containers', body: 'Core services include Nextcloud (file sync and sharing), Plex (media streaming), Grafana + Prometheus (monitoring), Portainer (container management), Nginx Proxy Manager (reverse proxy with auto-SSL), and several smaller utilities. All defined in Docker Compose files organized by service group for clean management.' },
      { key: 'monitoring', heading: 'Monitoring', body: 'Prometheus scrapes metrics from all containers and the host system every 15 seconds. Grafana dashboards visualize CPU, memory, disk I/O, network throughput, and container health. Alert rules notify me if any service goes down or if disk usage exceeds 85%. The monitoring stack itself is containerized and self-monitors.', media: [{ type: 'screenshot', src: '/assets/img/personal-server-grafana.png', alt: 'Grafana dashboard with CPU, memory, and disk metrics', caption: 'Grafana monitoring - system health' }] },
      { key: 'networking', heading: 'Networking', body: 'Tailscale provides secure remote access without exposing any ports to the public internet - the server joins a WireGuard-based mesh VPN that works through NAT and firewalls. Nginx Proxy Manager handles internal routing with automatic Let\'s Encrypt certificates. Docker networks isolate services that don\'t need to communicate.' },
      { key: 'lessons-learned', heading: 'Lessons Learned', body: 'Containers make everything reproducible - when I had to migrate to new hardware, the entire stack came up in 20 minutes from compose files and volume backups. Monitoring isn\'t optional; it\'s how you find problems before users do. Tailscale eliminated 90% of the networking headaches I expected from self-hosting.' },
    ],
  },

  // ─── 6. Pathfinding Visualizer ──────────────────────────────────────────────
  {
    id: 'pathfinding-visualizer',
    title: 'Pathfinding Visualizer',
    description:
      'Interactive visualization of graph traversal algorithms including BFS, DFS, and A* on a grid-based map with real-time animation.',
    category: ['SOFTWARE'],
    technologies: ['Java', 'Swing', 'Graph Theory', 'Algorithms'],
    timeframe: '2023',
    role: 'Personal Project',
    repositoryUrl: 'https://github.com/Doctorpizza357/Path_Finding_Algorithm_Visualizer',
    media: [
      { type: 'screenshot', src: '/assets/img/pathFinding.png', alt: 'Pathfinding algorithm visualizer showing A* traversal on a grid', caption: 'A* algorithm finding the shortest path' },
    ],
    displayOrder: 7,
    visualTier: 'standard',
    caseStudySections: [
      { key: 'problem', heading: 'Context', body: 'Pathfinding algorithms are foundational to computer science but hard to understand from pseudocode alone. Built this visualizer to make the traversal behavior of BFS, DFS, and A* tangible - watching nodes expand in real time makes the performance differences between algorithms immediately obvious.' },
      { key: 'approach', heading: 'Process', body: 'Designed a grid-based UI where users place start/end nodes and draw walls, then watch algorithms find the shortest path step by step. Each algorithm highlights visited nodes and the final path differently so you can compare exploration patterns. Added adjustable animation speed to slow down fast algorithms for analysis.' },
      { key: 'systems', heading: 'Technical Details', body: 'Java Swing application with a custom grid renderer. The graph is represented as an adjacency grid where each cell knows its neighbors. Algorithms run on a separate thread with configurable delay between steps so the UI remains responsive. Supports BFS (guarantees shortest path), DFS (fast but suboptimal), and A* (shortest path with heuristic guidance).' },
    ],
  },

  // ─── 7. Sorting Algorithm Visualizer ──────────────────────────────────────────
  {
    id: 'sorting-algorithm-visualizer',
    title: 'Sorting Algorithm Visualizer',
    description:
      'Visual demonstration of sorting algorithms with step-by-step animation showing comparisons, swaps, and the progression from chaos to order.',
    category: ['SOFTWARE'],
    technologies: ['Java', 'Swing', 'Algorithms', 'Animation'],
    timeframe: '2023',
    role: 'Personal Project',
    repositoryUrl: 'https://github.com/Doctorpizza357/Sorting_Algorithm_Visualizer',
    media: [
      { type: 'screenshot', src: '/assets/img/sortingVisualizer.png', alt: 'Sorting visualizer showing merge sort in progress', caption: 'Merge sort - divide and conquer in action' },
    ],
    displayOrder: 8,
    visualTier: 'standard',
    caseStudySections: [
      { key: 'problem', heading: 'Context', body: 'Sorting algorithms have different time complexities and behaviors that are hard to appreciate from Big-O notation alone. Watching bubble sort struggle on 500 elements while merge sort breezes through makes O(n²) vs O(n log n) viscerally clear.' },
      { key: 'approach', heading: 'Process', body: 'Implemented five sorting algorithms and built a visualization layer that highlights active comparisons (red), confirmed swaps (yellow), and sorted positions (green). Controls allow adjusting array size and animation speed. Each algorithm runs on its own thread for non-blocking visualization.' },
      { key: 'systems', heading: 'Technical Details', body: 'Java Swing application supporting bubble sort, selection sort, insertion sort, merge sort, and quicksort. Uses a custom bar-chart renderer where bar heights represent values. Threading allows concurrent visualization without freezing the UI. Array sizes from 10 to 500 elements demonstrate how algorithms scale.' },
    ],
  },

  // ─── 8. Network Traffic Analyzer ────────────────────────────────────────────
  {
    id: 'network-traffic-analyzer',
    title: 'Network Traffic Analyzer',
    description:
      'Packet capture and visualization tool that analyzes real network traffic to display protocol distributions, connection patterns, and traffic statistics.',
    category: ['SOFTWARE', 'SYSTEMS'],
    technologies: ['Python', 'Scapy', 'Data Visualization', 'Networking'],
    timeframe: '2023',
    role: 'Personal Project',
    repositoryUrl: 'https://github.com/Doctorpizza357/Network-Traffic-Visualizer',
    media: [
      { type: 'screenshot', src: '/assets/img/networkTraffic.png', alt: 'Network traffic analysis showing protocol distribution', caption: 'Protocol distribution analysis' },
    ],
    displayOrder: 9,
    visualTier: 'standard',
    caseStudySections: [
      { key: 'problem', heading: 'Context', body: 'Wanted hands-on understanding of network protocols beyond textbook definitions. Built a tool that captures live packets, parses protocol headers, and generates visual summaries - making invisible network activity tangible and analyzable.' },
      { key: 'approach', heading: 'Process', body: 'Used Scapy for packet capture and parsing, then built visualization layers showing protocol distribution (TCP vs UDP vs ICMP), packet size histograms, and connection frequency maps. The tool runs in real-time, updating displays as new packets arrive on the interface.' },
      { key: 'systems', heading: 'Technical Details', body: 'Python application using Scapy for raw packet capture and dissection. Visualizes traffic data including protocol breakdown by percentage, packet size distributions, top talkers (most active IPs), and connection state timelines. Supports filtering by protocol, port, or IP range.' },
    ],
  },

  // ─── 9. Map Path Finding ──────────────────────────────────────────────────────
  {
    id: 'map-path-finding',
    title: 'Map Path Finding',
    description:
      'Real-world pathfinding on geographic maps using OpenStreetMap data - applying graph algorithms to actual road networks with distance-weighted edges.',
    category: ['SOFTWARE'],
    technologies: ['Python', 'OSMnx', 'NetworkX', 'Matplotlib', 'Graph Theory'],
    timeframe: '2023',
    role: 'Personal Project',
    repositoryUrl: 'https://github.com/Doctorpizza357/Map_pathfinding',
    media: [
      { type: 'screenshot', src: '/assets/img/OSMNX.png', alt: 'Shortest path visualization on a real road network', caption: 'Shortest path on real road data' },
    ],
    displayOrder: 10,
    visualTier: 'standard',
    caseStudySections: [
      { key: 'problem', heading: 'Context', body: 'After building a grid-based pathfinding visualizer, wanted to apply the same algorithms to real geographic data. The jump from uniform grids to weighted road networks with irregular topology introduces real-world complexity - one-way streets, varying road speeds, and non-euclidean distances.' },
      { key: 'approach', heading: 'Process', body: 'Used OSMnx to download road network data for any city from OpenStreetMap, then converted it into a weighted graph where edges represent road segments with distance weights. Applied Dijkstra\'s algorithm and A* to find shortest routes between arbitrary points, visualized on geographic plots.' },
      { key: 'systems', heading: 'Technical Details', body: 'Python project using OSMnx for OpenStreetMap data extraction, NetworkX for graph representation and pathfinding, and Matplotlib for geographic visualization. Supports any location worldwide - just provide coordinates and a radius. Edge weights can be distance, travel time, or custom cost functions.' },
    ],
  },

  // ─── 10. Pizza Browser ──────────────────────────────────────────────────────
  {
    id: 'pizza-browser',
    title: 'Pizza Browser',
    description:
      'Custom-built web browser with tabbed browsing, navigation history, bookmarks, and a built-in rendering engine - exploring how browsers work under the hood.',
    category: ['SOFTWARE'],
    technologies: ['C#', '.NET', 'WinForms', 'WebView'],
    timeframe: '2023',
    role: 'Personal Project',
    repositoryUrl: 'https://github.com/Doctorpizza357/Pizza-Browser',
    media: [
      { type: 'screenshot', src: '/assets/img/browser.png', alt: 'Pizza Browser with multiple tabs open', caption: 'Tabbed browsing interface' },
    ],
    displayOrder: 11,
    visualTier: 'standard',
    caseStudySections: [
      { key: 'problem', heading: 'Context', body: 'We use browsers every day but rarely think about how they work. Built a browser from scratch to understand URL parsing, HTTP requests, page rendering, tab management, and history tracking at the application level.' },
      { key: 'approach', heading: 'Process', body: 'Developed a tabbed interface with address bar, back/forward navigation, refresh, and bookmarks. Integrated the WebView2 rendering engine for actual page display. The focus was on the browser chrome and state management rather than building a rendering engine.' },
      { key: 'systems', heading: 'Technical Details', body: 'C# WinForms application using WebView2 (Chromium-based) for page rendering. Implements tab management with independent browsing contexts, navigation history with back/forward stacks, bookmark persistence to JSON, and URL autocomplete from history.' },
    ],
  },

  // ─── 11. Tic-Tac-Toe AI ────────────────────────────────────────────────────
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe AI',
    description:
      'Unbeatable Tic-Tac-Toe opponent powered by the minimax algorithm - explores game theory and adversarial search in a simple but complete domain.',
    category: ['SOFTWARE'],
    technologies: ['Java', 'Swing', 'Minimax', 'Game Theory'],
    timeframe: '2022',
    role: 'Personal Project',
    repositoryUrl: 'https://github.com/Doctorpizza357/Tic-Tac-Toe',
    media: [
      { type: 'screenshot', src: '/assets/img/ticTacToe.png', alt: 'Tic-Tac-Toe game with AI opponent', caption: 'AI evaluating optimal move' },
    ],
    displayOrder: 12,
    visualTier: 'standard',
    caseStudySections: [
      { key: 'problem', heading: 'Context', body: 'Tic-Tac-Toe is a solved game - with perfect play, neither side can win. Implemented the minimax algorithm to create an AI that plays optimally in every situation, exploring how adversarial search works in a domain small enough to be fully enumerable.' },
      { key: 'approach', heading: 'Process', body: 'Started with a two-player implementation to nail the game logic, then added the minimax AI. The algorithm recursively evaluates every possible game state from the current position, assuming the opponent also plays optimally, and selects the move that maximizes the AI\'s minimum guaranteed outcome.' },
      { key: 'systems', heading: 'Technical Details', body: 'Java Swing application with a 3x3 grid interface. The minimax algorithm evaluates all reachable game states (at most 9! = 362,880, but pruned significantly by early termination). Response is instant because the state space is small enough to fully search without alpha-beta pruning.' },
    ],
  },

  // ─── 12. Auto Typer ─────────────────────────────────────────────────────────
  {
    id: 'auto-typer',
    title: 'Auto Typer',
    description:
      'Automated typing tool that simulates keyboard input at configurable speeds with hotkey triggers - evolved through three major versions.',
    category: ['SOFTWARE'],
    technologies: ['Python', 'PyAutoGUI', 'Tkinter', 'Automation'],
    timeframe: '2022',
    role: 'Personal Project',
    repositoryUrl: 'https://github.com/Doctorpizza357/Autotyper-v3',
    media: [
      { type: 'screenshot', src: '/assets/img/autoTyper.jpg', alt: 'Auto Typer GUI with speed and text configuration', caption: 'Version 3 interface' },
    ],
    displayOrder: 13,
    visualTier: 'standard',
    caseStudySections: [
      { key: 'problem', heading: 'Context', body: 'Repetitive typing tasks are tedious and error-prone. Built an automation tool that types pre-configured text at human-like speeds, triggered by hotkeys. Iterated through three versions adding reliability, configurability, and a proper GUI.' },
      { key: 'approach', heading: 'Process', body: 'Version 1 was a simple script. Version 2 added configurable speed and delay. Version 3 introduced a full Tkinter GUI for managing multiple text snippets, adjustable characters-per-second, start/stop hotkeys, and the ability to load text from files.' },
      { key: 'systems', heading: 'Technical Details', body: 'Python application using PyAutoGUI for keyboard simulation and Tkinter for the GUI. Supports configurable typing speed (10-1000 chars/sec), start/stop hotkeys via pynput, text file loading, and random delay jitter to simulate human typing patterns.' },
    ],
  },

  // ─── 13. Directory Sorter ──────────────────────────────────────────────────
  {
    id: 'directory-sorter',
    title: 'Directory Sorter',
    description:
      'File organization utility that automatically categorizes and moves files into sorted directories based on file type, extension, and custom rules.',
    category: ['SOFTWARE'],
    technologies: ['Java', 'File I/O', 'Desktop Automation'],
    timeframe: '2022',
    role: 'Personal Project',
    repositoryUrl: 'https://github.com/Doctorpizza357/Directory_Sorter',
    media: [
      { type: 'screenshot', src: '/assets/img/directorySorter.png', alt: 'Directory Sorter organizing files by category', caption: 'Automatic file categorization' },
    ],
    displayOrder: 14,
    visualTier: 'standard',
    caseStudySections: [
      { key: 'problem', heading: 'Context', body: 'Downloads folders accumulate hundreds of unsorted files - PDFs mixed with images mixed with installers. Built a tool that watches a directory and automatically sorts files into categorized subfolders based on their extension and type.' },
      { key: 'approach', heading: 'Process', body: 'Designed a rule-based classification system mapping file extensions to categories (Documents, Images, Videos, Archives, Code, etc.). The sorter scans the target directory, classifies each file, creates category folders if needed, and moves files to their correct location.' },
      { key: 'systems', heading: 'Technical Details', body: 'Java application using NIO file operations for directory scanning and file movement. Rule engine maps extensions to categories with support for custom rules via configuration file. Handles naming conflicts by appending timestamps. Can run as a one-shot sort or watch mode for continuous organization.' },
    ],
  },

  // ─── 14. CMU Minecraft ──────────────────────────────────────────────────────
  {
    id: 'cmu-minecraft',
    title: 'CMU Minecraft',
    description:
      'A 3D voxel-based Minecraft clone built entirely in CMU Graphics with a custom software-rendered 3D engine featuring perspective projection, face culling, and real-time block interaction.',
    category: ['SOFTWARE'],
    technologies: ['Python', 'CMU Graphics', '3D Rendering', 'Raycasting', 'Physics', 'Game Development'],
    timeframe: '2026',
    role: 'CS Final Project',
    repositoryUrl: 'https://github.com/Doctorpizza357/CMU-Minecraft',
    media: [
      { type: 'screenshot', src: '/assets/img/cmu-minecraft-splash.png', alt: 'CMU Minecraft 3D voxel world rendered in CMU Graphics', caption: 'Custom 3D engine running in CMU Graphics' },
    ],
    displayOrder: 4,
    visualTier: 'standard',
    caseStudySections: [
      { key: 'problem', heading: 'The Challenge', body: 'Build a complete 3D game using only CMU Graphics - a 2D canvas library with no 3D support, no shaders, and no GPU acceleration. Every pixel of the 3D world had to be projected, culled, and drawn using basic polygon primitives on a 2D surface.' },
      { key: 'rendering', heading: '3D Rendering Engine', body: 'Built a custom software renderer from scratch: camera-space transformation with yaw/pitch rotation, perspective division for screen projection, back-face culling and neighbor occlusion to reduce draw calls, painter\'s algorithm for depth sorting, and block face caching to avoid redundant projection when the camera is stationary. All rendering uses CMU Graphics primitives (Polygon, Line, Rect) - no external 3D libraries.', media: [{ type: 'screenshot', src: '/assets/img/cmu-minecraft-gameplay.png', alt: 'CMU Minecraft gameplay showing 3D rendered voxel world with inventory and HUD', caption: 'In-game gameplay with custom 3D renderer' }] },
      { key: 'gameplay', heading: 'Gameplay Systems', body: 'Full Minecraft-style interaction: raycasting for block placement and breaking, gravity and collision detection, fall damage in Survival mode, creative-style free flight, a 24-slot inventory with drag-and-drop, an 8-slot hotbar, health and hunger bars, and an in-game chat system with /tp teleport commands.' },
      { key: 'optimization', heading: 'Optimization', body: 'Running a 3D engine on a 2D canvas library meant every frame had to be fast. Face exposure culling skips faces hidden by neighboring blocks. Block face caching avoids re-projecting geometry when the camera hasn\'t moved. Render distance limiting keeps the visible block count manageable. These optimizations brought frame rates from single digits to playable.' },
      { key: 'result', heading: 'Result', body: 'A playable Minecraft clone with full 3D navigation, block interaction, physics, inventory management, and game state menus - all running in a library designed for 2D educational graphics. Demonstrates that understanding the math behind rendering (projection, culling, depth sorting) lets you build 3D experiences anywhere, even without a GPU.', media: [{ type: 'embed', src: 'https://academy.cs.cmu.edu/sharing/redGoat108501/embed', alt: 'CMU Minecraft playable demo', caption: 'Play CMU Minecraft in the browser' }] },
    ],
  },

  // ─── Speedcubing Timer ────────────────────────────────────────────────────────
  {
    id: 'speedcubing-timer',
    title: 'Speedcubing Timer',
    description:
      'An offline-first web app for Rubik\'s Cube speedsolvers: WCA-accurate timing with inspection and penalties, session statistics, an SRS algorithm trainer, and merge-based cross-device cloud sync.',
    category: ['SOFTWARE', 'SYSTEMS'],
    technologies: ['React', 'TypeScript', 'Zustand', 'Dexie', 'IndexedDB', 'cubing.js', 'Recharts', 'Tailwind CSS', 'Firebase', 'Vite', 'Vitest', 'fast-check'],
    timeframe: '2026',
    role: 'Personal Project',
    liveUrl: 'https://doctorpizza357.github.io/cube-timer/',
    media: [
      { type: 'screenshot', src: '/assets/img/cube-timer.png', alt: 'Speedcubing Timer interface showing solve timer, scramble, and session statistics', caption: 'Timer with scramble and session stats' },
    ],
    displayOrder: 5,
    visualTier: 'standard',
    caseStudySections: [
      { key: 'problem', heading: 'The Problem', body: 'Speedcubers practice a full loop - scramble, time, analyze, improve - and need a timer that is WCA-accurate, works anywhere without a network, and keeps detailed statistics. Most web timers either break offline or lose data when the same account is used across devices. I wanted an offline-first app where the cloud is an optional enhancement, not a dependency.' },
      { key: 'approach', heading: 'Approach', body: 'Built a client-only, offline-first single-page app. IndexedDB (via Dexie) is the source of truth so the app is fully functional with no connection. Optional Google sign-in layers on merge-based cloud sync so a cuber\'s solves follow them across devices. Pure, framework-free logic cores (statistics, scramble generation, cube-state reconstruction) sit beneath a thin React/Zustand UI, keeping the testable logic isolated from rendering.' },
      { key: 'systems', heading: 'Features', body: 'WCA-style timing with 15-second inspection, +2/DNF penalties, and configurable hold-to-start. Official scramble generation with interactive 2D-net and 3D visualizers via cubing.js. Session management with rolling averages (Ao5/12/50/100), best single/average tracking, and session mean. Solve-phase cadence tracking (Cross / F2L / OLL / PLL splits) surfaces a solver\'s weakest stage. An algorithm trainer with spaced-repetition scheduling, plus Zen Mode (distraction-free) and Ghost Mode (pace against a target time). csTimer import migrates existing solve history.' },
      { key: 'decisions', heading: 'Engineering Highlights', body: 'Offline-first with IndexedDB as the source of truth and the cloud as an optional enhancement. Two-way sync uses record-level merging with last-write-wins and deletion tombstones, so solves recorded offline on multiple devices reconcile instead of overwriting each other. A layered architecture (React components → Zustand stores → a single storage gateway → Dexie) keeps persistence concerns isolated. Pure logic cores are verified with unit tests and property-based tests (fast-check), and the app ships via an automated GitHub Actions CI/CD pipeline to GitHub Pages.' },
    ],
  },
]
