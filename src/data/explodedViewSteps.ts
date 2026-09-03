import type { ExplodedStep } from '../components/projects/ExplodedModelViewer';

/**
 * Exploded view steps for the RC Vehicle flagship project.
 *
 * Each step defines which mesh groups separate and in which direction,
 * creating a scroll-driven disassembly animation that reveals internal structure.
 *
 * meshPatterns use case-insensitive substring matching against Three.js mesh names.
 * You'll need to verify mesh names in your .glb file (open in a glTF viewer or log
 * model.traverse to console). Adjust patterns to match your actual mesh naming.
 *
 * cameraPosition values are in scene units — tune after seeing the model scale.
 */
export const rcVehicleExplodedSteps: ExplodedStep[] = [
  {
    id: 'assembled',
    label: '01',
    heading: 'Full Assembly',
    body: 'The complete RC vehicle in its assembled state. Every component is parametrically linked — change one dimension and the rest follow.',
    meshPatterns: [], // No explode — everything stays put
    explodeOffset: [0, 0, 0],
    cameraPosition: [3, 1.5, 3],
  },
  {
    id: 'body-separate',
    label: '02',
    heading: 'Body & Top Plate',
    body: 'The body panels and top plate lift away, exposing the chassis frame and internal mounting points. The frame uses a ladder topology with integrated cross-members.',
    meshPatterns: ['body', 'top', 'plate', 'shell', 'cover'],
    explodeOffset: [0, 0.8, 0],
    cameraPosition: [2.5, 2, 2.5],
  },
  {
    id: 'suspension-explode',
    label: '03',
    heading: 'Suspension System',
    body: 'Double-wishbone suspension arms spread outward. The geometry minimizes camber change through travel, keeping the tire contact patch consistent under load.',
    meshPatterns: ['suspension', 'wishbone', 'arm', 'shock', 'spring'],
    explodeOffset: [0.6, 0.2, 0],
    cameraPosition: [2, 1, 3],
  },
  {
    id: 'wheels-explode',
    label: '04',
    heading: 'Wheel Assemblies',
    body: 'The wheel assemblies — hubs, bearings, and tires — pull away from the suspension knuckles. M3 hardware throughout for easy serviceability.',
    meshPatterns: ['wheel', 'tire', 'hub', 'rim', 'knuckle'],
    explodeOffset: [0.8, 0, 0.3],
    cameraPosition: [3, 0.5, 2],
  },
  {
    id: 'chassis-detail',
    label: '05',
    heading: 'Chassis Frame',
    body: 'The bare chassis. Cross-members are positioned to minimize torsional flex. Battery tray acts as a stressed member — saves weight while adding rigidity.',
    meshPatterns: [], // Nothing moves — we're looking at what's left
    explodeOffset: [0, 0, 0],
    cameraPosition: [1.5, 2.5, 1.5],
  },
];


