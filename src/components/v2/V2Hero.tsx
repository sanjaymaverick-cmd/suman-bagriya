import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import V2Canvas, { type CanvasItem } from "@/components/v2/V2Canvas";
import { ORDER, SAATH, waEarn, waReset, waSaath } from "@/lib/links";

/** Every tile earns its place: her own result, the products, the protocol, or a client's proof.
 *
 *  The count matters as well as the content. The field wraps, so a tile index repeats every
 *  `items.length` cells; at 20 items on the 5-column phone grid that landed the same photo
 *  twice in the same column, two rows apart, which reads as a rendering fault rather than a
 *  wrap. At 22 no repeat is ever closer than one row *and* two columns. If tiles are added,
 *  22, 23, 27 and 30 keep that spacing; 21, 24, 25, 26 and 29 do not. */
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
  {
    id: "reset",
    kind: "note",
    title: "The Reset",
    meta: "90 days",
    href: waReset,
    tone: "#c45c32",
    blurb: "Unimate, Balance, an eating window, and Suman on WhatsApp for ninety days.",
  },
  {
    id: "product",
    kind: "photo",
    src: "/photos/suman-product.jpg",
    title: "Unimate + Balance",
    meta: "The system",
    blurb:
      "Two food-based products. One activates GLP-1, the other flattens the blood-sugar spike.",
    href: ORDER,
  },
  {
    id: "proof-06",
    kind: "photo",
    src: "/photos/proof/proof-06.png",
    title: "Bloodwork",
    meta: "Client result",
    blurb: "Markers retested after ninety days — the double guarantee rests on this.",
  },
  {
    id: "nodiet",
    kind: "note",
    title: "No diet.",
    meta: "The premise",
    tone: "#1f4d3d",
    blurb:
      "No calorie counting, no food lists, no gym sentence. The system changes how the body reads the food already on the plate.",
  },
  {
    id: "gym",
    kind: "photo",
    src: "/photos/suman-gym.jpg",
    title: "Training",
    meta: "Saath",
    href: SAATH,
    blurb: "Every client gets a free seat in Saath — the exercise and gym tracker.",
  },
  {
    id: "proof-16",
    kind: "photo",
    src: "/photos/proof/proof-16.jpg",
    title: "Down 25 lbs",
    meta: "Client result",
    blurb:
      "Prediabetic and menopausal. Fatigue gone, off all blood pressure medication in three months.",
  },
  {
    id: "saath",
    kind: "note",
    title: "Saath",
    meta: "The tracker",
    href: SAATH,
    tone: "#2b2118",
    blurb:
      "साथ — together. Workouts, weigh-ins, streaks and a thousand-exercise library. Free with her coaching.",
  },
  {
    id: "form-01",
    kind: "photo",
    src: "/photos/suman-form-01.jpg",
    title: "Five years in",
    meta: "Suman",
    blurb: "Five years in health and wellness, and every diet plan she tried before this one.",
  },
  {
    id: "proof-21",
    kind: "photo",
    src: "/photos/proof/proof-21.png",
    title: "165 lbs down",
    meta: "Client result",
    blurb: "No more sleep apnoea, prediabetes or high blood pressure.",
  },
  {
    id: "proof-19",
    kind: "photo",
    src: "/photos/proof/proof-19.png",
    title: "100 lbs, from a truck cab",
    meta: "Client result",
    blurb:
      "John did it as a long-haul driver — most of the day behind a steering wheel, eating truck-stop food.",
  },
  {
    id: "week-one",
    kind: "note",
    title: "Week one.",
    meta: "What moves first",
    tone: "#3b3320",
    blurb:
      "Most people notice cravings drop and energy lift inside the first week. Weight and bloodwork usually show by thirty days.",
  },
  {
    id: "glp1",
    kind: "note",
    title: "GLP-1",
    meta: "The mechanism",
    tone: "#3b3320",
    blurb:
      "Cravings and stubborn weight are usually low GLP-1 and insulin resistance — not a lack of willpower.",
  },
  {
    id: "blazer",
    kind: "photo",
    src: "/photos/suman-blazer.jpg",
    title: "Senior Director",
    meta: "Unicity, India",
    href: waEarn,
    blurb: "She also builds the business side with the people who want to hand the protocol on.",
  },
  {
    id: "proof-29",
    kind: "photo",
    src: "/photos/proof/proof-29.png",
    title: "Periods returned",
    meta: "Client result",
    blurb: "A PCOD client, two months in — inches down and a cycle back.",
  },
  {
    id: "build",
    kind: "note",
    title: "Build with me",
    meta: "Partner path",
    href: waEarn,
    tone: "#c45c32",
    blurb:
      "Finished the ninety days and want to hand it on? Five minutes on WhatsApp, no pitch deck.",
  },
  {
    id: "guarantee",
    kind: "note",
    title: "Bloodwork or refund.",
    meta: "The guarantee",
    href: waReset,
    tone: "#1f4d3d",
    blurb:
      "Test the markers before. Test them ninety days later. If they have not moved, the money comes back.",
  },
  {
    id: "form-02",
    kind: "photo",
    src: "/photos/suman-form-02.jpg",
    title: "In person, in India",
    meta: "Suman",
    blurb: "She coaches the protocol in person and on WhatsApp, from Mumbai.",
  },
  {
    id: "proof-32",
    kind: "photo",
    src: "/photos/proof/proof-32.jpg",
    title: "90 days",
    meta: "Client result",
    blurb: "One of Suman's mentees, start to finish.",
  },
  {
    id: "ozempic",
    kind: "note",
    title: "Not Ozempic.",
    meta: "The difference",
    tone: "#2b2118",
    blurb:
      "No injections. A plant-based protocol that supports the body's own GLP-1, at a fraction of the cost — and the weight does not come back when you stop.",
  },
  {
    id: "smile",
    kind: "photo",
    src: "/photos/suman-smile.jpg",
    title: "Ninety days later",
    meta: "Suman",
    blurb: "What the other side of the protocol looks like on the person who wrote it.",
  },
  {
    id: "form-03",
    kind: "photo",
    src: "/photos/suman-form-03.jpg",
    title: "Still holding",
    meta: "Suman",
    blurb: "Kept, not crash-lost. The reset changed the setting, not just the number.",
  },
];

export default function V2Hero() {
  const [open, setOpen] = useState<CanvasItem | null>(null);
  const [about, setAbout] = useState(false);

  return (
    <section id="gallery" className="relative">
      <V2Canvas items={items} onOpen={setOpen} />

      {/* The tiles carry the argument, but they drift — a visitor who lands mid-field saw
          only photographs and two small pills. The proposition is stated once, in place,
          over a scrim so it stays legible whatever photo pans under it. Non-interactive,
          so the drag still starts anywhere in this corner. */}
      {/* Two scrims: a broad one to sink the whole top of the field, and a tighter one down
          the left edge where the type actually sits. A photo tile can pan under the headline
          at any moment, so the text also carries its own shadow rather than trusting the
          gradient alone. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full max-w-[720px] bg-gradient-to-r from-black/85 via-black/45 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 top-24 flex items-start justify-between gap-6 px-[4%]">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-white/75 uppercase">
            Suman Bagriya — metabolic health coach
          </p>
          <h1
            className="font-display mt-4 max-w-[10ch] text-[clamp(36px,4.8vw,62px)] leading-[0.94] tracking-[-0.01em] text-white"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.75)" }}
          >
            No diet.
            <br />
            Ninety days.
          </h1>
          <p
            className="mt-4 max-w-[28ch] text-[14px] leading-[1.5] text-white/85 md:text-[15px]"
            style={{ textShadow: "0 1px 14px rgba(0,0,0,0.8)" }}
          >
            Bloodwork before and ninety days after — or your money back.
          </p>
        </div>
        <span className="font-mono hidden shrink-0 pt-1 text-[10px] tracking-[0.2em] text-white/60 uppercase md:block">
          Unicity · India
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-8 flex items-end justify-between px-[4%]">
        <button
          type="button"
          onClick={() => setAbout(true)}
          className="font-mono rounded-full border border-white/20 bg-black/50 px-4 py-2.5 text-[10px] tracking-[0.18em] text-white uppercase backdrop-blur-sm hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          About
        </button>
        <a
          href={waReset}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono rounded-full bg-[#ba532e] px-5 py-2.5 text-[10px] tracking-[0.18em] text-white uppercase hover:bg-[#a34724]"
        >
          Start the Reset
        </a>
      </div>

      {/* Radix owns focus trap, Escape, scroll lock and dialog semantics — the previous
          hand-rolled overlay had none of them. */}
      <Dialog.Root open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-[61] max-h-[86dvh] w-[calc(100%-2rem)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[18px] bg-[#111] focus:outline-none">
            {open && (
              <>
                {open.kind === "photo" ? (
                  <img
                    src={open.src}
                    alt={open.title}
                    className="max-h-[58dvh] w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-[260px] items-end p-8"
                    style={{ background: open.tone ?? "#c45c32" }}
                  >
                    <span className="font-display text-[64px] leading-[0.9] text-white">
                      {open.title}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-5 p-6">
                  <div>
                    <p className="font-mono mb-2 text-[10px] tracking-[0.16em] text-white/60 uppercase">
                      {open.meta}
                    </p>
                    <Dialog.Title className="text-[20px] text-white">{open.title}</Dialog.Title>
                    <Dialog.Description className="mt-3 max-w-[46ch] text-[14.5px] leading-[1.55] text-white/70">
                      {open.blurb ?? "Part of Suman's ninety-day metabolic reset."}
                    </Dialog.Description>
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
                        {open.href === ORDER
                          ? "Order the system"
                          : open.href === waEarn
                            ? "Talk about building"
                            : "Talk to Suman"}
                      </a>
                    )}
                    <Dialog.Close className="v2-pill-line !px-5 !py-3 !text-[11px]">
                      Keep exploring
                    </Dialog.Close>
                  </div>
                </div>
                <Dialog.Close
                  aria-label="Close"
                  className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X size={16} aria-hidden="true" />
                </Dialog.Close>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={about} onOpenChange={setAbout}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-[61] max-h-[86dvh] w-[calc(100%-2rem)] max-w-[620px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[22px] bg-[#f3ede2] p-9 text-[#111] focus:outline-none">
            <Dialog.Title className="font-mono mb-6 text-[10px] tracking-[0.2em] text-[#111]/60 uppercase">
              About
            </Dialog.Title>
            <Dialog.Description className="text-[17px] leading-[1.6]">
              Suman Bagriya is a metabolic health coach. She works with people who have tried every
              diet and still feel tired — not with a willpower problem, but an insulin one. Unimate
              in the morning, Balance before meals, ninety days, and a private house called Saath
              where the work is remembered. No calorie counting. No food restrictions. A double
              guarantee on the bloodwork.
            </Dialog.Description>
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
                className="font-mono rounded-full border border-[#111]/35 px-5 py-3 text-[11px] tracking-[0.14em] uppercase"
              >
                Ask for a seat
              </a>
            </div>
            <Dialog.Close
              aria-label="Close"
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#111]/10 hover:bg-[#111]/20"
            >
              <X size={16} aria-hidden="true" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
