import { useEffect, useRef, useState, useCallback } from 'react';
import type { Mesh, MeshStandardMaterial, PerspectiveCamera, WebGLRenderer } from 'three';
import styles from './ModelViewer.module.css';
import { composeAriaLabel } from '../../data/projectTypes';
import type { AnnotationData } from '../../data/projectTypes';

export interface ModelViewerProps {
  modelSrc: string;
  fallbackImage?: string;
  projectTitle: string;
  projectDescription: string;
  annotations?: AnnotationData[];
  autoRotateSpeed?: number; // degrees/sec, default 6
}

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

/** Timeout (ms) for GLB/GLTF model loading */
const MODEL_LOAD_TIMEOUT = 10_000;

/** Default camera distance from model center */
const DEFAULT_CAMERA_DISTANCE = 5;

/** Idle timeout before auto-rotation resumes (ms) */
const IDLE_TIMEOUT_MS = 2000;

/** Convert degrees/sec to Three.js autoRotateSpeed units */
function degreesToAutoRotateSpeed(degreesPerSec: number): number {
  // Three.js autoRotateSpeed: 1 unit ≈ 6 deg/s at 60fps
  return degreesPerSec / 6;
}

/**
 * ModelViewer — Interactive 3D model viewer with studio lighting and orbit controls.
 *
 * Dynamically imports Three.js for code splitting (never loaded on landing page).
 * Sets up a full scene with studio lighting, loads GLB/GLTF models via
 * GLTFLoader with a 10-second AbortController timeout, and displays
 * fallback content on failure. Materials are adjusted to matte/semi-gloss.
 *
 * Features:
 * - Studio lighting: ambient + directional key light (warm) + directional fill (cool)
 * - OrbitControls for pointer drag orbit and scroll/pinch zoom
 * - Zoom clamped to 0.5x–3.0x of default camera distance
 * - Auto-rotation at configurable speed when idle ≥2 seconds
 * - Respects prefers-reduced-motion: disables auto-rotation permanently
 * - Mobile: single-finger orbit, pinch-to-zoom (native OrbitControls)
 * - Disposes all Three.js resources on unmount
 */
/** Projected 2D annotation for rendering in CSS overlay */
interface ProjectedAnnotation {
  id: string;
  label: string;
  x: number; // screen X (px)
  y: number; // screen Y (px)
  visible: boolean; // whether the annotation is in front of the camera
}

function ModelViewer({
  modelSrc,
  fallbackImage,
  projectTitle,
  projectDescription,
  annotations,
  autoRotateSpeed: autoRotateSpeedDegPerSec = 6,
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [webGLAvailable, setWebGLAvailable] = useState<boolean>(true);
  const [projectedAnnotations, setProjectedAnnotations] = useState<ProjectedAnnotation[]>([]);

  // Refs for Three.js resources (managed outside React state for performance)
  const rendererRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotionRef = useRef<boolean>(false);
  const annotationsRef = useRef<AnnotationData[] | undefined>(annotations);
  const isVisibleRef = useRef<boolean>(true);

  const ariaLabel = composeAriaLabel(projectTitle, projectDescription);

  // Keep annotations ref in sync with prop
  useEffect(() => {
    annotationsRef.current = annotations;
  }, [annotations]);

  /**
   * Projects 3D annotation positions to 2D screen coordinates.
   * Called every frame in the render loop to keep overlays in sync with camera.
   */
  const projectAnnotationsTo2D = useCallback(() => {
    const camera = cameraRef.current as PerspectiveCamera | null;
    const renderer = rendererRef.current as WebGLRenderer | null;
    const annotationData = annotationsRef.current;

    if (!camera || !renderer || !annotationData || annotationData.length === 0) {
      return;
    }

    // Dynamically import THREE.Vector3 is expensive; use inline math instead.
    // Three.js project pattern: create vector, project, map to screen coords.
    const { Vector3 } = (renderer as any).__THREE || {};
    if (!Vector3) return;

    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const projected: ProjectedAnnotation[] = annotationData.map((ann) => {
      const vec = new Vector3(ann.position[0], ann.position[1], ann.position[2]);
      vec.project(camera);

      // After projection, vec.x and vec.y are in NDC [-1, 1]
      // vec.z < 1 means in front of camera
      const visible = vec.z < 1;
      const x = (vec.x * 0.5 + 0.5) * width;
      const y = (-vec.y * 0.5 + 0.5) * height;

      return { id: ann.id, label: ann.label, x, y, visible };
    });

    setProjectedAnnotations(projected);
  }, []);

  /** Clears the idle timer if one is active */
  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current !== null) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  /** Starts the idle timer to resume auto-rotation after IDLE_TIMEOUT_MS */
  const startIdleTimer = useCallback(() => {
    clearIdleTimer();
    if (reducedMotionRef.current) return; // Never resume auto-rotate in reduced motion

    idleTimerRef.current = setTimeout(() => {
      if (controlsRef.current) {
        controlsRef.current.autoRotate = true;
      }
    }, IDLE_TIMEOUT_MS);
  }, [clearIdleTimer]);

  useEffect(() => {
    // Check WebGL availability
    if (!isWebGLAvailable()) {
      setWebGLAvailable(false);
      setLoadState('error');
      return;
    }

    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = motionQuery.matches;

    // Begin dynamic import of Three.js for code splitting
    setLoadState('loading');

    let cancelled = false;
    let abortController: AbortController | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function initThree() {
      try {
        // Dynamic import for code splitting — Three.js bundle only loads here
        const THREE = await import('three');
        const { OrbitControls } = await import(
          /* @vite-ignore */ 'three/examples/jsm/controls/OrbitControls.js'
        );
        const { GLTFLoader } = await import(
          /* @vite-ignore */ 'three/examples/jsm/loaders/GLTFLoader.js'
        );

        if (cancelled) return;

        const container = canvasContainerRef.current;
        if (!container) return;

        // --- Scene Setup ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);
        sceneRef.current = scene;

        // --- Camera Setup ---
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 450;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 1, DEFAULT_CAMERA_DISTANCE);
        cameraRef.current = camera;

        // --- Renderer Setup ---
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Store THREE reference for annotation projection
        (renderer as any).__THREE = THREE;

        // --- Studio Lighting ---
        // Ambient fill (soft, low intensity)
        const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
        scene.add(ambientLight);

        // Key light — warm, from upper-right, casts shadows
        const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
        keyLight.position.set(5, 8, 4);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.camera.near = 0.1;
        keyLight.shadow.camera.far = 50;
        keyLight.shadow.bias = -0.001;
        scene.add(keyLight);

        // Fill light — cooler, from lower-left, no shadows
        const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.5);
        fillLight.position.set(-3, -2, -3);
        scene.add(fillLight);

        // --- OrbitControls Setup ---
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.enableZoom = false;

        // Auto-rotation configuration
        const prefersReducedMotion = reducedMotionRef.current;
        controls.autoRotate = !prefersReducedMotion;
        controls.autoRotateSpeed = degreesToAutoRotateSpeed(autoRotateSpeedDegPerSec);

        controlsRef.current = controls;

        // --- Interaction handlers for idle timer ---
        const onControlStart = () => {
          controls.autoRotate = false;
          clearIdleTimer();
        };

        const onControlEnd = () => {
          startIdleTimer();
        };

        controls.addEventListener('start', onControlStart);
        controls.addEventListener('end', onControlEnd);

        // --- Handle reduced motion changes at runtime ---
        const handleMotionChange = (e: MediaQueryListEvent) => {
          reducedMotionRef.current = e.matches;
          if (e.matches) {
            controls.autoRotate = false;
            clearIdleTimer();
          } else {
            startIdleTimer();
          }
        };
        motionQuery.addEventListener('change', handleMotionChange);

        // --- Model Loading with 10-second Timeout ---
        abortController = new AbortController();
        const { signal } = abortController;

        timeoutId = setTimeout(() => {
          abortController?.abort();
        }, MODEL_LOAD_TIMEOUT);

        try {
          const loader = new GLTFLoader();
          const gltf = await loadModelWithAbort(loader, modelSrc, signal);

          if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }

          if (cancelled) return;

          const model = gltf.scene;

          // --- Material Adjustments (matte/semi-gloss) ---
          model.traverse((child) => {
            if ((child as Mesh).isMesh) {
              const mesh = child as Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              const materials = Array.isArray(mesh.material)
                ? mesh.material
                : [mesh.material];

              for (const mat of materials) {
                if ((mat as MeshStandardMaterial).isMeshStandardMaterial) {
                  const stdMat = mat as MeshStandardMaterial;
                  stdMat.metalness = 0.1;
                  stdMat.roughness = 0.5;
                }
              }
            }
          });

          // --- Center Model and Fit Camera ---
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());

          // Center model at origin
          model.position.sub(center);

          // Fix orientation: many CAD exports (SolidWorks, etc.) use Z-up.
          // Rotate -90° around X to convert Z-up to Y-up (horizontal placement).
          model.rotation.x = -Math.PI / 2;

          scene.add(model);

          // Recalculate bounds after rotation
          const rotatedBox = new THREE.Box3().setFromObject(model);
          const rotatedSize = rotatedBox.getSize(new THREE.Vector3());

          // Position camera to fit model — slightly elevated, viewing from front-side
          const maxDim = Math.max(rotatedSize.x, rotatedSize.y, rotatedSize.z);
          const fov = camera.fov * (Math.PI / 180);
          const cameraDistance = (maxDim / 2) / Math.tan(fov / 2) * 1.5;
          camera.position.set(
            cameraDistance * 0.8,
            cameraDistance * 0.4,
            cameraDistance * 0.8
          );
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();

          controls.target.set(0, 0, 0);
          controls.update();
        } catch {
          // Model load failed or was aborted (timeout)
          if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          if (!cancelled) {
            setLoadState('error');
            return;
          }
        }

        // --- Render Loop with Visibility Management ---
        function animate() {
          if (cancelled) return;
          if (!isVisibleRef.current) {
            // Stop scheduling frames when not visible
            animationFrameRef.current = null;
            return;
          }
          animationFrameRef.current = requestAnimationFrame(animate);
          controls.update(); // Required for damping and auto-rotation
          renderer.render(scene, camera);
          projectAnnotationsTo2D(); // Update annotation 2D positions each frame
        }

        /** Restarts the render loop if not already running */
        function startRenderLoop() {
          if (animationFrameRef.current === null && !cancelled) {
            animate();
          }
        }

        // --- IntersectionObserver for Visibility Management ---
        let intersectionObserver: IntersectionObserver | null = null;
        const observedElement = containerRef.current;

        if (typeof IntersectionObserver !== 'undefined' && observedElement) {
          intersectionObserver = new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                const wasVisible = isVisibleRef.current;
                isVisibleRef.current = entry.isIntersecting;

                if (entry.isIntersecting && !wasVisible) {
                  // Re-entered viewport — resume render loop
                  startRenderLoop();
                }
                // When not intersecting, the animate() function will stop
                // scheduling new frames on its next iteration
              }
            }
            // Default threshold (0) — fires at 0% visibility boundary
          );
          intersectionObserver.observe(observedElement);
        } else {
          // Fallback: IntersectionObserver unavailable — always render
          isVisibleRef.current = true;
        }

        // Start the initial render loop
        animate();

        // --- Resize Handling ---
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width: w, height: h } = entry.contentRect;
            if (w > 0 && h > 0) {
              camera.aspect = w / h;
              camera.updateProjectionMatrix();
              renderer.setSize(w, h);
            }
          }
        });
        resizeObserver.observe(container);

        if (!cancelled) {
          setLoadState('ready');
        }

        // Store cleanup references
        (renderer as any).__cleanup = () => {
          // Cancel animation frame
          if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }

          // Clear idle timer
          clearIdleTimer();

          // Disconnect IntersectionObserver
          if (intersectionObserver) {
            intersectionObserver.disconnect();
            intersectionObserver = null;
          }

          // Cancel any pending model load
          if (abortController) {
            abortController.abort();
          }
          if (timeoutId !== null) {
            clearTimeout(timeoutId);
          }

          // Remove event listeners
          controls.removeEventListener('start', onControlStart);
          controls.removeEventListener('end', onControlEnd);
          motionQuery.removeEventListener('change', handleMotionChange);

          // Dispose controls
          controls.dispose();
          controlsRef.current = null;

          // Dispose scene resources (geometries, materials, AND textures)
          scene.traverse((obj: any) => {
            if (obj.isMesh) {
              obj.geometry?.dispose();

              const materials = Array.isArray(obj.material)
                ? obj.material
                : [obj.material];

              for (const mat of materials) {
                if (!mat) continue;

                // Dispose all texture maps attached to the material
                const textureKeys = [
                  'map', 'normalMap', 'roughnessMap', 'metalnessMap',
                  'aoMap', 'emissiveMap', 'bumpMap', 'displacementMap',
                  'alphaMap', 'envMap', 'lightMap', 'specularMap',
                ] as const;

                for (const key of textureKeys) {
                  const texture = (mat as any)[key];
                  if (texture && typeof texture.dispose === 'function') {
                    texture.dispose();
                  }
                }

                mat.dispose();
              }
            }
          });

          // Dispose renderer
          renderer.dispose();
          renderer.forceContextLoss();
          rendererRef.current = null;
          sceneRef.current = null;
          cameraRef.current = null;

          // Remove canvas from DOM
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }

          // Stop observing resize
          resizeObserver.disconnect();
        };
      } catch {
        if (!cancelled) {
          setLoadState('error');
        }
      }
    }

    initThree();

    return () => {
      cancelled = true;
      // Run cleanup if renderer was created
      if (rendererRef.current && (rendererRef.current as any).__cleanup) {
        (rendererRef.current as any).__cleanup();
      }
    };
  }, [modelSrc, autoRotateSpeedDegPerSec, clearIdleTimer, startIdleTimer, projectAnnotationsTo2D]);

  const showLoading = loadState === 'idle' || loadState === 'loading';
  const showFallback = loadState === 'error' || !webGLAvailable;
  const showCanvas = loadState === 'ready' && webGLAvailable;

  return (
    <div
      ref={containerRef}
      className={styles.container}
      aria-label={ariaLabel}
      role="img"
    >
      {/* Loading spinner */}
      {showLoading && (
        <div className={styles.loadingOverlay} aria-busy="true" aria-live="polite">
          <div className={styles.spinner} aria-hidden="true" />
          <span className={styles.loadingText}>Loading 3D model…</span>
        </div>
      )}

      {/* Canvas container for Three.js renderer */}
      <div
        ref={canvasContainerRef}
        className={`${styles.canvas}${!showCanvas ? ` ${styles.hidden}` : ''}`}
      />

      {/* Annotation overlay — CSS positioned labels connected to 3D points */}
      {showCanvas && annotations && annotations.length > 0 && (
        <div className={styles.annotationOverlay} aria-hidden="true">
          {/* SVG layer for connecting lines */}
          <svg className={styles.annotationSvg}>
            {projectedAnnotations.map((ann) =>
              ann.visible ? (
                <line
                  key={`line-${ann.id}`}
                  x1={ann.x}
                  y1={ann.y}
                  x2={ann.x}
                  y2={ann.y - 24}
                  className={styles.annotationLine}
                />
              ) : null
            )}
          </svg>

          {/* Label elements */}
          {projectedAnnotations.map((ann) =>
            ann.visible ? (
              <span
                key={`label-${ann.id}`}
                className={styles.annotationLabel}
                style={{
                  left: `${ann.x}px`,
                  top: `${ann.y - 32}px`,
                }}
              >
                {ann.label}
              </span>
            ) : null
          )}
        </div>
      )}

      {/* Fallback: WebGL unavailable or load error */}
      {showFallback && (
        <div className={styles.fallback}>
          {fallbackImage ? (
            <img
              src={fallbackImage}
              alt={`${projectTitle} — static preview`}
              className={styles.fallbackImage}
            />
          ) : (
            <div className={styles.fallbackPlaceholder}>
              <span aria-hidden="true">⚠</span>
              <span>Model unavailable</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Loads a GLTF/GLB model with AbortController support.
 * Wraps GLTFLoader.loadAsync to respect abort signals for timeout cancellation.
 */
async function loadModelWithAbort(
  loader: import('three/examples/jsm/loaders/GLTFLoader.js').GLTFLoader,
  url: string,
  signal: AbortSignal
): Promise<import('three/examples/jsm/loaders/GLTFLoader.js').GLTF> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const onAbort = () => {
      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal.addEventListener('abort', onAbort, { once: true });

    loader.loadAsync(url).then(
      (gltf) => {
        signal.removeEventListener('abort', onAbort);
        if (signal.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
        } else {
          resolve(gltf);
        }
      },
      (error) => {
        signal.removeEventListener('abort', onAbort);
        reject(error);
      }
    );
  });
}

/**
 * Checks whether WebGL is available in the current browser context.
 * Creates a temporary canvas to test for WebGL support.
 */
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') || canvas.getContext('webgl');
    return gl !== null;
  } catch {
    return false;
  }
}

export default ModelViewer;
