import { type ReactNode, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";

export function V4VelocityField() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 90, damping: 24, mass: 0.65 });
  const slowY = useTransform(scrollY, (value) => value * -0.035);
  const mediumY = useTransform(scrollY, (value) => value * -0.07);
  const fastY = useTransform(scrollY, (value) => value * -0.115);
  const driftSlow = useTransform(velocity, [-2200, 0, 2200], [38, 0, -38]);
  const driftFast = useTransform(velocity, [-2200, 0, 2200], [-72, 0, 72]);
  const skew = useTransform(velocity, [-2200, 0, 2200], [-5, 0, 5]);
  if (reduced) return null;
  return <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true"><motion.div className="v4-velocity-orb v4-velocity-orb-a" style={{ y: slowY, x: driftSlow }} /><motion.div className="v4-velocity-orb v4-velocity-orb-b" style={{ y: mediumY, x: driftFast, skewY: skew }} /><motion.div className="v4-velocity-line" style={{ y: fastY, x: driftSlow, skewY: skew }} /></div>;
}

export function V4Scene({ index, title, children, first = false }: { index: number; title: string; children: ReactNode; first?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 105, damping: 25, mass: 0.7 });
  const velocityGap = useSpring(useVelocity(progress), { stiffness: 80, damping: 18, mass: 0.75 });
  const y = useTransform(progress, [0, 0.16, 0.76, 1], first ? [0, 0, 0, -80] : [170, 0, 0, -120]);
  const scale = useTransform(progress, [0, 0.16, 0.76, 1], first ? [1, 1, 1, 0.965] : [0.9, 1, 1, 0.94]);
  const rotateX = useTransform(progress, [0, 0.16, 0.76, 1], first ? [0, 0, 0, -3] : [9, 0, 0, -6]);
  const opacity = useTransform(progress, [0, 0.1, 0.84, 1], first ? [1, 1, 1, 0.72] : [0.25, 1, 1, 0.58]);
  const radius = useTransform(progress, [0, 0.16, 0.78, 1], first ? [0, 0, 0, 36] : [48, 0, 0, 42]);
  const layerNear = useTransform(progress, [0, 1], [90, -110]);
  const layerFar = useTransform(progress, [0, 1], [38, -45]);
  const velocityOffset = useTransform(velocityGap, [-2, 0, 2], [-52, 0, 52]);
  const curtainScale = useTransform(progress, [0, 0.18], [1, 0]);
  return <div ref={ref} data-v4-scene data-scene-index={index} data-scene-title={title} className="v4-scene-shell"><motion.div className="v4-scene-face" style={reduced ? undefined : { y, scale, rotateX, opacity, borderRadius: radius }}><motion.div className="v4-scene-depth v4-scene-depth-far" style={reduced ? undefined : { y: layerFar }} /><motion.div className="v4-scene-depth v4-scene-depth-near" style={reduced ? undefined : { y: layerNear, x: velocityOffset }} /><div className="relative z-[2]">{children}</div>{!first && <motion.div className="v4-scene-curtain" style={reduced ? undefined : { scaleY: curtainScale }} />}</motion.div>{!first && <div className="v4-scene-seam" aria-hidden="true" />}</div>;
}

export function V4SceneHud({ count }: { count: number }) {
  const [active, setActive] = useState(1);
  const [title, setTitle] = useState("Opening");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.5 });
  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-v4-scene]"));
    const observer = new IntersectionObserver((entries) => { const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]; if (!visible) return; const element = visible.target as HTMLElement; setActive(Number(element.dataset.sceneIndex ?? 1)); setTitle(element.dataset.sceneTitle ?? "Scene"); }, { threshold: [0.2, 0.4, 0.65] });
    scenes.forEach((scene) => observer.observe(scene));
    return () => observer.disconnect();
  }, []);
  return <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6 sm:justify-start sm:px-8"><div className="flex min-w-[230px] items-center gap-3 rounded-full border border-white/15 bg-[#171310]/78 px-4 py-2.5 text-white shadow-2xl backdrop-blur-xl"><span className="font-mono text-[9px] tracking-[0.16em] text-white/55">{String(active).padStart(2, "0")} / {String(count).padStart(2, "0")}</span><span className="h-px flex-1 overflow-hidden bg-white/15"><motion.span className="block h-full origin-left bg-[#d88c7b]" style={{ scaleX: progress }} /></span><span className="max-w-[92px] truncate text-[9px] tracking-[0.15em] uppercase text-white/72">{title}</span></div></div>;
}
