import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { IG, ORDER, waReset } from "@/lib/links";
import "./v5-studio.css";

const ACCENTS = ["#ff3af2", "#00f5d4", "#ffe600", "#ff6b35", "#7b2fff"];
const PROOFS = ["12.jpg", "20.png", "30.jpg", "36.jpg", "37.jpg", "40.jpg"].map((f) => `/photos/proof/proof-${f}`);
const FAQ = [
  ["What is the daily ritual?", "Unimate is the morning step and Balance is the before-meal step. Suman helps you understand the routine and stay consistent."],
  ["Is this another diet plan?", "No. The programme is presented as a simple daily ritual rather than a calorie-counting plan. Individual needs and experiences vary."],
  ["What support do I receive?", "Personal guidance from Suman, help with the protocol, progress tracking and access to the Saath client experience after confirmation."],
  ["Can I speak with Suman first?", "Yes. The main action opens WhatsApp so you can ask questions before making a decision."],
  ["What if I take medication?", "Speak with a qualified medical professional before changing supplements, diet or medication, especially when managing an existing condition."],
];

function Magnetic({ children, className = "", href }: { children: React.ReactNode; className?: string; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${(event.clientX - box.left - box.width / 2) * .16}px`);
    event.currentTarget.style.setProperty("--my", `${(event.clientY - box.top - box.height / 2) * .16}px`);
  };
  const reset = () => { ref.current?.style.setProperty("--mx", "0px"); ref.current?.style.setProperty("--my", "0px"); };
  return <a ref={ref} href={href} className={`v5x-magnetic ${className}`} onPointerMove={move} onPointerLeave={reset}>{children}</a>;
}

function Cursor() {
  const core = useRef<HTMLDivElement>(null), ring = useRef<HTMLDivElement>(null), word = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    let x = -80, y = -80, rx = -80, ry = -80, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      core.current?.style.setProperty("transform", `translate3d(${x}px,${y}px,0)`);
      const hit = (e.target as Element)?.closest("a,button,.v5x-card,.v5x-proof");
      const label = hit?.matches(".v5x-proof") ? "DRAG" : hit ? "OPEN" : "";
      ring.current?.classList.toggle("is-hot", !!hit);
      if (word.current) { word.current.textContent = label; word.current.classList.toggle("is-hot", !!label); }
    };
    const loop = () => { rx += (x-rx)*.13; ry += (y-ry)*.13; ring.current?.style.setProperty("transform",`translate3d(${rx}px,${ry}px,0)`); word.current?.style.setProperty("transform",`translate3d(${rx+30}px,${ry+25}px,0)`); raf=requestAnimationFrame(loop); };
    addEventListener("pointermove", move); raf=requestAnimationFrame(loop);
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return <><div ref={ring} className="v5x-cursor-ring"/><div ref={core} className="v5x-cursor-core"/><div ref={word} className="v5x-cursor-word"/></>;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 56, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: false, amount: .2 }} transition={{ duration: .85, ease: [.16,1,.3,1] }}>{children}</motion.div>;
}

function Hero() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const y = useTransform(smooth, [0,.12], [0,130]);
  const opacity = useTransform(smooth, [0,.1], [1,0]);
  return <section className="v5x-hero" id="top">
    <div className="v5x-mesh"/><div className="v5x-dots"/>
    <div className="v5x-particles" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i} style={{"--i":i,"--c":ACCENTS[i%5]} as CSSProperties}/>)}</div>
    <motion.div className="v5x-hero-inner" style={{ y, opacity }}>
      <div className="v5x-eyebrow"><i/> METABOLIC HEALTH COACH · FEEL GREAT SYSTEM · 90-DAY SUPPORT</div>
      <h1><span>ENERGY</span><em>LOOKS GOOD</em><span>ON YOU.</span></h1>
      <p>A two-step daily ritual—not another diet—designed for modern women who want to feel energized, focused and completely in control.</p>
      <div className="v5x-hero-products">
        <article className="cyan"><small>STEP 01 · MORNING</small><b>UNIMATE</b><span>Energy · Clarity · Daily ritual</span><i>☀</i></article>
        <article className="pink"><small>STEP 02 · BEFORE MEALS</small><b>BALANCE</b><span>Fiber · Simple rhythm · Support</span><i>✦</i></article>
      </div>
      <div className="v5x-actions"><Magnetic href={waReset} className="primary">START YOUR RITUAL ↗</Magnetic><a href="#ritual" className="secondary">SEE THE RITUAL ↓</a></div>
    </motion.div>
    <div className="v5x-scrollcue">SCROLL <i/></div>
  </section>;
}

function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start","end end"] });
  const y1=useTransform(scrollYProgress,[0,.28],[80,0]), o1=useTransform(scrollYProgress,[0,.18],[0,1]);
  const y2=useTransform(scrollYProgress,[.25,.55],[80,0]), o2=useTransform(scrollYProgress,[.2,.48],[.08,1]);
  const y3=useTransform(scrollYProgress,[.55,.88],[100,0]), o3=useTransform(scrollYProgress,[.5,.8],[.06,1]);
  return <section ref={ref} className="v5x-manifesto"><div className="v5x-manifesto-sticky"><div className="v5x-ghost">RITUAL</div><motion.h2 style={{y:y1,opacity:o1}}>NOT ANOTHER DIET</motion.h2><motion.h2 style={{y:y2,opacity:o2}}>NOT ANOTHER RESET</motion.h2><motion.h2 style={{y:y3,opacity:o3}}>A RITUAL THAT<br/>MOVES WITH YOU</motion.h2></div></section>;
}

function Ritual() {
  return <section className="v5x-section v5x-ritual" id="ritual"><div className="v5x-giant">RITUAL</div><Reveal className="v5x-heading"><small>THE TWO-STEP SYSTEM</small><h2>Your Daily Ritual</h2></Reveal><div className="v5x-product-grid">
    {[{n:"01",time:"MORNING",name:"UNIMATE",copy:"Begin with energy and clarity—one simple morning step that is easy to remember.",img:"https://assets.cdn.filesafe.space/NGZ5Kh3Cb7Vo4u8VnD2Q/media/69cf5579849c507b526b51cd.png",tone:"cyan"},{n:"02",time:"BEFORE MEALS",name:"BALANCE",copy:"The before-meal step that turns a complicated plan into one beautifully clear habit.",img:"https://assets.cdn.filesafe.space/NGZ5Kh3Cb7Vo4u8VnD2Q/media/69cf55134cde4bbc2a6d5b2c.png",tone:"pink"}].map((p,i)=><motion.article key={p.name} className={`v5x-card v5x-product-card ${p.tone}`} initial={{opacity:0,x:i?-70:70,rotate:i?2:-2}} whileInView={{opacity:1,x:0,rotate:i?1:-1}} viewport={{amount:.25}} transition={{duration:.8,ease:[.16,1,.3,1]}} whileHover={{y:-12,rotate:i?2:-2,scale:1.015}}><div className="v5x-card-label"><b>STEP {p.n}</b><span>{p.time}</span></div><div className="v5x-product-stage"><div/><img src={p.img} alt={p.name} loading="lazy"/></div><h3>{p.name}</h3><p>{p.copy}</p><Magnetic href={waReset}>ASK SUMAN ↗</Magnetic></motion.article>)}
  </div></section>;
}

function ProofRail() {
  const rail=useRef<HTMLDivElement>(null), drag=useRef({on:false,x:0,left:0,pause:0});
  useEffect(()=>{const el=rail.current;if(!el||matchMedia("(prefers-reduced-motion: reduce)").matches)return;let id=0,last=performance.now();const loop=(now:number)=>{const dt=Math.min(now-last,40);last=now;if(!drag.current.on&&now>drag.current.pause){el.scrollLeft+=dt*.05;if(el.scrollLeft>=el.scrollWidth/2)el.scrollLeft-=el.scrollWidth/2}id=requestAnimationFrame(loop)};id=requestAnimationFrame(loop);return()=>cancelAnimationFrame(id)},[]);
  return <div ref={rail} className="v5x-proof-rail" onPointerDown={e=>{drag.current={on:true,x:e.clientX,left:rail.current?.scrollLeft||0,pause:0};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(drag.current.on&&rail.current)rail.current.scrollLeft=drag.current.left-(e.clientX-drag.current.x)*1.2}} onPointerUp={e=>{drag.current.on=false;drag.current.pause=performance.now()+700;e.currentTarget.releasePointerCapture(e.pointerId)}}>{[...PROOFS,...PROOFS].map((src,i)=><motion.figure key={`${src}-${i}`} className="v5x-proof" aria-hidden={i>=PROOFS.length||undefined} whileHover={{y:-18,rotate:i%2?2:-2,scale:1.025}}><img src={src} alt={i<PROOFS.length?`Transformation story ${i+1}`:""} loading="lazy"/><figcaption><span>REAL STORY</span><b>{String(i%PROOFS.length+1).padStart(2,"0")}</b></figcaption></motion.figure>)}</div>;
}

function Stories() { return <section className="v5x-section v5x-stories" id="stories"><Reveal className="v5x-heading split"><div><small>REAL STORIES · REAL LIVES</small><h2>Proof has<br/><em>its own glow.</em></h2></div><p>The gallery moves by itself. Grab, swipe or scroll through verified transformation photographs.<br/><b>Individual experiences vary.</b></p></Reveal><ProofRail/></section>; }

function Story() { return <section className="v5x-story"><motion.div className="v5x-story-photo" initial={{clipPath:"inset(12% 18% 12% 18% round 40px)"}} whileInView={{clipPath:"inset(0% 0% 0% 0% round 0px)"}} viewport={{amount:.25}} transition={{duration:1,ease:[.16,1,.3,1]}}><img src="/photos/suman-transform.jpg" alt="Suman Bagriya's transformation" loading="lazy"/><span>HER STORY · HER REASON</span></motion.div><Reveal className="v5x-story-copy"><small>MEET YOUR GUIDE</small><h2>SHE TRIED<br/>IT <em>FIRST.</em></h2><p>After years in health and wellness, Suman wanted something that could live beyond another strict plan. Her own experience became the reason she began guiding others—personally, patiently and without judgement.</p><blockquote>“Progress feels different when someone is walking beside you.”</blockquote></Reveal></section>; }

function Saath() { return <section className="v5x-section v5x-saath" id="saath"><Reveal className="v5x-saath-copy"><small>YOUR SUPPORT UNIVERSE</small><h2>YOU DON'T DO<br/>THIS <em>ALONE.</em></h2><p>Your workouts, weight, week and streak—held in one calm place. Saath keeps momentum visible and Suman's guidance close.</p><Link to="/saath" className="v5x-link">ENTER SAATH ↗</Link></Reveal><div className="v5x-phone-stage"><motion.div className="v5x-phone one" whileHover={{rotate:-3,y:-12}}><img src="/saath-shots/02-home.png" alt="Saath home" loading="lazy"/></motion.div><motion.div className="v5x-phone two" whileHover={{rotate:3,y:-12}}><img src="/saath-shots/08-stats.png" alt="Saath progress" loading="lazy"/></motion.div><div className="v5x-orbit-copy">TOGETHER ✦ TOGETHER ✦</div></div></section>; }

function Journey() { const beats=[["WEEK","01","Find the rhythm"],["DAY","30","Notice the shift"],["DAY","60","Make it yours"],["DAY","90","See your momentum"]];return <section className="v5x-section v5x-journey" id="journey"><Reveal className="v5x-heading"><small>THE 90-DAY ARC</small><h2>Momentum,<br/><em>made visible.</em></h2></Reveal><div className="v5x-days">{beats.map(([kind,n,label],i)=><motion.article key={n} className="v5x-card" style={{"--accent":ACCENTS[i%5]} as CSSProperties} initial={{opacity:0,y:90,rotate:i%2?4:-4}} whileInView={{opacity:1,y:i%2?55:0,rotate:i%2?2:-2}} viewport={{amount:.25}} transition={{duration:.7,delay:i*.1,ease:[.16,1,.3,1]}} whileHover={{scale:1.04,rotate:0}}><small>{kind}</small><b>{n}</b><p>{label}</p></motion.article>)}</div><p className="v5x-note">A framework for consistency, not a promise of a particular result.</p></section>; }

function Faq() { const [open,setOpen]=useState<number|null>(0);return <section className="v5x-section v5x-faq" id="faq"><Reveal className="v5x-faq-title"><small>ASK EVERYTHING</small><h2>GOOD<br/>QUESTIONS<br/><em>WELCOME.</em></h2></Reveal><div className="v5x-faq-list">{FAQ.map(([q,a],i)=><motion.article key={q} className="v5x-card" whileHover={{x:8}}><button onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i}><span>{q}</span><b>{open===i?"−":"+"}</b></button><div className={open===i?"open":""}><p>{a}</p></div></motion.article>)}</div></section>; }

function Finale() { return <section className="v5x-finale"><div className="v5x-finale-mesh"/><Reveal><small>YOUR TRANSFORMATION AWAITS</small><h2>YOUR RITUAL<br/><em>STARTS NOW.</em></h2><p>Start with a five-minute WhatsApp conversation. Ask questions, understand the ritual and decide without pressure.</p><Magnetic href={waReset} className="primary large">SPEAK WITH SUMAN ↗</Magnetic><div className="v5x-final-links"><a href={ORDER}>VIEW PRODUCTS</a><a href={IG}>INSTAGRAM</a><Link to="/saath">EXPLORE SAATH</Link></div></Reveal><footer><b>SUMAN BAGRIYA</b><span>Individual experiences vary. Always consult your healthcare provider.</span></footer></section>; }

export default function V5Studio() {
  return <main className="v5x" id="main"><Cursor/><div className="v5x-versions" aria-label="Design versions"><Link to="/">V1</Link><Link to="/v2">V2</Link><Link to="/v3">V3</Link><Link to="/v4">V4</Link><span>V5</span></div><nav className="v5x-nav"><a href="#top" className="v5x-logo">SUMAN BAGRIYA <i>✦</i></a><div><a href="#ritual">RITUAL</a><a href="#stories">STORY</a><a href="#journey">JOURNEY</a><a href="#faq">FAQ</a></div><Magnetic href={waReset}>START RITUAL ↗</Magnetic></nav><Hero/><Manifesto/><Ritual/><Stories/><Story/><Saath/><Journey/><Faq/><Finale/></main>;
}
