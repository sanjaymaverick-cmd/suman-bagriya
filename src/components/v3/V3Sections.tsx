import { useEffect, useRef } from "react";
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

/** Real results lead; the product and regulatory cards follow. Alt text carries the
 *  claim each card makes, because the claim is the reason the card is on the page. */
const proof = [
  {
    src: "/photos/proof/proof-16.jpg",
    alt: "Client testimonial: Laurie G, prediabetic and menopausal with hot flashes, insomnia and weight gain. Before and after photos. Lost 25lbs in three months, fatigue and foot pain gone, off all blood pressure medication.",
  },
  {
    src: "/photos/proof/proof-21.png",
    alt: "Client testimonial: before and after photos of a man with the caption 165 lbs down, no more sleep apnea, prediabetes or high blood pressure.",
  },
  {
    src: "/photos/proof/proof-29.png",
    alt: "WhatsApp conversation with a client who has PCOD, reporting that her periods returned after two months on Unimate and Balance, with inches lost even where the scale had not moved.",
  },
  {
    src: "/photos/proof/proof-32.jpg",
    alt: "Before and after photos of one of Suman's mentees, showing substantial fat loss over the programme.",
  },
  {
    src: "/photos/proof/proof-26.jpg",
    alt: "Before and after portraits of a female client showing visible change in her face over the programme.",
  },
  {
    src: "/photos/proof/proof-02.png",
    alt: "Diagram of the Feel Great System: a Unimate sachet plus a Balance sachet plus a time-based eating pattern.",
  },
  {
    src: "/photos/proof/proof-11.png",
    alt: "Unimate and Balance boxes beside a phone notification from a health coach asking how the protocol is going.",
  },
  {
    src: "/photos/proof/proof-06.png",
    alt: "Health Canada mark, indicating the products are regulator-approved for sale in Canada.",
  },
];

function Ticker() {
  const words = ["NO DIET", "NO COUNTING", "METABOLIC RESET", "GLP-1", "90 DAYS", "TOGETHER"];
  // .marquee-track animates to translateX(-50%), so the track must be an EVEN number of
  // copies or the loop restarts mid-phrase. It was three copies, which visibly jumped
  // every 38s. Four keeps the seam invisible and still covers an ultrawide viewport.
  const row = [...words, ...words, ...words, ...words];
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-white/10 bg-[#0c0b0a] py-7">
      <div className="marquee-track gap-12">
        {row.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="font-editorial-serif flex items-center text-[40px] text-[#f3ede2]/85 italic sm:text-[56px]"
          >
            <span className="px-2">{w}</span>
            <span className="px-6 text-brick not-italic">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** The three cards are identical except for their wrapper: two go out to WhatsApp, one
 *  stays in the app. The internal one was a plain <a>, which threw away client-side
 *  routing on the heaviest route on the site. Focus rings are explicit because the UA
 *  default ring is close to invisible on a near-black card. */
const cardClass =
  "group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[18px] border border-white/10 p-7 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3ede2]";

function OfferingCard({ o }: { o: (typeof offerings)[number] }) {
  const inner = (
    <>
      <img
        src={o.photo}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-55 grayscale transition duration-500 group-hover:opacity-80 group-hover:grayscale-0 group-focus-visible:opacity-80 group-focus-visible:grayscale-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a] via-[#0c0b0a]/40 to-transparent" />
      <div className="relative">
        <p className="font-mono mb-4 text-[10px] tracking-[0.16em] text-brick uppercase">{o.tag}</p>
        <h3 className="font-editorial-serif mb-3 text-[40px] leading-[0.95]">{o.title}</h3>
        <p className="max-w-[30ch] text-[14px] leading-[1.5] text-[#f3ede2]/70">{o.body}</p>
        <span className="font-mono mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.14em] text-[#f3ede2] uppercase">
          {o.cta}{" "}
          <span aria-hidden="true" className="transition group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </>
  );

  if (o.href.startsWith("http")) {
    return (
      <a href={o.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
        {inner}
      </a>
    );
  }
  // SAATH is the only internal destination in the list, and Link's `to` is typed
  // against the route tree, so it is named rather than threaded through as a string.
  return (
    <Link to="/saath" className={cardClass}>
      {inner}
    </Link>
  );
}

function Offerings() {
  return (
    <section
      id="offerings"
      className="scroll-mt-24 bg-[#0c0b0a] px-[5%] py-24 text-[#f3ede2] md:py-32"
    >
      <div className="mx-auto max-w-[1320px]">
        <p className="font-mono mb-4 text-[11px] tracking-[0.2em] text-[#f3ede2]/60 uppercase">
          What's inside
        </p>
        {/* The 16ch measure was breaking this as "Three doors. One / house." from 768px
            up, splitting the italic accent across two lines and leaving a five-letter
            widow. The break is now explicit, so the accent always reads as one phrase. */}
        <h2 className="font-editorial-serif mb-16 text-[clamp(38px,10.5vw,84px)] leading-[0.92]">
          Three doors.
          <br />
          <span className="text-brick italic">One house.</span>
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {offerings.map((o) => (
            <OfferingCard key={o.title} o={o} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultsStrip() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<number | null>(null);
  const rafRef = useRef(0); // 0 doubles as "no frame pending" — rAF never returns 0.

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Ease toward the cursor instead of snapping to it. A bare scrollLeft write on every
  // mousemove reads as a teleport; a ~12%-per-frame lerp reads as the strip following you.
  const step = () => {
    const wrap = wrapRef.current;
    const target = targetRef.current;
    if (!wrap || target === null) {
      rafRef.current = 0;
      return;
    }
    const advance = (target - wrap.scrollLeft) * 0.12;
    // scrollLeft snaps to whole pixels, so once a frame's advance falls under 1px the
    // lerp stops making progress and the loop would spin forever a few px short of the
    // target. Close the gap in one write and stand down instead.
    if (Math.abs(advance) < 1) {
      wrap.scrollLeft = target;
      rafRef.current = 0;
      return;
    }
    wrap.scrollLeft += advance;
    rafRef.current = requestAnimationFrame(step);
  };

  // Driving native scrollLeft rather than a transform keeps the cursor-flow as a
  // progressive enhancement: touch swipe, trackpad and keyboard arrows all still work
  // because the element is genuinely scrollable. Fine pointers only, so a tap on a
  // touchscreen doesn't fling the strip to wherever the finger happened to land.
  const flow = (clientX: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (!window.matchMedia?.("(pointer: fine)").matches) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const rect = wrap.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const max = wrap.scrollWidth - wrap.clientWidth;
    if (max <= 0) return;
    targetRef.current = ratio * max;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(step);
  };

  // Any deliberate input — wheel, trackpad, arrow keys — takes the wheel back from the
  // cursor-flow, so the two never fight over scrollLeft.
  const release = () => {
    targetRef.current = null;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  };

  return (
    <section id="results" className="scroll-mt-24 bg-[#0c0b0a] pb-24 text-[#f3ede2] md:pb-32">
      <div className="mx-auto max-w-[1320px] px-[5%]">
        <p className="font-mono mb-4 text-[11px] tracking-[0.2em] text-[#f3ede2]/60 uppercase">
          Results, not promises
        </p>
        {/* Was breaking as "The bloodwork talks / back." at every width from 375px up —
            a five-letter widow that also cut the italic accent in half. */}
        <h2 className="font-editorial-serif mb-12 text-[clamp(30px,7vw,60px)] leading-[0.95]">
          The bloodwork
          <br />
          <span className="text-brick italic">talks back.</span>
        </h2>
        <p className="font-mono mb-6 text-[10px] tracking-[0.16em] text-[#f3ede2]/65 uppercase">
          Move your cursor across the strip, or swipe
        </p>
      </div>
      <div
        ref={wrapRef}
        onMouseMove={(e) => flow(e.clientX)}
        onMouseLeave={release}
        onWheel={release}
        onKeyDown={release}
        tabIndex={0}
        role="group"
        aria-label="Client results. Scroll or use the arrow keys to move through them."
        className="scrollbar-none relative overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#f3ede2]/60"
      >
        {/* Gutters live on the track, not the scroll container: Chrome drops a scroll
            container's inline-end padding from its scrollable area, so the last card
            used to end flush against the viewport edge. */}
        <div className="flex w-max gap-3 px-[5%]">
          {proof.map((p) => (
            <img
              key={p.src}
              src={p.src}
              alt={p.alt}
              loading="lazy"
              decoding="async"
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
        <p className="font-mono mb-6 text-[11px] tracking-[0.2em] text-[#f3ede2]/60 uppercase">
          The tracker · free for clients
        </p>
        <div className="flex flex-wrap items-end gap-6">
          <img
            src="/brand/saath-mark-v2.svg"
            alt=""
            width="68"
            height="68"
            className="rounded-[17px]"
          />
          {/* Same clamp as Offerings and the closing CTA — one display tier, three uses. */}
          <h2 className="font-editorial-serif text-[clamp(38px,10.5vw,84px)] leading-[0.88]">
            Saath<span className="text-brick">.</span>
          </h2>
        </div>
        <p className="mt-10 max-w-[44ch] text-[18px] leading-[1.55] text-[#f3ede2]/70 md:text-[21px]">
          <span className="italic">साथ</span> — together. The exercise and gym tracker every client
          gets a free seat in. Set the line while you still weigh more than it, then log your way
          down to it.
        </p>

        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {houseFeatures.map((f) => (
            <article key={f.t} className="border-t border-white/10 pt-6">
              <h3 className="font-editorial-serif mb-3 text-[26px] leading-[1]">{f.t}</h3>
              <p className="max-w-[32ch] text-[14.5px] leading-[1.55] text-[#f3ede2]/65">{f.b}</p>
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
    <section id="start" className="scroll-mt-24 bg-[#0c0b0a] px-[5%] pb-28 text-[#f3ede2] md:pb-40">
      {/* pt-20 after the rule matches Saath's, so both hairlines sit on the same rhythm. */}
      <div className="mx-auto max-w-[1320px] border-t border-white/10 pt-20">
        {/* "reset, together." was the widest string on the page and sat 5px inside a
            375px viewport — one missing webfont away from a horizontal scrollbar. */}
        <h2 className="font-editorial-serif text-[clamp(38px,10.5vw,84px)] leading-[0.92]">
          Let's start the
          <br />
          <span className="text-brick italic">reset,</span> together.
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
          <a
            href={ORDER}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target hover:text-brick"
          >
            Order
          </a>
          <a
            href={IG}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target hover:text-brick"
          >
            Instagram
          </a>
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target hover:text-brick"
          >
            WhatsApp
          </a>
          <a
            href={DISCLOSURE}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target hover:text-brick"
          >
            Affiliate disclosure
          </a>
        </div>
      </div>
      <p className="font-mono mx-auto mt-8 max-w-[1320px] text-[10px] leading-[1.6] text-[#f3ede2]/35">
        V3 — an editorial design exploration, running alongside the original site. © 2026
        <br />
        Designed and developed by Sanjay Bagriya
      </p>
    </footer>
  );
}

export { Ticker, Offerings, ResultsStrip, SaathBlock, ClosingCTA, Footer };
