import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import SiteNav from "@/components/site/SiteNav";
import PageGrid from "@/components/site/PageGrid";
import { DISCLOSURE, IG, ORDER, SAATH_DEMO, WA, waReset, waSaath } from "@/lib/links";

const SaathWalk = lazy(() => import("@/components/saath/SaathWalk"));

export const Route = createFileRoute("/saath")({
  component: SaathPage,
  head: () => ({
    meta: [
      { title: "Saath — Suman Bagriya" },
      {
        name: "description",
        content:
          "Saath is Suman’s private house tracker. Every client gets free access — workouts, weight, plan, streaks. Together, not alone.",
      },
    ],
  }),
});

const features = [
  {
    k: "01",
    t: "Today",
    b: "What to do this morning. The session, the weigh-in, the check-in — one screen, not five apps.",
  },
  {
    k: "02",
    t: "Workouts",
    b: "Guided sessions with rest timers, last weights remembered, PRs marked. You train. It keeps the book.",
  },
  {
    k: "03",
    t: "The plan",
    b: "A week you can actually live with. Move a day. Rest a day. The house remembers.",
  },
  {
    k: "04",
    t: "Weight",
    b: "75 kg now. 60 kg is the line. A private chart. No public feed.",
  },
  {
    k: "05",
    t: "The library",
    b: "More than a thousand exercises with demos. Body-weight or the gym. Search, filter, save.",
  },
  {
    k: "06",
    t: "Streaks",
    b: "The run of days when willpower thins. Together, not alone — Suman’s people in one house.",
  },
];

const photos = [
  "/photos/p2.jpg",
  "/photos/p5.jpg",
  "/photos/p8.jpg",
  "/photos/p12.jpg",
  "/photos/p15.jpg",
  "/photos/p18.jpg",
  "/photos/proof/proof-12.jpg",
  "/photos/proof/proof-16.jpg",
  "/photos/proof/proof-23.jpg",
  "/photos/proof/proof-26.jpg",
  "/photos/proof/proof-30.jpg",
  "/photos/proof/proof-32.jpg",
];

function SaathPage() {
  return (
    <main className="relative min-h-screen bg-paper text-ink">
      <SiteNav current="saath" />
      <Suspense
        fallback={
          <div className="flex h-[70vh] items-center justify-center bg-[#1c110c] font-mono text-[12px] tracking-[0.2em] text-[#e8c37a]">
            OPENING THE HOUSE
          </div>
        }
      >
        <SaathWalk />
      </Suspense>

      <div className="relative bg-paper">
        <div className="grain" aria-hidden="true" />
        <PageGrid />

        <section className="px-[3.5%] pt-20 pb-10 md:pt-28">
          <div className="mx-auto max-w-[1280px]">
            <p className="font-mono mb-6 text-[12px] tracking-[0.16em] text-muted uppercase">The house tracker</p>
            <div className="flex flex-wrap items-end gap-6">
              <img src="/brand/saath-mark.svg" alt="" width="72" height="72" className="rounded-[16px]" />
              <h1 className="font-display text-[clamp(72px,14vw,180px)] leading-[0.8]">Saath.</h1>
            </div>
            <p className="font-neue mt-[72px] max-w-[22ch] text-[22px] leading-[1.3] md:text-[28px]">
              Every client gets a seat. Free.
            </p>
            <p className="mt-8 max-w-[46ch] text-[16px] leading-[1.55] text-muted md:text-[18px]">
              साथ — together. Set 60 kg as the line while you still weigh 75. Load the starter week. Train today.
              Log the set. Watch the curve fall. Suman’s people, in one private house.
            </p>
          </div>
        </section>

        <section id="house-live" className="scroll-mt-24 px-[3.5%] py-16 md:py-24">
          <div className="mx-auto max-w-[1280px]">
            <p className="font-mono mb-6 text-[12px] tracking-[0.16em] text-muted uppercase">Live demo</p>
            <h2 className="font-display mb-6 max-w-[14ch] text-[clamp(42px,7vw,88px)]">The house, inside this page.</h2>
            <p className="mb-10 max-w-[46ch] text-[16px] leading-[1.55] text-muted md:text-[18px]">
              This is the real app — not a screenshot. Demo seat only. After Suman confirms, the administrator
              sends your login.
            </p>
            <div className="saath-embed">
              <iframe
                src={`${SAATH_DEMO}#/home`}
                title="Saath house tracker"
                loading="lazy"
                allow="fullscreen"
              />
            </div>
            <a href={SAATH_DEMO} className="btn-ghost mt-8">
              Open full screen
            </a>
          </div>
        </section>

        <section className="px-[3.5%] py-8">
          <div className="mx-auto max-w-[1280px] border-y border-black/[0.07] py-10">
            <p className="font-mono mb-3 text-[11px] tracking-[0.16em] text-brick uppercase">How a seat is opened</p>
            <ol className="grid gap-10 md:grid-cols-3">
              <li>
                <p className="font-mono mb-4 text-[11px] tracking-[0.14em] text-muted">01</p>
                <h2 className="font-display mb-6 text-[32px] leading-[0.95]">Start with her</h2>
                <p className="max-w-[28ch] text-[15px] leading-[1.5] text-muted">
                  The Reset, or build with me — five minutes on WhatsApp. Same doors as always.
                </p>
              </li>
              <li>
                <p className="font-mono mb-4 text-[11px] tracking-[0.14em] text-muted">02</p>
                <h2 className="font-display mb-6 text-[32px] leading-[0.95]">She confirms</h2>
                <p className="max-w-[28ch] text-[15px] leading-[1.5] text-muted">
                  Suman says yes. You are in the house. Not a waitlist. A person.
                </p>
              </li>
              <li>
                <p className="font-mono mb-4 text-[11px] tracking-[0.14em] text-muted">03</p>
                <h2 className="font-display mb-6 text-[32px] leading-[0.95]">Login arrives</h2>
                <p className="max-w-[28ch] text-[15px] leading-[1.5] text-muted">
                  The administrator sends your ID and password. Then Saath is yours for the 90 days — and after.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="px-[3.5%] py-24">
          <div className="mx-auto max-w-[1280px]">
            <p className="font-mono mb-6 text-[12px] tracking-[0.16em] text-muted uppercase">Inside the house</p>
            <h2 className="font-display mb-[72px] max-w-[14ch] text-[clamp(42px,7vw,88px)]">What it holds.</h2>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <article key={f.k} className="border-t border-black/[0.07] pt-8">
                  <p className="font-mono mb-4 text-[11px] tracking-[0.14em] text-brick">{f.k}</p>
                  <h3 className="font-display mb-6 text-[28px] leading-[0.95] sm:text-[32px]">{f.t}</h3>
                  <p className="max-w-[32ch] text-[15px] leading-[1.5] text-muted">{f.b}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-[3.5%] py-24">
          <div className="mx-auto max-w-[1280px]">
            <p className="font-mono mb-6 text-[12px] tracking-[0.16em] text-muted uppercase">The people already in it</p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
              {photos.map((src, i) => (
                <figure key={src} className={i === 0 || i === 7 ? "md:col-span-2 md:row-span-2" : ""}>
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ aspectRatio: i === 0 || i === 7 ? "1 / 1" : "4 / 5" }}
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="px-[3.5%] py-24">
          <div className="mx-auto max-w-[1280px]">
            <h2 className="font-display mb-[72px] max-w-[16ch] text-[clamp(42px,7vw,88px)]">
              Free with her. Not for sale.
            </h2>
            <div className="grid gap-12 md:grid-cols-12">
              <p className="font-neue max-w-[28ch] text-[20px] leading-[1.35] md:col-span-5 md:text-[24px]">
                If you are Suman’s client, Saath is already yours. No extra fee. No subscription.
              </p>
              <div className="space-y-6 text-[16px] leading-[1.55] text-muted md:col-span-6 md:col-start-7">
                <p>
                  The 90-Day Reset is the door. WhatsApp is how you knock. After she confirms, the house
                  administrator sends the login — quietly, by hand.
                </p>
                <p className="text-ink">
                  Until then you can look around a demo of the house. Your real seat is the one with your name on it.
                </p>
                <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
                  <a href={waReset} target="_blank" rel="noopener noreferrer" className="btn-brick">
                    Start the Reset
                  </a>
                  <a href={waSaath} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                    Ask for a seat
                  </a>
                  <a href={SAATH_DEMO} className="btn-ghost">
                    Look around
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-black/[0.07] px-[3.5%] py-16">
          <div className="mx-auto max-w-[1280px]">
            <Link to="/" className="font-display text-[clamp(40px,8vw,96px)] leading-[0.85]">
              Suman Bagriya
            </Link>
            <div className="mt-[72px] flex flex-wrap gap-8 font-mono text-[12px] tracking-[0.12em] uppercase">
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
            <p className="font-mono mt-10 max-w-[52ch] text-[11px] leading-[1.5] text-muted/70">
              Saath is a branded house built on openGym (AGPL). Login IDs are issued after Suman confirms. © 2026
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
