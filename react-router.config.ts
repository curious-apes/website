import type { Config } from '@react-router/dev/config'
import { vercelPreset } from '@vercel/react-router/vite'

export default {
  // Server-side render every route (admin opts out at the component level).
  ssr: true,
  appDirectory: 'app',
  presets: [vercelPreset()],
} satisfies Config
