import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { WA, waReset } from "@/lib/links";

// #saath was a real section with nothing pointing at it; the tracker is the strongest
// differentiator on the page, so it earns a nav slot.
const items = [
  { href: "#offerings", label: "Offerings" },
  { href: "#results", label: "Results" },
  { href: "#saath", label: "Saath" },
  { href: "#start", label: "Start" },
];

export default function V3Nav() {
  const [open, setOpen] = useState(false);

  // Escape closes the sheet; without it the only way out is the (now hidden) toggle.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-[5%] pt-5">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between rounded-full border border-white/10 bg-[#0c0b0a]/80 px-5 py-3 text-[#f3ede2] backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/brand/suman-mark.svg"
            alt=""
            width="24"
            height="24"
            className="rounded-[4px]"
          />
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase">Suman Bagriya</span>
        </Link>
        {/* Six links plus a pill plus the wordmark measured ~770px, which overflowed the
            md (768px) row. The inline nav now starts at lg and tablets get the sheet. */}
        <nav className="hidden items-center gap-7 font-mono text-[11px] tracking-[0.16em] text-[#f3ede2]/70 uppercase lg:flex">
          {items.map((item) => (
            <a key={item.href} href={item.href} className="tap-target hover:text-[#f3ede2]">
              {item.label}
            </a>
          ))}
          <span aria-hidden="true" className="h-3 w-px bg-white/15" />
          <Link to="/v2" className="tap-target hover:text-[#f3ede2]">
            V2
          </Link>
          <Link to="/" className="tap-target hover:text-[#f3ede2]">
            Original
          </Link>
          <a
            href={waReset}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brick-solid px-4 py-2 text-[11px] tracking-[0.14em] text-white hover:bg-brick-dark"
          >
            Start
          </a>
        </nav>
        <button
          className="p-1.5 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="v3-menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div
          id="v3-menu"
          className="mx-auto mt-3 flex max-h-[calc(100dvh-8rem)] max-w-[1320px] flex-col overflow-y-auto rounded-[24px] border border-white/10 bg-[#0c0b0a] px-6 py-6 text-[#f3ede2] lg:hidden"
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-editorial-serif border-b border-white/10 py-4 text-[32px] leading-none"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/v2"
            onClick={() => setOpen(false)}
            className="font-editorial-serif border-b border-white/10 py-4 text-[32px] leading-none"
          >
            V2
          </Link>
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="font-editorial-serif border-b border-white/10 py-4 text-[32px] leading-none"
          >
            Original site
          </Link>
          <a
            href={waReset}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-dark-solid mt-6 justify-center"
          >
            Start the Reset
          </a>
          <a
            href={WA}
            className="tap-target font-mono mt-5 self-start text-[12px] tracking-[0.14em] text-[#f3ede2]/50"
          >
            +91 99204 04375
          </a>
        </div>
      )}
    </header>
  );
}
