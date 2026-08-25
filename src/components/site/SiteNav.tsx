import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { SAATH, waReset } from "@/lib/links";

const items = [
  { href: "/#about", label: "About" },
  { href: "/#product", label: "System" },
  { href: SAATH, label: "Saath" },
  { href: "/#business", label: "Business" },
  { href: "/#faq", label: "Q&A" },
];

export default function SiteNav({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.07] bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-[3.5%] py-4">
        <Link to="/" className="font-display text-[22px] leading-none tracking-tight">
          Suman Bagriya
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
            className="rounded-[5px] bg-brick px-4 py-[10px] text-[11px] tracking-[0.14em] text-white hover:bg-brick-dark"
          >
            START
          </a>
        </nav>
        <button className="p-2 lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-black/[0.07] px-[3.5%] py-4 lg:hidden">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-neue block py-3 text-sm"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a href={waReset} target="_blank" rel="noopener noreferrer" className="btn-brick mt-2 w-full">
            Start the Reset
          </a>
        </div>
      )}
    </header>
  );
}
