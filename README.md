# beckstage-web

The public marketing site for Beckstage, served at **https://beckstage.music**.
The app itself lives at `app.beckstage.music` (repo `beckstage-fe`).

Astro (static output) + React islands for the three interactive parts: *One
show* on the home, and Pricing and the FAQ on `/pricing`. Everything else — the
hero included, which is the claim only — is plain HTML with no JavaScript.

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
| Page order and meta tags | `src/pages/index.astro` (home) · `src/pages/pricing.astro` |
| Share image (1200×630) | `public/og.png` |
| One show (the four moments) | `src/components/one-show/` + `src/styles/one-show.css` |
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

## The home

Hero → One show → In their words → Who's Beckstage for? → Close → Footer. From
the Claude Design handoff *Website — new home and /pricing* (November 2026).
Pricing and the FAQ live on `/pricing`; an old `/#pricing` or `/#faq` link lands
there.

- **The hero's backdrop** is the row of stage lights (`public/img/hero-lights.webp`,
  and a 1200px version for phones), until a real photo of the room before doors
  replaces it under the same overlays. The hero is 820px tall (700 on a phone)
  but never taller than the screen, so its one button stays on the first one.
- **The nav** lies over the hero and becomes a fixed bar once the hero has
  scrolled out (`Nav.astro`, `bar="hero"`). On `/pricing` it is the bar from the
  top (`bar="fixed"`); on the legal pages it stays in the flow.
- **In their words** renders only the quotes marked `authorized: true` in
  `QUOTES`. Each needs its author's OK first; with none, the section is left out.
  Nobody is named: a quote is signed with the person's role.

## One show

Four moments of one show, each with its line and a small animated fragment of
the app. The lines and what the fragments show live in `site.ts` (`ONE_SHOW`,
`FRAGMENTS`); `OneShow.tsx` is the player and `fragments.tsx` the four pieces,
ported from the handoff's `wh/anim.jsx`.

- **The four lines are always readable.** They are server-rendered and nothing
  hides one behind a timer.
- **Desktop:** the list beside a stage. One fragment plays at a time; when its
  loop ends (`loop`, about 30 s for the four) the next moment takes over.
  Clicking a row plays it from the start.
- **Phone (≤ 760px):** an accordion. The open row's fragment sits under it and
  loops; it holds still while it is off screen, so its changing height never
  moves what is being read below it.
- **Nothing plays** until the section's top passes 70% of the viewport. With
  reduced motion there is no auto-advance and each fragment is its still frame.
- **A fragment is a piece of the app as it is**, with invented people, places
  and amounts. No finger, no cursor, no typing, and at most one thing opens or
  changes per loop. The avatar and the `Accepted` mark on an invite are the
  site's only additions to the app. When the app changes one of these pieces,
  change it here too.
- Icons are inlined from `@mdi/js`: the site makes no external requests.

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
