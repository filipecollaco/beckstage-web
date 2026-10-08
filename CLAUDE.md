# CLAUDE.md

Marketing site for Beckstage (https://beckstage.music). See `README.md` for
structure, commands and deploy.

- Copy lives in `src/data/site.ts` only. Don't hardcode strings in components.
- Never write "agency" in user-facing copy: the entity is an *artist
  representation*, its people are *representatives*.
- `src/data/legal.ts` is approved legal text: verbatim, not product copy (the
  "agency" rule doesn't apply). Change it only from a lawyer-reviewed revision.
- Never list a plan feature that doesn't exist in the app; paid plans only lift
  the Free limits.
- Orange buttons always carry white text.
- Keep it static: interactive parts are React islands (`client:load` for the
  hero stream, `client:idle` for the rest). Don't add a framework, a CSS
  library or analytics without asking.
- Verify at 390, 820, 1024 and 1320 wide before pushing; a push to `main`
  publishes.
