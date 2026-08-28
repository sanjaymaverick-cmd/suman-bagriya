import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { WA, waReset } from "@/lib/links";

export default function V2Nav() {
  const [open, setOpen] = useState(false);

  // The panel is a plain disclosure, not a dialog, so Radix is not involved — but a
  // full-width overlay that swallows the page and cannot be dismissed with Escape is a
  // keyboard trap in everything but name.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-[4%] pt-5">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full bg-[#f3ede2] px-2 py-2 pl-5 text-[#111]">
        {/* Stays inside V2 — the menu already offers the original site explicitly. */}
        <Link to="/v2" className="flex items-center gap-2 text-[15px]">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#111]/15">
            <img src="/brand/suman-mark.svg" alt="" width="16" height="16" />
          </span>
          <span>Suman</span>
          <span className="text-[#111]/45">Bagriya</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="v2-menu"
          className="rounded-full bg-[#111] px-5 py-2.5 text-[13px] text-[#f3ede2]"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav
          id="v2-menu"
          aria-label="Main"
          className="mx-auto mt-3 flex max-w-[1400px] flex-col rounded-[28px] bg-[#f3ede2] px-7 py-7 text-[#111]"
        >
          {[
            { href: "#gallery", label: "Drag to explore" },
            { href: "#about", label: "About" },
            { href: "#system", label: "The system" },
            { href: "#saath", label: "Saath" },
            { href: "#business", label: "Build with me" },
            { href: "#faq", label: "Questions" },
            { href: "/", label: "V1 — Original site", internal: true },
            { href: "/v3", label: "V3", internal: true },
            { href: "/v4", label: "V4 — Metabolic Muse", internal: true },
            { href: "/v5", label: "V5", internal: true },
          ].map((item) =>
            item.internal ? (
              <Link
                key={item.href}
                to={item.href}
                className="border-b border-[#111]/10 py-4 text-[30px] leading-none"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="border-b border-[#111]/10 py-4 text-[30px] leading-none"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ),
          )}
          <a
            href={waReset}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#111] px-6 py-3.5 text-[13px] tracking-[0.1em] text-[#f3ede2] uppercase"
          >
            Start the Reset
          </a>
          <a
            href={WA}
            className="tap-target mt-4 self-start text-[12px] tracking-[0.1em] text-[#111]/70"
          >
            +91 99204 04375
          </a>
        </nav>
      )}
    </header>
  );
}