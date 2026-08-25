import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SAATH, WA, waReset } from "@/lib/links";

const items = [
  { href: "/#about", label: "About" },
  { href: "/#photos", label: "Photos" },
  { href: "/#product", label: "System" },
  { href: SAATH, label: "Saath" },
  { href: "/#business", label: "Business" },
  { href: "/#faq", label: "Q&A" },
];

export default function SiteNav({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-black/[0.07] bg-paper/92 backdrop-blur-md" : "bg-paper/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-[3.5%] py-4">
        <Link to="/" className="flex items-center gap-2.5 text-ink">
          <img src="/brand/suman-mark.svg" alt="" width="28" height="28" className="rounded-[4px]" />
          <span className="font-display text-[22px] leading-none tracking-tight">Suman Bagriya</span>
        </Link>
        <nav className="hidden items-center gap-6 font-mono text-[11px] tracking-[0.12em] text-ink/80 lg:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={current === item.label.toLowerCase() ? "text-ink" : "hover:text-ink"}
            >
              {item.label.toUpperCase()}
            </a>
          ))}
          <a
            href={waReset}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[5px] bg-brick-solid px-4 py-[10px] text-[11px] tracking-[0.14em] text-white hover:bg-brick-dark"
          >
            START
          </a>
        </nav>
        <button
          className="p-2 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="flex max-h-[calc(100dvh-4.5rem)] flex-col overflow-y-auto bg-paper px-[3.5%] pt-6 pb-10 lg:hidden">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display block border-b border-black/[0.07] py-5 text-[40px] leading-none"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a href={WA} className="font-mono mt-8 text-[12px] tracking-[0.14em] text-muted">
            +91 99204 04375
          </a>
          <a href={waReset} target="_blank" rel="noopener noreferrer" className="btn-brick mt-6 w-full">
            Start the Reset
          </a>
        </div>
      )}
    </header>
  );
}
