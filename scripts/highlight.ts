import { createHighlighter, type BundledLanguage } from 'shiki'

// Build-time only: Shiki escapes source text before generating token markup.
const highlighter = await createHighlighter({
  themes: ['github-dark'],
  langs: ['tsx', 'typescript', 'javascript', 'json', 'bash'],
})
export function highlight(source: string, lang: BundledLanguage = 'tsx') {
  return highlighter.codeToHtml(source, { lang, theme: 'github-dark' })
    .replace('<pre ', '<pre tabindex="0" ')
}
