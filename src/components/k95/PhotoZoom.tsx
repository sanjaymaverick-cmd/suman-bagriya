import { useEffect, useMemo, useRef } from "react";

export default function PhotoZoom({
  url,
  urls,
  onClose,
  onPrev,
  onNext,
}: {
  url: string | null;
  urls: string[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusTo = useRef<Element | null>(null);

  useEffect(() => {
    if (!url) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [url, onClose, onPrev, onNext]);

  // The page used to keep scrolling behind the lightbox. Lock the body, and mark the
  // overlay so Lenis hands wheel events back to the browser instead of scrolling the page.
  // Runs on open/close only — not on every arrow press.
  const open = url !== null;
  useEffect(() => {
    if (!open) return;
    returnFocusTo.current = document.activeElement;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      (returnFocusTo.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  const index = useMemo(() => (url ? urls.indexOf(url) : -1), [url, urls]);
  if (!url) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      data-lenis-prevent
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#111111]/72 px-4 py-8 backdrop-blur-md"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        className="font-mono absolute top-5 right-5 z-10 inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-[12px] tracking-[0.16em] text-white/80 uppercase hover:text-white"
        onClick={onClose}
      >
        Close
      </button>
      <button
        className="font-mono absolute top-1/2 left-4 z-10 inline-flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center text-[22px] text-white/70 hover:text-white"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous photo"
      >
        ←
      </button>
      <button
        className="font-mono absolute top-1/2 right-4 z-10 inline-flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center text-[22px] text-white/70 hover:text-white"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next photo"
      >
        →
      </button>
      <figure
        className="photo-zoom-in relative max-h-[88vh] max-w-[92vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={url}
          alt="Proof"
          className="max-h-[88vh] max-w-[92vw] rounded-[5px] object-contain shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
        />
        <figcaption className="font-mono mt-4 text-center text-[11px] tracking-[0.16em] text-white/70 uppercase">
          {index >= 0 ? `${index + 1} / ${urls.length}` : "Proof"} · click outside to close
        </figcaption>
      </figure>
    </div>
  );
}
