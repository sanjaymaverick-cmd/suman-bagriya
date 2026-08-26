import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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

const BASE_CELL_W = 400;
const BASE_CELL_H = 470;
/** Fraction of the cell the tile fills; the remainder is the gutter. */
const TILE_RATIO = 0.86;
const MIN_COLS = 5;
const MIN_ROWS = 4;
const MAX_COLS = 12;
const MAX_ROWS = 8;
const CLICK_SLOP = 6;
const KEY_STEP = 120;

type Grid = { cw: number; ch: number; cols: number; rows: number };

const wrap = (v: number, size: number) => ((v % size) + size) % size;

/** The field is wrapped modulo its own size, so the column straddling the wrap seam is
 *  re-placed on the far side and punches a hole up to (1 + the 0.18 stagger) cells wide
 *  at one edge. A field of `cols` columns therefore only guarantees (cols - 1.18) * cw of
 *  cover, and the fixed 5x4 field left bare bands from ~1600px up (measured: 288px of
 *  void each side at 2560 wide, 726px at 3440). Rounding up and adding two columns keeps
 *  the canvas reading as infinite at every width up to 4K. Shrinking the cell on phones
 *  is the other half of the fix: at 375px a 400px cell showed barely one tile at a time
 *  and the field stopped reading as a field at all. */
const measure = (vw: number, vh: number): Grid => {
  const scale = vw < 640 ? 0.56 : vw < 1024 ? 0.78 : 1;
  const cw = Math.round(BASE_CELL_W * scale);
  const ch = Math.round(BASE_CELL_H * scale);
  return {
    cw,
    ch,
    cols: Math.min(MAX_COLS, Math.max(MIN_COLS, Math.ceil(vw / cw) + 2)),
    rows: Math.min(MAX_ROWS, Math.max(MIN_ROWS, Math.ceil(vh / ch) + 2)),
  };
};

/** Where tile `i` sits on the untransformed field. Alternate rows and columns are
 *  offset so the grid never reads as a plain grid. */
const basePos = (i: number, g: Grid) => {
  const col = i % g.cols;
  const row = Math.floor(i / g.cols);
  return {
    x: col * g.cw + (row % 2) * (g.cw * 0.18),
    y: row * g.ch + (col % 2) * (g.ch * 0.14),
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
  const raf = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [hinted, setHinted] = useState(false);
  // Server render has no viewport; the base 5x4 field matches the old markup and is
  // corrected on mount before the first paint the user sees.
  const [grid, setGrid] = useState<Grid>({
    cw: BASE_CELL_W,
    ch: BASE_CELL_H,
    cols: MIN_COLS,
    rows: MIN_ROWS,
  });
  const gridRef = useRef(grid);
  gridRef.current = grid;

  const paint = useCallback(() => {
    const host = wrapRef.current;
    if (!host) return;
    const g = gridRef.current;
    const vw = host.clientWidth;
    const vh = host.clientHeight;
    const fieldW = g.cols * g.cw;
    const fieldH = g.rows * g.ch;

    nodes.current.forEach((node, i) => {
      if (!node) return;
      const { x: baseX, y: baseY } = basePos(i, g);

      const x =
        wrap(baseX + offset.current.x + fieldW / 2, fieldW) - fieldW / 2 + vw / 2 - g.cw / 2;
      const y =
        wrap(baseY + offset.current.y + fieldH / 2, fieldH) - fieldH / 2 + vh / 2 - g.ch / 2;

      // depth: tiles near the viewport centre sit larger and brighter
      const dx = (x + g.cw / 2 - vw / 2) / vw;
      const dy = (y + g.ch / 2 - vh / 2) / vh;
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
   *  offset = -base, since the wrap is periodic in the field size. The extra term
   *  compensates for the tile filling only TILE_RATIO of its cell from the top-left,
   *  which otherwise leaves it sitting up and to the left of true centre. */
  const centreTile = useCallback(
    (i: number) => {
      const g = gridRef.current;
      const { x, y } = basePos(i, g);
      offset.current.x = -x + (g.cw * (1 - TILE_RATIO)) / 2;
      offset.current.y = -y + (g.ch * (1 - TILE_RATIO)) / 2;
      velocity.current = { x: 0, y: 0 };
      setHinted(true);
      paint();
    },
    [paint],
  );

  // Momentum runs only while there is momentum to spend. The previous version kept a
  // requestAnimationFrame loop alive for the life of the page, waking the compositor
  // every frame on an idle canvas.
  const glide = useCallback(() => {
    const v = velocity.current;
    if (drag.current.active || (Math.abs(v.x) <= 0.05 && Math.abs(v.y) <= 0.05)) {
      raf.current = 0;
      velocity.current = { x: 0, y: 0 };
      return;
    }
    offset.current.x += v.x;
    offset.current.y += v.y;
    v.x *= 0.94;
    v.y *= 0.94;
    paint();
    raf.current = requestAnimationFrame(glide);
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
      if (prefersReducedMotion()) {
        velocity.current = { x: 0, y: 0 };
        return;
      }
      if (!raf.current) raf.current = requestAnimationFrame(glide);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [paint, glide]);

  useEffect(() => {
    const apply = () => setGrid(measure(window.innerWidth, window.innerHeight));
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // Repaint after the grid (and therefore the node list) changes, before the browser
  // shows the new nodes at their default top-left position.
  useLayoutEffect(() => {
    nodes.current.length = grid.cols * grid.rows;
    paint();
  }, [grid, paint]);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, x: e.clientX, y: e.clientY, moved: 0 };
    velocity.current = { x: 0, y: 0 };
    setDragging(true);
    setHinted(true);
  };

  // Only the horizontal axis is taken. Vertical wheel belongs to the page: panning the
  // field *and* scrolling the document on the same gesture made the canvas feel like it
  // was fighting the scroll, and it matches the touch-action: pan-y contract below.
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < 1) return;
    panBy(-e.deltaX, 0);
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

  // Re-centring on focus is for keyboard users stepping through the field. A mouse press
  // also focuses the button, and doing it there yanked the whole field out from under the
  // cursor mid-click.
  const onTileFocus = (e: React.FocusEvent<HTMLButtonElement>, i: number) => {
    if (e.target.matches(":focus-visible")) centreTile(i);
  };

  // touch-pan-y keeps vertical swipes with the page — with touch-action:none the drag
  // handler ate them and the ~6,600px of content below the canvas was unreachable on a
  // phone. Horizontal gestures still pan the canvas. The sub-100dvh height leaves the
  // next section peeking, which is what invites the scroll.
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
        className="relative h-[86dvh] w-full touch-pan-y overflow-hidden bg-[#050505] select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white/60 md:h-[92dvh]"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      >
        {Array.from({ length: grid.cols * grid.rows }).map((_, i) => {
          const item = items[i % items.length];
          return (
            <div
              key={i}
              ref={(el) => {
                nodes.current[i] = el;
              }}
              className="absolute top-0 left-0 will-change-transform"
              style={{ width: grid.cw, height: grid.ch }}
            >
              <button
                type="button"
                onClick={() => activate(item)}
                onFocus={(e) => onTileFocus(e, i)}
                className="group relative block h-[86%] w-[86%] cursor-pointer overflow-hidden rounded-[14px] bg-[#111] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {item.kind === "photo" ? (
                  <img
                    src={item.src}
                    alt={item.title}
                    draggable={false}
                    decoding="async"
                    fetchPriority="low"
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
                    <span
                      className="font-display leading-[0.9] text-white"
                      style={{ fontSize: Math.round(grid.cw * 0.115) }}
                    >
                      {item.title}
                    </span>
                  </span>
                )}
                {/* Photos only: a note tile already prints its own title and meta, and the
                    caption strip printed both a second time over the top of them. Rests at
                    partial opacity rather than 0 so the affordance survives on touch, where
                    hover never fires. */}
                {item.kind === "photo" && (
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 to-transparent p-4 opacity-70 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="text-[13px] text-white">{item.title}</span>
                    <span className="font-mono text-[9px] tracking-[0.14em] text-white/70 uppercase">
                      {item.meta}
                    </span>
                  </span>
                )}
              </button>
            </div>
          );
        })}

        {/* One slot, two jobs: it teaches the drag, then becomes the standing signal that
            a whole page sits below the canvas. Centred on desktop; on phones it moves off
            the bottom row, where it used to sit on top of the About and CTA pills. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-start px-[4%] sm:bottom-8 sm:justify-center sm:px-0">
          <span className="relative grid">
            <span
              aria-hidden={hinted}
              className={`font-mono col-start-1 row-start-1 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-[10px] tracking-[0.2em] text-white/70 uppercase backdrop-blur-sm transition duration-500 ${
                hinted ? "opacity-0" : "opacity-100"
              }`}
            >
              <span className="sm:hidden">Drag · tap a tile</span>
              <span className="hidden sm:inline">Drag to explore · click a tile</span>
            </span>
            <span
              aria-hidden={!hinted}
              className={`font-mono col-start-1 row-start-1 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-[10px] tracking-[0.2em] text-white/70 uppercase backdrop-blur-sm transition duration-500 ${
                hinted ? "opacity-100" : "opacity-0"
              }`}
            >
              Scroll for the full story
              <ChevronDown size={12} aria-hidden="true" />
            </span>
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
