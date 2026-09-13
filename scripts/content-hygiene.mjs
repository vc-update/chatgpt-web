import { existsSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const root = process.cwd()
const sections = ['chatgpt', 'claude', 'gemini', 'grok']
const networkDomains = /(?:gpthomechat\.com|chatgpt-guides\.com|chatgpt-chinese-blog\.com|chatgpt-chinese\.chat|grok-china\.com|claude-chinese-guide\.com|gemini-cn-guide\.com|chatgpt-official\.com|chatgpt-guanwang\.com)/i
const relatedBySection = {
  chatgpt: [
    '/chatgpt/chatgpt-official-entry-2026-domestic-chinese-complete-guide-20260720',
    '/chatgpt/chatgpt-webpage-how-to-use-2026',
    '/chatgpt/chatgpt-free-quota-message-attachment-limit-recovery-20260728',
    '/chatgpt/chatgpt-web-voice-microphone-permission-no-sound-browser-troubleshoot-20260720',
    '/chatgpt/chatgpt-codex-web-cli-app-guide-2026-06',
    '/chatgpt/gpt-claude-gemini-grok-model-comparison-china-2026-07',
  ],
  claude: [
    '/claude/claude-official-entry-chinese-claude-code-domestic-guide-2026-07',
    '/claude/claude-code-install-windows-macos-vscode-domestic-guide-2026-07',
    '/claude/claude-code-mcp-config-file-scope-connection-failed-20260731',
    '/claude/claude-code-usage-limit-reached-reset-check-save-20260730',
  ],
  gemini: [
    '/gemini/gemini-official-entry-chinese-web-domestic-guide-2026-07',
    '/gemini/gemini-zhongwen-ban-guonei-shiyong-zhinan-2026',
    '/gemini/gemini-file-upload-failed-pdf-image-limit-troubleshoot-20260730',
    '/gemini/gemini-vs-chatgpt-duibi-2026',
  ],
  grok: [
    '/grok/grok-official-entry-grok-com-xai-chinese-domestic-guide-2026-07',
    '/grok/grok-zhongwen-ban-guonei-shiyong-zhinan-2026',
    '/grok/grok-deepsearch-vs-think-difference-use-cases-20260730',
    '/grok/grok-vs-chatgpt-duibi-2026',
  ],
}

function normalizeRoute(value) {
  let route = value.replace(/\\/g, '/')
  route = route.replace(/\.md$/i, '').replace(/\/index$/i, '/')
  if (!route.startsWith('/')) route = `/${route}`
  return route.length > 1 ? route.replace(/\/+$/, '') : route
}

function parseFrontmatter(source) {
  const match = source.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const result = {}
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (!item) continue
    result[item[1]] = item[2].replace(/^['"]|['"]$/g, '').trim()
  }
  return result
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

const vercelPath = join(root, 'vercel.json')
const redirectSources = new Set()
if (existsSync(vercelPath)) {
  const config = JSON.parse(await readFile(vercelPath, 'utf8'))
  for (const redirect of config.redirects || []) {
    if (redirect.source && !/[()*?[\]]/.test(redirect.source)) redirectSources.add(normalizeRoute(redirect.source))
  }
}

function internalLinks(source) {
  return [...source.matchAll(/\]\((\/[^)#?\s]+)/g)].map((match) => normalizeRoute(match[1]))
}

function contentLinks(source, currentRoute) {
  return new Set(
    internalLinks(source).filter((target) =>
      /^\/(?:chatgpt|claude|gemini|grok)\/[^/]+$/.test(target)
        && target !== currentRoute
        && !redirectSources.has(target),
    ),
  )
}

function insertBeforeDisclaimer(source, block) {
  const marker = '\n::: warning 免责声明'
  const index = source.lastIndexOf(marker)
  if (index >= 0) return `${source.slice(0, index)}${block}${source.slice(index)}`
  return `${source.trimEnd()}${block}\n`
}

const labels = new Map([
  ['/chatgpt/chatgpt-official-entry-2026-domestic-chinese-complete-guide-20260720', 'ChatGPT 官网入口与中文版国内使用完整指南'],
  ['/chatgpt/chatgpt-webpage-how-to-use-2026', 'ChatGPT 网页版使用教程、ChatGPT 官方入口（2026 国内完整指南）'],
  ['/chatgpt/chatgpt-free-quota-message-attachment-limit-recovery-20260728', 'ChatGPT 免费额度与附件限制排查'],
  ['/chatgpt/chatgpt-web-voice-microphone-permission-no-sound-browser-troubleshoot-20260720', 'ChatGPT 网页版语音与麦克风排查'],
  ['/chatgpt/chatgpt-codex-web-cli-app-guide-2026-06', 'ChatGPT Codex 网页、CLI 与 IDE 使用指南'],
  ['/chatgpt/gpt-claude-gemini-grok-model-comparison-china-2026-07', 'ChatGPT、Gemini、Claude、Grok 多模型对比'],
  ['/claude/claude-official-entry-chinese-claude-code-domestic-guide-2026-07', 'Claude 官网入口与中文版指南'],
  ['/claude/claude-code-install-windows-macos-vscode-domestic-guide-2026-07', 'Claude Code 安装与 VS Code 配置'],
  ['/claude/claude-code-mcp-config-file-scope-connection-failed-20260731', 'Claude Code MCP 配置与连接排查'],
  ['/claude/claude-code-usage-limit-reached-reset-check-save-20260730', 'Claude Code 使用上限与额度排查'],
  ['/gemini/gemini-official-entry-chinese-web-domestic-guide-2026-07', 'Gemini 官网入口与中文设置'],
  ['/gemini/gemini-zhongwen-ban-guonei-shiyong-zhinan-2026', 'Gemini 中文版与国内使用指南'],
  ['/gemini/gemini-file-upload-failed-pdf-image-limit-troubleshoot-20260730', 'Gemini 文件上传失败排查'],
  ['/gemini/gemini-vs-chatgpt-duibi-2026', 'Gemini vs ChatGPT 对比'],
  ['/grok/grok-official-entry-grok-com-xai-chinese-domestic-guide-2026-07', 'Grok 官网入口与国内访问核验'],
  ['/grok/grok-zhongwen-ban-guonei-shiyong-zhinan-2026', 'Grok 中文版与国内使用指南'],
  ['/grok/grok-deepsearch-vs-think-difference-use-cases-20260730', 'Grok DeepSearch 与 Think 对比'],
  ['/grok/grok-vs-chatgpt-duibi-2026', 'Grok vs ChatGPT 对比'],
])

let changed = 0
let cleanedNetworkLinks = 0
let addedRelatedBlocks = 0

for (const section of sections) {
  for (const file of await walk(join(root, section))) {
    const route = normalizeRoute(relative(root, file))
    if (route === `/${section}` || route === `/${section}/`) continue

    const original = await readFile(file, 'utf8')
    const source = original.replace(/^\uFEFF/, '')
    const frontmatter = parseFrontmatter(source)
    if (!frontmatter.title) continue

    const lines = source.split(/\r?\n/)
    const filtered = lines.filter((line) => !networkDomains.test(line))
    if (filtered.length !== lines.length) cleanedNetworkLinks += lines.length - filtered.length
    let next = filtered.join('\n')

    if (redirectSources.has(route)) {
      if (next !== source) {
        await writeFile(file, next, 'utf8')
        changed += 1
      }
      continue
    }

    // Replace empty link sections left behind after removing the site-network footer.
    next = next.replace(/\n## 延伸阅读\s*\n(?=\n::: warning 免责声明)/g, '')

    const candidates = (relatedBySection[section] || [])
      .filter((target) => target !== route && !redirectSources.has(target))
      .filter((target) => existsSync(join(root, `${target.slice(1)}.md`)))
    const currentLinks = contentLinks(next, route)
    const missing = candidates.filter((target) => !currentLinks.has(target)).slice(0, 3)
    if (currentLinks.size < 2 && missing.length > 0) {
      const block = `\n<!-- INTERNAL_RELATED_START -->\n## 相关教程\n\n${missing.map((target) => `- [${labels.get(target) || target}](${target})`).join('\n')}\n<!-- INTERNAL_RELATED_END -->\n`
      next = insertBeforeDisclaimer(next, block)
      addedRelatedBlocks += 1
    }

    if (next !== source) {
      await writeFile(file, next, 'utf8')
      changed += 1
    }
  }
}

console.log(`Content hygiene updated ${changed} articles; removed ${cleanedNetworkLinks} network-link lines; added ${addedRelatedBlocks} related-link blocks.`)
