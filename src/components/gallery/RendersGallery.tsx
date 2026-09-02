import { useState, useRef, useCallback } from 'react';
import type { RefObject } from 'react';
import { blenderGallery } from '../../data/blenderGallery';
import type { GalleryItem } from '../../data/blenderGallery';
import { useLazyLoad } from '../../hooks/useLazyLoad';
import SectionWrapper from '../ui/SectionWrapper';
import Lightbox from './Lightbox';
import styles from './RendersGallery.module.css';

/**
 * A single render cell in the gallery grid.
 *
 * Lazy-loads its media using the `useLazyLoad` hook with a `rootMargin` of one
 * viewport height so fetching begins when the item is within a viewport height
 * of the visible edge (Req 11.4). Images additionally carry the native
 * `loading="lazy"` attribute as a progressive-enhancement fallback.
 */
function GalleryCell({
  item,
  onOpen,
}: {
  item: GalleryItem;
  onOpen: (trigger: HTMLDivElement) => void;
}) {
  const sizeClass = styles[item.size] || styles.normal;
  // '100%' expands the observer root by one viewport height on each axis so
  // fetching begins within one viewport height of the visible edge (Req 11.4).
  // IntersectionObserver rootMargin only accepts px/percent — 'vh' is invalid.
  const { ref, isVisible } = useLazyLoad<HTMLDivElement>({ rootMargin: '100%' });

  const handleOpen = () => {
    if (ref.current) onOpen(ref.current);
  };

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={`${styles.item} ${sizeClass}`}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      }}
    >
      {isVisible ? (
        item.type === 'video' ? (
          <video
            className={styles.media}
            src={item.src}
            autoPlay
            muted
            loop
            playsInline
            aria-label={item.alt}
          />
        ) : (
          <img
            className={styles.media}
            src={item.src}
            alt={item.alt}
            loading="lazy"
          />
        )
      ) : (
        <div className={styles.placeholder} aria-hidden="true" />
      )}
      <div className={styles.overlay} aria-hidden="true">
        <span className={styles.label}>
          {item.title}
          <span className={styles.tag}>Blender</span>
        </span>
      </div>
    </div>
  );
}

/**
 * RendersGallery — responsive grid of 3D renders (Req 11).
 *
 * Renders the `blenderGallery` items inside the `id="gallery"` SectionWrapper
 * (Req 11.1) in a responsive grid with a uniform gutter sourced from the
 * `--gallery-gutter` design token (Req 11.2), collapsing to a single column
 * below 768px (Req 11.3). Each item lazy-loads within one viewport height of
 * the visible edge (Req 11.4).
 */
function RendersGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openLightbox = useCallback((index: number, trigger: HTMLDivElement) => {
    triggerRef.current = trigger;
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  return (
    <SectionWrapper id="gallery">
      <div className={styles.section}>
        <h2 className={styles.title}>Renders</h2>
        <div className={styles.grid}>
          {blenderGallery.map((item, i) => (
            <GalleryCell
              key={item.id}
              item={item}
              onOpen={(trigger) => openLightbox(i, trigger)}
            />
          ))}
        </div>
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          items={blenderGallery}
          index={lightboxIndex}
          onNavigate={setLightboxIndex}
          onClose={closeLightbox}
          triggerRef={triggerRef}
        />
      )}
    </SectionWrapper>
  );
}

export default RendersGallery;
