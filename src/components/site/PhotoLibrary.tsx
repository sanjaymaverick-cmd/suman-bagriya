import { useState } from "react";
import { CURATED, isGalleryPhoto } from "@/lib/photos";
import PhotoZoom from "@/components/k95/PhotoZoom";

// The curated list is a static constant, so resolve it during render instead of in an
// effect. Loading it client-side meant #photos did not exist in the server HTML: the
// nav anchor had nothing to target before hydration and crawlers saw no gallery at all.
const photos = CURATED.filter(isGalleryPhoto);

export default function PhotoLibrary() {
  const [selected, setSelected] = useState<string | null>(null);

  if (photos.length === 0) return null;

  return (
    <section id="photos" className="relative scroll-mt-24 px-[3.5%] py-24 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <p className="font-mono mb-6 text-[12px] tracking-[0.16em] text-muted uppercase">Proof</p>
        <h2 className="font-display mb-[72px] max-w-[14ch] text-[clamp(48px,8vw,96px)]">
          Results, not stock.
        </h2>
        <p className="font-mono mb-10 text-[12px] tracking-[0.12em] text-muted">
          {photos.length} photographs · click to zoom
        </p>
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 lg:gap-4">
          {photos.map((src, i) => (
            <figure key={src} className="mb-3 break-inside-avoid lg:mb-4">
              <button
                type="button"
                onClick={() => setSelected(src)}
                // The image is decorative, so the button had no accessible name at all.
                aria-label={`Open photograph ${i + 1} of ${photos.length}`}
                className="block w-full"
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-[5px] object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </button>
            </figure>
          ))}
        </div>
      </div>
      <PhotoZoom
        url={selected}
        urls={photos}
        onClose={() => setSelected(null)}
        onPrev={() => {
          if (!selected) return;
          const i = photos.indexOf(selected);
          setSelected(photos[(i - 1 + photos.length) % photos.length]);
        }}
        onNext={() => {
          if (!selected) return;
          const i = photos.indexOf(selected);
          setSelected(photos[(i + 1) % photos.length]);
        }}
      />
    </section>
  );
}
