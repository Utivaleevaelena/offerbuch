import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * W trybie deweloperskim obsługuje /api/send-offer tą samą funkcją,
 * która działa produkcyjnie jako Vercel Function (api/send-offer.ts).
 */
function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      for (const [key, value] of Object.entries(env)) process.env[key] ??= value

      server.middlewares.use('/api/send-offer', async (req, res) => {
        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk as Buffer)
        const request = new Request(`http://localhost${req.url ?? ''}`, {
          method: req.method,
          headers: { 'content-type': req.headers['content-type'] ?? 'application/json' },
          body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
        })
        try {
          const mod = await server.ssrLoadModule('/server/sendOffer.ts')
          const response: Response = await mod.handleSendOffer(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(await response.text())
        } catch (err) {
          server.config.logger.error(String(err))
          res.statusCode = 500
          res.end(JSON.stringify({ ok: false, error: 'Błąd serwera.' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApi()],
})
