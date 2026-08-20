import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, useTexture } from "@react-three/drei";
import * as THREE from "three";

const COLOR = "/photos/suman-face.jpg";

const W = 2.28;
const H = 2.9;

const holoVert = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const holoFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    float lines = 0.5 + 0.5 * sin(vUv.y * 88.0 + uTime * 3.2);
    float sweep = abs(vUv.y - fract(uTime * 0.14));
    float band = 1.0 - smoothstep(0.0, 0.07, sweep);
    float flicker = 0.88 + 0.12 * sin(uTime * 9.0);
    vec3 brick = vec3(0.77, 0.36, 0.20);
    vec3 gold = vec3(0.90, 0.74, 0.48);
    vec3 pearl = vec3(0.94, 0.91, 0.86);
    vec3 col = mix(brick, gold, lines);
    col = mix(col, pearl, band);
    float alpha = (0.06 + lines * 0.09 + band * 0.32) * flicker;
    gl_FragColor = vec4(col, alpha);
  }
`;

function HoloFilm({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const uniforms = useRef({ uTime: { value: 0 } });
  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.elapsedTime;
  });
  return (
    <mesh position={position} rotation={rotation} renderOrder={3}>
      <planeGeometry args={[W, H]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={holoVert}
        fragmentShader={holoFrag}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function ScanBar({ z, rotY = 0 }: { z: number; rotY?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.elapsedTime * 0.2) % 1;
    ref.current.position.y = -H / 2 + t * H;
  });
  return (
    <mesh ref={ref} position={[0, 0, z]} rotation={[0, rotY, 0]} renderOrder={4}>
      <planeGeometry args={[W * 0.98, 0.05]} />
      <meshBasicMaterial color="#e8c9a0" transparent opacity={0.4} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function GhostPrint({ map, sign }: { map: THREE.Texture; sign: 1 | -1 }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.z = sign * (0.05 + Math.sin(t * 1.15) * 0.025);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.11 + Math.sin(t * 1.15) * 0.05;
  });
  return (
    <mesh ref={ref} rotation={[0, sign < 0 ? Math.PI : 0, 0]} renderOrder={2}>
      <planeGeometry args={[W, H]} />
      <meshBasicMaterial map={map} transparent opacity={0.12} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Portrait({
  onSelect,
}: {
  active: boolean;
  onSelect?: (url: string) => void;
}) {
  const colorMap = useTexture(COLOR);
  const down = useRef({ x: 0, y: 0, t: 0 });

  useMemo(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.minFilter = THREE.LinearFilter;
    colorMap.magFilter = THREE.LinearFilter;
    colorMap.anisotropy = 8;
    colorMap.needsUpdate = true;
  }, [colorMap]);

  const tap = {
    onPointerOver: () => {
      document.body.style.cursor = "zoom-in";
    },
    onPointerOut: () => {
      document.body.style.cursor = "";
    },
    onPointerDown: (e: { nativeEvent: PointerEvent }) => {
      const n = e.nativeEvent;
      down.current = { x: n.clientX, y: n.clientY, t: performance.now() };
    },
    onPointerUp: (e: { nativeEvent: PointerEvent; stopPropagation: () => void }) => {
      const n = e.nativeEvent;
      const dx = n.clientX - down.current.x;
      const dy = n.clientY - down.current.y;
      if (dx * dx + dy * dy < 64 && performance.now() - down.current.t < 420) {
        e.stopPropagation();
        onSelect?.(COLOR);
      }
    },
  };

  return (
    <group>
      <mesh position={[0, 0, 0.012]} renderOrder={1} {...tap}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={colorMap} toneMapped={false} side={THREE.FrontSide} />
      </mesh>
      <mesh position={[0, 0, -0.012]} rotation={[0, Math.PI, 0]} renderOrder={1} {...tap}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={colorMap} toneMapped={false} side={THREE.FrontSide} />
      </mesh>
      <mesh renderOrder={0}>
        <boxGeometry args={[W - 0.02, H - 0.02, 0.02]} />
        <meshBasicMaterial color="#f0ebe3" toneMapped={false} />
      </mesh>
      <GhostPrint map={colorMap} sign={1} />
      <GhostPrint map={colorMap} sign={-1} />
      <HoloFilm position={[0, 0, 0.03]} />
      <HoloFilm position={[0, 0, -0.03]} rotation={[0, Math.PI, 0]} />
      <ScanBar z={0.04} />
      <ScanBar z={-0.04} rotY={Math.PI} />
    </group>
  );
}

function GlassVitrine() {
  const cw = W + 0.22;
  const ch = H + 0.22;
  const cd = 0.42;
  const bar = 0.026;
  const hw = cw / 2;
  const hh = ch / 2;
  const hd = cd / 2;
  const glass = {
    color: "#f4efe8",
    transparent: true,
    opacity: 0.09,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  } as const;
  const metal = { color: "#6a3f2c", toneMapped: false } as const;
  const bars: { p: [number, number, number]; s: [number, number, number] }[] = [
    { p: [0, hh, hd], s: [cw, bar, bar] },
    { p: [0, -hh, hd], s: [cw, bar, bar] },
    { p: [hw, 0, hd], s: [bar, ch, bar] },
    { p: [-hw, 0, hd], s: [bar, ch, bar] },
    { p: [0, hh, -hd], s: [cw, bar, bar] },
    { p: [0, -hh, -hd], s: [cw, bar, bar] },
    { p: [hw, 0, -hd], s: [bar, ch, bar] },
    { p: [-hw, 0, -hd], s: [bar, ch, bar] },
    { p: [hw, hh, 0], s: [bar, bar, cd] },
    { p: [-hw, hh, 0], s: [bar, bar, cd] },
    { p: [hw, -hh, 0], s: [bar, bar, cd] },
    { p: [-hw, -hh, 0], s: [bar, bar, cd] },
  ];

  return (
    <group>
      <mesh position={[0, -hh - 0.18, 0]}>
        <boxGeometry args={[cw + 0.2, 0.14, cd + 0.24]} />
        <meshBasicMaterial color="#1f1915" toneMapped={false} />
      </mesh>
      <mesh position={[0, -hh - 0.09, 0]}>
        <boxGeometry args={[cw + 0.02, 0.045, cd + 0.06]} />
        <meshBasicMaterial color="#c45c32" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, hd]} renderOrder={2}>
        <planeGeometry args={[cw, ch]} />
        <meshBasicMaterial {...glass} />
      </mesh>
      <mesh position={[0, 0, -hd]} renderOrder={0}>
        <planeGeometry args={[cw, ch]} />
        <meshBasicMaterial {...glass} />
      </mesh>
      <mesh position={[hw, 0, 0]} rotation={[0, Math.PI / 2, 0]} renderOrder={2}>
        <planeGeometry args={[cd, ch]} />
        <meshBasicMaterial {...glass} />
      </mesh>
      <mesh position={[-hw, 0, 0]} rotation={[0, Math.PI / 2, 0]} renderOrder={2}>
        <planeGeometry args={[cd, ch]} />
        <meshBasicMaterial {...glass} />
      </mesh>
      {bars.map((b, i) => (
        <mesh key={i} position={b.p}>
          <boxGeometry args={b.s} />
          <meshBasicMaterial {...metal} />
        </mesh>
      ))}
    </group>
  );
}

export default function SumanHero({
  active,
  dimmed,
  onSelect,
}: {
  active: boolean;
  dimmed: boolean;
  onSelect?: (url: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const scale = useRef(1);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = 0.92 + Math.sin(t * 0.32) * 0.04;
    const target = active ? 1.1 : dimmed ? 0.94 : 1;
    scale.current += (target - scale.current) * 0.1;
    group.current.scale.setScalar(scale.current);
  });

  return (
    <group ref={group} position={[0, 0.92, 0]}>
      <GlassVitrine />
      <Portrait active={active} onSelect={onSelect} />
      <ContactShadows position={[0, -H / 2 - 0.28, 0]} opacity={0.28} scale={6.5} blur={2.4} far={4} color="#2a211b" />
    </group>
  );
}
