import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

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
const KEY_STEP = 120;

const wrap = (v: number, size: number) => ((v % size) + size) % size;

/** Where tile `i` sits on the untransformed field. Alternate rows and columns are
 *  offset so the grid never reads as a plain grid. */
const basePos = (i: number) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return {
    x: col * CELL_W + (row % 2) * (CELL_W * 0.18),
    y: row * CELL_H + (col % 2) * (CELL_H * 0.14),
  };
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

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
      const { x: baseX, y: baseY } = basePos(i);

      const x =
        wrap(baseX + offset.current.x + CANVAS_W / 2, CANVAS_W) -
        CANVAS_W / 2 +
        vw / 2 -
        CELL_W / 2;
      const y =
        wrap(baseY + offset.current.y + CANVAS_H / 2, CANVAS_H) -
        CANVAS_H / 2 +
        vh / 2 -
        CELL_H / 2;

      // depth: tiles near the viewport centre sit larger and brighter
      const dx = (x + CELL_W / 2 - vw / 2) / vw;
      const dy = (y + CELL_H / 2 - vh / 2) / vh;
      const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy));

      node.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${1 - dist * 0.13})`;
      node.style.opacity = String(Math.max(0.3, 1 - dist * 0.45));
    });
  }, []);

  const panBy = useCallback(
    (dx: number, dy: number) => {
      offset.current.x += dx;
      offset.current.y += dy;
      setHinted(true);
      paint();
    },
    [paint],
  );

  /** Bring tile `i` to the centre. Solving the paint transform for offset gives
   *  offset = -base, since the wrap is periodic in CANVAS_W / CANVAS_H. */
  const centreTile = useCallback(
    (i: number) => {
      const { x, y } = basePos(i);
      offset.current.x = -x;
      offset.current.y = -y;
      velocity.current = { x: 0, y: 0 };
      setHinted(true);
      paint();
    },
    [paint],
  );

  // momentum
  useEffect(() => {
    if (prefersReducedMotion()) return;
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
      if (prefersReducedMotion()) velocity.current = { x: 0, y: 0 };
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
    panBy(-e.deltaX, -e.deltaY);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, [number, number]> = {
      ArrowLeft: [KEY_STEP, 0],
      ArrowRight: [-KEY_STEP, 0],
      ArrowUp: [0, KEY_STEP],
      ArrowDown: [0, -KEY_STEP],
    };
    const step = map[e.key];
    if (!step) return;
    e.preventDefault();
    panBy(step[0], step[1]);
  };

  const activate = (item: CanvasItem) => {
    if (drag.current.moved < CLICK_SLOP) onOpen(item);
  };

  // touch-pan-y keeps vertical swipes with the page — with touch-action:none the drag
  // handler ate them and the ~6,600px of content below the canvas was unreachable on a
  // phone. Horizontal gestures still pan the canvas. The sub-100dvh height on small
  // screens leaves the next section peeking, which is what invites the scroll.
  return (
    <div className="relative">
      <div
        ref={wrapRef}
        onPointerDown={onPointerDown}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="group"
        aria-label="Explore Suman's work. Use the arrow keys to pan, or Tab to step through each tile."
        className="relative h-[86dvh] w-full touch-pan-y overflow-hidden bg-[#050505] select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white/60 md:h-[100dvh]"
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
                onFocus={() => centreTile(i)}
                className="group relative block h-[86%] w-[86%] cursor-pointer overflow-hidden rounded-[14px] bg-[#111] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {item.kind === "photo" ? (
                  <img
                    src={item.src}
                    alt={item.title}
                    draggable={false}
                    decoding="async"
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
                    <span className="font-display text-[46px] leading-[0.9] text-white">
                      {item.title}
                    </span>
                  </span>
                )}
                {/* Rests at partial opacity rather than 0 so the affordance survives on
                    touch, where hover never fires. */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 to-transparent p-4 opacity-70 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="text-[13px] text-white">{item.title}</span>
                  <span className="font-mono text-[9px] tracking-[0.14em] text-white/70 uppercase">
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

      {/* WCAG 2.2 AA 2.5.7 — dragging cannot be the only way to reach the content. */}
      <div className="absolute right-[4%] bottom-24 grid grid-cols-3 grid-rows-3 gap-1 md:bottom-28">
        <button
          type="button"
          onClick={() => panBy(0, KEY_STEP)}
          aria-label="Pan up"
          className="col-start-2 row-start-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronUp size={15} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => panBy(KEY_STEP, 0)}
          aria-label="Pan left"
          className="col-start-1 row-start-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronLeft size={15} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => panBy(-KEY_STEP, 0)}
          aria-label="Pan right"
          className="col-start-3 row-start-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronRight size={15} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => panBy(0, -KEY_STEP)}
          aria-label="Pan down"
          className="col-start-2 row-start-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronDown size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
