import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ExplodedModelViewer.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Defines an exploded-view step: a named group of mesh parts that
 * separate along a given direction vector when this step is active.
 */
export interface ExplodedStep {
  /** Unique step identifier */
  id: string;
  /** Display label (e.g., "01") */
  label: string;
  /** Section heading */
  heading: string;
  /** Description body text */
  body: string;
  /**
   * Mesh name patterns to match in the loaded model.
   * Uses case-insensitive substring matching against mesh.name.
   * Use '*' to match all meshes (for a full explode).
   */
  meshPatterns: string[];
  /**
   * Direction and distance to offset matched meshes.
   * [x, y, z] in model-local units. Example: [0, 0.5, 0] = push up by 0.5.
   */
  explodeOffset: [number, number, number];
  /**
   * Optional camera position override for this step.
   * [x, y, z] — camera will smoothly tween here.
   */
  cameraPosition?: [number, number, number];
}

export interface ExplodedModelViewerProps {
  /** Path to .glb/.gltf model */
  modelSrc: string;
  /** Exploded view steps (scrollable sections) */
  steps: ExplodedStep[];
  /** Project title for accessibility */
  projectTitle: string;
  /** Fallback image if WebGL or model load fails */
  fallbackImage?: string;
}

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

const MODEL_LOAD_TIMEOUT = 15_000;

/**
 * ExplodedModelViewer — Scroll-driven 3D model exploded view.
 *
 * Layout: sticky 3D viewport on the left, scrollable steps on the right.
 * As the user scrolls through steps, matched mesh groups animate outward
 * along their defined offset vectors, revealing internal structure.
 *
 * Features:
 * - Dynamic Three.js import (code splitting)
 * - GSAP ScrollTrigger syncs explosion progress to scroll position
 * - Camera smoothly tweens to step-specific positions
 * - Respects prefers-reduced-motion (shows fully exploded, no animation)
 * - Falls back to static image on WebGL failure
 * - Visibility-based render loop (IntersectionObserver)
 */
function ExplodedModelViewer({
  modelSrc,
  steps,
  projectTitle,
  fallbackImage,
}: ExplodedModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [activeStep, setActiveStep] = useState(0);

  // Three.js resource refs
  const rendererRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const meshOriginalPositions = useRef<Map<string, [number, number, number]>>(new Map());
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  const setStepRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      stepRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setLoadState('loading');
    let cancelled = false;

    async function init() {
      try {
        const THREE = await import('three');
        const { OrbitControls } = await import(
          /* @vite-ignore */ 'three/examples/jsm/controls/OrbitControls.js'
        );
        const { GLTFLoader } = await import(
          /* @vite-ignore */ 'three/examples/jsm/loaders/GLTFLoader.js'
        );

        if (cancelled) return;

        const container = canvasRef.current!;
        const width = container.clientWidth || 600;
        const height = container.clientHeight || 400;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 1, 5);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting — studio setup
        scene.add(new THREE.AmbientLight(0x404040, 1.2));
        const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
        keyLight.position.set(5, 8, 4);
        scene.add(keyLight);
        const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.5);
        fillLight.position.set(-3, -2, -3);
        scene.add(fillLight);

        // Controls (limited — scroll drives the view, but allow orbit)
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.autoRotate = false;
        controlsRef.current = controls;

        // Load model
        const loader = new GLTFLoader();
        const abortController = new AbortController();
        const timeout = setTimeout(() => abortController.abort(), MODEL_LOAD_TIMEOUT);

        const gltf = await new Promise<any>((resolve, reject) => {
          if (abortController.signal.aborted) {
            reject(new Error('Aborted'));
            return;
          }
          const onAbort = () => reject(new Error('Aborted'));
          abortController.signal.addEventListener('abort', onAbort, { once: true });

          loader.loadAsync(modelSrc).then(
            (result) => {
              abortController.signal.removeEventListener('abort', onAbort);
              resolve(result);
            },
            (err) => {
              abortController.signal.removeEventListener('abort', onAbort);
              reject(err);
            }
          );
        });

        clearTimeout(timeout);
        if (cancelled) return;

        const model = gltf.scene;
        modelRef.current = model;

        // Material adjustment
        model.traverse((child: any) => {
          if (child.isMesh) {
            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];
            for (const mat of materials) {
              if (mat.isMeshStandardMaterial) {
                mat.metalness = 0.1;
                mat.roughness = 0.5;
              }
            }
          }
        });

        // Center and orient
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.rotation.x = -Math.PI / 2; // Z-up to Y-up
        scene.add(model);

        // Fit camera
        const rotatedBox = new THREE.Box3().setFromObject(model);
        const size = rotatedBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const dist = (maxDim / 2) / Math.tan(fov / 2) * 1.6;
        camera.position.set(dist * 0.8, dist * 0.4, dist * 0.8);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();

        // Store original mesh positions for explode animation
        model.traverse((child: any) => {
          if (child.isMesh) {
            meshOriginalPositions.current.set(child.uuid, [
              child.position.x,
              child.position.y,
              child.position.z,
            ]);
          }
        });

        // --- ScrollTrigger setup for each step ---
        if (!prefersReduced && containerRef.current) {
          steps.forEach((_step, index) => {
            const stepEl = stepRefs.current[index];
            if (!stepEl) return;

            const st = ScrollTrigger.create({
              trigger: stepEl,
              start: 'top center',
              end: 'bottom center',
              onEnter: () => {
                setActiveStep(index);
                animateToStep(index, model, camera, controls, steps);
              },
              onEnterBack: () => {
                setActiveStep(index);
                animateToStep(index, model, camera, controls, steps);
              },
            });
            scrollTriggersRef.current.push(st);
          });
        } else {
          // Reduced motion: show fully exploded (last step)
          applyExplodeInstant(model, steps, steps.length - 1);
        }

        // Render loop
        function animate() {
          if (cancelled) return;
          if (!isVisibleRef.current) {
            animationFrameRef.current = null;
            return;
          }
          animationFrameRef.current = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        }

        // Visibility observer
        let observer: IntersectionObserver | null = null;
        if (viewportRef.current) {
          observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
              const was = isVisibleRef.current;
              isVisibleRef.current = entry.isIntersecting;
              if (entry.isIntersecting && !was) animate();
            }
          });
          observer.observe(viewportRef.current);
        }

        animate();

        // Resize
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

        if (!cancelled) setLoadState('ready');

        // Cleanup reference
        (renderer as any).__cleanup = () => {
          if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          scrollTriggersRef.current.forEach((st) => st.kill());
          scrollTriggersRef.current = [];
          observer?.disconnect();
          resizeObserver.disconnect();
          controls.dispose();

          scene.traverse((obj: any) => {
            if (obj.isMesh) {
              obj.geometry?.dispose();
              const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
              for (const mat of mats) mat?.dispose();
            }
          });

          renderer.dispose();
          renderer.forceContextLoss();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        };
      } catch {
        if (!cancelled) setLoadState('error');
      }
    }

    init();

    return () => {
      cancelled = true;
      if (rendererRef.current?.__cleanup) {
        rendererRef.current.__cleanup();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelSrc]);

  /** Animates mesh positions and camera for a given step index */
  function animateToStep(
    stepIndex: number,
    model: any,
    camera: any,
    controls: any,
    allSteps: ExplodedStep[]
  ) {
    // Reset all meshes to original, then apply cumulative offsets up to current step
    model.traverse((child: any) => {
      if (!child.isMesh) return;
      const orig = meshOriginalPositions.current.get(child.uuid);
      if (!orig) return;

      let offsetX = 0;
      let offsetY = 0;
      let offsetZ = 0;

      for (let i = 0; i <= stepIndex; i++) {
        const s = allSteps[i];
        if (meshMatchesPatterns(child.name, s.meshPatterns)) {
          offsetX += s.explodeOffset[0];
          offsetY += s.explodeOffset[1];
          offsetZ += s.explodeOffset[2];
        }
      }

      gsap.to(child.position, {
        x: orig[0] + offsetX,
        y: orig[1] + offsetY,
        z: orig[2] + offsetZ,
        duration: 0.8,
        ease: 'power2.out',
      });
    });

    // Camera tween
    const currentStep = allSteps[stepIndex];
    if (currentStep.cameraPosition) {
      gsap.to(camera.position, {
        x: currentStep.cameraPosition[0],
        y: currentStep.cameraPosition[1],
        z: currentStep.cameraPosition[2],
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.lookAt(controls.target);
        },
      });
    }
  }

  /** Instantly applies explode offsets (for reduced motion) */
  function applyExplodeInstant(model: any, allSteps: ExplodedStep[], upToStep: number) {
    model.traverse((child: any) => {
      if (!child.isMesh) return;
      const orig = meshOriginalPositions.current.get(child.uuid);
      if (!orig) return;

      let offsetX = 0;
      let offsetY = 0;
      let offsetZ = 0;

      for (let i = 0; i <= upToStep; i++) {
        const step = allSteps[i];
        if (meshMatchesPatterns(child.name, step.meshPatterns)) {
          offsetX += step.explodeOffset[0];
          offsetY += step.explodeOffset[1];
          offsetZ += step.explodeOffset[2];
        }
      }

      child.position.set(orig[0] + offsetX, orig[1] + offsetY, orig[2] + offsetZ);
    });
  }

  const showLoading = loadState === 'idle' || loadState === 'loading';
  const showCanvas = loadState === 'ready';
  const showFallback = loadState === 'error';

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Sticky 3D viewport */}
      <div ref={viewportRef} className={styles.viewport}>
        {showLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} aria-hidden="true" />
            <span className={styles.loadingText}>Loading 3D model…</span>
          </div>
        )}

        <div
          ref={canvasRef}
          className={styles.canvas}
          style={{ display: showCanvas ? 'block' : 'none' }}
          role="img"
          aria-label={`Exploded 3D view of ${projectTitle}`}
        />

        {showFallback && (
          <div className={styles.fallback}>
            {fallbackImage ? (
              <img
                src={fallbackImage}
                alt={`${projectTitle} — static preview`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            ) : (
              <span>Model unavailable</span>
            )}
          </div>
        )}
      </div>

      {/* Scrollable content steps */}
      <div className={styles.contentPanel}>
        {steps.map((step, index) => (
          <div
            key={step.id}
            ref={(el) => setStepRef(el, index)}
            className={`${styles.step} ${activeStep === index ? styles.stepActive : ''}`}
          >
            <span className={styles.stepLabel}>{step.label}</span>
            <h4 className={styles.stepHeading}>{step.heading}</h4>
            <p className={styles.stepBody}>{step.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Checks if a mesh name matches any of the given patterns.
 * '*' matches everything. Otherwise, case-insensitive substring match.
 */
function meshMatchesPatterns(meshName: string, patterns: string[]): boolean {
  if (!meshName && !patterns.includes('*')) return false;
  const lower = (meshName || '').toLowerCase();
  return patterns.some((p) => p === '*' || lower.includes(p.toLowerCase()));
}

export default ExplodedModelViewer;
