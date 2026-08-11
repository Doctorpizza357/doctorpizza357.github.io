import { CaseStudyData } from './types';

/**
 * All portfolio projects presented as engineering case studies.
 * Each project includes placeholder case study sections (context, process, technical details)
 * to be filled in with detailed content later.
 *
 * Image paths reference src/assets/img/ where they'll be available after migration (task 12.2).
 * Repository URLs are sourced from the existing portfolio site.
 */
export const projects: CaseStudyData[] = [
  {
    id: 'pathfinding-visualizer',
    title: 'Pathfinding Visualizer',
    summary: 'Interactive visualization of graph traversal algorithms including BFS, DFS, and A*',
    technologies: ['Java', 'Swing', 'Graph Theory', 'Algorithms'],
    images: ['/assets/img/pathFinding.png'],
    repositoryUrl: 'https://github.com/Doctorpizza357/Path_Finding_Algorithm_Visualizer',
    caseStudySections: [
      {
        heading: 'Context',
        body: 'Built to explore and visualize how different pathfinding algorithms traverse a grid-based graph. The goal was to make abstract algorithm behavior tangible and observable.',
      },
      {
        heading: 'Process',
        body: 'Designed a grid-based UI that allows users to place start/end nodes and walls, then watch algorithms find the shortest path in real time. Iteratively refined the animation timing for clarity.',
      },
      {
        heading: 'Technical Details',
        body: 'Implemented in Java using Swing for the GUI. Supports BFS, DFS, and A* algorithms with adjustable animation speed. Uses an adjacency-based graph representation for the grid.',
      },
    ],
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    summary: 'Classic Tic-Tac-Toe game with an AI opponent using the minimax algorithm',
    technologies: ['Java', 'Swing', 'Minimax', 'Game Theory'],
    images: ['/assets/img/ticTacToe.png'],
    repositoryUrl: 'https://github.com/Doctorpizza357/Tic-Tac-Toe',
    caseStudySections: [
      {
        heading: 'Context',
        body: 'Created as an exploration of game theory and adversarial search. The challenge was implementing an unbeatable AI using the minimax decision-making algorithm.',
      },
      {
        heading: 'Process',
        body: 'Started with a basic two-player implementation, then layered in the minimax AI. Focused on making the game state evaluation efficient for real-time play.',
      },
      {
        heading: 'Technical Details',
        body: 'Built with Java Swing for the interface. The AI uses a recursive minimax algorithm to evaluate all possible game states and select the optimal move.',
      },
    ],
  },
  {
    id: 'sorting-algorithm-visualizer',
    title: 'Sorting Algorithm Visualizer',
    summary: 'Visual demonstration of various sorting algorithms with step-by-step animation',
    technologies: ['Java', 'Swing', 'Algorithms', 'Animation'],
    images: ['/assets/img/sortingVisualizer.png'],
    repositoryUrl: 'https://github.com/Doctorpizza357/Sorting_Algorithm_Visualizer',
    caseStudySections: [
      {
        heading: 'Context',
        body: 'Designed to make sorting algorithm behavior visible and intuitive. Watching elements swap and shift helps build understanding of algorithmic complexity.',
      },
      {
        heading: 'Process',
        body: 'Implemented multiple sorting algorithms and built a visualization layer that highlights comparisons and swaps in real time. Added controls for speed and array size.',
      },
      {
        heading: 'Technical Details',
        body: 'Java Swing application supporting bubble sort, selection sort, insertion sort, merge sort, and quicksort. Uses threading for non-blocking animations during sort execution.',
      },
    ],
  },
  {
    id: 'pizza-browser',
    title: 'Pizza Browser',
    summary: 'A custom-built web browser with tabbed browsing and essential navigation features',
    technologies: ['C#', '.NET', 'WinForms', 'WebView'],
    images: ['/assets/img/browser.png'],
    repositoryUrl: 'https://github.com/Doctorpizza357/Pizza-Browser',
    caseStudySections: [
      {
        heading: 'Context',
        body: 'Built to understand how web browsers work under the hood — from URL parsing and navigation to rendering web content within a native application.',
      },
      {
        heading: 'Process',
        body: 'Developed a tabbed browser interface with address bar, back/forward navigation, and bookmarks. Integrated a web rendering engine for displaying pages.',
      },
      {
        heading: 'Technical Details',
        body: 'Built with C# and .NET WinForms, using a WebView component for page rendering. Implements tab management, history tracking, and basic bookmark storage.',
      },
    ],
  },
  {
    id: 'auto-typer',
    title: 'Auto Typer',
    summary: 'Automated typing tool that simulates keyboard input at configurable speeds',
    technologies: ['Python', 'PyAutoGUI', 'Tkinter', 'Automation'],
    images: ['/assets/img/autoTyper.jpg'],
    repositoryUrl: 'https://github.com/Doctorpizza357/Autotyper-v3',
    caseStudySections: [
      {
        heading: 'Context',
        body: 'Created as a utility tool to automate repetitive typing tasks. Evolved through multiple versions to add more control and reliability.',
      },
      {
        heading: 'Process',
        body: 'Built a GUI for configuring typing speed, delay, and text input. Iterated through three major versions improving accuracy and adding features like hotkey triggers.',
      },
      {
        heading: 'Technical Details',
        body: 'Python application using PyAutoGUI for keyboard simulation and Tkinter for the GUI. Supports configurable typing speed, start/stop hotkeys, and text file input.',
      },
    ],
  },
  {
    id: 'map-path-finding',
    title: 'Map Path Finding',
    summary: 'Real-world pathfinding on geographic maps using OpenStreetMap data and graph algorithms',
    technologies: ['Python', 'OSMnx', 'NetworkX', 'Matplotlib', 'Graph Theory'],
    images: ['/assets/img/OSMNX.png'],
    repositoryUrl: 'https://github.com/Doctorpizza357/Map_pathfinding',
    caseStudySections: [
      {
        heading: 'Context',
        body: 'Applied pathfinding algorithms to real geographic data, bridging the gap between abstract graph theory and practical navigation on actual road networks.',
      },
      {
        heading: 'Process',
        body: 'Used OSMnx to download and process OpenStreetMap road network data, then applied shortest-path algorithms to find routes between real-world locations.',
      },
      {
        heading: 'Technical Details',
        body: 'Python project using OSMnx for map data extraction, NetworkX for graph operations and pathfinding, and Matplotlib for route visualization on geographic plots.',
      },
    ],
  },
  {
    id: 'directory-sorter',
    title: 'Directory Sorter',
    summary: 'File organization tool that automatically sorts files into categorized directories',
    technologies: ['Java', 'File I/O', 'Desktop Automation'],
    images: ['/assets/img/directorySorter.png'],
    repositoryUrl: 'https://github.com/Doctorpizza357/Directory_Sorter',
    caseStudySections: [
      {
        heading: 'Context',
        body: 'Built to solve the common problem of cluttered download folders. Automatically categorizes and moves files based on their type and extension.',
      },
      {
        heading: 'Process',
        body: 'Designed a rule-based system that maps file extensions to categories, then moves files into organized subdirectories. Added configuration for custom rules.',
      },
      {
        heading: 'Technical Details',
        body: 'Java application using file I/O operations to scan directories, classify files by extension, and move them into categorized folders. Supports customizable sorting rules.',
      },
    ],
  },
  {
    id: 'network-traffic-analyzer',
    title: 'Network Traffic Analyzer',
    summary: 'Tool for capturing and visualizing network traffic patterns and packet data',
    technologies: ['Python', 'Scapy', 'Data Visualization', 'Networking'],
    images: ['/assets/img/networkTraffic.png'],
    repositoryUrl: 'https://github.com/Doctorpizza357/Network-Traffic-Visualizer',
    caseStudySections: [
      {
        heading: 'Context',
        body: 'Developed to gain hands-on understanding of network protocols and traffic patterns by capturing and analyzing real packet data.',
      },
      {
        heading: 'Process',
        body: 'Built a packet capture system that collects network traffic, parses protocol headers, and generates visual representations of traffic patterns and distributions.',
      },
      {
        heading: 'Technical Details',
        body: 'Python application using Scapy for packet capture and analysis. Visualizes traffic data including protocol distribution, packet sizes, and connection patterns.',
      },
    ],
  },
  {
    id: 'folder-encrypter',
    title: 'Folder Encrypter',
    summary: 'File encryption tool that secures folder contents using cryptographic algorithms',
    technologies: ['Python', 'Cryptography', 'File I/O', 'Security'],
    images: ['/assets/img/folderEncrypter.png'],
    repositoryUrl: 'https://github.com/Doctorpizza357/Folder-Encrypter',
    caseStudySections: [
      {
        heading: 'Context',
        body: 'Created to explore practical cryptography by building a tool that encrypts and decrypts entire folder contents for secure storage.',
      },
      {
        heading: 'Process',
        body: 'Implemented file-level encryption with key generation, secure storage of encryption keys, and a user interface for selecting folders to encrypt or decrypt.',
      },
      {
        heading: 'Technical Details',
        body: 'Python application using the cryptography library for encryption operations. Supports folder-level encryption/decryption with secure key management.',
      },
    ],
  },
  {
    id: 'radical-simplifier',
    title: 'Radical Simplifier',
    summary: 'Mathematical tool that simplifies radical expressions step by step',
    technologies: ['Java', 'Mathematics', 'Algorithms'],
    images: ['/assets/img/radicalSimplfier.png'],
    repositoryUrl: 'https://github.com/doctorpizza357/radical_Simplifier/',
    caseStudySections: [
      {
        heading: 'Context',
        body: 'Built as a math utility to automate the simplification of radical (square root) expressions, showing the factoring process step by step.',
      },
      {
        heading: 'Process',
        body: 'Implemented prime factorization logic to break down radicands, then applied simplification rules to extract perfect square factors from under the radical.',
      },
      {
        heading: 'Technical Details',
        body: 'Java application implementing prime factorization and radical simplification algorithms. Provides step-by-step output showing the simplification process.',
      },
    ],
  },
  {
    id: 'heap-tree-visualizer',
    title: 'Heap Tree Visualizer',
    summary: 'Interactive visualization of heap data structure operations including insert and extract',
    technologies: ['Java', 'Swing', 'Data Structures', 'Trees'],
    images: ['/assets/img/treeVisualizer.png'],
    repositoryUrl: 'https://github.com/Doctorpizza357/Heap_Visualizer',
    caseStudySections: [
      {
        heading: 'Context',
        body: 'Designed to visualize how heap data structures maintain their properties during insertions and extractions, making tree-based data structures more intuitive.',
      },
      {
        heading: 'Process',
        body: 'Built a tree rendering system that displays heap state and animates operations like insert, extract-min/max, and heapify to show structural changes.',
      },
      {
        heading: 'Technical Details',
        body: 'Java Swing application with custom tree rendering. Visualizes min-heap and max-heap operations with animated node movements during structural rebalancing.',
      },
    ],
  },
];
