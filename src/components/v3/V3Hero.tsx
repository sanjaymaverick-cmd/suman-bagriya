import { Suspense, lazy, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { isCoarsePointer } from "@/lib/texture-memory";
import { waReset, waEarn } from "@/lib/links";

const SumanHero = lazy(() => import("@/components/k95/SumanHero"));

/** SSR-safe: false on the server, corrected on mount, and kept live if the user
 *  flips the OS setting while the page is open. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/** The shared portrait runs an unconditional idle bob and a pointer lerp in useFrame.
 *  We cannot edit that component, but we can stop the render loop from our own Canvas:
 *  frameloop="demand" paints only when something asks. Its textures arrive async, so
 *  nudge a few frames after mount to guarantee the portrait actually appears, then rest. */
function DemandPainter({ enabled }: { enabled: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!enabled) return;
    let n = 0;
    const id = window.setInterval(() => {
      invalidate();
      if (++n > 40) window.clearInterval(id);
    }, 100);
    return () => window.clearInterval(id);
  }, [enabled, invalidate]);
  return null;
}

export default function V3Hero() {
  const reduced = usePrefersReducedMotion();
  // Widens the pointer field the parallax reads from: without this the portrait only
  // reacts once the cursor is directly over the 360px canvas. Capped at 500px so the
  // normalised pointer stays near +/-1.4 and the depth shift never slams its clamp.
  // Held as state rather than a ref because R3F's eventSource type predates React 19's
  // nullable RefObject, and an element is what it actually wants.
  const [pointerField, setPointerField] = useState<HTMLDivElement | null>(null);

  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-[#0c0b0a] px-[5%] pt-28 pb-16 text-[#f3ede2] sm:pt-32 sm:pb-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #f3ede2 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-[1320px] items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="font-mono mb-6 flex items-center gap-3 text-[11px] tracking-[0.22em] text-[#f3ede2]/60 uppercase sm:mb-8">
            <span className="h-[6px] w-[6px] rounded-full bg-brick" />
            Metabolic health coach — est. Vasai
          </p>
          {/* Fluid rather than a 15vw/9vw/6.4vw ladder: that ladder collapsed 40% at the
              640px breakpoint and 4% again at 1024px, and grew unbounded past the 1320px
              container on ultrawide. One clamp per column width, capped at both ends. */}
          <h1 className="font-editorial-serif text-[clamp(46px,14.5vw,84px)] leading-[0.92] tracking-[-0.01em] lg:text-[clamp(76px,7.6vw,120px)]">
            No diet.
            <br />
            A metabolic
            <br />
            <span className="text-brick italic">reset.</span>
          </h1>
          <p className="mt-10 max-w-[42ch] text-[16px] leading-[1.6] text-[#f3ede2]/70 md:text-[18px]">
            Unimate in the morning. Balance before meals. Ninety days with Suman — no calorie
            counting, no willpower theatre. The house does the remembering.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={waReset} target="_blank" rel="noopener noreferrer" className="btn-dark-solid">
              Start the Reset
            </a>
            <a href={waEarn} target="_blank" rel="noopener noreferrer" className="btn-dark-line">
              Build with me
            </a>
          </div>
        </div>

        <div
          ref={setPointerField}
          className="relative mx-auto flex w-full max-w-[500px] items-center justify-center"
        >
          <div className="relative mx-auto flex h-[320px] w-full max-w-[360px] items-center justify-center sm:h-[420px] lg:h-[560px]">
            <div className="pointer-events-none absolute -inset-x-10 -inset-y-6 rounded-full bg-brick/10 blur-3xl" />
            <div className="relative h-full w-full">
              <Suspense fallback={null}>
                <Canvas
                  camera={{ position: [0, 0.12, 7.1], fov: 28, near: 0.1, far: 40 }}
                  dpr={isCoarsePointer() ? [1, 1.15] : [1, 1.5]}
                  gl={{ antialias: !isCoarsePointer(), alpha: true, powerPreference: "low-power" }}
                  style={{ background: "transparent" }}
                  frameloop={reduced ? "demand" : "always"}
                  eventSource={pointerField ?? undefined}
                  eventPrefix="client"
                >
                  <DemandPainter enabled={reduced} />
                  <Suspense fallback={null}>
                    <SumanHero active={false} dimmed={false} />
                  </Suspense>
                </Canvas>
              </Suspense>
            </div>
            <span className="font-mono absolute -right-2 top-6 -rotate-6 rounded-[3px] bg-brick-solid px-3 py-1.5 text-[11px] tracking-[0.14em] text-white shadow-lg sm:-right-6">
              90 DAYS.
            </span>
          </div>
        </div>
      </div>

      {/* The fold's only forward affordance, so it is a real link rather than a label. */}
      <div className="relative mx-auto mt-12 flex w-full max-w-[1320px] sm:mt-20 items-center justify-between">
        <a
          href="#offerings"
          className="tap-target font-mono group gap-2 text-[10px] tracking-[0.2em] text-[#f3ede2]/40 uppercase transition-colors hover:text-[#f3ede2]/80"
        >
          Scroll
          <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">
            ↓
          </span>
        </a>
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#f3ede2]/40 uppercase">
          V3 — Editorial
        </span>
      </div>
    </section>
  );
}
