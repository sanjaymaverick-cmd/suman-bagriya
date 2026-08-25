import { BEATS } from "@/lib/saath-beats";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const W = 1.22;
const H = 2.52;
const D = 0.22;

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
    const targetX = offset * 1.72;
    const targetZ = -Math.abs(offset) * 0.78;
    const targetRot = -offset * 0.3;
    g.current.position.x += (targetX - g.current.position.x) * 0.08;
    g.current.position.z += (targetZ - g.current.position.z) * 0.08;
    g.current.position.y = Math.sin(t * 1.05 + offset) * 0.03;
    g.current.rotation.y += (targetRot - g.current.rotation.y) * 0.08;
    g.current.rotation.x = Math.sin(t * 0.65) * 0.02;
    const s = active ? 1.08 : Math.max(0.58, 0.92 - Math.abs(offset) * 0.16);
    g.current.scale.setScalar(g.current.scale.x + (s - g.current.scale.x) * 0.08);
  });
  return (
    <group ref={g}>
      <RoundedBox args={[W, H, D]} radius={0.16} smoothness={8} castShadow>
        <meshStandardMaterial color="#4a4036" metalness={0.84} roughness={0.22} />
      </RoundedBox>
      <mesh position={[0, 0, D / 2 + 0.001]}>
        <planeGeometry args={[W - 0.06, H - 0.06]} />
        <meshStandardMaterial color="#0c0908" roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.03, D / 2 + 0.005]}>
        <planeGeometry args={[W - 0.22, H - 0.3]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, H / 2 - 0.22, D / 2 + 0.01]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.042, 0.28, 8, 16]} />
        <meshStandardMaterial color="#050403" metalness={0.65} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0, -(D / 2 + 0.002)]}>
        <planeGeometry args={[W * 0.86, H * 0.86]} />
        <meshStandardMaterial color="#c45c32" metalness={0.42} roughness={0.38} />
      </mesh>
      <mesh position={[-(W / 2 + 0.014), 0.78, 0]}>
        <boxGeometry args={[0.028, 0.09, 0.05]} />
        <meshStandardMaterial color="#3a322c" metalness={0.7} roughness={0.28} />
      </mesh>
      <mesh position={[-(W / 2 + 0.014), 0.5, 0]}>
        <boxGeometry args={[0.028, 0.24, 0.05]} />
        <meshStandardMaterial color="#3a322c" metalness={0.7} roughness={0.28} />
      </mesh>
      <mesh position={[W / 2 + 0.014, 0.42, 0]}>
        <boxGeometry args={[0.028, 0.18, 0.05]} />
        <meshStandardMaterial color="#3a322c" metalness={0.7} roughness={0.28} />
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
    group.current.rotation.y += (mouse.current.x * 0.22 - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (-mouse.current.y * 0.1 - group.current.rotation.x) * 0.05;
  });
  return (
    <group ref={group} position={[0, 0.02, 0]}>
      {BEATS.map((b, i) => (
        <Phone key={b.src} src={b.src} active={i === index} offset={i - index} />
      ))}
    </group>
  );
}

function CameraFit() {
  const { camera, size } = useThree();
  useEffect(() => {
    const mobile = size.width < 640;
    camera.position.set(0, mobile ? 0.08 : 0.04, mobile ? 3.55 : 3.05);
    camera.fov = mobile ? 34 : 32;
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Lights() {
  return (
    <>
      <color attach="background" args={["#1c110c"]} />
      <fog attach="fog" args={["#1c110c", 4.2, 8.5]} />
      <ambientLight intensity={0.32} />
      <spotLight
        position={[2.4, 4.2, 4.8]}
        angle={0.42}
        penumbra={0.75}
        intensity={70}
        color="#ffd7b8"
        castShadow
      />
      <spotLight position={[-3.2, 1.8, 3.2]} angle={0.55} penumbra={0.9} intensity={28} color="#c45c32" />
      <pointLight position={[1.6, -1.2, 2.2]} intensity={12} color="#e8c37a" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]} receiveShadow>
        <circleGeometry args={[3.4, 48]} />
        <meshStandardMaterial color="#140e0b" roughness={0.85} metalness={0.15} />
      </mesh>
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
            camera={{ position: [0, 0.04, 3.05], fov: 32 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: false }}
            shadows
          >
            <CameraFit />
            <Lights />
            <Suspense fallback={null}>
              <Rig index={index} />
            </Suspense>
          </Canvas>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#1c110c] via-transparent to-transparent pt-24 pb-24">
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
            <div className="pointer-events-auto mt-6 flex items-center gap-3 overflow-x-auto pb-1">
              {BEATS.map((b, i) => (
                <button
                  key={b.k}
                  onClick={() => {
                    setIndex(i);
                    setPaused(true);
                    setPlayVid(false);
                  }}
                  aria-label={b.t}
                  className={`h-2 shrink-0 rounded-full transition-all ${
                    i === index && !playVid ? "w-7 bg-[#c45c32]" : "w-2 bg-white/30 hover:bg-white/55"
                  }`}
                />
              ))}
              <button
                onClick={() => {
                  setPlayVid(true);
                  setPaused(true);
                }}
                className={`ml-2 shrink-0 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase ${
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
