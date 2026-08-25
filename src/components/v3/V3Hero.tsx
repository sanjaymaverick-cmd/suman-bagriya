import { Suspense, lazy } from "react";
import { Canvas } from "@react-three/fiber";
import { isCoarsePointer } from "@/lib/texture-memory";
import { waReset, waEarn } from "@/lib/links";

const SumanHero = lazy(() => import("@/components/k95/SumanHero"));

export default function V3Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-[#0c0b0a] px-[5%] pt-32 pb-24 text-[#f3ede2]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #f3ede2 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative mx-auto grid w-full max-w-[1320px] items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="font-mono mb-8 flex items-center gap-3 text-[11px] tracking-[0.22em] text-[#f3ede2]/60 uppercase">
            <span className="h-[6px] w-[6px] rounded-full bg-brick" />
            Metabolic health coach — est. Vasai
          </p>
          <h1 className="font-editorial-serif text-[15vw] leading-[0.92] tracking-[-0.01em] sm:text-[9vw] lg:text-[6.4vw]">
            No diet.
            <br />
            A metabolic
            <br />
            <span className="text-brick italic">reset.</span>
          </h1>
          <p className="mt-10 max-w-[42ch] text-[16px] leading-[1.6] text-[#f3ede2]/70 md:text-[18px]">
            Unimate in the morning. Balance before meals. Ninety days with Suman — no calorie counting, no
            willpower theatre. The house does the remembering.
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

        <div className="relative mx-auto flex h-[420px] w-full max-w-[360px] items-center justify-center lg:h-[560px]">
          <div className="pointer-events-none absolute -inset-x-10 -inset-y-6 rounded-full bg-brick/10 blur-3xl" />
          <div className="relative h-full w-full">
            <Suspense fallback={null}>
              <Canvas
                camera={{ position: [0, 0.12, 7.1], fov: 28, near: 0.1, far: 40 }}
                dpr={isCoarsePointer() ? [1, 1.15] : [1, 1.5]}
                gl={{ antialias: !isCoarsePointer(), alpha: true, powerPreference: "low-power" }}
                style={{ background: "transparent" }}
              >
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

      <div className="relative mx-auto mt-20 flex w-full max-w-[1320px] items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#f3ede2]/40 uppercase">Scroll</span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#f3ede2]/40 uppercase">V2 — Editorial</span>
      </div>
    </section>
  );
}
