import { useCallback, useEffect, useRef, useState } from "react";

export type CanvasItem = {
  id: string;
  kind: "photo" | "note";
  src?: string;
  title: string;
  meta: string;
  href?: string;
  tone?: string;
  blurb?: string;
};

const CELL_W = 400;
const CELL_H = 470;
const COLS = 5;
const ROWS = 4;
const CANVAS_W = COLS * CELL_W;
const CANVAS_H = ROWS * CELL_H;
const CLICK_SLOP = 6;

const wrap = (v: number, size: number) => ((v % size) + size) % size;

/** Infinite drag canvas: pointer drag pans, momentum carries, tiles wrap in both axes. */
export default function V2Canvas({
  items,
  onOpen,
}: {
  items: CanvasItem[];
  onOpen: (item: CanvasItem) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const drag = useRef({ active: false, x: 0, y: 0, moved: 0 });
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const [dragging, setDragging] = useState(false);
  const [hinted, setHinted] = useState(false);

  const paint = useCallback(() => {
    const host = wrapRef.current;
    if (!host) return;
    const vw = host.clientWidth;
    const vh = host.clientHeight;

    nodes.current.forEach((node, i) => {
      if (!node) return;
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      // stagger alternate rows/columns so it never reads as a plain grid
      const baseX = col * CELL_W + (row % 2) * (CELL_W * 0.18);
      const baseY = row * CELL_H + (col % 2) * (CELL_H * 0.14);

      const x = wrap(baseX + offset.current.x + CANVAS_W / 2, CANVAS_W) - CANVAS_W / 2 + vw / 2 - CELL_W / 2;
      const y = wrap(baseY + offset.current.y + CANVAS_H / 2, CANVAS_H) - CANVAS_H / 2 + vh / 2 - CELL_H / 2;

      // depth: tiles near the viewport centre sit larger and brighter
      const dx = (x + CELL_W / 2 - vw / 2) / vw;
      const dy = (y + CELL_H / 2 - vh / 2) / vh;
      const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy));

      node.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${1 - dist * 0.13})`;
      node.style.opacity = String(Math.max(0.3, 1 - dist * 0.45));
    });
  }, []);

  // momentum
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (!drag.current.active) {
        const v = velocity.current;
        if (Math.abs(v.x) > 0.05 || Math.abs(v.y) > 0.05) {
          offset.current.x += v.x;
          offset.current.y += v.y;
          v.x *= 0.94;
          v.y *= 0.94;
          paint();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paint]);

  // Drag is tracked on window rather than via setPointerCapture, which would retarget
  // pointer events to the canvas and swallow clicks on the tiles. Listeners stay attached
  // for the life of the component and gate on the ref, so no move is lost to a re-render.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      offset.current.x += dx;
      offset.current.y += dy;
      velocity.current = { x: dx, y: dy };
      d.moved += Math.abs(dx) + Math.abs(dy);
      d.x = e.clientX;
      d.y = e.clientY;
      paint();
    };

    const onUp = () => {
      if (!drag.current.active) return;
      drag.current.active = false;
      setDragging(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [paint]);

  useEffect(() => {
    paint();
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paint]);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, x: e.clientX, y: e.clientY, moved: 0 };
    velocity.current = { x: 0, y: 0 };
    setDragging(true);
    setHinted(true);
  };

  const onWheel = (e: React.WheelEvent) => {
    offset.current.x -= e.deltaX;
    offset.current.y -= e.deltaY;
    setHinted(true);
    paint();
  };

  const activate = (item: CanvasItem) => {
    if (drag.current.moved < CLICK_SLOP) onOpen(item);
  };

  return (
    <div
      ref={wrapRef}
      onPointerDown={onPointerDown}
      onWheel={onWheel}
      className="relative h-[100dvh] w-full touch-none overflow-hidden bg-[#050505] select-none"
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      {Array.from({ length: COLS * ROWS }).map((_, i) => {
        const item = items[i % items.length];
        return (
          <div
            key={i}
            ref={(el) => {
              nodes.current[i] = el;
            }}
            className="absolute top-0 left-0 will-change-transform"
            style={{ width: CELL_W, height: CELL_H }}
          >
            <button
              type="button"
              onClick={() => activate(item)}
              className="group relative block h-[86%] w-[86%] cursor-pointer overflow-hidden rounded-[14px] bg-[#111] text-left"
            >
              {item.kind === "photo" ? (
                <img
                  src={item.src}
                  alt={item.title}
                  draggable={false}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <span
                  className="flex h-full w-full flex-col justify-between p-7"
                  style={{ background: item.tone ?? "#c45c32" }}
                >
                  <span className="font-mono text-[10px] tracking-[0.18em] text-white/70 uppercase">
                    {item.meta}
                  </span>
                  <span className="font-display text-[46px] leading-[0.9] text-white">{item.title}</span>
                </span>
              )}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                <span className="text-[13px] text-white">{item.title}</span>
                <span className="font-mono text-[9px] tracking-[0.14em] text-white/60 uppercase">
                  {item.meta}
                </span>
              </span>
            </button>
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
        <span
          className={`font-mono rounded-full border border-white/15 bg-black/50 px-4 py-2 text-[10px] tracking-[0.2em] text-white/70 uppercase backdrop-blur-sm transition duration-500 ${
            hinted ? "opacity-0" : "opacity-100"
          }`}
        >
          Drag to explore · click a tile
        </span>
      </div>
    </div>
  );
}
