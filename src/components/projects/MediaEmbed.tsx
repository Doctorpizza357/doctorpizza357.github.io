import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import styles from './MediaEmbed.module.css';
import type { MediaItem } from '../../data/projectTypes';
import { ModelViewerBoundary } from './ProjectErrorBoundary';

const ModelViewerLazy = lazy(() => import('./ModelViewer'));

interface MediaEmbedProps {
  media: MediaItem;
  lazy?: boolean;
}

/**
 * MediaEmbed renders the correct media element based on media.type with
 * lazy loading via IntersectionObserver.
 *
 * Supported media types:
 * - image, screenshot, cad-render, diagram, gif → <picture> with WebP/AVIF sources and <img> fallback
 * - video → <video> with controls
 * - 3d-model → ModelViewer component (lazy imported)
 * - pdf → <iframe>
 *
 * Lazy loading uses IntersectionObserver with rootMargin of "100%" (1 viewport distance).
 * When lazy is false or undefined, media renders immediately.
 */
function MediaEmbed({ media, lazy = true }: MediaEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!lazy);

  useEffect(() => {
    if (!lazy) {
      setIsVisible(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    // Check if IntersectionObserver is available; fall back to eager loading if not
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(element);
          }
        }
      },
      { rootMargin: '100%' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [lazy]);

  function renderMedia() {
    if (!isVisible) {
      return (
        <div className={styles.placeholder}>
          <span className={styles.placeholderText}>Loading…</span>
        </div>
      );
    }

    switch (media.type) {
      case 'image':
      case 'screenshot':
      case 'cad-render':
      case 'diagram':
      case 'gif':
        return renderPicture();
      case 'video':
        return renderVideo();
      case '3d-model':
        return renderModel();
      case 'pdf':
        return renderPdf();
      case 'embed':
        return renderEmbed();
      default:
        return null;
    }
  }

  function renderPicture() {
    return (
      <img
        className={styles.mediaImage}
        src={media.src}
        alt={media.alt}
        loading="lazy"
      />
    );
  }

  function renderVideo() {
    return (
      <video
        className={styles.mediaVideo}
        src={media.src}
        controls
        aria-label={media.alt}
      />
    );
  }

  function renderModel() {
    return (
      <div className={styles.modelContainer}>
        <ModelViewerBoundary projectTitle={media.alt}>
          <Suspense
            fallback={
              <div className={styles.placeholder}>
                <span className={styles.placeholderText}>Loading 3D model…</span>
              </div>
            }
          >
            <ModelViewerLazy
              modelSrc={media.src}
              projectTitle={media.alt}
              projectDescription={media.caption || ''}
            />
          </Suspense>
        </ModelViewerBoundary>
      </div>
    );
  }

  function renderPdf() {
    return (
      <iframe
        className={styles.mediaPdf}
        src={media.src}
        title={media.alt}
      />
    );
  }

  function renderEmbed() {
    return (
      <iframe
        className={styles.mediaEmbed}
        src={media.src}
        title={media.alt}
        allow="fullscreen"
      />
    );
  }

  return (
    <div ref={containerRef} className={styles.mediaContainer}>
      <figure className={styles.figure}>
        {renderMedia()}
        {media.caption && (
          <figcaption className={styles.caption}>{media.caption}</figcaption>
        )}
      </figure>
    </div>
  );
}

export default MediaEmbed;
export type { MediaEmbedProps };
