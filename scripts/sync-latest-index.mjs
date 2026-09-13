import { readdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = process.cwd()
const latestPath = join(root, 'latest', 'index.md')
const sections = ['chatgpt', 'claude', 'gemini', 'grok']
const sectionNames = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  grok: 'Grok',
}

// Keep historical article URLs and on-page titles intact, while the discovery
// feed uses wording that remains useful after fast-changing model labels age.
const displayOverrides = new Map([
  ['/chatgpt/chatgpt-chinese-online-gpt55-claude-gemini-2026', {
    title: 'ChatGPT网页版在线使用：电脑手机免下载与多模型选择指南',
    description: '说明电脑手机浏览器免下载流程、ChatGPT 官网入口核验，以及 GPT、Claude、Gemini、Grok 等模型应如何按实际任务比较。',
  }],
  ['/chatgpt/chatgpt-chinese-web-tutorial-gpt5-5-gpt-image-2-2026', {
    title: 'ChatGPT中文版网页版教程：免下载、中文设置与多模型工具辨别',
    description: '讲清 ChatGPT 中文版、官方网页版和第三方多模型服务的区别，包含浏览器使用步骤、图片任务、安全检查与常见问题。',
  }],
  ['/chatgpt/chatgpt-chinese-web-version-guide-2026', {
    title: 'ChatGPT中文版网页版：官网入口、国内在线使用与镜像网站辨别',
    description: '从域名、账号体系、隐私和计费规则区分 ChatGPT 官网、中文版网页与第三方镜像，并给出免下载使用步骤。',
  }],
  ['/chatgpt/chatgpt-web-cannot-open-2026', {
    title: 'ChatGPT网页版打不开怎么办：官网、Cookie、网络与第三方入口排查',
    description: '按网址、浏览器、Cookie、扩展、网络、账号和服务状态的顺序排查 ChatGPT 网页版打不开问题。',
  }],
  ['/chatgpt/chatgpt-web-gpt56-online-free-mobile-browser-20260711', {
    title: 'ChatGPT网页版模型怎么核验：免费版、手机浏览器与历史型号说明',
    description: '保留历史型号搜索线索，同时说明如何从当前 ChatGPT 账号、OpenAI 开发者文档和第三方平台列表核验模型与权限。',
  }],
  ['/chatgpt/gpt56-model-selector-web-mobile-instant-medium-high-20260711', {
    title: 'ChatGPT模型选择器在哪：网页版、手机端与推理档位核验',
    description: '说明网页版和手机端如何查看当前模型或推理档位，以及按钮不一致、型号缺失和工作区权限的排查顺序。',
  }],
  ['/chatgpt/gpt56-web-mobile-browser-no-download-free-entry-20260711', {
    title: 'ChatGPT网页版模型使用指南：手机浏览器、免下载与免费权限核验',
    description: '说明手机浏览器免下载使用方式、免费权限核验、官方与第三方入口区别，以及看不到某个模型时的检查步骤。',
  }],
  ['/chatgpt/gpt56-sol-terra-luna-chatgpt-codex-api-choice-20260728', {
    title: 'ChatGPT、Codex 与 API 怎么选：任务难度、速度、成本与模型核验',
    description: '区分 ChatGPT、Codex 与 API 三类入口，按任务难度、速度、成本、代码风险和批量规模选择并核验当前模型。',
  }],
  ['/chatgpt/gpt-5-5-fabu-jiexi-guonei-shiyong-2026', {
    title: 'ChatGPT模型更新与国内使用核验：名称、入口、权限和第三方平台',
    description: '把历史型号文章转为模型核验指南：检查 OpenAI 官方页面、当前账号、API 模型 ID，以及第三方平台的模型和权限说明。',
  }],
  ['/chatgpt/chatgpt-mianfei-shiyong-quangonglue-2026', {
    title: 'ChatGPT免费使用攻略：免费层、消息额度、文件图片限制与恢复方法',
    description: '说明 ChatGPT 免费层能否满足日常使用、额度与工具限制如何查看，并区分付费第三方多模型服务和代充。',
  }],
  ['/chatgpt/chatgpt-prompt-tishici-daquan-2026', {
    title: 'ChatGPT提示词 Prompt 大全：写作、办公、编程与可复用模板',
    description: '提供角色、任务、背景约束和输出格式四要素，以及写作、办公、编程、翻译和学习场景的可复用提示词。',
  }],
  ['/chatgpt/chatgpt-ai-xiezuo-lunwen-jiaocheng-2026', {
    title: 'ChatGPT AI写作与论文教程：选题、提纲、润色、引用和诚信核验',
    description: '从选题、提纲、分段写作、润色到引用核验，说明如何把 ChatGPT 当作协作工具并遵守学术诚信。',
  }],
  ['/chatgpt/chatgpt-zhongwen-ban-shiyong-zhinan-2026', {
    title: 'ChatGPT中文版使用指南：官网区别、网页版入口与第三方平台安全',
    description: '说明 ChatGPT 官网、网页版、中文版和第三方多模型平台的区别，并给出中文使用、账号与隐私检查方法。',
  }],
  ['/claude/claude-4-8-zenme-yong-jiaocheng-2026', {
    title: 'Claude怎么用：模型名称核验、长文档、代码与错误排查',
    description: '先从 Anthropic 官方页面和当前账号核验模型名称，再按长文档、写作、代码与错误排查流程使用 Claude。',
  }],
  ['/gemini/gemini-3-1-pro-zenme-yong-jiaocheng-2026', {
    title: 'Gemini Pro怎么用：模型名称核验、文件图片与错误排查',
    description: '先从 Google 官方页面和当前账号核验模型名称，再按文件、图片、写作与错误排查流程使用 Gemini。',
  }],
  ['/grok/grok-4-3-zenme-yong-jiaocheng-2026', {
    title: 'Grok怎么用：模型名称核验、搜索、推理与图片任务',
    description: '先从 xAI 与 Grok 当前页面核验模型名称，再按搜索、推理、写作、图片与错误排查流程使用。',
  }],
])

function normalizeRoute(value) {
  let route = value.replace(/\\/g, '/')
  route = route.replace(/\.md$/i, '')
  route = route.replace(/\/index$/i, '/')
  if (!route.startsWith('/')) route = `/${route}`
  if (route.length > 1) route = route.replace(/\/+$/, '')
  return route || '/'
}

function parseFrontmatter(source) {
  const clean = source.replace(/^\uFEFF/, '')
  const match = clean.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const values = {}
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (!item) continue
    let value = item[2].trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    values[item[1]] = value.replace(/\\(["'])/g, '$1')
  }
  return values
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(path))
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path)
  }
  return files
}

async function redirectSources() {
  const configPath = join(root, 'vercel.json')
  if (!existsSync(configPath)) return new Set()
  const config = JSON.parse(await readFile(configPath, 'utf8'))
  return new Set(
    (config.redirects || [])
      .map((item) => item.source || '')
      .filter((source) => source && !/[()*?[\]]/.test(source))
      .map(normalizeRoute),
  )
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

const redirects = await redirectSources()
const consolidatedRoutes = new Set([
  '/chatgpt/chatgpt-image-generation-gpt-image-2-web-guide-2026-06',
])
const articles = []
for (const section of sections) {
  const files = await walk(join(root, section))
  for (const file of files) {
    const relativePath = relative(root, file).replace(/\\/g, '/')
    if (relativePath === `${section}/index.md`) continue
    const route = normalizeRoute(relativePath)
    if (route === '/' || route.endsWith('/') || redirects.has(route) || consolidatedRoutes.has(route)) continue
    const frontmatter = parseFrontmatter(await readFile(file, 'utf8'))
    if (!frontmatter.title) continue
    const date = String(frontmatter.updated || frontmatter.date || '').slice(0, 10)
    const display = displayOverrides.get(route)
    articles.push({
      route,
      title: display?.title || frontmatter.title,
      description: display?.description || frontmatter.description || '中文 AI 工具使用教程、步骤说明和常见问题排查。',
      date,
      section: sectionNames[section] || section,
    })
  }
}

articles.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN'))

const feed = articles.map((article) => `  <article class="latest-feed-item">
    <div class="latest-feed-meta"><span>${escapeHtml(article.section)}</span><time datetime="${escapeHtml(article.date)}">${escapeHtml(article.date || '未标注日期')}</time></div>
    <h2><a href="${escapeHtml(article.route)}">${escapeHtml(article.title)}</a></h2>
    <p>${escapeHtml(article.description)}</p>
  </article>`).join('\n')

const source = await readFile(latestPath, 'utf8')
const start = '<!-- LATEST_FEED_START -->'
const end = '<!-- LATEST_FEED_END -->'
const startIndex = source.indexOf(start)
const endIndex = source.indexOf(end)
if (startIndex < 0 || endIndex < startIndex) {
  throw new Error('latest/index.md is missing the latest feed markers')
}

const replacement = `${start}\n<div class="latest-feed" aria-label="按更新时间排列的文章列表" data-article-count="${articles.length}">\n${feed}\n</div>\n${end}`
const next = `${source.slice(0, startIndex)}${replacement}${source.slice(endIndex + end.length)}`
if (next !== source) await writeFile(latestPath, next, 'utf8')

console.log(`Synced latest index with ${articles.length} canonical article links.`)
