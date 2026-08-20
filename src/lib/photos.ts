const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

export function isGalleryPhoto(url: string) {
  return IMAGE_EXT.test(url) && !url.endsWith("list.json");
}

export async function loadPhotoList(): Promise<string[]> {
  const res = await fetch("/photos/list.json", { cache: "no-store" });
  if (!res.ok) return [];
  const data: unknown = await res.json();
  if (!Array.isArray(data)) return [];
  return data.filter((u): u is string => typeof u === "string" && isGalleryPhoto(u));
}

const SKIP = ["proof-01.png", "proof-45.png", "suman-center.png"];

export function surroundingPhotos(all: string[], center: string) {
  return all.filter((u) => u !== center && !SKIP.some((s) => u.endsWith(s)));
}
