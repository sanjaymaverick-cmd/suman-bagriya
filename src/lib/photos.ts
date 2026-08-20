const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

export function isGalleryPhoto(url: string) {
  return IMAGE_EXT.test(url) && !url.endsWith("list.json");
}

/** Locked 40 — results, chats, her. Not the 1,200 dump. */
export const CURATED: string[] = [
  "/photos/proof/proof-02.png",
  "/photos/proof/proof-03.png",
  "/photos/proof/proof-04.png",
  "/photos/proof/proof-05.png",
  "/photos/proof/proof-06.png",
  "/photos/proof/proof-07.png",
  "/photos/proof/proof-08.png",
  "/photos/proof/proof-09.png",
  "/photos/proof/proof-10.png",
  "/photos/proof/proof-11.png",
  "/photos/proof/proof-12.jpg",
  "/photos/proof/proof-13.jpg",
  "/photos/proof/proof-14.jpg",
  "/photos/proof/proof-15.png",
  "/photos/proof/proof-16.jpg",
  "/photos/proof/proof-17.jpg",
  "/photos/proof/proof-18.jpg",
  "/photos/proof/proof-19.png",
  "/photos/proof/proof-20.png",
  "/photos/proof/proof-21.png",
  "/photos/proof/proof-22.png",
  "/photos/proof/proof-23.jpg",
  "/photos/proof/proof-24.png",
  "/photos/proof/proof-25.png",
  "/photos/proof/proof-26.jpg",
  "/photos/proof/proof-27.png",
  "/photos/proof/proof-28.jpg",
  "/photos/proof/proof-29.png",
  "/photos/proof/proof-30.jpg",
  "/photos/proof/proof-32.jpg",
  "/photos/p1.jpg",
  "/photos/p2.jpg",
  "/photos/p3.jpg",
  "/photos/p5.jpg",
  "/photos/p6.jpg",
  "/photos/p8.jpg",
  "/photos/p10.jpg",
  "/photos/p12.jpg",
  "/photos/p15.jpg",
  "/photos/p18.jpg",
];

export async function loadPhotoList(): Promise<string[]> {
  return CURATED.filter(isGalleryPhoto);
}

const SKIP = ["proof-01.png", "proof-45.png", "suman-center.png", "suman-depth.jpg", "suman-face.jpg"];

export function surroundingPhotos(all: string[], center: string) {
  return all.filter((u) => u !== center && !SKIP.some((s) => u.endsWith(s)));
}
