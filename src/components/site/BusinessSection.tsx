import { waApply } from "@/lib/links";

const model = [
  {
    k: "01",
    t: "From anywhere",
    b: "No office, no commute. A phone and a laptop is enough to build this.",
  },
  {
    k: "02",
    t: "Zero inventory",
    b: "Nothing in the garage. The company ships directly to customers worldwide.",
  },
  {
    k: "03",
    t: "Residual income",
    b: "Customers reorder monthly because the products work. You earn every time they do.",
  },
  {
    k: "04",
    t: "Full training",
    b: "Scripts, templates, weekly coaching, and a community that wants you to win.",
  },
];

const timing = [
  {
    t: "Health crisis",
    b: "Most adults are metabolically unhealthy and looking for natural solutions. Demand is already here.",
  },
  {
    t: "Economic shift",
    b: "Costs rise, job security thins. People need a second stream they can build on their own terms.",
  },
  {
    t: "Digital leverage",
    b: "The tools are already in the system. Reach more people with less theatre.",
  },
];

export default function BusinessSection() {
  return (
    <section id="business" className="relative scroll-mt-24 px-[3.5%] py-24 md:py-32">
      <div id="partner" className="mx-auto max-w-[1280px]">
        <p className="font-mono mb-6 text-[12px] tracking-[0.16em] text-muted uppercase">Build with Suman</p>
        <h2 className="font-display max-w-[16ch] text-[clamp(48px,8vw,110px)]">
          A health business from your phone.
        </h2>
        <div className="mt-[72px] grid gap-12 md:grid-cols-12">
          <p className="font-neue max-w-[34ch] text-[20px] leading-[1.35] md:col-span-5 md:text-[22px]">
            I built this while working full time. You can too.
          </p>
          <div className="space-y-6 text-[16px] leading-[1.55] text-muted md:col-span-6 md:col-start-7 md:text-[18px]">
            <p>
              Years in health and wellness, helping people lose weight with diet plans and supplements. The results
              never lasted. When the Feel Great System worked on her, it stopped being only a health solution.
            </p>
            <p className="text-ink">It was a business solution. Nobody she knew had heard of it. Everyone needed it.</p>
            <p className="font-mono text-[12px] tracking-[0.12em] text-ink uppercase">
              No experience needed · Mentorship included · 60+ countries
            </p>
          </div>
        </div>

        <div className="mt-24 grid gap-16 border-t border-black/[0.07] sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {model.map((item, i) => (
            <article
              key={item.k}
              className={`pt-10 lg:px-6 ${i > 0 ? "lg:border-l lg:border-black/[0.07]" : "lg:pl-0"}`}
            >
              <p className="font-mono mb-8 text-[12px] tracking-[0.14em] text-brick">{item.k}</p>
              <h3 className="font-display mb-[72px] text-[36px] sm:text-[44px]">{item.t}</h3>
              <p className="max-w-[28ch] text-[15px] leading-[1.5] text-muted">{item.b}</p>
            </article>
          ))}
        </div>

        <div className="mt-24 grid gap-16 border-t border-black/[0.07] md:grid-cols-3 md:gap-0">
          {timing.map((item, i) => (
            <article
              key={item.t}
              className={`pt-10 md:px-8 ${i > 0 ? "md:border-l md:border-black/[0.07]" : "md:pl-0"}`}
            >
              <h3 className="font-display mb-[72px] text-[36px] sm:text-[48px]">{item.t}</h3>
              <p className="max-w-[32ch] text-[16px] leading-[1.5] text-muted">{item.b}</p>
            </article>
          ))}
        </div>

        <div className="mt-24 rounded-[5px] bg-ink px-8 py-16 text-[#eeece9] md:px-16 md:py-24">
          <p className="font-mono mb-6 text-[12px] tracking-[0.16em] text-white/50 uppercase">Your next step</p>
          <h3 className="font-display mb-[72px] max-w-[14ch] text-[clamp(42px,7vw,84px)] text-white">
            Ready to build something meaningful?
          </h3>
          <p className="mb-10 max-w-[48ch] text-[18px] leading-[1.45] text-white/70">
            No experience, no large following, no spare hours required — a desire to help people and a willingness to
            learn. A five-minute WhatsApp chat. No pressure.
          </p>
          <a href={waApply} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-[5px] bg-[#eeece9] px-6 py-[14px] font-mono text-[13px] tracking-[0.14em] text-ink uppercase hover:bg-white">
            Apply to work with me
          </a>
          <p className="mt-10 max-w-[52ch] text-[12px] leading-[1.5] text-white/40">
            Income results vary. No specific outcomes are guaranteed. This is not a get-rich-quick opportunity. Success
            requires effort, consistency, and a willingness to learn.
          </p>
        </div>
      </div>
    </section>
  );
}
