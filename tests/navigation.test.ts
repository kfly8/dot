import { afterAll, beforeAll, expect, test } from 'bun:test'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { readFileSync } from 'node:fs'
import type { Router } from '@barefootjs/router'
let router: Router
const origin = 'https://dot.kobaken.co'
beforeAll(async () => {
  GlobalRegistrator.register({ url: origin + '/', settings: { disableJavaScriptFileLoading: true, disableCSSFileLoading: true, handleDisabledFileLoadingAsSuccess: true } })
  document.write(readFileSync('site/index.html', 'utf8'))
  const { startNavigation } = await import('../client/navigation')
  router = startNavigation({
    fetch: (async (url: string | URL | Request) => {
      const href = String(url)
      const path = new URL(href).pathname
      const response = new Response(readFileSync('site' + path + 'index.html', 'utf8'))
      Object.defineProperty(response, 'url', { value: href })
      return response
    }) as typeof fetch,
    loadModule: async () => ({}),
    // The DOM harness checks navigation, not island execution; browsers test that.
    rehydrate: () => {}, dispose: () => {}, prefetch: false,
  })
})
afterAll(() => { router.stop(); GlobalRegistrator.unregister() })
test('partial navigation preserves document, updates metadata and language, and focuses heading', async () => {
  const shell = document.body
  const region = document.querySelector('[bf-region]')
  await router.navigate('/en/about/')
  expect(document.body).toBe(shell)
  expect(document.querySelector('[bf-region]')).toBe(region)
  expect(location.pathname).toBe('/en/about/')
  expect(document.documentElement.lang).toBe('en')
  expect(document.title).toBe('About — dot')
  expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(origin + '/en/about/')
  expect(document.querySelector('link[hreflang="ja"]')?.getAttribute('href')).toBe(origin + '/about/')
  expect(document.activeElement?.tagName).toBe('H1')
  await router.navigate('/posts/inspect-ui-before-browser/')
  expect(document.documentElement.lang).toBe('ja')
  expect(document.querySelector('h1 img')?.getAttribute('alt')).toBe('そのテストは、何を確かめていますか？')
  expect(document.querySelector('input[type="checkbox"]')).not.toBeNull()
  expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('article')
})
test('article language switch updates the hero and social image metadata', async () => {
  for (const [locale, title, base] of [
    ['ja', 'そのテストは、何を確かめていますか？', '/'],
    ['en', 'What does your test check?', '/en/'],
  ]) {
    await router.navigate(`${base}posts/inspect-ui-before-browser/`)
    const image = `/images/what-does-your-test-check-${locale}.png`
    expect(document.title).toBe(`${title} — dot`)
    expect(document.querySelector('h1 img')?.getAttribute('alt')).toBe(title)
    expect(document.querySelector('h1 img')?.getAttribute('src')).toBe(image)
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(origin + image)
    expect(document.querySelector('meta[property="og:image:alt"]')?.getAttribute('content')).toBe(title)
    expect(document.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toBe(origin + image)
    expect(document.querySelector('meta[name="twitter:image:alt"]')?.getAttribute('content')).toBe(title)
    expect(document.querySelector('meta[property="og:image:width"]')?.getAttribute('content')).toBe('1200')
    expect(document.querySelector('meta[property="og:image:height"]')?.getAttribute('content')).toBe('630')
    expect(document.activeElement?.tagName).toBe('H1')
  }
  await router.navigate('/about/')
  expect(document.querySelector('meta[property="og:image"]')).toBeNull()
  expect(document.querySelector('meta[name="twitter:image"]')).toBeNull()
})
test('back and forward restore route, locale and metadata', async () => {
  await router.navigate('/en/about/')
  await router.navigate('/posts/inspect-ui-before-browser/')
  history.back()
  await new Promise(resolve => setTimeout(resolve, 30))
  expect(location.pathname).toBe('/en/about/')
  expect(document.documentElement.lang).toBe('en')
  expect(document.title).toBe('About — dot')
  history.forward()
  await new Promise(resolve => setTimeout(resolve, 30))
  expect(location.pathname).toBe('/posts/inspect-ui-before-browser/')
  expect(document.documentElement.lang).toBe('ja')
})
