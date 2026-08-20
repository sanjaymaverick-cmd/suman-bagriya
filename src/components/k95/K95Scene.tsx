import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  PRESETS,
  type FeelPreset,
  type PhysicsParams,
  type PhysicsState,
} from "@/lib/physics-presets";
import { loadPhotoList, surroundingPhotos } from "@/lib/photos";
import { ORDER } from "@/lib/links";
import PhotoZoom from "@/components/k95/PhotoZoom";

const CENTER = "/photos/suman-face.jpg";
const PAPER = "#eeece9";
const PAPER_FOG = "#e4e0db";
const INK = "#1a1816";
const MAX_3D_PLANES = 48;

function ringLayout(count: number) {
  const positions: [number, number, number][] = [];
  const rotations: [number, number, number][] = [];
  let placed = 0;
  let ring = 0;
  while (placed < count) {
    const slots = Math.min(count - placed, 10 + ring * 6);
    const radius = 6.4 + ring * 2.55;
    for (let i = 0; i < slots; i++) {
      const angle = (i / slots) * Math.PI * 2 + ring * 0.22;
      const y = Math.sin((placed + i) * 1.37) * (1.35 + ring * 0.25);
      positions.push([Math.cos(angle) * radius, y, Math.sin(angle) * radius]);
      rotations.push([0.04, -angle + Math.PI / 2, ((i % 5) - 2) * 0.035]);
    }
    placed += slots;
    ring += 1;
  }
  return { positions, rotations };
}

function spiralLayout(count: number) {
  const positions: [number, number, number][] = [];
  const rotations: [number, number, number][] = [];
  const turns = 3.2 + count * 0.12;
  for (let i = 0; i < count; i++) {
    const t = i / Math.max(count - 1, 1);
    const angle = t * Math.PI * turns;
    const radius = 2.1 + t * (8.2 + count * 0.08);
    positions.push([Math.cos(angle) * radius, (t - 0.5) * (7.4 + count * 0.05), Math.sin(angle) * radius]);
    rotations.push([0.07, -angle + Math.PI / 2, 0]);
  }
  return { positions, rotations };
}

function GridFloor() {
  const points = useMemo(() => {
    const pts: number[] = [];
    const size = 90;
    const divisions = 46;
    const step = size / divisions;
    const half = size / 2;
    for (let i = 0; i <= divisions; i++) {
      const pos = -half + i * step;
      pts.push(-half, 0, pos, half, 0, pos);
      pts.push(pos, 0, -half, pos, 0, half);
    }
    return new Float32Array(pts);
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(points, 3));
    return geo;
  }, [points]);

  return (
    <group position={[0, -4.2, 0]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={INK} transparent opacity={0.14} />
      </lineSegments>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[90, 90]} />
        <meshBasicMaterial color="#d8d2ca" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function PhotoPlane({
  url,
  position,
  rotation,
  isCenter = false,
  active = false,
  dimmed = false,
  onSelect,
}: {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  isCenter?: boolean;
  active?: boolean;
  dimmed?: boolean;
  onSelect?: (url: string) => void;
}) {
  const texture = useTexture(url);
  const group = useRef<THREE.Group>(null);
  const scale = useRef(1);
  const down = useRef({ x: 0, y: 0, t: 0 });

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const amp = isCenter ? 0.05 : 0.11;
    group.current.position.y =
      position[1] + Math.sin(t * 0.32 + position[0] * 0.45 + position[2] * 0.28) * amp;
    const target = active ? 1.18 : 1;
    scale.current += (target - scale.current) * 0.12;
    group.current.scale.setScalar(scale.current);
  });

  const w = isCenter ? 2.35 : 1.52;
  const h = isCenter ? 2.98 : 1.92;

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "zoom-in";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
      onPointerDown={(e) => {
        const n = e.nativeEvent;
        down.current = { x: n.clientX, y: n.clientY, t: performance.now() };
      }}
      onPointerUp={(e) => {
        const n = e.nativeEvent;
        const dx = n.clientX - down.current.x;
        const dy = n.clientY - down.current.y;
        if (dx * dx + dy * dy < 64 && performance.now() - down.current.t < 420) {
          e.stopPropagation();
          onSelect?.(url);
        }
      }}
    >
      <mesh position={[0.045, -0.045, -0.025]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color="#3a322c" transparent opacity={0.18} />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          side={THREE.DoubleSide}
          transparent
          opacity={dimmed ? 0.28 : 1}
        />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[w + 0.035, h + 0.035]} />
        <meshBasicMaterial color="#111111" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

function SceneContent({
  images,
  mode,
  physics,
  params,
  selected,
  onSelect,
}: {
  images: string[];
  mode: "rings" | "spiral";
  physics: React.MutableRefObject<PhysicsState>;
  params: PhysicsParams;
  selected: string | null;
  onSelect: (url: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const { positions, rotations } = useMemo(() => {
    return mode === "rings" ? ringLayout(images.length) : spiralLayout(images.length);
  }, [images.length, mode]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = physics.current;
    const prm = paramsRef.current;
    const dt = Math.min(delta, 0.033);

    // If the pointer left the window, ease the shuttle off so it coasts
    if (performance.now() - p.lastMoveAt > 380) {
      p.edgeX *= Math.exp(-1.35 * dt);
      p.edgeY *= Math.exp(-1.35 * dt);
    }

    // Edge shuttle — holding at the screen edge keeps spinning
    p.velY += p.edgeX * prm.edgeBoost * dt;
    p.velX += p.edgeY * prm.edgeBoost * 0.42 * dt;

    // Mouse-delta impulses (unbounded)
    p.velY += p.smoothDx * prm.deltaGainY * 60 * dt * 18;
    p.velX += p.smoothDy * prm.deltaGainX * 60 * dt * 18;

    // Input decay (so a flick coasts instead of sticking)
    const inputDecay = Math.exp(-10 * dt);
    p.smoothDx *= inputDecay;
    p.smoothDy *= inputDecay;

    // Orbit: no restoring spring — never clamps to a screen-mapped target
    p.velY *= Math.exp(-prm.dampingY * dt);
    p.orbitY += p.velY * dt + prm.autoSpin * dt;

    // Tilt: spring toward a small look offset, critically damped-ish
    const targetTilt = THREE.MathUtils.clamp(p.lookX * prm.lookGain, -0.38, 0.38);
    p.velX += (targetTilt - p.tiltX) * prm.springX * dt;
    p.velX *= Math.exp(-prm.dampingX * dt);
    p.tiltX += p.velX * dt;
    p.tiltX = THREE.MathUtils.clamp(p.tiltX, -0.48, 0.48);

    group.current.rotation.y = p.orbitY;
    group.current.rotation.x = p.tiltX;
    group.current.rotation.z = p.lookY * 0.03;
  });

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.touchAction = "pan-y";
    const EDGE = 80;
    const clampMove = (v: number) => Math.max(-90, Math.min(90, v));
    const isChrome = (e: Event) => {
      const t = e.target as HTMLElement | null;
      return !!t?.closest("button, a, input, label, nav");
    };

    const touch = {
      axis: null as null | "x" | "y",
      lastX: 0,
      lastY: 0,
      active: false,
    };

    const applyMouse = (e: PointerEvent) => {
      const p = physics.current;
      const prm = paramsRef.current;
      const overUi = isChrome(e);
      const dx = clampMove(e.movementX);
      const dy = clampMove(e.movementY);

      if (!overUi) {
        p.smoothDx += (dx - p.smoothDx) * prm.inputSmooth;
        p.smoothDy += (dy - p.smoothDy) * prm.inputSmooth;
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;
      p.lookY = nx;
      p.lookX = -ny;

      let edgeX = 0;
      if (e.clientX > w - EDGE) {
        const t = Math.min(1, (e.clientX - (w - EDGE)) / EDGE);
        edgeX = t * t;
      } else if (e.clientX < EDGE) {
        const t = Math.min(1, (EDGE - e.clientX) / EDGE);
        edgeX = -(t * t);
      }
      let edgeY = 0;
      if (e.clientY > h - EDGE) {
        const t = Math.min(1, (e.clientY - (h - EDGE)) / EDGE);
        edgeY = t * t;
      } else if (e.clientY < EDGE) {
        const t = Math.min(1, (EDGE - e.clientY) / EDGE);
        edgeY = -(t * t);
      }
      p.edgeX = edgeX;
      p.edgeY = edgeY;
      p.lastMoveAt = performance.now();

      if (p.dragging && !overUi) {
        p.velY += dx * prm.dragImpulse;
        p.velX += dy * prm.dragImpulse * 0.55;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        if (!touch.active) return;
        const dx = e.clientX - touch.lastX;
        const dy = e.clientY - touch.lastY;
        touch.lastX = e.clientX;
        touch.lastY = e.clientY;

        if (!touch.axis) {
          if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
          touch.axis = Math.abs(dy) >= Math.abs(dx) * 0.85 ? "y" : "x";
        }
        if (touch.axis === "y") return;

        const p = physics.current;
        const prm = paramsRef.current;
        p.edgeX = 0;
        p.edgeY = 0;
        p.velY += clampMove(dx) * prm.dragImpulse * 1.15;
        p.lastMoveAt = performance.now();
        p.dragging = true;
        return;
      }
      applyMouse(e);
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (isChrome(e)) return;

      if (e.pointerType === "touch") {
        touch.active = true;
        touch.axis = null;
        touch.lastX = e.clientX;
        touch.lastY = e.clientY;
        physics.current.dragging = false;
        return;
      }

      if (e.target !== canvas && !canvas.contains(e.target as Node)) {
        const overlay = (e.target as HTMLElement)?.closest?.("[data-hero]");
        if (!overlay) return;
      }
      physics.current.dragging = true;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      canvas.style.cursor = "grabbing";
    };

    const onUp = (e: PointerEvent) => {
      touch.active = false;
      touch.axis = null;
      physics.current.dragging = false;
      if (e.pointerType === "touch") return;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      canvas.style.cursor = "grab";
    };

    const onWindowOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      const p = physics.current;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (e.clientX >= w - 4) p.edgeX = 1;
      else if (e.clientX <= 4) p.edgeX = -1;
      if (e.clientY >= h - 4) p.edgeY = 1;
      else if (e.clientY <= 4) p.edgeY = -1;
    };

    const onEnter = () => {
      physics.current.smoothDx = 0;
      physics.current.smoothDy = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("mouseout", onWindowOut);
    window.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("mouseout", onWindowOut);
      window.removeEventListener("pointerenter", onEnter);
    };
  }, [gl, physics]);

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        <PhotoPlane
          url={CENTER}
          position={[0, 0.75, 0]}
          rotation={[0, 0, 0]}
          isCenter
          active={selected === CENTER}
          dimmed={!!selected && selected !== CENTER}
          onSelect={onSelect}
        />
      </Suspense>
      {images.map((url, i) => {
        if (i >= positions.length) return null;
        return (
          <Suspense key={`${url}-${i}`} fallback={null}>
            <PhotoPlane
              url={url}
              position={positions[i]}
              rotation={rotations[i]}
              active={selected === url}
              dimmed={!!selected && selected !== url}
              onSelect={onSelect}
            />
          </Suspense>
        );
      })}
    </group>
  );
}

function FeelPanel({
  preset,
  setPreset,
  params,
  setParams,
}: {
  preset: FeelPreset;
  setPreset: (p: FeelPreset) => void;
  params: PhysicsParams;
  setParams: (p: PhysicsParams) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-auto absolute bottom-20 left-5 z-20 sm:bottom-24 sm:left-10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-[5px] border border-black/10 bg-paper/80 px-3 py-1.5 font-mono text-[10px] font-medium tracking-[0.18em] text-ink/80 backdrop-blur-md hover:bg-paper"
      >
        FEEL
      </button>
      {open && (
        <div className="mt-3 w-[240px] rounded-[5px] border border-black/10 bg-paper p-4 text-ink shadow-xl">
          <p className="font-mono mb-3 text-[10px] tracking-[0.16em] text-muted">PHYSICS</p>
          <div className="mb-4 grid grid-cols-2 gap-1.5">
            {(Object.keys(PRESETS) as FeelPreset[]).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setPreset(key);
                  setParams({ ...PRESETS[key] });
                }}
                className={`rounded-[5px] px-2 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase ${
                  preset === key ? "bg-brick text-white" : "bg-black/5 text-ink/70 hover:bg-black/10"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
          {(
            [
              ["edgeBoost", "Edge spin", 0.4, 8],
              ["deltaGainY", "Mouse gain", 0.002, 0.02],
              ["dampingY", "Inertia", 1.2, 7],
              ["autoSpin", "Auto orbit", 0, 0.2],
            ] as const
          ).map(([key, label, min, max]) => (
            <label key={key} className="mb-2 block">
              <span className="mb-1 flex justify-between font-mono text-[10px] tracking-wide text-muted">
                {label}
                <span className="tabular-nums text-ink">{params[key].toFixed(3)}</span>
              </span>
              <input
                type="range"
                min={min}
                max={max}
                step={(max - min) / 80}
                value={params[key]}
                onChange={(e) => setParams({ ...params, [key]: Number(e.target.value) })}
                className="w-full accent-[#c45c32]"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function K95Scene() {
  const [mode, setMode] = useState<"rings" | "spiral">("spiral");
  const [images, setImages] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [preset, setPreset] = useState<FeelPreset>("premium");
  const [params, setParams] = useState<PhysicsParams>({ ...PRESETS.premium });
  const [menuOpen, setMenuOpen] = useState(false);

  const physics = useRef<PhysicsState>({
    orbitY: 0,
    tiltX: 0,
    velY: 0,
    velX: 0,
    smoothDx: 0,
    smoothDy: 0,
    lookX: 0,
    lookY: 0,
    edgeX: 0,
    edgeY: 0,
    lastMoveAt: 0,
    dragging: false,
  });

  useEffect(() => {
    loadPhotoList().then((all) => {
      const pool = surroundingPhotos(all, CENTER);
      const proofs = pool.filter((u) => u.includes("/proof/"));
      const rest = pool.filter((u) => !u.includes("/proof/"));
      const shuffledProofs = [...proofs].sort(() => Math.random() - 0.5);
      const shuffledRest = [...rest].sort(() => Math.random() - 0.5);
      setImages([...shuffledProofs, ...shuffledRest].slice(0, MAX_3D_PLANES));
    });
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="relative h-[88dvh] w-full overflow-hidden bg-paper md:h-screen" style={{ touchAction: "pan-y" }}>
      <Canvas
        camera={{ position: [0, 1.7, 13.2], fov: 40, near: 0.1, far: 200 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ cursor: "grab", touchAction: "pan-y" }}
        onCreated={({ gl }) => {
          gl.domElement.style.touchAction = "pan-y";
        }}
      >
        <color attach="background" args={[PAPER]} />
        <fog attach="fog" args={[PAPER_FOG, 14, 48]} />
        <ambientLight intensity={1.15} />
        <directionalLight position={[6, 10, 5]} intensity={0.55} color="#fff6ea" />
        <directionalLight position={[-4, 4, -2]} intensity={0.2} color="#c4b8a8" />
        <GridFloor />
        {images.length > 0 && (
          <SceneContent
            images={images}
            mode={mode}
            physics={physics}
            params={params}
            selected={selected}
            onSelect={setSelected}
          />
        )}
      </Canvas>

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="pointer-events-auto absolute top-0 right-0 left-0 grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-5 sm:px-10">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-neue justify-self-start text-[18px] font-medium tracking-tight text-ink"
          >
            Suman Bagriya
          </button>

          <div className="flex rounded-[5px] border border-black/10 bg-paper/70 p-1 backdrop-blur-md">
            <button
              onClick={() => setMode("rings")}
              className={`rounded-[5px] px-4 py-1.5 font-mono text-[10px] tracking-[0.16em] sm:text-[11px] ${
                mode === "rings" ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"
              }`}
            >
              RINGS
            </button>
            <button
              onClick={() => setMode("spiral")}
              className={`rounded-[5px] px-4 py-1.5 font-mono text-[10px] tracking-[0.16em] sm:text-[11px] ${
                mode === "spiral" ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"
              }`}
            >
              SPIRAL
            </button>
          </div>

          <div className="flex items-center justify-self-end gap-2">
          <nav className="hidden items-center gap-5 font-mono text-[11px] tracking-[0.12em] text-ink/80 lg:flex">
            <button onClick={() => scrollTo("about")} className="hover:text-ink">
              ABOUT
            </button>
            <button onClick={() => scrollTo("photos")} className="hover:text-ink">
              PHOTOS
            </button>
            <button onClick={() => scrollTo("product")} className="hover:text-ink">
              SYSTEM
            </button>
            <button onClick={() => scrollTo("business")} className="hover:text-ink">
              BUSINESS
            </button>
            <button onClick={() => scrollTo("faq")} className="hover:text-ink">
              Q&A
            </button>
            <a
              href="https://wa.me/919920404375?text=Hi%20Suman%2C%20I%20want%20to%20start"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[5px] bg-brick px-4 py-[10px] text-[11px] tracking-[0.14em] text-white hover:bg-brick-dark"
            >
              WHATSAPP
            </a>
          </nav>

          <button className="p-2 text-ink lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
          </div>
        </div>

        {menuOpen && (
          <div className="pointer-events-auto absolute top-16 right-4 left-4 rounded-[5px] border border-black/10 bg-paper p-5 shadow-xl lg:hidden">
            {["about", "photos", "product", "business", "faq", "connect"].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="font-neue block w-full rounded-[5px] px-3 py-3 text-left text-sm tracking-wide text-ink hover:bg-black/5"
              >
                {id === "product"
                  ? "System"
                  : id === "faq"
                    ? "Q&A"
                    : id === "photos"
                      ? "Photos"
                      : id === "business"
                        ? "Business"
                        : id[0].toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-3 px-5 py-4 font-mono text-[11px] tracking-[0.14em] text-ink/50 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-5">
          <div className="hidden font-medium sm:block">METABOLIC HEALTH COACH</div>
          <div className="pointer-events-auto flex items-center justify-between gap-2.5 sm:justify-start">
            <a
              href="https://www.instagram.com/sumanbagriyaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-black/10 bg-paper text-ink hover:bg-ink hover:text-paper"
              aria-label="Instagram"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://wa.me/919920404375"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-black/10 bg-paper text-ink hover:bg-[#25D366] hover:text-white"
              aria-label="WhatsApp"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
          <a
            href={ORDER}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto w-full rounded-[5px] bg-brick px-5 py-[14px] text-center font-mono text-[11px] tracking-[0.14em] text-white hover:bg-brick-dark sm:w-auto"
          >
            YES — GET ME STARTED
          </a>
        </div>
      </div>
      <PhotoZoom
        url={selected}
        urls={[CENTER, ...images]}
        onClose={() => setSelected(null)}
        onPrev={() => {
          const all = [CENTER, ...images];
          if (!selected) return;
          const i = all.indexOf(selected);
          setSelected(all[(i - 1 + all.length) % all.length]);
        }}
        onNext={() => {
          const all = [CENTER, ...images];
          if (!selected) return;
          const i = all.indexOf(selected);
          setSelected(all[(i + 1) % all.length]);
        }}
      />
    </div>
  );
}
