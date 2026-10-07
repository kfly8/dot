// Uses the existing Sharp dependency supplied by Wrangler. Run on macOS with Hiragino Sans.
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
await mkdir('public/images', { recursive: true })
const cards = {
  ja: { lines: ['そのテストは、', '何を確かめていますか？'], font: 'Hiragino Sans, sans-serif', size: 82 },
  en: { lines: ['What does your', 'test check?'], font: 'Helvetica Neue, sans-serif', size: 98 },
}
for (const [lang, card] of Object.entries(cards)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f7f7f2"/><g fill="#242820" font-family="${card.font}" font-size="${card.size}" font-weight="400">${card.lines.map((line, i) => `<text x="108" y="${280 + i * 130}">${line}</text>`).join('')}</g></svg>`
  const base = `public/images/what-does-your-test-check-${lang}`
  await writeFile(`${base}.svg`, svg + '\n')
  await sharp(Buffer.from(svg)).png().toFile(`${base}.png`)
  await sharp(`${base}.png`).resize(335).png().toFile(`/tmp/dot-question-${lang}-mobile.png`)
  console.log(`${base}.png: 1200 × 630; mobile proof: /tmp/dot-question-${lang}-mobile.png`)
}
