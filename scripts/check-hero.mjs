import { chromium } from "playwright";

const URL = process.argv[2] || "http://127.0.0.1:8080/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console:${msg.text()}`);
});

await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(3500);

const report = await page.evaluate(() => {
  const canvas = document.querySelector("[data-hero] canvas") || document.querySelector("canvas");
  const heroRoot = document.querySelector("[data-hero]");
  const framed = document.querySelector(".suman-hero-frame img");
  const canoe = [...document.querySelectorAll("img")].find((img) => {
    const src = img.getAttribute("src") || "";
    const r = img.getBoundingClientRect();
    return src.includes("suman-hero.jpg") && r.width > 80 && r.y < window.innerHeight;
  });
  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName,
      src: el.getAttribute?.("src"),
      w: Math.round(r.width),
      h: Math.round(r.height),
      x: Math.round(r.x),
      y: Math.round(r.y),
      visible: r.width > 0 && r.height > 0,
      opacity: cs.opacity,
      portrait: heroRoot?.getAttribute("data-hero-portrait") || null,
    };
  };

  const vitrine = document.querySelector("[data-suman-vitrine]");
  return {
    title: document.title,
    canvases: document.querySelectorAll("canvas").length,
    canvas: box(canvas),
    heroRoot: box(heroRoot),
    framed: box(framed),
    canoe: box(canoe),
    vitrine: box(vitrine),
  };
});

const shot = URL.includes("vercel") ? "scripts/.tmp-hero-vercel.png" : "scripts/.tmp-hero-local.png";
await page.screenshot({ path: shot, fullPage: false });
await browser.close();

console.log(JSON.stringify({ url: URL, errors, report, shot }, null, 2));

const canvasOk = report.canvas?.visible;
const htmlCanoe = report.framed?.visible || report.canoe?.visible;

if (!canvasOk) {
  console.error("FAIL: WebGL canvas missing/invisible");
  process.exit(1);
}
if (htmlCanoe) {
  console.error("FAIL: canoe / HTML overlay is still the central hero");
  process.exit(2);
}
if (report.heroRoot?.portrait !== "3d") {
  console.error("FAIL: hero is not the 3D portrait");
  process.exit(3);
}
if (!report.vitrine?.visible || report.vitrine.h < 200) {
  console.error("FAIL: 3D vitrine overlay missing or too small");
  process.exit(4);
}
if (errors.length) {
  console.error("FAIL: page errors", errors);
  process.exit(5);
}
console.error("PASS: 3D Suman hero is in the canvas (no canoe overlay)");

