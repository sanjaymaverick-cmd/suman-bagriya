import { CENTER_PORTRAIT } from "@/lib/photos";

export default function SumanHero({ onSelect }: { onSelect?: (url: string) => void }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] flex items-start justify-center pt-24 sm:items-center sm:pt-8 sm:pb-[26vh]">
      <button
        type="button"
        onClick={() => onSelect?.(CENTER_PORTRAIT)}
        className="suman-hero-float pointer-events-auto cursor-zoom-in"
        aria-label="Portrait of Suman Bagriya — open"
      >
        <span className="suman-hero-frame">
          <img
            src={CENTER_PORTRAIT}
            alt="Suman Bagriya"
            width={600}
            height={800}
            draggable={false}
          />
        </span>
        <span className="font-mono mt-2 block text-center text-[10px] tracking-[0.18em] text-ink/45 uppercase">
          Suman Bagriya
        </span>
      </button>
    </div>
  );
}
