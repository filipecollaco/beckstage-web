# beckstage-web

The public marketing site for Beckstage, served at **https://beckstage.music**.
The app itself lives at `app.beckstage.music` (repo `beckstage-fe`).

Astro (static output) + React islands for the four interactive parts: the hero
activity stream, *Who's Beckstage for?*, Pricing and the FAQ. Everything else
is plain HTML with no JavaScript.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npx astro check    # type-check (CI runs this too)
```

## Change the site

| What | Where |
|---|---|
| Any copy, prices, FAQ, links | `src/data/site.ts` (single source of truth) |
| Styles and design tokens | `src/styles/site.css` |
| Page order and meta tags | `src/pages/index.astro` |
| Share image (1200×630) | `public/og.png` |

- Sign-up and log-in buttons point at `LINKS.signup` / `LINKS.login`.
- The **Get the app** band and its store badges stay hidden until both
  `LINKS.appStore` and `LINKS.googlePlay` are set.
- Privacy Policy and Terms are not on the site yet (no text exists). The app's
  Settings links to `beckstage.music/terms`, which shows the 404 page until a
  `src/pages/terms.astro` exists.

Copy rules from the design handoff: never "agency" in copy (artist
representation / representatives); the plans are Artist Free / Pro and
Representative Free / Pro; never mention transaction fees; never promise crew
is free forever.

## Deploy

Every push to `main` builds and publishes to GitHub Pages
(`.github/workflows/deploy.yml`). `public/CNAME` holds the custom domain.

DNS (Namecheap) for `beckstage.music`:

| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | filipecollaco.github.io |

Leave `app` (Firebase), the MX and TXT records as they are.

## Design source

Built from the Claude Design handoff *Beckstage marketing website* (October
2026). Desktop matches the 1320 artboard and mobile the 390 artboard; the
reference's `.is-mobile` class is the `max-width: 760px` media query. Two
things the handoff did not design were added: the mobile menu behind the
burger, and a tablet step (below 980px the nav collapses and the hero stacks).
