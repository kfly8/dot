import { defineConfig } from 'vite'
import { barefoot } from '@barefootjs/hono/vite'
export default defineConfig({
  base: '/components/', publicDir: false,
  build: { outDir: 'public/components', emptyOutDir: true },
  plugins: barefoot({ components: ['ui/components/ui'], templates: 'dist/components' }),
})
