import { BEATS } from "@/lib/saath-beats";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const W = 1.18;
const H = 2.42;

function Phone({
  src,
  active,
  offset,
}: {
  src: string;
  active: boolean;
  offset: number;
}) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.anisotropy = 8;
  const g = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime;
    const targetX = offset * 1.55;
    const targetZ = -Math.abs(offset) * 0.55;
    const targetRot = -offset * 0.22;
    g.current.position.x += (targetX - g.current.position.x) * 0.08;
    g.current.position.z += (targetZ - g.current.position.z) * 0.08;
    g.current.position.y = Math.sin(t * 1.1 + offset) * 0.04;
    g.current.rotation.y += (targetRot - g.current.rotation.y) * 0.08;
    g.current.rotation.x = Math.sin(t * 0.7) * 0.03;
    const s = active ? 1 : 0.78;
    g.current.scale.setScalar(g.current.scale.x + (s - g.current.scale.x) * 0.08);
  });
  return (
    <group ref={g}>
      <mesh castShadow>
        <boxGeometry args={[W + 0.08, H + 0.08, 0.1]} />
        <meshStandardMaterial color="#1a1410" metalness={0.55} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0, 0.056]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.052]}>
        <planeGeometry args={[W * 0.92, H * 0.92]} />
        <meshStandardMaterial color="#c45c32" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Rig({ index }: { index: number }) {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y += (mouse.current.x * 0.28 - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (-mouse.current.y * 0.12 - group.current.rotation.x) * 0.05;
  });
  return (
    <group ref={group} position={[0, 0.05, 0]}>
      {BEATS.map((b, i) => (
        <Phone key={b.src} src={b.src} active={i === index} offset={i - index} />
      ))}
    </group>
  );
}

function Lights() {
  return (
    <>
      <color attach="background" args={["#1c110c"]} />
      <fog attach="fog" args={["#1c110c", 6, 14]} />
      <ambientLight intensity={0.55} />
      <spotLight position={[3, 6, 4]} angle={0.5} penumbra={0.8} intensity={40} color="#ffb089" />
      <pointLight position={[-3, 1, 3]} intensity={12} color="#c45c32" />
      <pointLight position={[2, -2, 2]} intensity={8} color="#e8c37a" />
    </>
  );
}

export default function SaathWalk() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playVid, setPlayVid] = useState(false);
  const beat = BEATS[index];

  useEffect(() => {
    if (paused || playVid) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % BEATS.length), 3200);
    return () => window.clearInterval(id);
  }, [paused, playVid]);

  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <section className="saath-walk relative isolate overflow-hidden">
      <div className="relative h-[min(92vh,920px)] min-h-[640px] w-full">
        {playVid ? (
          <div className="flex h-full items-center justify-center px-4">
            <div className="phone-bezel">
              <video
                src="/saath-shots/walkthrough.mp4"
                autoPlay
                muted
                playsInline
                controls
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ) : reduced ? (
          <div className="flex h-full items-center justify-center px-4">
            <img src={beat.src} alt={beat.t} className="phone-still" />
          </div>
        ) : (
          <Canvas
            camera={{ position: [0, 0, 3.85], fov: 36 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: false }}
          >
            <Lights />
            <Suspense fallback={null}>
              <Rig index={index} />
            </Suspense>
          </Canvas>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#1c110c] via-transparent to-transparent pt-8 pb-24">
          <div className="mx-auto max-w-[1280px] px-[3.5%]">
            <p className="font-mono text-[11px] tracking-[0.2em] text-[#e8c37a] uppercase">Live from the house</p>
            <h2 className="font-display mt-3 text-[clamp(40px,7vw,88px)] text-[#f4ece4]">The 90 days, on screen.</h2>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1c110c] via-[#1c110c]/90 to-transparent pt-28 pb-6">
          <div className="mx-auto max-w-[1280px] px-[3.5%]">
            <p className="font-mono text-[11px] tracking-[0.18em] text-[#c45c32]">{beat.k}</p>
            <p className="font-display mt-2 text-[clamp(28px,4vw,48px)] text-[#f4ece4]">{beat.t}</p>
            <p className="font-neue mt-3 max-w-[42ch] text-[15px] leading-[1.45] text-[#f4ece4]/70">{beat.b}</p>
            <div className="pointer-events-auto mt-6 flex flex-wrap items-center gap-2">
              {BEATS.map((b, i) => (
                <button
                  key={b.k}
                  onClick={() => {
                    setIndex(i);
                    setPaused(true);
                    setPlayVid(false);
                  }}
                  className={`rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase ${
                    i === index && !playVid ? "bg-[#c45c32] text-white" : "bg-white/10 text-[#f4ece4]/80 hover:bg-white/20"
                  }`}
                >
                  {b.t}
                </button>
              ))}
              <button
                onClick={() => {
                  setPlayVid(true);
                  setPaused(true);
                }}
                className={`rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase ${
                  playVid ? "bg-[#e8c37a] text-[#1c110c]" : "bg-white/10 text-[#e8c37a] hover:bg-white/20"
                }`}
              >
                Play walkthrough
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
