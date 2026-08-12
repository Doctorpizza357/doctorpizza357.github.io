import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { blenderGallery } from '../../data/blenderGallery';
import type { GalleryItem } from '../../data/blenderGallery';
import SectionWrapper from '../ui/SectionWrapper';
import styles from './BlenderGallery.module.css';

function GalleryCell({ item, onClick }: { item: GalleryItem; onClick: () => void }) {
  const sizeClass = styles[item.size] || styles.normal;

  return (
    <div
      className={`${styles.item} ${sizeClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {item.type === 'video' ? (
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

function Lightbox({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.documentElement.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div className={styles.lightboxBackdrop} onClick={onClose}>
      <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.lightboxClose}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {item.type === 'video' ? (
          <video
            className={styles.lightboxMedia}
            src={item.src}
            autoPlay
            controls
            playsInline
            aria-label={item.alt}
          />
        ) : (
          <img
            className={styles.lightboxMedia}
            src={item.src}
            alt={item.alt}
          />
        )}
        <span className={styles.lightboxTitle}>{item.title}</span>
      </div>
    </div>,
    document.body
  );
}

function BlenderGallery() {
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  return (
    <SectionWrapper id="gallery">
      <div className={styles.section}>
        <h2 className={styles.title}>Renders</h2>
        <div className={styles.grid}>
          {blenderGallery.map((item) => (
            <GalleryCell
              key={item.id}
              item={item}
              onClick={() => setLightboxItem(item)}
            />
          ))}
        </div>
      </div>
      {lightboxItem && <Lightbox item={lightboxItem} onClose={closeLightbox} />}
    </SectionWrapper>
  );
}

export default BlenderGallery;
