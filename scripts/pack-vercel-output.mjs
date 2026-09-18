import { access, cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const distDir = 'dist'
const outputDir = join('.vercel', 'output')
const staticDir = join(outputDir, 'static')

await access(join(distDir, 'index.html'))

await rm(outputDir, { recursive: true, force: true })
await mkdir(staticDir, { recursive: true })
await cp(distDir, staticDir, { recursive: true })

const config = {
  version: 3,
  routes: [
    {
      src: '/(.*)',
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Frame-Options': 'DENY',
      },
      continue: true,
    },
    { handle: 'filesystem' },
    { src: '/(.*)', dest: '/index.html' },
  ],
}

await writeFile(join(outputDir, 'config.json'), `${JSON.stringify(config, null, 2)}\n`)
