import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function V4CursorPhysics() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 310, damping: 26, mass: 0.45 });
  const ringY = useSpring(y, { stiffness: 310, damping: 26, mass: 0.45 });
  const haloX = useSpring(x, { stiffness: 85, damping: 18, mass: 0.85 });
  const haloY = useSpring(y, { stiffness: 85, damping: 18, mass: 0.85 });
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const active = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("v4-cursor-active");

    const resetTarget = () => {
      if (!active.current) return;
      active.current.style.removeProperty("--v4-tilt-x");
      active.current.style.removeProperty("--v4-tilt-y");
      active.current.style.removeProperty("--v4-magnet-x");
      active.current.style.removeProperty("--v4-magnet-y");
      active.current.classList.remove("v4-physics-active");
      active.current = null;
    };

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("a, button, article, figure, [data-v4-physics]") ?? null;
      if (target !== active.current) {
        resetTarget();
        active.current = target;
        setHovering(Boolean(target));
      }
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      target.style.setProperty("--v4-tilt-x", `${(-ny * 7).toFixed(2)}deg`);
      target.style.setProperty("--v4-tilt-y", `${(nx * 8).toFixed(2)}deg`);
      target.style.setProperty("--v4-magnet-x", `${(nx * 9).toFixed(1)}px`);
      target.style.setProperty("--v4-magnet-y", `${(ny * 9).toFixed(1)}px`);
      target.style.setProperty("--v4-light-x", `${((nx + 0.5) * 100).toFixed(1)}%`);
      target.style.setProperty("--v4-light-y", `${((ny + 0.5) * 100).toFixed(1)}%`);
      target.classList.add("v4-physics-active");
    };
    const onLeave = () => { setVisible(false); setHovering(false); resetTarget(); };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      resetTarget();
      document.documentElement.classList.remove("v4-cursor-active");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [reduced, x, y]);

  if (reduced) return null;
  return <div className={`v4-cursor-system ${visible ? "is-visible" : ""} ${hovering ? "is-hovering" : ""} ${pressed ? "is-pressed" : ""}`} aria-hidden="true"><motion.span className="v4-cursor-halo" style={{ x: haloX, y: haloY }} /><motion.span className="v4-cursor-ring" style={{ x: ringX, y: ringY }} /><motion.span className="v4-cursor-dot" style={{ x, y }} /></div>;
}
