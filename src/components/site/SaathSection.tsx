import { SAATH, waReset } from "@/lib/links";

export default function SaathSection() {
  return (
    <section id="saath" className="relative scroll-mt-24 px-[3.5%] py-24 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <p className="font-mono mb-6 text-[12px] tracking-[0.16em] text-muted uppercase">
          Free for every client
        </p>
        <h2 className="font-display max-w-[12ch] text-[clamp(56px,10vw,128px)]">Saath.</h2>
        <div className="mt-[72px] grid gap-12 md:grid-cols-12">
          <p className="font-neue max-w-[28ch] text-[22px] leading-[1.3] md:col-span-5 md:text-[26px]">
            The house tracker. Together, not alone.
          </p>
          <div className="md:col-span-6 md:col-start-7">
            <p className="max-w-[42ch] text-[16px] leading-[1.55] text-muted md:text-[18px]">
              Workouts, weight, the week, the streak. Every one of Suman’s clients gets a seat — no extra fee.
              After she confirms, the administrator sends your login.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href={SAATH} className="btn-brick">
                See the house
              </a>
              <a href={waReset} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Start the Reset
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
