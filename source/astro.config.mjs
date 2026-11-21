import { defineConfig } from 'astro/config';
export default defineConfig({
  build: { inlineStylesheets: 'always', format: 'file', assets: 'assets' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
