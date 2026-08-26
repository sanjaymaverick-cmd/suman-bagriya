import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { waEarn, waReset, ORDER, IG } from "@/lib/links";

const proof = [
  "/photos/proof/proof-12.jpg",
  "/photos/proof/proof-20.png",
  "/photos/proof/proof-30.jpg",
  "/photos/proof/proof-36.jpg",
];

const faqs = [
  ["What is the daily ritual?", "Unimate is presented as the morning step and Balance as the before-meal step. Suman personally helps clients understand the routine and stay consistent."],
  ["Do I need to count calories?", "The public programme is positioned as a simple routine rather than a calorie-counting plan. Individual needs and results vary."],
  ["What support do I receive?", "Guidance from Suman, help with the protocol, progress tracking and access to the Saath client experience after confirmation."],
  ["Can I speak with Suman before ordering?", "Yes. The primary action opens a WhatsApp conversation, so you can ask questions before deciding."],
  ["What if I take medication?", "Speak with a qualified medical professional before changing your diet, supplements or medication, especially when managing an existing condition."],
];

export function V4Manifesto() {
  return (
    <section className="relative overflow-hidden bg-[#171310] px-5 py-28 text-[#f3eee7] sm:px-10 sm:py-40 lg:px-16">
      <div className="mx-auto max-w-[1450px]">
        <p className="mb-14 text-[10px] tracking-[0.25em] uppercase text-[#cdb99d]/55">A ritual, not a punishment</p>
        <h2 className="v4-display max-w-[13ch] text-[clamp(54px,10vw,148px)] leading-[0.88] tracking-[-0.045em]">
          Your body was never asking for <span className="italic text-[#d08b7d]">more discipline.</span>
        </h2>
        <div className="mt-16 grid gap-10 border-t border-white/10 pt-9 md:grid-cols-3">
          <p className="text-[12px] tracking-[0.18em] uppercase text-[#cdb99d]/60">Quiet the noise</p>
          <p className="max-w-[34ch] text-[17px] leading-7 text-[#f3eee7]/72">A simple morning and before-meal rhythm designed to fit the life you already have.</p>
          <p className="max-w-[34ch] text-[17px] leading-7 text-[#f3eee7]/72">No perfection theatre. Just a clear ritual, personal guidance and ninety days of showing up together.</p>
        </div>
      </div>
    </section>
  );
}

export function V4Ritual() {
  return (
    <section id="ritual" className="bg-[#efe8df] px-5 py-28 text-[#171310] sm:px-10 sm:py-40 lg:px-16">
      <div className="mx-auto max-w-[1450px]">
        <div className="mb-16 grid items-end gap-8 md:grid-cols-2">
          <div>
            <p className="mb-5 text-[10px] tracking-[0.24em] uppercase text-[#846c5e]">The two-step ritual</p>
            <h2 className="v4-display text-[clamp(58px,9vw,126px)] leading-[0.86] tracking-[-0.04em]">Morning.<br/><span className="italic text-[#a74d3d]">Then meals.</span></h2>
          </div>
          <p className="max-w-[43ch] pb-2 text-[16px] leading-7 text-[#5f4e44] md:justify-self-end">Two products. Two moments in your day. Suman helps you make the ritual feel natural, personal and sustainable.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="group relative min-h-[620px] overflow-hidden rounded-[32px] bg-[#d8b0a4] p-7 sm:p-10">
            <div className="relative z-10 flex justify-between text-[10px] tracking-[0.2em] uppercase"><span>01 · Morning</span><span>Unimate</span></div>
            <img src="https://assets.cdn.filesafe.space/NGZ5Kh3Cb7Vo4u8VnD2Q/media/69cf5579849c507b526b51cd.png" alt="Unimate product" loading="lazy" className="absolute inset-x-[10%] top-[14%] h-[55%] w-[80%] object-contain drop-shadow-[0_35px_35px_rgba(65,35,27,0.22)] transition-transform duration-700 group-hover:scale-[1.04] group-hover:-rotate-2" />
            <div className="absolute inset-x-7 bottom-7 sm:inset-x-10 sm:bottom-10"><h3 className="v4-display text-[52px] leading-none">Begin with clarity.</h3><p className="mt-4 max-w-[39ch] text-[15px] leading-6 text-[#4e332d]/75">A warm morning ritual, paired with Suman’s guidance and a rhythm you can actually remember.</p></div>
          </article>
          <article className="group relative min-h-[620px] overflow-hidden rounded-[32px] bg-[#87907c] p-7 text-[#f5f0e7] sm:p-10">
            <div className="relative z-10 flex justify-between text-[10px] tracking-[0.2em] uppercase"><span>02 · Before meals</span><span>Balance</span></div>
            <img src="https://assets.cdn.filesafe.space/NGZ5Kh3Cb7Vo4u8VnD2Q/media/69cf55134cde4bbc2a6d5b2c.png" alt="Balance product" loading="lazy" className="absolute inset-x-[10%] top-[14%] h-[55%] w-[80%] object-contain drop-shadow-[0_35px_35px_rgba(30,38,28,0.28)] transition-transform duration-700 group-hover:scale-[1.04] group-hover:rotate-2" />
            <div className="absolute inset-x-7 bottom-7 sm:inset-x-10 sm:bottom-10"><h3 className="v4-display text-[52px] leading-none">Move with ease.</h3><p className="mt-4 max-w-[39ch] text-[15px] leading-6 text-white/72">The before-meal step that turns an ambitious plan into one beautifully simple habit.</p></div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function V4Stories() {
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0, left: 0 });
  const manualUntil = useRef(0);
  useEffect(() => {
    const node = rail.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let previous = performance.now();
    const animate = (now: number) => {
      const elapsed = Math.min(now - previous, 40);
      previous = now;
      if (!drag.current.active && now > manualUntil.current) {
        node.scrollLeft += elapsed * 0.045;
        const loopPoint = node.scrollWidth / 2;
        if (node.scrollLeft >= loopPoint) node.scrollLeft -= loopPoint;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  const move = (direction: number) => {
    manualUntil.current = performance.now() + 900;
    rail.current?.scrollBy({ left: direction * Math.min(window.innerWidth * 0.72, 410), behavior: "smooth" });
  };
  return (
    <section id="stories" className="overflow-hidden bg-[#f4efe8] py-28 text-[#171310] sm:py-40">
      <div className="mx-auto mb-14 flex max-w-[1450px] items-end justify-between gap-8 px-5 sm:px-10 lg:px-16">
        <div><p className="mb-5 text-[10px] tracking-[0.24em] uppercase text-[#846c5e]">Real stories · real lives</p><h2 className="v4-display text-[clamp(62px,10vw,132px)] leading-[0.84] tracking-[-0.04em]">The quiet<br/><span className="italic text-[#a74d3d]">glow-up.</span></h2></div>
        <div className="hidden items-end gap-6 md:flex"><p className="max-w-[30ch] text-[14px] leading-6 text-[#68564b]">Drag, swipe or scroll through a selection from the transformation library. Individual experiences vary.</p><div className="flex gap-2"><button type="button" onClick={()=>move(-1)} aria-label="Previous transformation" className="v4-proof-arrow">←</button><button type="button" onClick={()=>move(1)} aria-label="Next transformation" className="v4-proof-arrow">→</button></div></div>
      </div>
      <div ref={rail} data-v4-physics className="v4-proof-scroll flex cursor-grab gap-4 overflow-x-auto px-5 pb-5 select-none active:cursor-grabbing sm:px-10 lg:px-[max(4rem,calc((100vw-1450px)/2))]" onPointerDown={(event)=>{drag.current={active:true,x:event.clientX,left:rail.current?.scrollLeft??0}; event.currentTarget.setPointerCapture(event.pointerId);}} onPointerMove={(event)=>{if(!drag.current.active||!rail.current)return; rail.current.scrollLeft=drag.current.left-(event.clientX-drag.current.x)*1.15;}} onPointerUp={(event)=>{drag.current.active=false;manualUntil.current=performance.now()+900;event.currentTarget.releasePointerCapture(event.pointerId);}} onPointerCancel={()=>{drag.current.active=false;manualUntil.current=performance.now()+900;}} onWheel={(event)=>{const node=rail.current;if(!node)return;const delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;manualUntil.current=performance.now()+750;event.preventDefault();node.scrollLeft+=delta*1.35;}}>
        {[...proof, ...proof].map((src, index) => { const story = index % proof.length; const duplicate = index >= proof.length; return <figure key={`${src}-${index}`} aria-hidden={duplicate || undefined} className="group relative aspect-[3/4] w-[78vw] max-w-[390px] shrink-0 overflow-hidden rounded-[24px] bg-[#d7c7b6]"><img src={src} alt={duplicate ? "" : `Transformation story ${story + 1}`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"/><figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 pt-24 text-white"><span className="text-[10px] tracking-[0.2em] uppercase">Story {String(story + 1).padStart(2,"0")}</span></figcaption></figure>; })}
      </div>
      <div className="mt-7 flex items-center justify-between px-5 md:hidden"><span className="text-[10px] tracking-[0.18em] uppercase text-[#846c5e]">Swipe · drag · wheel</span><div className="flex gap-2"><button type="button" onClick={()=>move(-1)} aria-label="Previous transformation" className="v4-proof-arrow">←</button><button type="button" onClick={()=>move(1)} aria-label="Next transformation" className="v4-proof-arrow">→</button></div></div>
    </section>
  );
}

export function V4Suman() {
  return (
    <section className="bg-[#a95140] px-5 py-24 text-white sm:px-10 sm:py-36 lg:px-16">
      <div className="mx-auto grid max-w-[1450px] items-center gap-14 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[560px] overflow-hidden rounded-[50%_50%_8%_8%/38%_38%_8%_8%] bg-[#7b392d]"><img src="/photos/suman-transform.jpg" alt="Suman Bagriya's transformation" loading="lazy" className="h-full w-full object-cover"/></div>
        <div><p className="mb-7 text-[10px] tracking-[0.24em] uppercase text-white/55">Her story, before the system</p><h2 className="v4-display max-w-[9ch] text-[clamp(64px,10vw,142px)] leading-[0.84] tracking-[-0.045em]">She tried it <span className="italic text-[#f0d5bd]">first.</span></h2><p className="mt-9 max-w-[48ch] text-[17px] leading-8 text-white/76">After years in health and wellness, Suman wanted something that could live beyond another strict plan. Her own experience became the reason she began guiding other women—personally, patiently and without judgement.</p><blockquote className="v4-display mt-10 max-w-[16ch] border-l border-white/30 pl-6 text-[34px] leading-tight italic text-[#f5dfcb]">“I didn’t become a different person. I found a ritual that worked with my life.”</blockquote></div>
      </div>
    </section>
  );
}

export function V4Saath() {
  return (
    <section id="saath-v4" className="relative overflow-hidden bg-[#182019] px-5 py-28 text-[#f2eee5] sm:px-10 sm:py-40 lg:px-16">
      <div className="absolute -right-[15%] top-[10%] h-[650px] w-[650px] rounded-full bg-[#92a184]/20 blur-[120px]" />
      <div className="relative mx-auto grid max-w-[1450px] items-center gap-16 lg:grid-cols-2">
        <div><p className="mb-6 text-[10px] tracking-[0.24em] uppercase text-[#bcc9b1]/55">Included for every client</p><h2 className="v4-display text-[clamp(72px,12vw,160px)] leading-[0.8] tracking-[-0.05em]">Saath.<span className="mt-4 block text-[0.34em] italic tracking-normal text-[#cad3bf]">The house remembers.</span></h2><p className="mt-9 max-w-[41ch] text-[16px] leading-7 text-white/64">Your workouts, weight, week and streak—held in one calm place. Progress feels different when you are not doing it alone.</p><Link to="/saath" className="v4-pill mt-9 border border-white/25 text-white hover:bg-white hover:text-[#182019]">Explore Saath</Link></div>
        <div className="relative mx-auto h-[650px] w-full max-w-[620px]"><div className="absolute left-[5%] top-[10%] w-[48%] -rotate-6 rounded-[38px] border-[8px] border-[#090c09] bg-black p-1 shadow-2xl"><img src="/saath-shots/02-home.png" alt="Saath home screen" loading="lazy" className="w-full rounded-[27px]"/></div><div className="absolute right-[3%] top-[22%] w-[48%] rotate-6 rounded-[38px] border-[8px] border-[#090c09] bg-black p-1 shadow-2xl"><img src="/saath-shots/08-stats.png" alt="Saath progress screen" loading="lazy" className="w-full rounded-[27px]"/></div></div>
      </div>
    </section>
  );
}

export function V4Journey() {
  const beats = [["Week 01","Find the rhythm"],["Day 30","Notice the difference"],["Day 60","Make it yours"],["Day 90","See how far you came"]];
  return <section className="bg-[#eee6dc] px-5 py-28 text-[#171310] sm:px-10 sm:py-40 lg:px-16"><div className="mx-auto max-w-[1450px]"><p className="mb-6 text-[10px] tracking-[0.24em] uppercase text-[#846c5e]">Ninety days, held gently</p><h2 className="v4-display max-w-[11ch] text-[clamp(62px,10vw,136px)] leading-[0.84] tracking-[-0.04em]">A transformation has a <span className="italic text-[#a74d3d]">rhythm.</span></h2><div className="mt-16 grid gap-px overflow-hidden rounded-[24px] bg-[#8f7768]/18 md:grid-cols-4">{beats.map(([time,title],i)=><article key={time} className="min-h-[260px] bg-[#eee6dc] p-7 sm:p-9"><span className="text-[10px] tracking-[0.2em] uppercase text-[#8a7365]">{String(i+1).padStart(2,"0")} · {time}</span><h3 className="v4-display mt-24 text-[36px] leading-none">{title}</h3></article>)}</div></div></section>;
}

export function V4Faq() {
  const [open, setOpen] = useState(0);
  return <section className="bg-[#f5f1ea] px-5 py-28 text-[#171310] sm:px-10 sm:py-40 lg:px-16"><div className="mx-auto grid max-w-[1450px] gap-16 lg:grid-cols-[0.72fr_1.28fr]"><div><p className="mb-6 text-[10px] tracking-[0.24em] uppercase text-[#846c5e]">Before we begin</p><h2 className="v4-display text-[clamp(68px,9vw,120px)] leading-[0.82]">Questions,<br/><span className="italic text-[#a74d3d]">beautifully answered.</span></h2></div><div className="border-t border-[#7c685b]/20">{faqs.map(([q,a],i)=><div key={q} className="border-b border-[#7c685b]/20"><button type="button" onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i} className="flex min-h-[76px] w-full items-center justify-between gap-5 py-4 text-left text-[17px] font-medium"><span>{q}</span><span className="text-2xl font-light">{open===i?"−":"+"}</span></button>{open===i&&<p className="max-w-[58ch] pb-7 text-[15px] leading-7 text-[#67564b]">{a}</p>}</div>)}</div></div></section>;
}

export function V4Closing() {
  return <><section id="start-v4" className="relative overflow-hidden bg-[#241915] px-5 py-28 text-[#f7eee5] sm:px-10 sm:py-44 lg:px-16"><div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_75%_20%,#b55c48,transparent_40%)]"/><div className="relative mx-auto max-w-[1450px]"><p className="mb-7 text-[10px] tracking-[0.25em] uppercase text-[#d7baa7]/55">Your next chapter</p><h2 className="v4-display max-w-[10ch] text-[clamp(72px,12vw,172px)] leading-[0.8] tracking-[-0.055em]">Ready to feel like <span className="italic text-[#d88c7b]">yourself again?</span></h2><div className="mt-12 flex flex-wrap gap-3"><a href={waReset} target="_blank" rel="noopener noreferrer" className="v4-pill bg-[#bd624d] text-white hover:bg-[#cf705a]">Talk to Suman</a><a href={ORDER} target="_blank" rel="noopener noreferrer" className="v4-pill border border-white/25 text-white hover:bg-white hover:text-[#241915]">Order online</a><a href={waEarn} target="_blank" rel="noopener noreferrer" className="v4-pill border border-white/25 text-white hover:bg-white hover:text-[#241915]">Build with her</a></div><p className="mt-8 max-w-[60ch] text-[12px] leading-6 text-white/40">Individual results vary. Consult a qualified healthcare professional before making changes to supplements, diet or medication.</p></div></section><footer className="bg-[#120e0c] px-5 py-10 text-[#f3eee7]/55 sm:px-10 lg:px-16"><div className="mx-auto flex max-w-[1450px] flex-col gap-8 text-[10px] tracking-[0.16em] uppercase sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Suman Bagriya · V4 Metabolic Muse</span><div className="flex flex-wrap gap-5"><a href={IG} target="_blank" rel="noopener noreferrer">Instagram</a><Link to="/">Original</Link><Link to="/v2">V2</Link><Link to="/v3">V3</Link></div></div></footer></>;
}
