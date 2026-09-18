// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.lojiva.com.br',
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/api/') &&
        !page.includes('/cadastro') &&
        !page.includes('/termos') &&
        !page.includes('/privacidade'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
