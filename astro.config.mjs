import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';

import vue from '@astrojs/vue';

import db from '@astrojs/db';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  vite: {
    ssr: {
      noExternal: ['bulma'],
    },
  },

  output: "hybrid",
  integrations: [vue(), db()],
  adapter: cloudflare(),
});