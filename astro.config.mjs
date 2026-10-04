// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://beckstage.music',
  integrations: [react()],
  devToolbar: { enabled: false },
});
