import { waReset } from "@/lib/links";

const steps = [
  {
    n: "01",
    t: "Morning",
    b: "Unimate. GLP-1 wakes up. The snack-voice goes quiet.",
  },
  {
    n: "02",
    t: "Before meals",
    b: "Balance. The spike flattens. The 4pm crash never arrives.",
  },
  {
    n: "03",
    t: "The window",
    b: "Eat in a window your body already understands. No lists. No gym sentence.",
  },
];

export default function FeelGreatBlock() {
  return (
    <section id="feel-great" className="relative scroll-mt-24 px-[3.5%] py-24 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <p className="font-mono mb-6 text-[12px] tracking-[0.16em] text-muted uppercase">
          The Feel Great System · 12 seconds
        </p>
        <h2 className="font-display max-w-[18ch] text-[clamp(48px,8vw,104px)]">
          Two drinks.
          <br />
          One window.
        </h2>
        <p className="font-neue mt-[72px] max-w-[36ch] text-[20px] leading-[1.35] md:text-[24px]">
          Unimate in the morning. Balance before you eat. An eating window. That is the system.
        </p>
        <div className="mt-16 grid gap-10 border-t border-black/[0.07] md:grid-cols-3 md:gap-0">
          {steps.map((s, i) => (
            <article
              key={s.n}
              className={`pt-10 ${i > 0 ? "border-t border-black/[0.07] md:border-t-0 md:border-l md:pl-10" : "md:pr-10"}`}
            >
              <p className="font-mono mb-6 text-[12px] tracking-[0.14em] text-brick">{s.n}</p>
              <h3 className="font-display mb-8 text-[32px] sm:text-[40px]">{s.t}</h3>
              <p className="max-w-[32ch] text-[16px] leading-[1.5] text-muted">{s.b}</p>
            </article>
          ))}
        </div>
        <a href={waReset} target="_blank" rel="noopener noreferrer" className="btn-brick mt-16 inline-flex">
          Start my 90-Day Reset
        </a>
      </div>
    </section>
  );
}
