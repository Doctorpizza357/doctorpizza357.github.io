/**
 * Blender gallery data — renders and animations for the masonry grid.
 *
 * Each item has a size hint for grid placement:
 * - 'wide': spans 2 columns (cinematic/ultra-wide renders)
 * - 'tall': spans 2 rows
 * - 'large': spans 2 columns + 2 rows (hero piece)
 * - 'normal': single grid cell
 */

export type GalleryItemSize = 'normal' | 'wide' | 'tall' | 'large';

export interface GalleryItem {
  id: string;
  title: string;
  src: string;
  type: 'image' | 'video';
  size: GalleryItemSize;
  alt: string;
}

export const blenderGallery: GalleryItem[] = [
  {
    id: 'black-hole',
    title: 'Black Hole',
    src: '/assets/img/blender/Black Hole.png',
    type: 'image',
    size: 'wide',
    alt: 'Blender render of a black hole with accretion disk',
  },
  {
    id: 'earth',
    title: 'Earth',
    src: '/assets/img/blender/earth v2.png',
    type: 'image',
    size: 'normal',
    alt: 'Blender render of Earth from space',
  },
  {
    id: 'nebula',
    title: 'Nebula',
    src: '/assets/img/blender/nebular-blue 3.png',
    type: 'image',
    size: 'normal',
    alt: 'Blender render of a blue nebula in space',
  },
  {
    id: 'planet-8k',
    title: 'Planet',
    src: '/assets/img/blender/planet 8k v2.png',
    type: 'image',
    size: 'large',
    alt: 'Blender render of a detailed planet surface from orbit',
  },
  {
    id: 'forest',
    title: 'Forest',
    src: '/assets/img/blender/forest.jpg',
    type: 'image',
    size: 'normal',
    alt: 'Blender render of a forest scene',
  },
  {
    id: 'night-sky',
    title: 'Night Sky',
    src: '/assets/img/blender/nightsky.png',
    type: 'image',
    size: 'normal',
    alt: 'Blender render of a night sky with stars',
  },
  {
    id: 'mountain',
    title: 'Mountain',
    src: '/assets/img/blender/mountainV2.png',
    type: 'image',
    size: 'wide',
    alt: 'Blender render of a mountain landscape',
  },
  {
    id: 'planet-moon',
    title: 'Planet & Moon',
    src: '/assets/img/blender/planet moon.png',
    type: 'image',
    size: 'normal',
    alt: 'Blender render of a planet with its moon',
  },
  {
    id: 'stormy-ocean',
    title: 'Stormy Ocean',
    src: '/assets/img/blender/stormy ocean v3.png',
    type: 'image',
    size: 'normal',
    alt: 'Blender render of a stormy ocean scene',
  },
  {
    id: 'ship-ocean',
    title: 'Ship at Sea',
    src: '/assets/img/blender/ship ocean.jpg',
    type: 'image',
    size: 'wide',
    alt: 'Blender render of a ship on the ocean',
  },
  {
    id: 'animation',
    title: 'Animation Reel',
    src: '/assets/videos/blender/Final Video with Audio.mp4',
    type: 'video',
    size: 'wide',
    alt: 'Blender animation reel',
  },
];
