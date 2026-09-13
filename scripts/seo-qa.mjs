import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = process.cwd()
const distDir = join(root, '.vitepress', 'dist')
const publicSections = ['chatgpt', 'claude', 'gemini', 'grok']
const networkDomains = /(?:gpthomechat\.com|chatgpt-guides\.com|chatgpt-chinese-blog\.com|chatgpt-chinese\.chat|grok-china\.com|claude-chinese-guide\.com|gemini-cn-guide\.com|chatgpt-official\.com|chatgpt-guanwang\.com)/i
const utilityRoutes = new Set(['/','/about','/privacy','/disclaimer','/latest','/chatgpt','/claude','/gemini','/grok'])
const errors = []
const warnings = []
const highRiskClaims = [
  { pattern: /所有模型保持最新/, label: 'unverifiable universal model-freshness claim' },
  { pattern: /国内邮箱即可注册、无需翻墙/, label: 'absolute registration and access claim' },
  { pattern: /免费版完全能用/, label: 'absolute free-tier claim' },
  { pattern: /输出质量翻倍/, label: 'unverifiable output-quality multiplier' },
  { pattern: /官网注册需海外邮箱\s*\+\s*海外手机号/, label: 'fixed official registration requirement' },
  { pattern: /官网注册往往需要海外手机号/, label: 'fixed official phone-verification claim' },
  { pattern: /默认 GPT-5\.5 即可/, label: 'fixed default-model recommendation' },
  { pattern: /GPT-5\.5正式发布/, label: 'unverified model-release claim' },
  { pattern: /国内邮箱即可使用GPT-5\.5/, label: 'absolute third-party model-access claim' },
]

function walk(dir) {
  const files = []
  if (!existsSync(dir)) return files
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(path))
    else files.push(path)
  }
  return files
}

function normalizeRoute(value) {
  let path = value
  try {
    path = new URL(value, 'https://www.chatgpt-web.com').pathname
  } catch {
    path = value.split(/[?#]/, 1)[0]
  }
  path = path.replace(/\\/g, '/').replace(/\/index\.(?:html|md)$/i, '/')
  path = path.replace(/\.(?:html|md)$/i, '')
  if (!path.startsWith('/')) path = `/${path}`
  if (path.length > 1) path = path.replace(/\/+$/, '')
  return path || '/'
}

function frontmatter(source) {
  const clean = source.replace(/^\uFEFF/, '')
  const match = clean.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return null
  const values = {}
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (item) values[item[1]] = item[2].replace(/^['"]|['"]$/g, '').trim()
  }
  return values
}

function htmlPath(route) {
  if (route === '/') return join(distDir, 'index.html')
  const clean = route.replace(/^\//, '')
  const direct = join(distDir, `${clean}.html`)
  if (existsSync(direct)) return direct
  return join(distDir, clean, 'index.html')
}

function metaContent(html, name) {
  const pattern = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i')
  return html.match(pattern)?.[1] || ''
}

function exactRedirects() {
  const config = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'))
  return new Map(
    (config.redirects || [])
      .filter((item) => item.source && !/[()*?[\]]/.test(item.source))
      .map((item) => [normalizeRoute(item.source), normalizeRoute(item.destination)]),
  )
}

function visibleMain(html) {
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || ''
}

function visibleInternalLinks(html) {
  return [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1])
    .filter((href) => href.startsWith('/'))
    .map(normalizeRoute)
}

function contentArticleLinks(html, currentRoute, redirectMap) {
  return [...new Set(visibleInternalLinks(visibleMain(html)).filter((route) =>
    /^\/(?:chatgpt|claude|gemini|grok)\/[^/]+$/.test(route)
      && route !== currentRoute
      && !utilityRoutes.has(route)
      && !redirectMap.has(route),
  ))]
}

function hasUnexpectedEmptyTableCell(html) {
  for (const table of html.matchAll(/<table\b[\s\S]*?<\/table>/gi)) {
    const tableHtml = table[0]
    if (/是\s*\/\s*否/.test(tableHtml)) continue
    for (const row of tableHtml.matchAll(/<tr\b[\s\S]*?<\/tr>/gi)) {
      const cells = [...row[0].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)]
      if (cells.some((cell) => cell[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim() === '')) return true
    }
  }
  return false
}

const sourceFiles = [
  join(root, 'index.md'),
  join(root, 'about.md'),
  join(root, 'privacy.md'),
  join(root, 'disclaimer.md'),
  join(root, 'latest', 'index.md'),
  ...publicSections.flatMap((section) => walk(join(root, section)).filter((file) => file.endsWith('.md'))),
]

for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf8')
  if (source.startsWith('\uFEFF')) errors.push(`BOM: ${relative(root, file)}`)
  if (!frontmatter(source)) errors.push(`frontmatter missing or malformed: ${relative(root, file)}`)
  if (networkDomains.test(source)) errors.push(`network link remains: ${relative(root, file)}`)
  for (const claim of highRiskClaims) {
    if (claim.pattern.test(source)) errors.push(`${claim.label}: ${relative(root, file)}`)
  }
}

if (!existsSync(join(distDir, 'sitemap.xml'))) {
  errors.push('missing build output: .vitepress/dist/sitemap.xml; run npm run build first')
  console.error(errors.join('\n'))
  process.exit(1)
}

const sitemap = readFileSync(join(distDir, 'sitemap.xml'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
const routes = new Set(urls.map(normalizeRoute))
const redirectMap = exactRedirects()

if (new Set(urls).size !== urls.length) errors.push(`duplicate sitemap URLs: ${urls.length}`)
if (urls.some((url) => !url.startsWith('https://www.chatgpt-web.com/'))) errors.push('sitemap contains a non-canonical host URL')

for (const url of urls) {
  const route = normalizeRoute(url)
  if (redirectMap.has(route)) errors.push(`sitemap contains redirect source: ${route} -> ${redirectMap.get(route)}`)
  const file = htmlPath(route)
  if (!existsSync(file)) {
    errors.push(`sitemap URL has no HTML: ${route}`)
    continue
  }
  const html = readFileSync(file, 'utf8')
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim() || ''
  const description = metaContent(html, 'description')
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)?.[1] || ''
  const h1Count = (html.match(/<h1\b/gi) || []).length
  if (!title) errors.push(`missing title: ${route}`)
  if (!description) errors.push(`missing description: ${route}`)
  if (canonical !== url) errors.push(`canonical mismatch: ${route} -> ${canonical || '(missing)'}`)
  if (h1Count !== 1) errors.push(`expected one H1, found ${h1Count}: ${route}`)

  const isArticle = /^\/(chatgpt|claude|gemini|grok)\/[^/]+$/.test(route)
  if (isArticle && !/"@type"\s*:\s*"Article"/.test(html)) errors.push(`Article schema not found: ${route}`)
  if (isArticle && !/"@type"\s*:\s*"BreadcrumbList"/.test(html)) errors.push(`Breadcrumb schema not found: ${route}`)
  if (isArticle && contentArticleLinks(html, route, redirectMap).length < 2) {
    errors.push(`article needs at least 2 content links: ${route}`)
  }
  if (isArticle && hasUnexpectedEmptyTableCell(html)) errors.push(`article table contains an unexpected empty cell: ${route}`)

  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const href = match[1]
    if (/^(?:https?:|mailto:|tel:|#|javascript:)/i.test(href)) continue
    const target = normalizeRoute(href)
    if (target.startsWith('/assets/') || /\.(?:png|jpe?g|gif|svg|webp|ico|txt|xml|css|js)$/i.test(target)) continue
    if (redirectMap.has(target)) errors.push(`internal link points to redirect source from ${route}: ${href} -> ${redirectMap.get(target)}`)
    else if (!routes.has(target)) errors.push(`broken internal link from ${route}: ${href}`)
  }

  for (const match of html.matchAll(/<a\b([^>]*?)href=["'](https?:\/\/[^"']+)["']([^>]*)>/gi)) {
    const anchor = `${match[1]} ${match[3]}`
    const hostname = new URL(match[2]).hostname.toLowerCase()
    const sponsored = /(?:^|\.)gptbuys\.com$|(?:^|\.)gptcat\.cc$|(?:^|\.)snakegpt\.vip$|(?:^|\.)zeogpt\.com$|(?:^|\.)zeoapi\.com$/.test(hostname)
    if (sponsored) {
      const rel = new Set((anchor.match(/\brel=["']([^"']*)["']/i)?.[1] || '').split(/\s+/).filter(Boolean))
      for (const token of ['nofollow', 'sponsored', 'noopener', 'noreferrer']) {
        if (!rel.has(token)) errors.push(`sponsored link missing rel=${token}: ${route} -> ${hostname}`)
      }
    }
  }
}

const llmsPath = join(root, 'public', 'llms.txt')
if (existsSync(llmsPath)) {
  for (const match of readFileSync(llmsPath, 'utf8').matchAll(/\((https?:\/\/[^)]+)\)/g)) {
    if (!routes.has(normalizeRoute(match[1]))) errors.push(`llms.txt URL missing from sitemap: ${match[1]}`)
  }
} else warnings.push('public/llms.txt is missing')

const latestHtml = htmlPath('/latest')
if (!existsSync(latestHtml)) {
  errors.push('latest page is missing from build output')
} else {
  const latestHtmlSource = readFileSync(latestHtml, 'utf8')
  const latestCount = Number(latestHtmlSource.match(/data-article-count=["'](\d+)["']/i)?.[1] || 0)
  const latestLinks = [...latestHtmlSource.matchAll(/class=["'][^"']*latest-feed-item[^"']*["'][\s\S]*?<a href=["']([^"']+)["']/gi)]
    .map((match) => normalizeRoute(match[1]))
  if (latestCount < 1 || latestLinks.length < 1) errors.push('latest page has no crawlable article links')
  if (latestCount !== latestLinks.length) errors.push(`latest page article count mismatch: data=${latestCount}, links=${latestLinks.length}`)
}

const robots = existsSync(join(root, 'public', 'robots.txt')) ? readFileSync(join(root, 'public', 'robots.txt'), 'utf8') : ''
if (!/Sitemap:\s*https:\/\/www\.chatgpt-web\.com\/sitemap\.xml/i.test(robots)) errors.push('robots.txt does not reference the formal XML sitemap')

console.log(`SEO QA: ${urls.length} sitemap URLs checked, ${sourceFiles.length} source pages scanned.`)
if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`)
  for (const warning of warnings) console.log(`- ${warning}`)
}
if (errors.length) {
  console.error(`Errors (${errors.length}):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log('SEO QA passed.')
