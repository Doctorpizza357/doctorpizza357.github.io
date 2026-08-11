import type { SectionContent } from './types';

export const sections: Record<string, SectionContent | null> = {
  beginning: {
    id: 'beginning',
    title: 'The Beginning',
    body: 'It started with FIRST Robotics — designing competition robots from raw aluminum and turning sketches into machines that could score points autonomously. That loop of prototyping, testing, breaking, and rebuilding became the foundation for everything that followed. Every challenge was permission to learn something new.',
  },
  iteration: {
    id: 'iteration',
    title: 'Iteration',
    body: 'Python scripts became full applications. Algorithm visualizers pushed understanding of data structures into territory textbooks couldn\'t reach. Curiosity about networking produced traffic analyzers. Interest in security led to encryption tools. Each project compounded on the last — building fluency across software, systems, and mechanical design.',
  },
  pennState: {
    id: 'penn-state',
    title: 'Penn State',
    body: 'Entering Penn State\'s Mechanical Engineering program in Fall 2026. The self-taught foundation meets formal engineering rigor — thermodynamics, solid mechanics, manufacturing processes, and the collaborative intensity of a top engineering program. Ready to apply years of independent building to structured engineering challenges at scale.',
  },
  currently: {
    id: 'currently',
    title: 'Currently',
    body: 'Working at the intersection of mechanical design and software. Building an RC vehicle from parametric CAD, modeling engine geometries for fun, self-hosting infrastructure, and competing in FIRST Robotics as team captain. Always looking for the next problem worth solving.',
  },
  labNotes: null,
};
