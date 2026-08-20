import fs from "node:fs";
import path from "node:path";

const root = path.resolve("public/photos");
const allow = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const skip = new Set(["proof-01.png", "proof-45.png"]);

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (allow.has(path.extname(name).toLowerCase()) && st.size > 15000 && !skip.has(name)) {
      acc.push({ rel: "/photos/" + path.relative(root, full).replaceAll("\\", "/"), size: st.size });
    }
  }
  return acc;
}

const files = walk(root);
files.sort((a, b) => {
  const ap = a.rel.includes("/proof/") ? 0 : 1;
  const bp = b.rel.includes("/proof/") ? 0 : 1;
  if (ap !== bp) return ap - bp;
  return a.rel.localeCompare(b.rel, undefined, { numeric: true });
});
const urls = files.map((f) => f.rel);
fs.writeFileSync(path.join(root, "list.json"), JSON.stringify(urls, null, 2));
console.log(`Wrote ${urls.length} images (${urls.filter((u) => u.includes("/proof/")).length} proofs)`);
