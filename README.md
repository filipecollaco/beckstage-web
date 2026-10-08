# beckstage-web

The public marketing site for Beckstage, served at **https://beckstage.music**.
The app itself lives at `app.beckstage.music` (repo `beckstage-fe`).

Astro (static output) + React islands for the four interactive parts: *How it
works* (the two phones under the hero), *Who's Beckstage for?*, Pricing and the
FAQ. Everything else — the hero included, which is the claim only — is plain
HTML with no JavaScript.

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
| How it works (two phones) | `src/components/how-it-works/` + `src/styles/how-it-works.css` |
| Legal pages | `src/data/legal.ts` (copy) · `src/components/legal/` · `src/styles/legal.css` |

- Sign-up and log-in buttons point at `LINKS.signup` / `LINKS.login`.
- The **Get the app** band and its store badges stay hidden until both
  `LINKS.appStore` and `LINKS.googlePlay` are set.
- Legal pages: `/privacy` and `/terms` (`src/pages/privacy.astro`,
  `terms.astro`, both `src/components/legal/LegalPage.astro`). The copy lives in
  `src/data/legal.ts`, **verbatim approved legal text** — never edit it outside a
  lawyer revision, and bump `updated` / `updatedISO` with every one. No cookie
  section and no cookie banner until the site sets cookies.

Copy rules from the design handoff: never "agency" in copy (artist
representation / representatives); the plans are Artist Free / Pro and
Representative Free / Pro; never mention transaction fees; never promise crew
is free forever.

## How it works

The two-phone piece under the hero comes from the Claude Design handoff
*How it works* (2026-10-06, second version: claim-only hero, poster frame,
Maya's representation on the booking). Until playback starts it shows
`HIW_POSTER`; it starts on its own at ≥ 50% visible. `data.ts` is the timeline (`BEATS`, `hiwFrame`),
`screens.tsx` the app screens, `HowItWorks.tsx` the player (desktop: two phones;
≤ 760px: one in front, scaled to fit the column and one viewport). These three
are kept close to the reference (`@ts-nocheck`) so a later handoff diffs cleanly.
Icons are inlined from `@mdi/js` (`mdi.ts`) — the site makes no external requests.

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
burger, and a tablet step (below 980px the nav collapses into the menu).
