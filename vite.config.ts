import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'

// React Router v7 framework mode (SSR). The reactRouter() plugin replaces
// @vitejs/plugin-react and wires up server rendering + route code-splitting.
export default defineConfig({
  plugins: [reactRouter()],
  ssr: {
    // GSAP is CommonJS and its deep plugin path (gsap/ScrollTrigger) has no
    // named ESM export. If left external, the server bundle emits a raw
    // `import { ScrollTrigger } from 'gsap/ScrollTrigger'` that crashes Vercel's
    // strict-ESM Node runtime. Bundle it into the server build instead.
    noExternal: [/^gsap($|\/)/],
  },
})
