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

// Design explorations live alongside the site proper — v2 and v3 already cross-link
// each other and back here, so this closes the loop rather than leaving them
// reachable only by typing the URL.
const explorations = [
  { href: "/v2", label: "V2" },
  { href: "/v3", label: "V3" },
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

  // Escape closed nothing before: the panel covers the page, so it needs a keyboard exit.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-black/[0.07] bg-paper/92 backdrop-blur-md"
          : "bg-paper/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-[3.5%] py-4">
        <Link to="/" className="flex items-center gap-2.5 text-ink">
          <img
            src="/brand/suman-mark.svg"
            alt=""
            width="28"
            height="28"
            className="rounded-[4px]"
          />
          <span className="font-display text-[22px] leading-none tracking-tight">
            Suman Bagriya
          </span>
        </Link>
        <nav className="hidden items-center gap-6 font-mono text-[11px] tracking-[0.12em] text-ink/80 lg:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={current === item.label.toLowerCase() ? "page" : undefined}
              // The current page used to differ from the rest by ink/80 vs ink — invisible.
              className={`tap-target ${
                current === item.label.toLowerCase()
                  ? "text-ink underline decoration-brick decoration-2 underline-offset-[6px]"
                  : "hover:text-ink"
              }`}
            >
              {item.label.toUpperCase()}
            </a>
          ))}
          <span className="h-4 w-px bg-black/15" aria-hidden="true" />
          {explorations.map((item) => (
            <a key={item.href} href={item.href} className="tap-target hover:text-ink">
              {item.label}
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
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {/* min-h as well as max-h: the panel used to stop ~100px short of the bottom on an
          812px screen, leaving the 3D hero showing beneath the menu. */}
      {open && (
        <div
          id="site-menu"
          className="flex max-h-[calc(100dvh-4.5rem)] min-h-[calc(100dvh-4.5rem)] flex-col overflow-y-auto bg-paper px-[3.5%] pt-6 pb-10 lg:hidden"
        >
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
          <p className="font-mono mt-8 text-[11px] tracking-[0.16em] text-muted uppercase">
            Design explorations
          </p>
          <div className="mt-3 flex gap-3">
            {explorations.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="tap-target font-mono rounded-[5px] border border-black/15 px-4 py-2 text-[13px] tracking-[0.1em]"
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target font-mono mt-8 self-start text-[12px] tracking-[0.14em] text-muted"
          >
            +91 99204 04375
          </a>
          <a
            href={waReset}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brick mt-6 w-full"
          >
            Start the Reset
          </a>
        </div>
      )}
    </header>
  );
}
