import { ORDER, waStart } from "@/lib/links";

export default function ProductSection() {
  return (
    <>
      <section id="product" className="relative scroll-mt-24 px-[3.5%] py-24 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-mono mb-6 text-[12px] tracking-[0.16em] text-muted uppercase">
            The Feel Great System
          </p>
          <h2 className="font-display max-w-[16ch] text-[clamp(52px,9vw,120px)]">
            You don’t have a willpower problem.
          </h2>
          <div className="mt-[72px] grid gap-12 md:grid-cols-12">
            <p className="font-neue max-w-[34ch] text-[22px] leading-[1.3] md:col-span-5 md:text-[26px]">
              You have a body stuck in storage. The diets punished you for a signal you could not hear.
            </p>
            <div className="space-y-6 text-[16px] leading-[1.55] text-muted md:col-span-6 md:col-start-7 md:text-[18px]">
              <p>
                Hungry an hour after lunch. The 4pm crash. Clothes that never quite forgive you. That is not laziness —
                that is low GLP-1 and a blood-sugar spike that crashes, then begs for more.
              </p>
              <p className="text-ink">
                Suman lost 5 kgs in one month without changing her routine. Same kitchen. Same hours. Different
                signals. The system is two food-based steps, used in 60+ countries, and it costs less than a couple of
                coffees a day.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-[3.5%] pb-8">
        <div className="mx-auto max-w-[1280px] border-y border-black/[0.07] py-16 md:py-20">
          <div className="grid gap-16 md:grid-cols-2 md:gap-0">
            <div className="md:pr-12">
              <p className="font-mono mb-6 text-[12px] tracking-[0.14em] text-brick uppercase">What is happening now</p>
              <h3 className="font-display mb-[72px] text-[40px] sm:text-[52px]">Spike. Crash. Repeat.</h3>
              <p className="max-w-[40ch] text-[16px] leading-[1.5] text-muted">
                Cravings that feel like character. Fog after meals. Fat that will not move because insulin is telling
                the body to hold. You can out-discipline this for a week. You cannot out-discipline a hormone.
              </p>
            </div>
            <div className="border-t border-black/[0.07] pt-16 md:border-t-0 md:border-l md:pt-0 md:pl-12">
              <p className="font-mono mb-6 text-[12px] tracking-[0.14em] text-brick uppercase">What becomes possible</p>
              <h3 className="font-display mb-[72px] text-[40px] sm:text-[52px]">Quiet. Steady. Light.</h3>
              <p className="max-w-[40ch] text-[16px] leading-[1.5] text-muted">
                Appetite that ends when the plate does. Energy that lasts past 4pm. A metabolism that releases instead
                of hoarding. Most people feel the cravings drop in the first week. The clothes follow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="reset" className="relative scroll-mt-24 px-[3.5%] py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-mono mb-6 text-[12px] tracking-[0.16em] text-muted uppercase">The protocol</p>
          <h2 className="font-display mb-[72px] max-w-[14ch] text-[clamp(42px,7vw,88px)]">
            Two minutes. Two products. Your body does the rest.
          </h2>
          <div className="grid gap-16 border-t border-black/[0.07] md:grid-cols-2 md:gap-0">
            <article className="pt-10 md:pr-12">
              <p className="font-mono mb-8 text-[12px] tracking-[0.14em] text-brick">01 — Morning</p>
              <h3 className="font-display mb-[72px] text-[42px] sm:text-[56px]">Unimate</h3>
              <p className="mb-6 max-w-[42ch] text-[18px] leading-[1.45] text-ink">
                Drink this first. GLP-1 wakes up. The snack-voice goes quiet.
              </p>
              <p className="max-w-[42ch] text-[16px] leading-[1.5] text-muted">
                A plant-based yerba mate concentrate that activates the same hormone Ozempic mimics — naturally, without
                an injection, without the rebound when you stop. This is how cravings lose the argument before breakfast
                is over.
              </p>
            </article>
            <article className="border-t border-black/[0.07] pt-10 md:border-t-0 md:border-l md:pl-12">
              <p className="font-mono mb-8 text-[12px] tracking-[0.14em] text-brick">02 — Before meals</p>
              <h3 className="font-display mb-[72px] text-[42px] sm:text-[56px]">Balance</h3>
              <p className="mb-6 max-w-[42ch] text-[18px] leading-[1.45] text-ink">
                Take this before you eat. The spike flattens. The crash never arrives.
              </p>
              <p className="max-w-[42ch] text-[16px] leading-[1.5] text-muted">
                A patented fiber matrix, clinically shown to reduce blood sugar spikes by 43%. Eat the food you already
                eat. The afternoon fog, the 4pm hunt, the stubborn band of fat — they were riding that spike. Cut the
                spike and they have nowhere to live.
              </p>
            </article>
          </div>
          <p className="font-mono mt-16 text-[12px] tracking-[0.12em] text-ink uppercase">
            No calorie counting · No food lists · No gym sentence · Plant-based · Patented · 60+ countries
          </p>
        </div>
      </section>

      <section className="relative px-[3.5%] pb-8">
        <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[5px] bg-ink">
          <div className="relative aspect-[16/10] md:aspect-[21/9]">
            <img
              src="/photos/suman-face.jpg"
              alt="Suman Bagriya"
              className="h-full w-full object-cover object-[center_18%] opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 p-6 sm:p-10 md:p-14">
              <p className="font-mono mb-3 text-[12px] tracking-[0.16em] text-white/70">90-DAY DOUBLE GUARANTEE</p>
              <h2 className="font-display max-w-[18ch] text-[clamp(40px,6.5vw,88px)] text-white">
                Try it. Measure it. If nothing moves, you don’t pay.
              </h2>
            </div>
          </div>
        </div>
        <div className="mx-auto grid max-w-[1280px] gap-x-12 gap-y-[72px] pt-[72px] md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-neue text-[22px] leading-[1.3] md:text-[26px]">
              Another year of starting Monday, or ninety days that actually count.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="mb-6 text-[16px] leading-[1.55] text-muted md:text-[18px]">
              Suman spent five years watching good people fail good diets. Then she ran this system on herself: 5 kgs
              in a month, workouts that finally paid off, energy that did not collapse at 4pm. She did not become a
              different person. Her body started answering.
            </p>
            <p className="mb-6 text-[16px] leading-[1.55] text-muted md:text-[18px]">
              When you order, you are not left with a PDF. She walks the protocol with you — what to take, when, what
              the first week should feel like. Test your bloodwork at the start. Test it at day 90. If the markers have
              not improved, full refund. The only way this costs you is if you never begin.
            </p>
            <p className="mb-10 text-[16px] leading-[1.45] text-ink">
              Two steps. Less than a couple of coffees a day. A body that finally works with you.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={ORDER} target="_blank" rel="noopener noreferrer" className="btn-brick">
                Yes — start my 90 days
              </a>
              <a href={waStart} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Talk to Suman first
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
