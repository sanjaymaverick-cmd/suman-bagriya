import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { DISCLOSURE, IG, ORDER, SAATH, WA, waEarn, waReset, waSaath } from "@/lib/links";

const offerings = [
  {
    tag: "METABOLIC RESET • 90 DAYS",
    title: "The Reset",
    body: "Unimate + Balance, a plan you can live with, and Suman on WhatsApp. The 90-day double guarantee.",
    photo: "/photos/suman-product.jpg",
    href: waReset,
    cta: "Start the Reset",
  },
  {
    tag: "FREE FOR CLIENTS • THE HOUSE",
    title: "Saath",
    body: "Workouts, weigh-ins, streaks, the library — one private house tracker. Together, not alone.",
    photo: "/photos/suman-gym.jpg",
    href: SAATH,
    cta: "Look inside",
  },
  {
    tag: "PARTNER PATH • BUILD",
    title: "Build with me",
    body: "Five minutes on WhatsApp. No pressure, no pitch deck — just whether it fits.",
    photo: "/photos/suman-blazer.jpg",
    href: waEarn,
    cta: "Ask Suman",
  },
];

const proof = [
  "/photos/proof/proof-02.png",
  "/photos/proof/proof-06.png",
  "/photos/proof/proof-11.png",
  "/photos/proof/proof-16.jpg",
  "/photos/proof/proof-21.png",
  "/photos/proof/proof-26.jpg",
  "/photos/proof/proof-29.png",
  "/photos/proof/proof-32.jpg",
];

function Ticker() {
  const words = ["NO DIET", "NO COUNTING", "METABOLIC RESET", "GLP-1", "90 DAYS", "TOGETHER"];
  const row = [...words, ...words, ...words];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-[#0c0b0a] py-7">
      <div className="marquee-track gap-12">
        {row.map((w, i) => (
          <span key={`${w}-${i}`} className="font-editorial-serif flex items-center text-[40px] text-[#f3ede2]/85 italic sm:text-[56px]">
            <span className="px-2">{w}</span>
            <span className="px-6 text-brick not-italic">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Offerings() {
  return (
    <section id="offerings" className="bg-[#0c0b0a] px-[5%] py-24 text-[#f3ede2] md:py-32">
      <div className="mx-auto max-w-[1320px]">
        <p className="font-mono mb-4 text-[11px] tracking-[0.2em] text-[#f3ede2]/50 uppercase">What's inside</p>
        <h2 className="font-editorial-serif mb-16 max-w-[16ch] text-[13vw] leading-[0.92] sm:text-[7vw] lg:text-[4.6vw]">
          Three doors. <span className="italic text-brick">One house.</span>
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {offerings.map((o) => (
            <a
              key={o.title}
              href={o.href}
              target={o.href.startsWith("http") ? "_blank" : undefined}
              rel={o.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[18px] border border-white/10 p-7"
            >
              <img
                src={o.photo}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-55 grayscale transition duration-500 group-hover:opacity-80 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a] via-[#0c0b0a]/40 to-transparent" />
              <div className="relative">
                <p className="font-mono mb-4 text-[10px] tracking-[0.16em] text-brick uppercase">{o.tag}</p>
                <h3 className="font-editorial-serif mb-3 text-[40px] leading-[0.95]">{o.title}</h3>
                <p className="max-w-[30ch] text-[14px] leading-[1.5] text-[#f3ede2]/70">{o.body}</p>
                <span className="font-mono mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.14em] text-[#f3ede2] uppercase">
                  {o.cta} <span className="transition group-hover:translate-x-1">→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultsStrip() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const flow = (clientX: number) => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    const rect = wrap.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const max = track.scrollWidth - wrap.clientWidth;
    if (max <= 0) return;
    track.style.transform = `translate3d(-${ratio * max}px,0,0)`;
  };

  return (
    <section id="results" className="bg-[#0c0b0a] pb-24 text-[#f3ede2] md:pb-32">
      <div className="mx-auto max-w-[1320px] px-[5%]">
        <p className="font-mono mb-4 text-[11px] tracking-[0.2em] text-[#f3ede2]/50 uppercase">Results, not promises</p>
        <h2 className="font-editorial-serif mb-12 max-w-[18ch] text-[9vw] leading-[0.95] sm:text-[5vw] lg:text-[3.2vw]">
          The bloodwork <span className="italic text-brick">talks back.</span>
        </h2>
        <p className="font-mono mb-6 text-[10px] tracking-[0.16em] text-[#f3ede2]/35 uppercase">
          Move your cursor across the strip
        </p>
      </div>
      <div
        ref={wrapRef}
        onMouseMove={(e) => flow(e.clientX)}
        onTouchMove={(e) => flow(e.touches[0].clientX)}
        className="relative overflow-hidden px-[5%] pb-2"
      >
        <div ref={trackRef} className="flex w-max gap-3 transition-transform duration-300 ease-out will-change-transform">
          {proof.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="h-[260px] w-[200px] flex-none rounded-[10px] object-cover grayscale transition duration-500 hover:grayscale-0 md:h-[340px] md:w-[260px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const houseFeatures = [
  { t: "Today", b: "The session, the weigh-in, the check-in — one screen, not five apps." },
  { t: "Workouts", b: "Guided sessions with rest timers, last weights remembered, PRs marked." },
  { t: "The plan", b: "A week you can live with. Move a day. Rest a day. The house remembers." },
  { t: "Weight", b: "A private chart from where you are to the line you set. No public feed." },
  { t: "Library", b: "A thousand-plus exercises with demos. Body-weight or the gym." },
  { t: "Streaks", b: "The run of days, for when willpower thins. Together, not alone." },
];

function SaathBlock() {
  return (
    <section id="saath" className="scroll-mt-24 bg-[#0c0b0a] px-[5%] pb-24 text-[#f3ede2] md:pb-32">
      <div className="mx-auto max-w-[1320px] border-t border-white/10 pt-20">
        <p className="font-mono mb-6 text-[11px] tracking-[0.2em] text-[#f3ede2]/50 uppercase">
          The tracker · free for clients
        </p>
        <div className="flex flex-wrap items-end gap-6">
          <img src="/brand/saath-mark-v2.svg" alt="" width="68" height="68" className="rounded-[17px]" />
          <h2 className="font-editorial-serif text-[clamp(48px,8vw,104px)] leading-[0.88]">
            Saath<span className="text-brick">.</span>
          </h2>
        </div>
        <p className="mt-10 max-w-[44ch] text-[18px] leading-[1.55] text-[#f3ede2]/70 md:text-[21px]">
          <span className="italic">साथ</span> — together. The exercise and gym tracker every client gets a free
          seat in. Set the line while you still weigh more than it, then log your way down to it.
        </p>

        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {houseFeatures.map((f) => (
            <article key={f.t} className="border-t border-white/10 pt-6">
              <h3 className="font-editorial-serif mb-3 text-[26px] leading-[1]">{f.t}</h3>
              <p className="max-w-[32ch] text-[14.5px] leading-[1.55] text-[#f3ede2]/55">{f.b}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link to="/saath" className="btn-dark-solid">
            Open the house
          </Link>
          <a href={waSaath} target="_blank" rel="noopener noreferrer" className="btn-dark-line">
            Ask for a seat
          </a>
        </div>
      </div>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section id="start" className="bg-[#0c0b0a] px-[5%] pt-8 pb-28 text-[#f3ede2] md:pb-40">
      <div className="mx-auto max-w-[1320px] border-t border-white/10 pt-16 md:pt-24">
        <h2 className="font-editorial-serif max-w-[20ch] text-[13vw] leading-[0.92] sm:text-[8vw] lg:text-[5.6vw]">
          Let's start the
          <br />
          <span className="italic text-brick">reset,</span> together.
        </h2>
        <div className="mt-12 flex flex-wrap gap-4">
          <a href={waReset} target="_blank" rel="noopener noreferrer" className="btn-dark-solid">
            Start the Reset
          </a>
          <a href={waSaath} target="_blank" rel="noopener noreferrer" className="btn-dark-line">
            Ask for a Saath seat
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0c0b0a] px-[5%] py-14 text-[#f3ede2]">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-6">
        <span className="font-editorial-serif text-[24px]">Suman Bagriya</span>
        <div className="flex flex-wrap gap-7 font-mono text-[11px] tracking-[0.12em] text-[#f3ede2]/60 uppercase">
          <a href={ORDER} target="_blank" rel="noopener noreferrer" className="hover:text-brick">
            Order
          </a>
          <a href={IG} target="_blank" rel="noopener noreferrer" className="hover:text-brick">
            Instagram
          </a>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="hover:text-brick">
            WhatsApp
          </a>
          <a href={DISCLOSURE} target="_blank" rel="noopener noreferrer" className="hover:text-brick">
            Affiliate disclosure
          </a>
        </div>
      </div>
      <p className="font-mono mx-auto mt-8 max-w-[1320px] text-[10px] leading-[1.6] text-[#f3ede2]/35">
        V2 — an editorial design exploration, running alongside the original site. © 2026
      </p>
    </footer>
  );
}

export { Ticker, Offerings, ResultsStrip, SaathBlock, ClosingCTA, Footer };
