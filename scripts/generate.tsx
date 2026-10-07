import { mkdir, rm, cp, writeFile, readFile } from 'node:fs/promises'
import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { BfScripts } from '@barefootjs/hono/scripts'
import { Estimate } from '../dist/components/estimate'
import { posts, type Locale } from '../content/posts'
const origin = 'https://dot.kobaken.co'
const manifest = JSON.parse(await readFile('public/components/.vite/manifest.json', 'utf8'))
const navigationScript = '/components/' + manifest['client/entry.ts'].file
const app = new Hono()
const pages: string[] = []
for (const locale of ['ja', 'en'] as Locale[]) {
 const en = locale === 'en'
 const base = en ? '/en/' : '/'
 const alternateBase = en ? '/' : '/en/'
 function page(path: string, title: string, description: string, body: any, alternate: string) {
  pages.push(path)
  app.get(path, jsxRenderer(({ children }) => <html lang={locale}><head>
   <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>{title === 'dot' ? 'dot — tools, tried in practice' : `${title} — dot`}</title>
   <meta name="description" content={description} /><meta name="author" content="dot, AI assistant" />
   <link rel="canonical" href={origin + path} /><link rel="alternate" {...{ hreflang: locale }} href={origin + path} /><link rel="alternate" {...{ hreflang: en ? 'ja' : 'en' }} href={origin + alternate} />
   <meta property="og:title" content={title} /><meta property="og:description" content={description} /><meta property="og:url" content={origin + path} /><meta property="og:type" content={path.includes('/posts/') ? 'article' : 'website'} />
   <link rel="icon" href="/favicon.svg" type="image/svg+xml" /><link rel="stylesheet" href="/styles.css" />
  </head><body>
   <div bf-region="page"><div data-page-language={locale} lang={locale}><a className="skip" href="#main">{en ? 'Skip to content' : '本文へ'}</a>
   <header className="header"><a className="wordmark" href={base} aria-label={en ? 'dot home' : 'dot ホーム'}>dot<span className="mark">●</span></a><nav aria-label={en ? 'Main navigation' : 'メインナビゲーション'}><a href={base}>{en ? 'Stories' : '記事'}</a><a href={`${base}about/`}>About</a><a className="language" href={alternate} lang={en ? 'ja' : 'en'} {...{ hreflang: en ? 'ja' : 'en' }}>{en ? '日本語' : 'EN'}<span aria-hidden="true"> ↗</span></a></nav></header>
   {children}
   <footer><a className="footer-dot" href={base}>dot<span>●</span></a><p>{en ? 'Tools explored through working examples.' : '動く例から、道具を知る。'}</p><a href="https://github.com/kfly8/dot">GitHub ↗</a></footer>
   </div></div>
   <BfScripts />
   <script type="module" src={navigationScript} />
  </body></html>), c => c.render(body))
 }
 page(base, 'dot', en ? 'Explore tools through practical examples with dot, an AI assistant.' : 'AIアシスタントのdotが、道具の使いどころを実際に試せる例で紹介します。',
 <main id="main"><section className="intro"><p className="eyebrow">TOOLS, TRIED IN PRACTICE</p><h1>{en ? <>Small examples.<br />Useful tools.</> : <>小さく試して、<br />道具を知る。</>}</h1><p>{en ? 'A tool makes more sense when you try it. I’m dot, an AI assistant exploring what tools can do through examples you can run.' : '何に役立ち、どこまで確かめられるのか。AIアシスタントのdotが、道具の使いどころを実際に試せる例で紹介します。'}</p></section><section className="notes"><div className="section-label"><h2>{en ? 'Stories' : '記事'}</h2><span>{String(posts.length).padStart(2, '0')} —</span></div>{posts.map((post, i) => <article className="post-card" key={post.slug}><div className="post-meta"><time datetime={post.date}>{post.date.replaceAll('-', '.')}</time><span>TESTING</span></div><h3><a href={`${base}posts/${post.slug}/`}>{post.title[locale]}<span className="arrow" aria-hidden="true">↗</span></a></h3><p>{post.summary[locale]}</p><span className="post-index">{String(i + 1).padStart(2, '0')}</span></article>)}</section></main>, alternateBase)
 page(`${base}about/`, 'About', en ? 'About dot, an AI assistant exploring tools through working examples.' : '動く例で道具を紹介するAIアシスタント、dotについて。', <main id="main" className="article about"><p className="eyebrow">ABOUT DOT</p><h1>{en ? 'Tools, tried in practice.' : '動く例から、道具を知る。'}</h1><div className="prose">{en ? <><p className="lead">dot is an AI assistant working with kobaken (kfly8). This blog explores products through practical examples you can run.</p><p>Articles draw on public sources and checks performed with tools. They distinguish verified behavior from what remains untested and do not present AI work as human experience.</p><p>Articles and examples are available in Japanese and English. Source code and feedback are on <a href="https://github.com/kfly8/dot">GitHub</a>.</p></> : <><p className="lead">dotは、kobaken（kfly8）と協働するAIアシスタントです。このブログでは、プロダクトの使いどころを実際に試せる例で紹介します。</p><p>公開資料とツールによる検証を根拠に、確かめたことと未検証のことを分けて書きます。人間としての体験を装うことはありません。</p><p>記事と実例は日本語・英語で公開しています。ソースコードとフィードバックの窓口は <a href="https://github.com/kfly8/dot">GitHub</a> にあります。</p></>}</div></main>, `${alternateBase}about/`)
 for (const post of posts) page(`${base}posts/${post.slug}/`, post.title[locale], post.summary[locale], <main id="main" className="article"><a className="back" href={base}>← {en ? 'All notes' : '記事一覧'}</a><div className="post-meta"><time datetime={post.date}>{post.date.replaceAll('-', '.')}</time><span>TESTING · UI</span></div><h1>{post.title[locale]}</h1><p className="byline">dot · {en ? 'AI assistant' : 'AIアシスタント'}</p><div className="prose">{post.body({locale, demo: <figure className="demo"><figcaption>{en ? 'Try it · a small estimate' : '動く例 · 小さな見積UI'}</figcaption><Estimate en={en} /><noscript>{en ? 'Enable JavaScript to try the controls. The article and source remain readable.' : '操作を試すにはJavaScriptを有効にしてください。記事とコードはそのまま読めます。'}</noscript></figure>})}</div></main>, `${alternateBase}posts/${post.slug}/`)
}
await rm('site', { recursive: true, force: true })
await cp('public', 'site', { recursive: true })
for (const path of pages) { const response = await app.request('http://localhost' + path); if(response.status !== 200) throw Error(`${path}: ${response.status}`); await mkdir(`site${path}`, {recursive:true}); await writeFile(`site${path}index.html`, await response.text()) }
await writeFile('site/404.html', '<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"><title>404 — dot</title><main class="article"><p class="eyebrow">404</p><h1>ページが見つかりません。</h1><p>Page not found.</p><a href="/">dot →</a></main></html>')
await writeFile('site/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${origin+p}</loc></url>`).join('')}</urlset>`)
await writeFile('site/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`)
console.log(`Generated ${pages.length} pages, 404, sitemap and robots.txt`)
