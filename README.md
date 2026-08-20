# Suman Bagriya

Premium personal site for Suman Bagriya — metabolic health coach.

**Demo first.** Host this on a Vercel URL, send her the link, let her look. When she is ready, point `sumanbagriya.com` at the same project — no rebuild required.

Lovable cannot host this 3D stack. Use Vercel.

## Show her the demo

1. Download this project folder.
2. In the folder:

```bash
npm install
npx vercel
```

3. You get a link like `https://suman-bagriya.vercel.app`
4. Send that on WhatsApp. Do not explain. Let her open it.

GitHub (optional, for later updates): [sanjaymaverick-cmd/suman-bagriya](https://github.com/sanjaymaverick-cmd/suman-bagriya)

```bash
git init
git add .
git commit -m "Suman Bagriya site"
git branch -M main
git remote add origin https://github.com/sanjaymaverick-cmd/suman-bagriya.git
git push -u origin main
```

Then import the repo at [vercel.com/new](https://vercel.com/new).

## Later: her real domain

Vercel → Project → Domains → add `sumanbagriya.com`. Keep the Vercel URL as the demo until DNS is switched.

## Hard refresh (if the live site looks old)

Wait until Vercel shows the latest deploy as **Ready**. Then:

### iPhone (Safari)
1. Close the tab.
2. Swipe Safari out of the app switcher.
3. Open this instead (cache bypass): `https://suman-bagriya.vercel.app/?v=2`
4. Still stuck: **Settings → Safari → Advanced → Website Data** → search `vercel` → **Remove**.

### Android (Chrome)
1. Tap the address bar and add `?v=2` at the end, then Go.
2. Or: tap the lock / tune icon by the URL → **Site settings** → **Clear & reset**.

### Desktop
- Windows Chrome / Edge: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

If it is still old, the deploy is not finished. Check Vercel → **Deployments**.

## Local

```bash
npm install
node scripts/generate-photo-list.mjs
npm run dev
```

## Center portrait (3D)

The hero is a depth-mapped 2.5D of Suman: glass vitrine, warm holographic rim, volumetric points.

To drop in a real Gaussian splat later, export a SuperSplat `.ply` and save it as `public/photos/suman.ply` (iPhone orbit of her, 20–60s). Until then the depth volume is the 3D her.

