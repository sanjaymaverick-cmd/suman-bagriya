import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { IG, ORDER, waReset } from "@/lib/links";

const proofs = ["12.jpg", "20.png", "30.jpg", "36.jpg", "37.jpg", "40.jpg"].map((file) => `/photos/proof/proof-${file}`);
const journey = [["01", "Find your rhythm"], ["30", "Notice the shift"], ["60", "Make it yours"], ["90", "See your momentum"]];
const faqs = [
  ["What is the daily ritual?", "Unimate is presented as the morning step and Balance as the before-meal step. Suman helps clients understand the routine and stay consistent."],
  ["Do I need to count calories?", "The programme is positioned as a simple daily ritual rather than a calorie-counting plan. Individual needs and experiences vary."],
  ["What support do I receive?", "You receive guidance from Suman, help understanding the protocol, progress tracking and access to the Saath client experience after confirmation."],
  ["Can I speak with Suman first?", "Yes. The main action opens WhatsApp so you can ask questions before deciding."],
];

function ProofRail() {
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0, left: 0, pause: 0 });
  useEffect(() => {
    const node = rail.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0, previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(40, now - previous); previous = now;
      if (!drag.current.active && now > drag.current.pause) {
        node.scrollLeft += dt * .055;
        if (node.scrollLeft >= node.scrollWidth / 2) node.scrollLeft -= node.scrollWidth / 2;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  return <div ref={rail} className="v5-proof-rail" aria-label="Transformation stories" onPointerDown={(e)=>{drag.current={active:true,x:e.clientX,left:rail.current?.scrollLeft||0,pause:0};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={(e)=>{if(drag.current.active&&rail.current)rail.current.scrollLeft=drag.current.left-(e.clientX-drag.current.x)*1.25}} onPointerUp={(e)=>{drag.current.active=false;drag.current.pause=performance.now()+800;e.currentTarget.releasePointerCapture(e.pointerId)}} onPointerCancel={()=>{drag.current.active=false}} onWheel={(e)=>{e.preventDefault();drag.current.pause=performance.now()+700;if(rail.current)rail.current.scrollLeft+=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*1.3}}>
    {[...proofs,...proofs].map((src,i)=><figure key={`${src}-${i}`} aria-hidden={i>=proofs.length||undefined} className={`v5-proof-card v5-accent-${i%5}`}><img src={src} alt={i<proofs.length?`Transformation story ${i+1}`:""} loading="lazy"/><figcaption><span>REAL STORY</span><b>{String(i%proofs.length+1).padStart(2,"0")}</b></figcaption></figure>)}
  </div>;
}

function Cursor() {
  const dot = useRef<HTMLDivElement>(null), aura = useRef<HTMLDivElement>(null), label = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches)return;
    let x=-100,y=-100,ax=-100,ay=-100,id=0;
    const move=(e:PointerEvent)=>{x=e.clientX;y=e.clientY;dot.current?.style.setProperty("transform",`translate3d(${x}px,${y}px,0)`);const target=(e.target as Element)?.closest("a,button,.v5-proof-card,.v5-ritual-card,.v5-day,.phone");const word=target?.matches("a,button")?"OPEN":target?.matches(".v5-proof-card")?"DRAG":target?"VIEW":"";aura.current?.classList.toggle("active",!!target);if(label.current){label.current.textContent=word;label.current.classList.toggle("active",!!word)}};
    const tick=()=>{ax+=(x-ax)*.14;ay+=(y-ay)*.14;aura.current?.style.setProperty("transform",`translate3d(${ax}px,${ay}px,0)`);label.current?.style.setProperty("transform",`translate3d(${ax+31}px,${ay+25}px,0)`);id=requestAnimationFrame(tick)};
    addEventListener("pointermove",move);id=requestAnimationFrame(tick);return()=>{removeEventListener("pointermove",move);cancelAnimationFrame(id)};
  },[]);
  return <><div ref={aura} className="v5-cursor-aura"/><div ref={dot} className="v5-cursor-dot"/><div ref={label} className="v5-cursor-label"/></>;
}

function MotionDirector() {
  useEffect(()=>{
    if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const root=document.querySelector<HTMLElement>(".v5");
    const sections=[...document.querySelectorAll<HTMLElement>(".v5 section")];
    const targets=[...document.querySelectorAll<HTMLElement>(".v5-button,.v5-button-secondary,.v5-mini-cta,.v5-ritual-card,.v5-proof-card,.v5-day,.v5-faq-list article")];
    root?.classList.add("v5-motion-ready");
    const observer=new IntersectionObserver((entries)=>entries.forEach(entry=>entry.target.classList.toggle("v5-in-view",entry.isIntersecting)),{threshold:.12,rootMargin:"0px 0px -8%"});
    sections.forEach(section=>observer.observe(section));
    const cleanups=targets.map(target=>{const move=(event:PointerEvent)=>{const rect=target.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width-.5;const y=(event.clientY-rect.top)/rect.height-.5;target.style.setProperty("--hover-x",`${x*12}px`);target.style.setProperty("--hover-y",`${y*10}px`);target.style.setProperty("--hover-r",`${x*3}deg`);target.classList.add("v5-physics-active")};const leave=()=>{target.classList.remove("v5-physics-active");target.style.setProperty("--hover-x","0px");target.style.setProperty("--hover-y","0px");target.style.setProperty("--hover-r","0deg")};target.addEventListener("pointermove",move);target.addEventListener("pointerleave",leave);return()=>{target.removeEventListener("pointermove",move);target.removeEventListener("pointerleave",leave)}});
    let frame=0;const update=()=>{for(const section of sections){const rect=section.getBoundingClientRect();const progress=Math.max(-1,Math.min(1,(innerHeight/2-(rect.top+rect.height/2))/(innerHeight+rect.height)*2));section.style.setProperty("--scene-progress",String(progress))}frame=0};const scroll=()=>{if(!frame)frame=requestAnimationFrame(update)};addEventListener("scroll",scroll,{passive:true});update();
    return()=>{observer.disconnect();cleanups.forEach(fn=>fn());removeEventListener("scroll",scroll);if(frame)cancelAnimationFrame(frame);root?.classList.remove("v5-motion-ready")};
  },[]);
  return null;
}

export default function V5Experience() {
  const [open,setOpen]=useState<number|null>(null);
  return <main className="v5" id="main">
    <MotionDirector/>
    <Cursor/>
    <nav className="v5-nav"><a href="#main" className="v5-brand">SUMAN<span>✦</span></a><div className="v5-navlinks"><a href="#ritual">RITUAL</a><a href="#proof">STORIES</a><a href="#saath">SAATH</a></div><a href={waReset} className="v5-mini-cta">LET'S TALK ↗</a></nav>

    <section className="v5-hero">
      <div className="v5-orbit v5-orbit-a"/><div className="v5-orbit v5-orbit-b"/><div className="v5-spark s1">✦</div><div className="v5-spark s2">✺</div><div className="v5-spark s3">●</div>
      <div className="v5-hero-content">
        <p className="v5-kicker"><span/>METABOLIC HEALTH COACH · FEEL GREAT SYSTEM · 90-DAY SUPPORT</p>
        <h1><span className="plain">ENERGY</span><span className="gradient">LOOKS GOOD</span><span className="plain">ON YOU.</span></h1>
        <p className="v5-hero-intro">A two-step daily ritual—not another diet—designed for modern women who want to feel energized, focused and completely in control.</p>
        <div className="v5-hero-steps" aria-label="Product overview">
          <article className="unimate"><small>STEP 01 · MORNING</small><b>UNIMATE</b><p>Energy · Clarity · Daily ritual</p></article>
          <article className="balance"><small>STEP 02 · BEFORE MEALS</small><b>BALANCE</b><p>Fiber · Simple rhythm · Support</p></article>
        </div>
        <div className="v5-hero-actions"><a href={waReset} className="v5-button">START YOUR RITUAL <b>↗</b></a><a href="#ritual" className="v5-button-secondary">SEE THE RITUAL ↓</a></div>
      </div>
      <div className="v5-marquee"><div>FEEL GOOD ✦ LOOK ALIVE ✦ MOVE DIFFERENT ✦ YOUR RITUAL ✦ YOUR MOMENT ✦ FEEL GOOD ✦ LOOK ALIVE ✦ MOVE DIFFERENT ✦</div></div>
    </section>

    <section className="v5-manifesto"><div className="v5-bg-word">RESET</div><p>SCROLL TO BREAK THE OLD LOOP</p><div className="v5-statements"><h2>NOT ANOTHER <i>DIET.</i></h2><h2>NOT ANOTHER <i>RESET.</i></h2><h2>A RITUAL THAT <em>MOVES.</em></h2></div></section>

    <section className="v5-ritual" id="ritual"><div className="v5-section-label"><span>01</span> THE TWO-STEP RITUAL</div><h2>TWO MOMENTS.<br/><span>ONE NEW RHYTHM.</span></h2><div className="v5-ritual-grid">
      <article className="v5-ritual-card morning"><div className="v5-card-no">01 / AM</div><img src="https://assets.cdn.filesafe.space/NGZ5Kh3Cb7Vo4u8VnD2Q/media/69cf5579849c507b526b51cd.png" alt="Unimate" loading="lazy"/><div><h3>WAKE UP<br/>WITH CLARITY.</h3><p>Begin the morning with a ritual that is simple enough to remember—and personal enough to make yours.</p></div></article>
      <article className="v5-ritual-card meal"><div className="v5-card-no">02 / MEALS</div><img src="https://assets.cdn.filesafe.space/NGZ5Kh3Cb7Vo4u8VnD2Q/media/69cf55134cde4bbc2a6d5b2c.png" alt="Balance" loading="lazy"/><div><h3>MOVE THROUGH<br/>MEALS WITH EASE.</h3><p>The before-meal step that turns a complicated plan into one beautifully clear habit.</p></div></article>
    </div></section>

    <section className="v5-proof" id="proof"><div className="v5-section-label"><span>02</span> REAL STORIES · REAL LIVES</div><div className="v5-proof-heading"><h2>PROOF HAS<br/><span>ITS OWN GLOW.</span></h2><p>The rail moves by itself. Grab it, swipe it, or use your wheel.<br/>Individual experiences vary.</p></div><ProofRail/></section>

    <section className="v5-story"><div className="v5-story-image"><img src="/photos/suman-transform.jpg" alt="Suman Bagriya's transformation" loading="lazy"/><span>HER STORY / HER REASON</span></div><div className="v5-story-copy"><div className="v5-section-label"><span>03</span> MEET YOUR GUIDE</div><h2>SHE TRIED IT<br/><i>FIRST.</i></h2><p>After years in health and wellness, Suman wanted something that could live beyond another strict plan. Her own experience became the reason she began guiding others—personally, patiently and without judgement.</p><blockquote>“Progress feels different when someone is walking beside you.”</blockquote></div></section>

    <section className="v5-saath" id="saath"><div className="v5-saath-copy"><div className="v5-section-label"><span>04</span> YOUR SUPPORT UNIVERSE</div><h2>YOU DON'T<br/>DO THIS <i>ALONE.</i></h2><p>Your workouts, weight, week and streak—held in one calm place. Saath keeps your momentum visible and Suman's guidance close.</p><Link to="/saath" className="v5-button cyan">ENTER SAATH <b>↗</b></Link></div><div className="v5-phones"><div className="phone one"><img src="/saath-shots/02-home.png" alt="Saath home" loading="lazy"/></div><div className="phone two"><img src="/saath-shots/08-stats.png" alt="Saath progress" loading="lazy"/></div><div className="v5-ring-text">TOGETHER ✦ TOGETHER ✦</div></div></section>

    <section className="v5-journey"><div className="v5-section-label"><span>05</span> THE 90-DAY ARC</div><h2>WATCH YOUR<br/><span>MOMENTUM GROW.</span></h2><div className="v5-timeline">{journey.map(([day,title],i)=><article key={day} className={`v5-day d${i}`}><small>{i===0?"WEEK":"DAY"}</small><b>{day}</b><p>{title}</p></article>)}</div><p className="v5-disclaimer">A framework for consistency, not a promise of a particular result.</p></section>

    <section className="v5-faq"><div><div className="v5-section-label"><span>06</span> ASK EVERYTHING</div><h2>GOOD<br/>QUESTIONS<br/><i>WELCOME.</i></h2></div><div className="v5-faq-list">{faqs.map(([q,a],i)=><article key={q}><button onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i}><span>{q}</span><b>{open===i?"−":"+"}</b></button><div className={open===i?"open":""}><p>{a}</p></div></article>)}</div></section>

    <section className="v5-finale"><div className="v5-finale-orb"/><p>YOUR NEXT CHAPTER DOESN'T NEED A PERFECT MONDAY.</p><h2>START<br/><span>NOW.</span></h2><a href={waReset} className="v5-button finale">TALK TO SUMAN ON WHATSAPP <b>↗</b></a><div className="v5-footer"><span>SUMAN BAGRIYA © 2026</span><div><a href={ORDER}>PRODUCTS</a><a href={IG}>INSTAGRAM</a><Link to="/v4">VIEW V4</Link></div></div></section>
  </main>;
}
