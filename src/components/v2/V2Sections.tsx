import * as Accordion from "@radix-ui/react-accordion";
import { Link } from "@tanstack/react-router";
import { DISCLOSURE, IG, ORDER, SAATH, WA, waEarn, waReset, waSaath } from "@/lib/links";

const steps = [
  { n: "01", t: "Morning", b: "Unimate. GLP-1 wakes up. The snack-voice goes quiet." },
  { n: "02", t: "Before meals", b: "Balance. The spike flattens. The 4pm crash never arrives." },
  {
    n: "03",
    t: "The window",
    b: "Eat in a window your body already understands. No lists. No gym sentence.",
  },
];

const houseFeatures = [
  { t: "Today", b: "The session, the weigh-in, the check-in — one screen, not five apps." },
  { t: "Workouts", b: "Guided sessions with rest timers, last weights remembered, PRs marked." },
  { t: "The plan", b: "A week you can live with. Move a day. Rest a day. The house remembers." },
  { t: "Weight", b: "A private chart from where you are to the line you set. No public feed." },
  { t: "Library", b: "A thousand-plus exercises with demos. Body-weight or the gym." },
  { t: "Streaks", b: "The run of days, for when willpower thins. Together, not alone." },
];

const faqs = [
  {
    q: "What exactly will I be taking?",
    a: "Two food-based products: Unimate, a plant-based yerba mate concentrate that activates GLP-1, and Balance, a patented fiber matrix that flattens blood sugar spikes before meals. Together they target insulin resistance.",
  },
  {
    q: "Do I have to change my diet?",
    a: "No. The system changes how the body processes the food already being eaten. Most people make better choices naturally as cravings drop — but no diet and no calorie counting are required.",
  },
  {
    q: "How fast will I feel a difference?",
    a: "Most people notice cravings drop and energy lift within the first week. Visible changes in weight and bloodwork typically show within 30 days. Ninety days for the fuller metabolic shift.",
  },
  {
    q: "How is this different from Ozempic?",
    a: "Ozempic is an injection that mimics GLP-1 — stop, and the weight often returns. This is a plant-based protocol that supports the body's own GLP-1. No injections, at a fraction of the cost.",
  },
  {
    q: "I'm on medication — is this safe?",
    a: "The products are food-based. Always consult your doctor if you are on medication for blood sugar, blood pressure, cholesterol, or thyroid. This is not medical advice.",
  },
  {
    q: "What if it doesn't work for me?",
    a: "The 90-day double guarantee. Test bloodwork before, test it ninety days later. If the markers have not improved, you get a full refund.",
  },
];

function Shell({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-white/10 px-[4%] py-24 md:py-32">
      <div className="mx-auto max-w-[1400px]">{children}</div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono mb-8 text-[10px] tracking-[0.2em] text-white/60 uppercase">
      {children}
    </p>
  );
}

function About() {
  return (
    <Shell id="about">
      <Label>About Suman</Label>
      <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
        <div>
          <h2 className="text-[clamp(40px,6.5vw,86px)] leading-[0.95] tracking-[-0.02em] text-[#f3ede2]">
            Not a textbook.
            <br />A life lived.
          </h2>
          <p className="mt-10 max-w-[46ch] text-[17px] leading-[1.6] text-white/65">
            Five years in health and wellness. Diet plans that never held. Then a system that worked
            on her first. For years the cycle was the same: try a diet, lose a little, regain more,
            feel worse. The advice never addressed why the body was holding on so tightly.
          </p>
          <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.6] text-[#f3ede2]">
            Unicity Senior Director, India. She coaches the protocol in person, and builds a digital
            health business with the people ready to share it.
          </p>
        </div>
        <figure className="overflow-hidden rounded-[18px]">
          <img
            src="/photos/suman-transform.jpg"
            alt="Suman's own before and after"
            loading="lazy"
            decoding="async"
            width="760"
            height="1013"
            className="w-full object-cover"
          />
          <figcaption className="font-mono mt-4 text-[10px] tracking-[0.16em] text-white/60 uppercase">
            Her own reset — before / after
          </figcaption>
        </figure>
      </div>
    </Shell>
  );
}

function System() {
  return (
    <Shell id="system">
      <Label>The Feel Great System · 12 seconds</Label>
      <h2 className="max-w-[16ch] text-[clamp(40px,6.5vw,86px)] leading-[0.95] tracking-[-0.02em] text-[#f3ede2]">
        You don't have a willpower problem.
      </h2>
      <p className="mt-10 max-w-[44ch] text-[19px] leading-[1.5] text-white/70">
        You have a body stuck in storage. The diets punished you for a signal you could not hear.
      </p>

      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <article key={s.n} className="rounded-[16px] border border-white/10 bg-white/[0.03] p-7">
            <p className="font-mono mb-6 text-[10px] tracking-[0.16em] text-[#e07a4d]">{s.n}</p>
            <h3 className="mb-4 text-[26px] leading-[1.05] text-[#f3ede2]">{s.t}</h3>
            <p className="text-[15px] leading-[1.55] text-white/65">{s.b}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-7">
          <p className="font-mono mb-5 text-[10px] tracking-[0.16em] text-[#e07a4d] uppercase">
            Now
          </p>
          <h3 className="mb-4 text-[26px] text-[#f3ede2]">Spike. Crash. Repeat.</h3>
          <p className="max-w-[42ch] text-[15px] leading-[1.55] text-white/65">
            Cravings that feel like character. Fog after meals. Fat that will not move because
            insulin is telling the body to hold. You can out-discipline this for a week. You cannot
            out-discipline a hormone.
          </p>
        </div>
        <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-7">
          <p className="font-mono mb-5 text-[10px] tracking-[0.16em] text-[#e07a4d] uppercase">
            Possible
          </p>
          <h3 className="mb-4 text-[26px] text-[#f3ede2]">Quiet. Steady. Light.</h3>
          <p className="max-w-[42ch] text-[15px] leading-[1.55] text-white/65">
            Appetite that ends when the plate does. Energy that lasts past 4pm. A metabolism that
            releases instead of hoarding. Most people feel the cravings drop in the first week.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <a href={waReset} target="_blank" rel="noopener noreferrer" className="v2-pill-solid">
          Start my 90-Day Reset
        </a>
        <a href={ORDER} target="_blank" rel="noopener noreferrer" className="v2-pill-line">
          Order direct
        </a>
      </div>
    </Shell>
  );
}

function Saath() {
  return (
    <Shell id="saath">
      <Label>The house tracker · free for clients</Label>
      <div className="flex flex-wrap items-end gap-6">
        <img
          src="/brand/saath-mark-v2.svg"
          alt=""
          width="64"
          height="64"
          className="rounded-[16px]"
        />
        <h2 className="text-[clamp(44px,7vw,92px)] leading-[0.9] tracking-[-0.02em] text-[#f3ede2]">
          Saath.
        </h2>
      </div>
      <p className="mt-8 max-w-[48ch] text-[19px] leading-[1.5] text-white/70">
        साथ — together. The exercise and gym tracker every client gets a free seat in. Set the line
        while you still weigh more than it. Load the starter week. Log the set. Watch the curve
        fall.
      </p>

      <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {houseFeatures.map((f) => (
          <article key={f.t} className="rounded-[16px] border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-3 text-[20px] text-[#f3ede2]">{f.t}</h3>
            <p className="text-[14.5px] leading-[1.55] text-white/65">{f.b}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/saath" className="v2-pill-solid">
          Open the house
        </Link>
        <a href={waSaath} target="_blank" rel="noopener noreferrer" className="v2-pill-line">
          Ask for a seat
        </a>
      </div>
    </Shell>
  );
}

function Business() {
  return (
    <Shell id="business">
      <Label>The partner path</Label>
      <h2 className="max-w-[18ch] text-[clamp(40px,6.5vw,86px)] leading-[0.95] tracking-[-0.02em] text-[#f3ede2]">
        Or build it with her.
      </h2>
      <p className="mt-10 max-w-[46ch] text-[17px] leading-[1.6] text-white/65">
        Some people finish the ninety days and want to hand it on. There is a path for that —
        Unicity, the same products, the same coaching, as a business you run yourself. Five minutes
        on WhatsApp, no pressure and no pitch deck. Suman will tell you honestly whether it fits.
      </p>
      <a href={waEarn} target="_blank" rel="noopener noreferrer" className="v2-pill-solid mt-10">
        Talk about building
      </a>
    </Shell>
  );
}

function Faq() {
  return (
    <Shell id="faq">
      <Label>Questions</Label>
      <h2 className="mb-14 max-w-[14ch] text-[clamp(40px,6.5vw,86px)] leading-[0.95] tracking-[-0.02em] text-[#f3ede2]">
        The honest answers.
      </h2>
      <Accordion.Root type="single" collapsible className="border-t border-white/10">
        {faqs.map((f, i) => (
          <Accordion.Item key={i} value={`i${i}`} className="border-b border-white/10">
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left">
                <span className="text-[18px] leading-[1.3] text-[#f3ede2] md:text-[21px]">
                  {f.q}
                </span>
                <span className="font-mono shrink-0 text-[20px] text-[#e07a4d] transition group-data-[state=open]:rotate-45">
                  +
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="faq-content">
              <p className="max-w-[62ch] pb-7 text-[15.5px] leading-[1.6] text-white/65">{f.a}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Shell>
  );
}

function Connect() {
  return (
    <Shell id="connect">
      <h2 className="max-w-[18ch] text-[clamp(44px,8vw,110px)] leading-[0.92] tracking-[-0.02em] text-[#f3ede2]">
        Ninety days.
        <br />
        One conversation.
      </h2>
      <div className="mt-12 flex flex-wrap gap-3">
        <a href={waReset} target="_blank" rel="noopener noreferrer" className="v2-pill-solid">
          Start the Reset
        </a>
        <a href={waSaath} target="_blank" rel="noopener noreferrer" className="v2-pill-line">
          Ask for a Saath seat
        </a>
        <a href={waEarn} target="_blank" rel="noopener noreferrer" className="v2-pill-line">
          Build with me
        </a>
      </div>
    </Shell>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-[4%] py-14">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-6">
        <Link to="/" className="text-[22px] text-[#f3ede2]">
          Suman Bagriya
        </Link>
        <div className="flex flex-wrap gap-7 font-mono text-[11px] tracking-[0.12em] text-white/50 uppercase">
          <a
            href={ORDER}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target hover:text-[#e07a4d]"
          >
            Order
          </a>
          <a
            href={IG}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target hover:text-[#e07a4d]"
          >
            Instagram
          </a>
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target hover:text-[#e07a4d]"
          >
            WhatsApp
          </a>
          <a href={SAATH} className="tap-target hover:text-[#e07a4d]">
            Saath
          </a>
          <a
            href={DISCLOSURE}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target hover:text-[#e07a4d]"
          >
            Disclosure
          </a>
        </div>
      </div>
      <p className="font-mono mx-auto mt-8 max-w-[1400px] text-[10px] leading-[1.6] text-white/30">
        V2 — a drag-canvas design exploration, running alongside the original site. © 2026
      </p>
    </footer>
  );
}

export { About, System, Saath, Business, Faq, Connect, Footer };
