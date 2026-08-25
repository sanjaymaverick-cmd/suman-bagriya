import { SAATH, waReset } from "@/lib/links";
import IPhoneFrame from "@/components/site/IPhoneFrame";
import { motion } from "motion/react";

export default function SaathSection() {
  return (
    <section id="saath" className="relative scroll-mt-24 px-[3.5%] py-24 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <p className="font-mono mb-6 text-[12px] tracking-[0.16em] text-muted uppercase">
          Free for every client
        </p>
        <h2 className="font-display max-w-[12ch] text-[clamp(56px,10vw,128px)]">Saath.</h2>
        <div className="mt-[72px] grid items-center gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6">
            <p className="font-neue max-w-[28ch] text-[22px] leading-[1.3] md:text-[26px]">
              The house tracker. Together, not alone.
            </p>
            <p className="mt-8 max-w-[42ch] text-[16px] leading-[1.55] text-muted md:text-[18px]">
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
          <div className="flex justify-center md:col-span-5 md:col-start-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            >
              <IPhoneFrame src="/saath-shots/02-home.png" alt="Saath home — 75 kg now, 60 kg goal" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
