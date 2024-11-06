import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';

import vue from '@astrojs/vue';

// import db from '@astrojs/db';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  vite: {
    ssr: {
      noExternal: ['bulma'],
    },
  },
  build: {
    format: "file",
  },

  output: "hybrid",
  integrations: [vue()],
  adapter: cloudflare(),
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@images/*": ["src/images/*"]
    }
  }
});