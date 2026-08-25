import { useState } from "react";
import { Link } from "@tanstack/react-router";
import V2Canvas, { type CanvasItem } from "@/components/v2/V2Canvas";
import { ORDER, SAATH, waEarn, waReset, waSaath } from "@/lib/links";

/** Every tile earns its place: her own result, the products, the protocol, or a client's proof. */
const items: CanvasItem[] = [
  {
    id: "transform",
    kind: "photo",
    src: "/photos/suman-transform.jpg",
    title: "Her own reset",
    meta: "Before / after",
    blurb: "Suman ran the protocol on herself before she coached anyone through it.",
    href: waReset,
  },
  { id: "reset", kind: "note", title: "The Reset", meta: "90 days", href: waReset, tone: "#c45c32", blurb: "Unimate, Balance, an eating window, and Suman on WhatsApp for ninety days." },
  {
    id: "product",
    kind: "photo",
    src: "/photos/suman-product.jpg",
    title: "Unimate + Balance",
    meta: "The system",
    blurb: "Two food-based products. One activates GLP-1, the other flattens the blood-sugar spike.",
    href: ORDER,
  },
  { id: "proof-06", kind: "photo", src: "/photos/proof/proof-06.png", title: "Bloodwork", meta: "Client result" },
  { id: "nodiet", kind: "note", title: "No diet.", meta: "The premise", tone: "#1f4d3d", blurb: "No calorie counting, no food lists, no gym sentence. The system changes how the body reads the food already on the plate." },
  { id: "gym", kind: "photo", src: "/photos/suman-gym.jpg", title: "Training", meta: "Saath", href: SAATH, blurb: "Every client gets a free seat in Saath — the exercise and gym tracker." },
  { id: "proof-16", kind: "photo", src: "/photos/proof/proof-16.jpg", title: "Down 25 lbs", meta: "Client result" },
  { id: "saath", kind: "note", title: "Saath", meta: "The tracker", href: SAATH, tone: "#2b2118", blurb: "साथ — together. Workouts, weigh-ins, streaks and a thousand-exercise library. Free with her coaching." },
  { id: "form-01", kind: "photo", src: "/photos/suman-form-01.jpg", title: "Suman", meta: "Coach" },
  { id: "proof-21", kind: "photo", src: "/photos/proof/proof-21.png", title: "Markers", meta: "Client result" },
  { id: "glp1", kind: "note", title: "GLP-1", meta: "The mechanism", tone: "#3b3320", blurb: "Cravings and stubborn weight are usually low GLP-1 and insulin resistance — not a lack of willpower." },
  { id: "blazer", kind: "photo", src: "/photos/suman-blazer.jpg", title: "Suman", meta: "Senior Director, Unicity" },
  { id: "proof-26", kind: "photo", src: "/photos/proof/proof-26.jpg", title: "Client chat", meta: "Client result" },
  { id: "build", kind: "note", title: "Build with me", meta: "Partner path", href: waEarn, tone: "#c45c32", blurb: "Finished the ninety days and want to hand it on? Five minutes on WhatsApp, no pitch deck." },
  { id: "form-02", kind: "photo", src: "/photos/suman-form-02.jpg", title: "Suman", meta: "Coach" },
  { id: "proof-32", kind: "photo", src: "/photos/proof/proof-32.jpg", title: "90 days", meta: "Client result" },
  { id: "smile", kind: "photo", src: "/photos/suman-smile.jpg", title: "Suman", meta: "Coach" },
  { id: "form-03", kind: "photo", src: "/photos/suman-form-03.jpg", title: "Suman", meta: "Coach" },
];

export default function V2Hero() {
  const [open, setOpen] = useState<CanvasItem | null>(null);
  const [about, setAbout] = useState(false);

  return (
    <section id="gallery" className="relative">
      <V2Canvas items={items} onOpen={setOpen} />

      {/* corner rails, personaal-style */}
      <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-between px-[4%]">
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/45 uppercase">
          Recent work — Suman Bagriya
        </span>
        <span className="font-mono hidden text-[10px] tracking-[0.2em] text-white/45 uppercase sm:block">
          Metabolic health coach
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-8 flex items-end justify-between px-[4%]">
        <button
          onClick={() => setAbout(true)}
          className="font-mono rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[10px] tracking-[0.18em] text-white/80 uppercase backdrop-blur-sm hover:bg-white hover:text-black"
        >
          About
        </button>
        <a
          href={waReset}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono rounded-full bg-[#c45c32] px-5 py-2.5 text-[10px] tracking-[0.18em] text-white uppercase hover:bg-[#a34724]"
        >
          Start the Reset
        </a>
      </div>

      {/* item detail */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative max-h-[86vh] w-full max-w-[520px] overflow-hidden rounded-[18px] bg-[#111]"
            onClick={(e) => e.stopPropagation()}
          >
            {open.kind === "photo" ? (
              <img src={open.src} alt="" className="max-h-[64vh] w-full object-cover" />
            ) : (
              <div className="flex h-[300px] items-end p-8" style={{ background: open.tone ?? "#c45c32" }}>
                <span className="font-display text-[64px] leading-[0.9] text-white">{open.title}</span>
              </div>
            )}
            <div className="flex flex-col gap-5 p-6">
              <div>
                <p className="font-mono mb-2 text-[10px] tracking-[0.16em] text-white/50 uppercase">{open.meta}</p>
                <p className="text-[20px] text-white">{open.title}</p>
                {open.blurb && (
                  <p className="mt-3 max-w-[46ch] text-[14.5px] leading-[1.55] text-white/60">{open.blurb}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {open.href === SAATH ? (
                  <Link to="/saath" className="v2-pill-solid !px-5 !py-3 !text-[11px]">
                    Open Saath
                  </Link>
                ) : (
                  <a
                    href={open.href ?? waReset}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v2-pill-solid !px-5 !py-3 !text-[11px]"
                  >
                    {open.href === ORDER ? "Order the system" : "Talk to Suman"}
                  </a>
                )}
                <button onClick={() => setOpen(null)} className="v2-pill-line !px-5 !py-3 !text-[11px]">
                  Keep exploring
                </button>
              </div>
            </div>
            <button
              onClick={() => setOpen(null)}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* about panel */}
      {about && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
          onClick={() => setAbout(false)}
        >
          <div
            className="relative w-full max-w-[620px] rounded-[22px] bg-[#f3ede2] p-9 text-[#111]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-mono mb-6 text-[10px] tracking-[0.2em] text-[#111]/50 uppercase">About</p>
            <p className="text-[17px] leading-[1.6]">
              Suman Bagriya is a metabolic health coach. She works with people who have tried every diet and
              still feel tired — not with a willpower problem, but an insulin one. Unimate in the morning,
              Balance before meals, ninety days, and a private house called Saath where the work is remembered.
              No calorie counting. No food restrictions. A double guarantee on the bloodwork.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={waReset}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono rounded-full bg-[#111] px-5 py-3 text-[11px] tracking-[0.14em] text-[#f3ede2] uppercase"
              >
                Start the Reset
              </a>
              <a
                href={waSaath}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono rounded-full border border-[#111]/25 px-5 py-3 text-[11px] tracking-[0.14em] uppercase"
              >
                Ask for a seat
              </a>
            </div>
            <button
              onClick={() => setAbout(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#111]/10"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
