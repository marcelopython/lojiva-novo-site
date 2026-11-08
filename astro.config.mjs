// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const contentDates = new Map();
for (const collection of ['recursos', 'segmentos', 'integracoes', 'guias', 'comparar', 'perguntas', 'glossario']) {
  const dir = join(process.cwd(), 'src/content', collection);
  for (const file of readdirSync(dir).filter((name) => name.endsWith('.mdx'))) {
    const source = readFileSync(join(dir, file), 'utf8');
    const match = source.match(/^updatedAt:\s*['"]?(\d{4}-\d{2}-\d{2})/m);
    if (!match) throw new Error(`updatedAt ausente: ${collection}/${file}`);
    contentDates.set(`/${collection}/${file.slice(0, -4)}`, match[1]);
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.lojiva.com.br',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory' },
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
      serialize: (item) => {
        const pathname = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        const updatedAt = contentDates.get(pathname);
        return { ...item, url: new URL(pathname, 'https://www.lojiva.com.br').href, ...(updatedAt && { lastmod: updatedAt }) };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
