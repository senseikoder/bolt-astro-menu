import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';

export default defineConfig({
  vite: {
    ssr: {
      noExternal: ['bulma'],
    },
  },

  output: "hybrid",
  integrations: [],
  adapter: netlify(),
});