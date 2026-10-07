import { startRouter, type RouterOptions } from '@barefootjs/router'
import { setupStreaming } from '@barefootjs/client/runtime'

/** Enhance ordinary links while keeping every route independently readable. */
export function startNavigation(options: RouterOptions = {}) {
  setupStreaming()
  const region = document.querySelector('[bf-region]')
  const syncLanguage = () => {
    const language = region?.querySelector('[data-page-language]')?.getAttribute('data-page-language')
    if (language === 'ja' || language === 'en') document.documentElement.lang = language
  }
  syncLanguage()
  // Router reconciles page metadata, but 0.39.3 does not copy <html lang>.
  const observer = new MutationObserver(syncLanguage)
  if (region) observer.observe(region, { childList: true })
  const router = startRouter(options)
  return { ...router, stop: () => { observer.disconnect(); router.stop() } }
}
