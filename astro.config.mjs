import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel({ maxDuration: 15 }),
  integrations: [tailwind()],
});
