import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Sparkles, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isCoarsePointer } from "@/lib/texture-memory";
import { waReset } from "@/lib/links";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function Portrait() {
  const texture = useTexture("/photos/suman-v4-editorial.png");
  texture.colorSpace = THREE.SRGBColorSpace;
  return (
    <mesh position={[0, -0.12, 0]}>
      <planeGeometry args={[3.55, 4.75, 1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function SilkOrbit({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current || reduced) return;
    group.current.rotation.z += delta * 0.055;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.08;
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, state.pointer.x * 0.16, 0.025);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, state.pointer.y * 0.1, 0.025);
  });
  return (
    <group ref={group} rotation={[0.08, 0.2, -0.18]}>
      <mesh position={[0, 0, 0.45]} scale={[1.34, 1.5, 0.7]}>
        <torusGeometry args={[2.05, 0.22, 32, 180]} />
        <MeshTransmissionMaterial
          color="#d8a5a0"
          transmission={0.96}
          thickness={0.75}
          roughness={0.18}
          chromaticAberration={0.035}
          anisotropicBlur={0.45}
          distortion={0.22}
          distortionScale={0.34}
          temporalDistortion={reduced ? 0 : 0.08}
        />
      </mesh>
      <mesh position={[0.1, -0.12, -0.15]} rotation={[0.22, -0.4, 0.35]} scale={[1.2, 1.46, 0.72]}>
        <torusGeometry args={[2.3, 0.055, 16, 180]} />
        <meshStandardMaterial color="#d8c7a4" metalness={0.72} roughness={0.22} />
      </mesh>
    </group>
  );
}

function HeroScene({ reduced }: { reduced: boolean }) {
  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight position={[4, 5, 5]} intensity={2.2} color="#fff4df" />
      <directionalLight position={[-4, 1, 2]} intensity={1.3} color="#c47870" />
      <Float speed={reduced ? 0 : 1.05} rotationIntensity={reduced ? 0 : 0.08} floatIntensity={reduced ? 0 : 0.22}>
        <Portrait />
      </Float>
      <SilkOrbit reduced={reduced} />
      <Sparkles count={isCoarsePointer() ? 18 : 34} scale={[6, 6, 3]} size={1.25} speed={reduced ? 0 : 0.18} color="#f3dfbd" />
    </>
  );
}

export default function V4Hero() {
  const reduced = useReducedMotion();
  return (
    <section className="v4-hero relative min-h-[100svh] overflow-hidden bg-[#f1ece4] text-[#171310]">
      <div className="v4-grain absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="relative mx-auto grid min-h-[100svh] max-w-[1600px] items-center px-5 pt-28 pb-12 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-16 lg:pt-24">
        <div className="relative z-10 order-2 -mt-12 pb-8 lg:order-1 lg:mt-0 lg:pb-0">
          <p className="mb-6 text-[10px] font-medium tracking-[0.25em] uppercase text-[#745f54] sm:text-[11px]">
            Suman Bagriya · Metabolic wellness
          </p>
          <h1 className="v4-display max-w-[8ch] text-[clamp(64px,17vw,112px)] leading-[0.82] tracking-[-0.055em] lg:text-[clamp(88px,8.4vw,142px)]">
            Feel lighter.
            <span className="block italic text-[#a74d3d]">Live beautifully.</span>
          </h1>
          <p className="mt-8 max-w-[37ch] text-[15px] leading-7 text-[#57483f] sm:text-[17px]">
            A modern 90-day ritual, personally guided by Suman—for women ready for steadier energy, quieter cravings and confidence that feels like their own.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a className="v4-pill v4-pill-solid" href={waReset} target="_blank" rel="noopener noreferrer">
              Begin your reset
            </a>
            <a className="v4-pill v4-pill-line" href="#stories">
              See the stories
            </a>
          </div>
        </div>

        <div className="relative order-1 h-[56svh] min-h-[430px] lg:order-2 lg:h-[82svh]">
          <div className="absolute inset-x-[3%] top-[4%] bottom-[1%] rounded-[48%_48%_16%_16%/38%_38%_12%_12%] bg-[radial-gradient(circle_at_58%_31%,#d9a392_0%,#805044_34%,#33201a_70%,#1c1411_100%)] shadow-[0_55px_120px_rgba(62,37,27,0.24)]" />
          <div className="absolute inset-x-[9%] top-[10%] h-[72%] rounded-full bg-[#d99c88]/22 blur-[62px]" aria-hidden="true" />
          <div className="absolute inset-x-[2%] bottom-[1%] z-[3] h-[20%] bg-gradient-to-t from-[#f1ece4] via-[#f1ece4]/72 to-transparent" aria-hidden="true" />
          <Suspense fallback={<img src="/photos/suman-v4-editorial.png" alt="Suman Bagriya" className="absolute inset-x-[12%] top-[9%] h-[80%] w-[76%] rounded-[44%_44%_12%_12%/30%_30%_10%_10%] object-cover object-top shadow-2xl" />}>
            <Canvas
              camera={{ position: [0, 0, 7.1], fov: 36 }}
              dpr={isCoarsePointer() ? [1, 1.15] : [1, 1.6]}
              frameloop={reduced ? "demand" : "always"}
              gl={{ alpha: true, antialias: !isCoarsePointer(), powerPreference: "high-performance" }}
            >
              <HeroScene reduced={reduced} />
            </Canvas>
          </Suspense>
          <span className="absolute right-[3%] bottom-[14%] rotate-[-7deg] rounded-full bg-[#b85b43] px-4 py-2 text-[10px] tracking-[0.2em] text-white uppercase shadow-xl">
            90 days · together
          </span>
        </div>
      </div>
    </section>
  );
}
