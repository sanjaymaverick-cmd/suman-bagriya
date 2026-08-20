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

## Local

```bash
npm install
node scripts/generate-photo-list.mjs
npm run dev
```
