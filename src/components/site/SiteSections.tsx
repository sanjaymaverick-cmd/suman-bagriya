import { useState } from "react";
import PhotoLibrary from "@/components/site/PhotoLibrary";
import ProductSection from "@/components/site/ProductSection";
import BusinessSection from "@/components/site/BusinessSection";
import FeelGreatBlock from "@/components/site/FeelGreatBlock";
import { DISCLOSURE, IG, ORDER, WA, waConnect, waEarn, waReset, waResetHi } from "@/lib/links";

const faqs = [
  {
    q: "What exactly will I be taking?",
    a: "Two food-based products: Unimate (a plant-based yerba mate concentrate that activates GLP-1) and Balance (a patented fiber matrix that flattens blood sugar spikes before meals). Together they target insulin resistance — the root behind weight gain, high blood sugar, low energy, and cholesterol issues.",
  },
  {
    q: "Do I have to change my diet?",
    a: "No. The system modifies how the body processes the food already being eaten. Most people make better choices naturally as cravings drop — but no diet, no calorie counting, no food restrictions are required.",
  },
  {
    q: "How fast will I feel a difference?",
    a: "Most people notice cravings drop and energy lift within the first week. Visible changes in weight, bloodwork, and how clothes fit typically show within 30 days. Stay consistent for 90 days for the fuller metabolic shift.",
  },
  {
    q: "I’m on medication — is this safe?",
    a: "The products are food-based. Always consult your doctor if you are on medication for blood sugar, blood pressure, cholesterol, or thyroid. This is not medical advice and does not replace a clinician.",
  },
  {
    q: "How is this different from Ozempic?",
    a: "Ozempic is an injection that mimics GLP-1 — stop, and the weight often returns. This is a plant-based protocol that supports the body’s own GLP-1. No injections. A fraction of the theatre, less than a couple of coffees a day.",
  },
  {
    q: "What if it doesn’t work for me?",
    a: "The 90-day double guarantee. Test bloodwork before. Test it 90 days later. If the markers have not improved — full refund.",
  },
  {
    q: "What if I want to help others too?",
    a: "There is a partner path. Apply to work with Suman — a five-minute WhatsApp conversation, no pressure.",
  },
];

function Marquee() {
  const items = ["UNIMATE", "BALANCE", "GLP-1", "RESET", "NO COUNTING", "90 DAYS"];
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-black/[0.07] py-6">
      <div className="marquee-track gap-10">
        {row.map((w, i) => (
          <span key={`${w}-${i}`} className="font-display flex items-center text-[42px] text-ink/80 sm:text-[64px] md:text-[80px]">
            <span className="px-2">{w}</span>
            <span className="px-5 text-brick">+</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SiteSections() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="relative z-10 bg-paper text-ink">
      <section id="about" className="relative scroll-mt-24 px-[3.5%] py-24 md:py-36">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-mono mb-6 text-[12px] tracking-[0.16em] text-muted uppercase">About Suman</p>
          <h2 className="font-display max-w-[18ch] text-[clamp(56px,10vw,128px)]">
            Not a textbook.
            <br />
            A life lived.
          </h2>
          <div className="mt-[72px] grid gap-12 md:grid-cols-12 md:gap-8">
            <p className="font-neue max-w-[34ch] text-[20px] leading-[1.35] md:col-span-5 md:text-[22px]">
              Five years in health and wellness. Diet plans that never held. Then a system that worked on her first.
            </p>
            <div className="space-y-6 text-[16px] leading-[1.55] text-muted md:col-span-6 md:col-start-7 md:text-[18px]">
              <p>
                For years the cycle was the same: try a diet, lose a little, regain more, feel worse. The advice never
                addressed why the body was holding on so tightly.
              </p>
              <p>
                The Feel Great System — Unimate and Balance — made the picture clear. Cravings, crashes, stubborn
                weight: often insulin and GLP-1, not a lack of willpower.
              </p>
              <p className="text-ink">
                Unicity Senior Director, India. She coaches the protocol in person, and builds a digital health
                business with the people ready to share it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FeelGreatBlock />
      <Marquee />
      <PhotoLibrary />
      <ProductSection />

      <section id="faq" className="relative scroll-mt-24 px-[3.5%] py-24 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-mono mb-4 text-[12px] tracking-[0.16em] text-muted uppercase">Questions worth asking</p>
          <h2 className="font-display mb-[72px] max-w-[16ch] text-[clamp(42px,7vw,80px)]">before we begin.</h2>
          <div className="border-t border-black/[0.07]">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q} className="border-b border-black/[0.07]">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-6 py-7 text-left"
                  >
                    <span className="font-neue text-[20px] leading-[1.25] md:text-[26px]">{item.q}</span>
                    <span className="font-mono mt-1 shrink-0 text-[18px] text-brick">{isOpen ? "–" : "+"}</span>
                  </button>
                  {isOpen && <p className="max-w-[62ch] pb-8 text-[16px] leading-[1.55] text-muted">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <BusinessSection />

      <section id="connect" className="relative scroll-mt-24 px-[3.5%] py-24 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="font-display mb-[72px] text-[clamp(56px,10vw,120px)]">Two doors.</h2>
          <p className="mb-12 max-w-[42ch] text-[20px] leading-[1.4] text-muted">
            Start the 90-Day Reset, or ask about building with Suman. Five minutes on WhatsApp. No pressure.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <a
              href={waReset}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[5px] border border-black/10 bg-ink p-8 text-paper transition-colors hover:bg-brick md:p-10"
            >
              <p className="font-mono mb-6 text-[11px] tracking-[0.16em] text-white/50">01 — FOR YOU</p>
              <h3 className="font-display mb-4 text-[36px] sm:text-[44px]">90-Day Reset</h3>
              <p className="mb-8 max-w-[32ch] text-[16px] leading-[1.45] text-white/70">
                Unimate, Balance, the window. She walks the first week with you.
              </p>
              <span className="font-mono text-[11px] tracking-[0.14em]">WHATSAPP THIS →</span>
            </a>
            <a
              href={waEarn}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[5px] border border-black/10 bg-paper p-8 transition-colors hover:border-brick md:p-10"
            >
              <p className="font-mono mb-6 text-[11px] tracking-[0.16em] text-muted">02 — WITH HER</p>
              <h3 className="font-display mb-4 text-[36px] sm:text-[44px]">Earn with me</h3>
              <p className="mb-8 max-w-[32ch] text-[16px] leading-[1.45] text-muted">
                Unicity business from your phone. Mentorship included. Apply for a conversation.
              </p>
              <span className="font-mono text-[11px] tracking-[0.14em] text-brick">WHATSAPP THIS →</span>
            </a>
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a href={waResetHi} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              हिंदी में लिखें
            </a>
            <a href={ORDER} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Order online
            </a>
            <a href={IG} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Instagram
            </a>
          </div>
          <p className="font-mono mt-10 text-[13px] tracking-wide text-muted">+91 99204 04375</p>
        </div>
      </section>

      <footer className="relative border-t border-black/[0.07] px-[3.5%] py-16 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-display text-[clamp(48px,12vw,140px)] leading-[0.85]">Suman Bagriya</p>
          <div className="mt-[72px] flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[12px] tracking-[0.14em] text-muted uppercase">
                Unicity Senior Director, India · Metabolic health · Feel Great System
              </p>
              <p className="mt-6 max-w-[42ch] text-[14px] leading-[1.5] text-muted">
                For Suman, on Rakshabandhan 2026 — a house of work made to honour the way she cares for others.
              </p>
              <p className="mt-4 max-w-[52ch] text-[12px] leading-[1.5] text-muted/70">
                These statements have not been evaluated by regulatory authorities. This product is not intended to
                diagnose, treat, cure, or prevent any disease. Results vary. Powered by Unicity International.
              </p>
            </div>
            <div className="flex flex-wrap gap-8 font-mono text-[12px] tracking-[0.12em] uppercase">
              <a href={ORDER} target="_blank" rel="noopener noreferrer" className="hover:text-brick">
                Order
              </a>
              <a href={IG} target="_blank" rel="noopener noreferrer" className="hover:text-brick">
                Instagram
              </a>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="hover:text-brick">
                WhatsApp
              </a>
              <a href={waConnect} target="_blank" rel="noopener noreferrer" className="hover:text-brick">
                Connect
              </a>
              <a href={DISCLOSURE} target="_blank" rel="noopener noreferrer" className="hover:text-brick">
                Affiliate disclosure
              </a>
            </div>
          </div>
          <p className="font-mono mt-16 text-[11px] tracking-[0.12em] text-muted/70 uppercase">© 2026 Suman Bagriya</p>
        </div>
      </footer>
    </div>
  );
}
