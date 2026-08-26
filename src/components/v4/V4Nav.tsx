import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { waReset } from "@/lib/links";

export default function V4Nav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between rounded-full border border-[#6f594b]/15 bg-[#f4efe8]/80 px-4 py-3 backdrop-blur-xl sm:px-6">
        <Link to="/v4" className="flex items-center gap-2.5" aria-label="Suman Bagriya V4 home">
          <img src="/brand/suman-mark.svg" alt="" width="24" height="24" className="rounded-full" />
          <span className="text-[11px] font-semibold tracking-[0.16em] uppercase">Suman Bagriya</span>
        </Link>
        <nav className="hidden items-center gap-7 text-[10px] font-medium tracking-[0.16em] uppercase md:flex" aria-label="V4 navigation">
          <a href="#ritual">The ritual</a>
          <a href="#stories">Stories</a>
          <a href="#saath-v4">Saath</a>
          <Link to="/">Versions</Link>
        </nav>
        <div className="flex items-center gap-2">
          <a className="rounded-full bg-[#171310] px-5 py-2.5 text-[10px] tracking-[0.16em] text-white uppercase" href={waReset} target="_blank" rel="noopener noreferrer">Start</a>
          <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={open} aria-controls="v4-mobile-menu" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#6f594b]/20 text-lg md:hidden">{open ? "×" : "≡"}</button>
        </div>
      </div>
      {open && <nav id="v4-mobile-menu" aria-label="V4 mobile navigation" className="mx-auto mt-2 flex max-w-[1500px] flex-col rounded-[24px] border border-[#6f594b]/15 bg-[#f4efe8] p-6 text-[24px] leading-none shadow-xl md:hidden">{[["#ritual","The ritual"],["#stories","Stories"],["#saath-v4","Saath"]].map(([href,label])=><a key={href} href={href} onClick={()=>setOpen(false)} className="v4-display border-b border-[#6f594b]/15 py-4">{label}</a>)}<Link to="/" onClick={()=>setOpen(false)} className="v4-display py-4">View all versions</Link></nav>}
    </header>
  );
}
