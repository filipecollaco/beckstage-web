// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://beckstage.music',
  integrations: [react()],
  devToolbar: { enabled: false },
  // /privacy and /terms as privacy.html and terms.html: GitHub Pages serves them at the extensionless
  // URL with no trailing-slash redirect, so the address matches the canonical.
  build: { format: 'file' },
});
