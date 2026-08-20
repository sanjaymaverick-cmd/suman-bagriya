import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, MeshTransmissionMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";

const COLOR = "/photos/suman-face.jpg";
const DEPTH = "/photos/suman-depth.jpg";

const W = 2.28;
const H = 2.9;

const portraitVert = /* glsl */ `
  uniform sampler2D uDepth;
  uniform vec2 uPointer;
  uniform float uTime;
  uniform float uAmp;
  varying vec2 vUv;
  varying float vDepth;
  varying vec3 vView;
  void main() {
    vUv = uv;
    float d = texture2D(uDepth, uv).r;
    vDepth = d;
    vec3 pos = position;
    pos.z += (d - 0.22) * uAmp;
    pos.x += uPointer.x * d * 0.12;
    pos.y += uPointer.y * d * 0.07;
    pos.y += sin(uTime * 0.7) * 0.018;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const portraitFrag = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D uDepth;
  uniform vec2 uPointer;
  uniform float uTime;
  varying vec2 vUv;
  varying float vDepth;
  varying vec3 vView;
  void main() {
    vec2 uv = vUv + uPointer * (1.0 - vDepth) * 0.045;
    uv = clamp(uv, 0.0, 1.0);
    vec4 col = texture2D(uMap, uv);
    float fres = pow(1.0 - abs(normalize(vView).z), 2.4);
    float wave = 0.5 + 0.5 * sin(uTime * 0.6 + vUv.y * 9.0 + vUv.x * 3.0);
    vec3 brick = vec3(0.77, 0.36, 0.20);
    vec3 gold = vec3(0.86, 0.74, 0.52);
    vec3 holo = mix(brick, gold, wave);
    col.rgb += fres * holo * 0.42;
    col.rgb += vDepth * 0.04;
    gl_FragColor = vec4(col.rgb, 1.0);
  }
`;

const pointsVert = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uTime;
  uniform float uSize;
  attribute vec2 aUv;
  varying float vDepth;
  varying vec2 vUv;
  void main() {
    vUv = aUv;
    float d = texture2D(uDepth, aUv).r;
    vDepth = d;
    vec3 pos = vec3((aUv.x - 0.5) * ${W.toFixed(2)}, (aUv.y - 0.5) * ${H.toFixed(2)}, (d - 0.2) * 0.62);
    pos.y += sin(uTime * 0.7 + aUv.x * 4.0) * 0.012;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (0.6 + d) * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const pointsFrag = /* glsl */ `
  uniform sampler2D uMap;
  varying float vDepth;
  varying vec2 vUv;
  void main() {
    if (vDepth < 0.16) discard;
    vec2 p = gl_PointCoord - 0.5;
    if (dot(p, p) > 0.25) discard;
    vec3 col = texture2D(uMap, vUv).rgb;
    gl_FragColor = vec4(col, 0.42 * vDepth);
  }
`;

function PortraitVolume({
  active,
  onSelect,
}: {
  active: boolean;
  onSelect?: (url: string) => void;
}) {
  const colorMap = useTexture(COLOR);
  const depthMap = useTexture(DEPTH);
  const uniforms = useRef({
    uMap: { value: colorMap },
    uDepth: { value: depthMap },
    uPointer: { value: new THREE.Vector2() },
    uTime: { value: 0 },
    uAmp: { value: 0.52 },
  });
  const down = useRef({ x: 0, y: 0, t: 0 });
  const width = useThree((s) => s.size.width);
  const mobile = width < 720;

  useMemo(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.minFilter = THREE.LinearFilter;
    colorMap.magFilter = THREE.LinearFilter;
    depthMap.minFilter = THREE.LinearFilter;
    depthMap.magFilter = THREE.LinearFilter;
  }, [colorMap, depthMap]);

  useFrame((state) => {
    const u = uniforms.current;
    u.uTime.value = state.clock.elapsedTime;
    u.uPointer.value.lerp(state.pointer, 0.08);
    u.uAmp.value = THREE.MathUtils.lerp(u.uAmp.value, active ? 0.7 : 0.52, 0.08);
  });

  const segs = mobile ? [32, 42] : [64, 84];

  return (
    <mesh
      onPointerOver={() => {
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
          onSelect?.(COLOR);
        }
      }}
    >
      <planeGeometry args={[W, H, segs[0], segs[1]]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={portraitVert}
        fragmentShader={portraitFrag}
        toneMapped={false}
      />
    </mesh>
  );
}

function HoloPoints() {
  const colorMap = useTexture(COLOR);
  const depthMap = useTexture(DEPTH);
  const width = useThree((s) => s.size.width);
  const mobile = width < 720;
  const nx = mobile ? 48 : 88;
  const ny = mobile ? 60 : 110;

  const geo = useMemo(() => {
    const count = nx * ny;
    const aUv = new Float32Array(count * 2);
    const pos = new Float32Array(count * 3);
    let i = 0;
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        aUv[i * 2] = x / (nx - 1);
        aUv[i * 2 + 1] = y / (ny - 1);
        i++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aUv", new THREE.BufferAttribute(aUv, 2));
    return g;
  }, [nx, ny]);

  const uniforms = useRef({
    uMap: { value: colorMap },
    uDepth: { value: depthMap },
    uTime: { value: 0 },
    uSize: { value: mobile ? 1.6 : 2.2 },
  });

  useFrame((s) => {
    uniforms.current.uTime.value = s.clock.elapsedTime;
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={pointsVert}
        fragmentShader={pointsFrag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

function GlassVitrine() {
  const cw = W + 0.28;
  const ch = H + 0.28;
  const cd = 0.64;
  const bar = 0.032;
  const hw = cw / 2;
  const hh = ch / 2;
  const hd = cd / 2;
  const metal = {
    color: "#6a3f2c",
    metalness: 0.84,
    roughness: 0.26,
  } as const;
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
      <mesh position={[0, -hh - 0.2, 0]} castShadow>
        <boxGeometry args={[cw + 0.22, 0.16, cd + 0.28]} />
        <meshStandardMaterial color="#1f1915" roughness={0.55} metalness={0.18} />
      </mesh>
      <mesh position={[0, -hh - 0.1, 0]}>
        <boxGeometry args={[cw + 0.04, 0.05, cd + 0.08]} />
        <meshStandardMaterial color="#c45c32" roughness={0.32} metalness={0.62} />
      </mesh>
      <mesh>
        <boxGeometry args={[cw, ch, cd]} />
        <MeshTransmissionMaterial
          samples={4}
          resolution={256}
          thickness={0.35}
          chromaticAberration={0.018}
          anisotropy={0.08}
          distortion={0.04}
          distortionScale={0.12}
          temporalDistortion={0}
          roughness={0.06}
          transmission={1}
          ior={1.46}
          color="#f4efe8"
          toneMapped={false}
        />
      </mesh>
      {bars.map((b, i) => (
        <mesh key={i} position={b.p}>
          <boxGeometry args={b.s} />
          <meshStandardMaterial {...metal} />
        </mesh>
      ))}
      <pointLight position={[0.4, 1.2, 1.8]} intensity={1.35} color="#fff3e4" distance={8} />
      <pointLight position={[-0.9, 0.4, 1.2]} intensity={0.45} color="#c45c32" distance={6} />
      <spotLight
        position={[0, 2.4, 1.6]}
        angle={0.38}
        penumbra={0.7}
        intensity={1.1}
        color="#fff7ee"
        distance={10}
        castShadow={false}
      />
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
    const target = active ? 1.12 : dimmed ? 0.92 : 1;
    scale.current += (target - scale.current) * 0.1;
    group.current.scale.setScalar(scale.current);
    group.current.traverse((obj) => {
      const mat = (obj as THREE.Mesh).material as THREE.Material | undefined;
      if (mat && "opacity" in mat && dimmed) {
        /* portrait shader stays opaque; glass already transparent */
      }
    });
  });

  return (
    <group ref={group} position={[0, 0.92, 0]}>
      <Environment preset="studio" environmentIntensity={0.55} />
      <GlassVitrine />
      <group position={[0, 0.02, -0.06]}>
        <PortraitVolume active={active} onSelect={onSelect} />
        <HoloPoints />
      </group>
      <ContactShadows position={[0, -H / 2 - 0.3, 0]} opacity={0.38} scale={7} blur={2.6} far={4} color="#2a211b" />
    </group>
  );
}
