import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

// ============================================================
//  站点常量
// ============================================================
const SITE = 'https://www.chatgpt-web.com'
const SITE_NAME = 'ChatGPT 中文网'
const DEFAULT_OG_IMAGE = `${SITE}/og-image.png`
const OG_IMAGE_DIMENSIONS: Readonly<Record<string, { width: number; height: number }>> = {
  '/og-image.png': { width: 1200, height: 630 },
  '/images/chatgpt-auto-mirror-reference-2026.png': { width: 1908, height: 939 },
  '/images/gpt-5-6-agents-last-exam-cost.png': { width: 867, height: 758 },
  '/images/gpt-5-6-browsecomp-multi-agent-latency.png': { width: 795, height: 781 },
  '/images/gpt-5-6-coding-agent-index-cost.png': { width: 828, height: 687 },
  '/images/gpt-6-astra-gptcat-snakegpt-20260906.png': { width: 1890, height: 931 },
  '/images/news-ai-creation.jpg': { width: 1600, height: 1000 },
  '/images/news-chatgpt.jpg': { width: 1600, height: 1000 },
  '/images/news-claude-code.jpg': { width: 1600, height: 1000 },
  '/images/news-gemini-study.jpg': { width: 1600, height: 1000 },
  '/images/news-grok-space.jpg': { width: 1600, height: 1000 },
  '/images/snakegpt-mirror-page.png': { width: 1910, height: 941 },
}
const SPONSORED_DOMAINS = new Set([
  'gptbuys.com',
  'www.gptbuys.com',
  'gptcat.cc',
  'www.gptcat.cc',
  'share.gptcat.cc',
  'snakegpt.vip',
  'www.snakegpt.vip',
  'share.snakegpt.vip',
  'zeoapi.com',
  'www.zeoapi.com',
  'zeogpt.com',
  'www.zeogpt.com',
])
const OFFICIAL_SOURCE_DOMAINS = [
  'chatgpt.com',
  'openai.com',
  'help.openai.com',
  'status.openai.com',
  'platform.openai.com',
  'developers.openai.com'
]

const CHATGPT_OFFICIAL_PILLAR = '/chatgpt/chatgpt-official-entry-2026-domestic-chinese-complete-guide-20260720'
const CHATGPT_WEB_PILLAR = '/chatgpt/chatgpt-webpage-how-to-use-2026'
const CHATGPT_MOBILE_PILLAR = '/chatgpt/chatgpt-web-version-mobile-browser-tutorial-2026'
const CHATGPT_APP_PILLAR = '/chatgpt/chatgpt-app-download-windows-macos-ios-android-2026'

// Editorial timestamps are used only for curated hubs and utility pages.
// Article lastmod values continue to come from their own frontmatter.
const EDITORIAL_LASTMOD: Readonly<Record<string, string>> = {
  '/': '2026-09-06',
  '/chatgpt': '2026-09-06',
  '/claude': '2026-07-31',
  '/gemini': '2026-08-20',
  '/grok': '2026-08-20',
  '/latest': '2026-09-06',
  '/about': '2026-08-20',
  '/privacy': '2026-08-20',
  '/disclaimer': '2026-08-20',
}

// Highly overlapping entry pages consolidate to one intent-specific pillar.
const CANONICAL_CONSOLIDATIONS: Readonly<Record<string, string>> = {
  '/chatgpt/chatgpt-web-official-entry-domestic-chinese-mirror-no-download-online-20260709-4': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-entry-online-chinese-official-mirror-tutorial-20260709-2': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-online-entry-chinese-mirror-no-download-guide-20260709': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-entry-chinese-online-mirror-desktop-mobile-20260708': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-version-entry-china-2026-20260708-1': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-entry-china-online-2026': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-version-entry-china-2026': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-version-official-entry-guide-2026': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-no-download-online-guide-2026': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-version-no-download-guide-2026': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-version-online-entry-2026': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-version-entry-2026': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-version-guide-2026': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-version-china-guide-2026': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-online-use-login-free-2026-06': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-wangyeban-online-computer-phone-2026-06': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-login-free-mobile-desktop-2026-06': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-entry-login-online-free-2026-06': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-entry-official-login-chinese-no-download-2026-07': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-how-to-use-official-chinese-no-download-2026': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-webpage-entrance-2026-online-no-download-guide': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-entry-online-chinese-multimodel-2026': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-entrance-online-chinese-guide-2026': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-online-entry-web-version-chinese-2026': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-version-china-entry-mobile-browser-2026': CHATGPT_MOBILE_PILLAR,
  '/chatgpt/chatgpt-web-mobile-browser-chinese-entry-2026': CHATGPT_MOBILE_PILLAR,
  '/chatgpt/chatgpt-official-chinese-ultimate-guide-gpt56-gpt5-gpt4o-20260720': CHATGPT_OFFICIAL_PILLAR,
  '/chatgpt/chatgpt-official-chinese-gpt5-domestic-no-vpn-guide-20260720': CHATGPT_OFFICIAL_PILLAR,
  '/chatgpt/chatgpt-official-chinese-ultimate-guide-gpt5-gpt4o-mirror-register-20260711': CHATGPT_OFFICIAL_PILLAR,
  '/chatgpt/chatgpt-official-url-login-entry-chinese-version-20260720': CHATGPT_OFFICIAL_PILLAR,
  '/chatgpt/chatgpt-official-website-login-entry-2026': CHATGPT_OFFICIAL_PILLAR,
  '/chatgpt/chatgpt-login-entry-official-url-web-domestic-2026': CHATGPT_OFFICIAL_PILLAR,
  '/chatgpt/chatgpt-guanwang-rukou-zhongwenban-webban-2026': CHATGPT_OFFICIAL_PILLAR,
  '/chatgpt/chatgpt-guanwang-wangyeban-rukou-jiaocheng-2026': CHATGPT_OFFICIAL_PILLAR,
  '/chatgpt/chatgpt-chinese-entrance-guide-2026': CHATGPT_OFFICIAL_PILLAR,
  '/chatgpt/chatgpt-chinese-version-online-use-2026': CHATGPT_OFFICIAL_PILLAR,
  '/chatgpt/chatgpt-chinese-how-to-use-2026': CHATGPT_OFFICIAL_PILLAR,
  '/chatgpt/chatgpt-official-not-open-web-login-failed-captcha-mirror-2026-07-02': '/chatgpt/chatgpt-guanwang-dabukai-access-denied-jiejue-2026',
  '/chatgpt/chatgpt-login-failed-access-denied-account-fix-2026-06': '/chatgpt/chatgpt-login-failed-access-denied-2026',
  '/chatgpt/chatgpt-login-access-denied-captcha-phone-fix-2026-06': '/chatgpt/chatgpt-login-failed-access-denied-2026',
  '/chatgpt/chatgpt-api-key-official-price-call-zeoapi-guide-2026-07': '/chatgpt/chatgpt-api-key-how-to-get-official-price-call-zeoapi-2026-07-02',
  '/chatgpt/gpt-claude-gemini-grok-model-choice-2026-06': '/chatgpt/gpt-claude-gemini-grok-model-comparison-china-2026-07',
  '/chatgpt/ai-moxing-duibi-gpt-claude-gemini-grok-2026': '/chatgpt/gpt-claude-gemini-grok-model-comparison-china-2026-07',
  '/chatgpt/chatgpt-web-entry-where-official-login-online-chinese-fix-2026-07-02': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-vs-app-official-desktop-mobile-china-2026-07-02': '/chatgpt/chatgpt-app-download-windows-macos-ios-android-2026',
  '/chatgpt/chatgpt-online-free-web-official-mirror-chinese-tools-compare-2026-07-02': '/chatgpt/chatgpt-web-version-free-guide-2026',
  '/chatgpt/chatgpt-online-free-web-chinese-official-mirror-2026-07': '/chatgpt/chatgpt-web-version-free-guide-2026',
  '/chatgpt/chatgpt-official-web-login-failed-domestic-mirror-2026-07': '/chatgpt/chatgpt-guanwang-dabukai-access-denied-jiejue-2026',
  '/chatgpt/chatgpt-image-2-web-gpt-image-2-prompt-free-guide-2026-07': '/chatgpt/chatgpt-image-2-web-entry-gpt-image-2-generate-edit-prompt-limit-2026-07-02',
  '/chatgpt/chatgpt-image-generation-gpt-image-2-web-guide-2026-06': '/chatgpt/chatgpt-image-2-web-entry-gpt-image-2-generate-edit-prompt-limit-2026-07-02',
  '/chatgpt/chatgpt-web-login-entry-browser-history-troubleshoot-20260719': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-message-send-failed-network-session-file-status-20260716': '/chatgpt/chatgpt-free-quota-message-attachment-limit-recovery-20260728',
  '/chatgpt/chatgpt-web-gpt56-domestic-online-chinese-entry-no-download-mirror-20260710': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-no-download-entry-chinese-mirror-gpt56-online-guide-20260710-2': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-official-entry-chinese-mirror-no-download-online-guide-20260710-1': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-web-entry-chinese-official-domestic-mirror-gpt-image-2-online-20260709-3': CHATGPT_WEB_PILLAR,
  '/chatgpt/chatgpt-mobile-official-entry-2026': CHATGPT_MOBILE_PILLAR,
  '/chatgpt/chatgpt-desktop-download-vs-web-version-windows-mac-2026': CHATGPT_APP_PILLAR,
}
const SITE_HOSTNAMES = new Set([
  new URL(SITE).hostname.toLowerCase(),
  new URL(SITE).hostname.toLowerCase().replace(/^www\./, ''),
])

function normalizeRoutePath(value: string) {
  let path = value.trim()
  try {
    path = new URL(path, `${SITE}/`).pathname
  } catch {
    path = path.split(/[?#]/, 1)[0]
  }
  path = path.replace(/\\/g, '/').replace(/\/{2,}/g, '/')
  if (!path.startsWith('/')) path = `/${path}`
  path = path.replace(/\/index\.(?:md|html)$/i, '/')
  path = path.replace(/\.(?:md|html)$/i, '')
  if (path.length > 1) path = path.replace(/\/+$/, '')
  return path || '/'
}

function consolidationTarget(value: string, requireInternal = false) {
  if (requireInternal) {
    try {
      const parsed = new URL(value, `${SITE}/`)
      if (!SITE_HOSTNAMES.has(parsed.hostname.toLowerCase())) return undefined
      return CANONICAL_CONSOLIDATIONS[normalizeRoutePath(parsed.pathname)]
    } catch {
      return undefined
    }
  }
  return CANONICAL_CONSOLIDATIONS[normalizeRoutePath(value)]
}

// ============================================================
//  侧边栏
// ============================================================
const chatgptSidebar = [
  {
    text: 'ChatGPT 入门必读',
    collapsed: false,
    items: [
      { text: 'ChatGPT 网页版使用教程、ChatGPT 官方入口（2026 国内完整指南）', link: '/chatgpt/chatgpt-webpage-how-to-use-2026' },
      { text: 'ChatGPT下载安装教程：Windows、Mac、iPhone、Android与网页版全平台使用指南【2026年7月】', link: '/chatgpt/chatgpt-app-download-windows-macos-ios-android-2026' },
      { text: 'ChatGPT桌面App官方下载：Windows、Mac、Work与Codex入口区别【2026年9月】', link: '/chatgpt/chatgpt-desktop-app-download-work-codex-20260907' },
      { text: 'AI编程工具怎么选？Claude Code、Gemini CLI、Codex与API平台对比【2026年9月】', link: '/chatgpt/ai-coding-tools-claude-code-gemini-cli-codex-api-20260909' },
      { text: 'AI Agent是什么？ChatGPT Work、Codex与智能体工具怎么选【2026年9月】', link: '/chatgpt/ai-agent-chatgpt-work-codex-tools-guide-20260909' },
      { text: 'GPT Images 2.5是真的吗？ChatGPT图片生成入口、更新核验与提示词教程【2026年9月】', link: '/chatgpt/gpt-images-2-5-official-entry-verification-prompt-guide-20260909' },
      { text: 'ChatGPT聊天记录怎么导出？网页版全部数据、单个对话与备份方法【2026年9月】', link: '/chatgpt/chatgpt-web-chat-history-export-backup-markdown-pdf-20260912' },
      { text: 'AI编程工具怎么选？Claude Code、Gemini CLI、Codex与API平台对比【2026年9月】', link: '/chatgpt/ai-coding-tools-claude-code-gemini-cli-codex-api-20260909' },
      { text: 'AI Agent是什么？ChatGPT Work、Codex与智能体工具怎么选【2026年9月】', link: '/chatgpt/ai-agent-chatgpt-work-codex-tools-guide-20260909' },
      { text: 'GPT Images 2.5是真的吗？ChatGPT图片生成入口、更新核验与提示词教程【2026年9月】', link: '/chatgpt/gpt-images-2-5-official-entry-verification-prompt-guide-20260909' },
      { text: "ChatGPT中文版网页版教程：无需下载、中文设置与多模型工具辨别【2026年更新】", link: "/chatgpt/chatgpt-chinese-web-tutorial-gpt5-5-gpt-image-2-2026" },
      { text: "ChatGPT中文版入口：国内网页版、官方边界与安全核验指南【2026年更新】", link: "/chatgpt/chatgpt-chinese-entrance-guide-2026" },
      { text: "ChatGPT网页版在线使用：电脑手机免下载与多模型选择指南【2026年更新】", link: "/chatgpt/chatgpt-chinese-online-gpt55-claude-gemini-2026" },
      { text: "ChatGPT在线使用入口：网页版免下载、中文版直连与多模型工具对比【2026年7月】", link: "/chatgpt/chatgpt-online-entry-web-version-chinese-2026" },
      { text: "ChatGPT网页版入口：国内在线使用中文版与多模型切换教程【2026年7月更新】", link: "/chatgpt/chatgpt-web-entrance-online-chinese-guide-2026" },
      { text: "ChatGPT中文版怎么用？网页版入口、中文设置与使用教程【2026年更新】", link: "/chatgpt/chatgpt-chinese-how-to-use-2026" },
      { text: "ChatGPT网页版怎么打开？官网入口、在线使用和中文版方案对比", link: "/chatgpt/chatgpt-web-version-guide-2026" },
      { text: 'ChatGPT 中文版使用指南（2026最新）', link: '/chatgpt/chatgpt-zhongwen-ban-shiyong-zhinan-2026' },
      { text: 'ChatGPT 官网入口与网页版使用教程', link: '/chatgpt/chatgpt-guanwang-wangyeban-rukou-jiaocheng-2026' },
      { text: 'ChatGPT 官网打不开与 Access Denied 解决', link: '/chatgpt/chatgpt-guanwang-dabukai-access-denied-jiejue-2026' },
      { text: 'ChatGPT 中文版和官网区别与安全指南', link: '/chatgpt/chatgpt-zhongwenban-guanwang-qubie-anquan-2026' },
      { text: 'ChatGPT 怎么用？新手完整教程', link: '/chatgpt/chatgpt-zenme-yong-xinshou-jiaocheng-2026' },
      { text: 'ChatGPT注册登录教程：官网入口、邮箱验证与安全排查【2026年8月】', link: '/chatgpt/chatgpt-zhuce-jiaocheng-guonei-2026' },
      { text: 'ChatGPT 免费使用全攻略', link: '/chatgpt/chatgpt-mianfei-shiyong-quangonglue-2026' },
      { text: 'ChatGPT 手机版 App 下载安装教程', link: '/chatgpt/chatgpt-shoujiban-app-xiazai-anzhuang-2026' },
      { text: 'ChatGPT 打不开？报错解决方案', link: '/chatgpt/chatgpt-dabukai-baocuo-jiejue-2026' },
    ],
  },
  {
    text: '进阶与场景',
    collapsed: false,
    items: [
      { text: 'ChatGPT Plus 订阅与升级教程', link: '/chatgpt/chatgpt-plus-dingyue-shengji-jiaocheng-2026' },
      { text: 'ChatGPT 模型更新与使用核验', link: '/chatgpt/gpt-5-5-fabu-jiexi-guonei-shiyong-2026' },
      { text: 'ChatGPT 提示词（Prompt）大全', link: '/chatgpt/chatgpt-prompt-tishici-daquan-2026' },
      { text: 'ChatGPT AI 写作与论文教程', link: '/chatgpt/chatgpt-ai-xiezuo-lunwen-jiaocheng-2026' },
      { text: 'ChatGPT Codex AI 编程教程', link: '/chatgpt/chatgpt-codex-ai-biancheng-jiaocheng-2026' },
      { text: '四大 AI 模型横评：GPT/Claude/Gemini/Grok', link: '/chatgpt/ai-moxing-duibi-gpt-claude-gemini-grok-2026' },
    ],
  },
]

const grokSidebar = [
  {
    text: 'Grok 教程',
    collapsed: false,
    items: [
      { text: 'Grok 中文版国内使用指南', link: '/grok/grok-zhongwen-ban-guonei-shiyong-zhinan-2026' },
      { text: 'Grok 怎么用？模型名称、搜索与推理模式核验', link: '/grok/grok-4-3-zenme-yong-jiaocheng-2026' },
      { text: 'Grok vs ChatGPT 深度对比', link: '/grok/grok-vs-chatgpt-duibi-2026' },
    ],
  },
]

const claudeSidebar = [
  {
    text: 'Claude 教程',
    collapsed: false,
    items: [
      { text: 'Claude 中文版国内使用指南', link: '/claude/claude-zhongwen-ban-guonei-shiyong-zhinan-2026' },
      { text: 'Claude 注册教程：国内注册全流程', link: '/claude/claude-zhuce-jiaocheng-guonei-2026' },
      { text: 'Claude 怎么用？模型名称、长文档与代码任务核验', link: '/claude/claude-4-8-zenme-yong-jiaocheng-2026' },
      { text: 'Claude vs ChatGPT 深度对比', link: '/claude/claude-vs-chatgpt-duibi-2026' },
    ],
  },
]

const geminiSidebar = [
  {
    text: 'Gemini 教程',
    collapsed: false,
    items: [
      { text: 'Gemini 中文版国内使用指南', link: '/gemini/gemini-zhongwen-ban-guonei-shiyong-zhinan-2026' },
      { text: 'Gemini Pro 怎么用？模型名称、文件与图片任务核验', link: '/gemini/gemini-3-1-pro-zenme-yong-jiaocheng-2026' },
      { text: 'Gemini vs ChatGPT 深度对比', link: '/gemini/gemini-vs-chatgpt-duibi-2026' },
    ],
  },
]

const sidebar = {
  '/chatgpt/': chatgptSidebar,
  '/grok/': grokSidebar,
  '/claude/': claudeSidebar,
  '/gemini/': geminiSidebar,
}

// ============================================================
//  主配置
// ============================================================
// AUTO-GENERATED ARTICLE SIDEBAR START
const articleSidebar = [
  {
    "text": "ChatGPT 网页版与中文版",
    "collapsed": false,
    "items": [
      {"text":"ChatGPT账号被封了怎么办？封禁与打不开的区分、申诉流程与账号安全排查【2026年9月】","link":"/chatgpt/chatgpt-account-banned-suspended-appeal-security-check-20260915"},
      {"text":"ChatGPT Plus怎么取消订阅？退款条件、苹果谷歌渠道与扣费排查【2026年9月】","link":"/chatgpt/chatgpt-plus-cancel-subscription-refund-apple-google-billing-20260914"},
      {"text":"ChatGPT Images 2.5怎么用？网页版生图、图片编辑与中文提示词教程【2026年9月】","link":"/chatgpt/chatgpt-images-2-5-web-generate-edit-prompt-guide-20260909"},
      {"text":"ChatGPT网页版入口：Work模式、6 Astra Ultra与官网登录核验教程【2026年9月】","link":"/chatgpt/chatgpt-web-entry-work-6-astra-ultra-login-guide-202609"},
      {"text":"ChatGPT官网入口网页版：GPT-6 Astra官方页面与模型上线核验【2026年9月】","link":"/chatgpt/chatgpt-official-web-entry-gpt-6-astra-verification-2026-09"},
      {"text":"GPT-6 Astra国内怎么用？ChatGPT官网、中文版与GPTCat/SnakeGPT入口核验【2026年9月】","link":"/chatgpt/gpt-6-astra-guonei-shiyong-gptcat-snakegpt-guide-20260906"},
      {"text":"GPT-6 Astra国内怎么用？看不到模型、网页版登录与账号核验步骤【2026年9月】","link":"/chatgpt/gpt-6-astra-guonei-shiyong-kankan-budao-model-20260906"},
      {"text":"GPT-6 Astra官方入口在哪里？OpenAI发布页、ChatGPT官网与API核验指南【2026年9月】","link":"/chatgpt/gpt-6-astra-official-entry-publish-page-api-check-20260906"},
      {"text":"ChatGPT官网最新地址2026：chatgpt.com中文版、网页版登录与真假入口辨别","link":"/chatgpt/chatgpt-guanwang-zuixin-dizhi-zhongwenban-wangyeban-20260906"},
      {"text":"ChatGPT网页版无法完成回复怎么办？服务器无响应、长对话与浏览器排查【2026年8月】","link":"/chatgpt/chatgpt-web-unable-finish-replying-server-browser-troubleshoot-20260826"},
      {"text":"ChatGPT网页版临时聊天怎么用？历史记录、数据控制与隐私设置核对【2026年8月】","link":"/chatgpt/chatgpt-web-temporary-chat-data-controls-privacy-20260826"},
      {"text":"ChatGPT网页版复制代码乱码怎么办？代码块、Markdown、浏览器编码与下载排查【2026年8月】","link":"/chatgpt/chatgpt-web-copy-code-garbled-markdown-encoding-20260826"},
      {"text":"ChatGPT网页版很卡怎么办？长对话、浏览器扩展、缓存与网络排查【2026年8月】","link":"/chatgpt/chatgpt-web-page-lag-long-chat-browser-performance-20260825"},
      {"text":"ChatGPT网页版复制粘贴不了怎么办？浏览器权限、格式清理与输入框排查【2026年8月】","link":"/chatgpt/chatgpt-web-copy-paste-failed-browser-permission-20260825"},
      {"text":"ChatGPT网页版怎么换行？电脑、手机输入框换行快捷键与发送设置【2026年8月】","link":"/chatgpt/chatgpt-web-line-break-shortcut-mobile-desktop-20260825"},
      {"text":"ChatGPT中文版免费使用怎么实现？免费额度、免登录在线入口与付费升级区别核对【2026年8月】","link":"/chatgpt/chatgpt-chinese-free-use-limits-online-entry-2026"},
      {"text":"Codex CLI、网页版还是桌面App：ChatGPT登录与IDE使用区别【2026年8月】","link":"/chatgpt/chatgpt-codex-web-cli-app-guide-2026-06"},
      {"text":"ChatGPT手机电脑怎么同步？网页版与桌面客户端不同步、跨会话与登录设置排查【2026年8月】","link":"/chatgpt/chatgpt-web-desktop-mobile-sync-login-history-browser-settings-20260719"},
      {"text":"ChatGPT聊天记录没了怎么办？历史对话消失、登录方式、浏览器会话与找回检查【2026年8月】","link":"/chatgpt/chatgpt-web-chat-history-missing-login-browser-session-export-check-20260719"},
      {"text":"ChatGPT网页版：多设备同步、切换模型与浏览器免下载在线使用【2026年8月】","link":"/chatgpt/chatgpt-web-entrance-china-online-tutorial-2026"},
      {"text":"ChatGPT网页版在线使用：官网入口、免下载登录与中文版区别（2026年8月）","link":"/chatgpt/chatgpt-web-version-free-guide-2026"},
      

      {"text":"ChatGPT官网入口2026：国内使用、中文版与网页版核验指南","link":"/chatgpt/chatgpt-official-entry-2026-domestic-chinese-complete-guide-20260720"},
      {"text":"ChatGPT语音对话怎么用？GPT-Live语音模式、网页版手机App入口、麦克风没声音与按钮消失排查【2026年8月】","link":"/chatgpt/chatgpt-web-voice-microphone-permission-no-sound-browser-troubleshoot-20260720"},
      {"text":"ChatGPT云端浏览器怎么用？Work入口、Agent模式变化、网页任务与登录付款限制【2026年8月】","link":"/chatgpt/chatgpt-cloud-browser-work-agent-web-tasks-login-payment-20260807"},
      {"text":"ChatGPT Work怎么用？官网入口、Work下载、与Codex区别及国内使用教程【2026最新】","link":"/chatgpt/chatgpt-work-entry-download-codex-local-cloud-china-guide-20260805"},
      {"text":"ChatGPT怎么生成PPT？PPT大纲、提示词、PPTX下载与排版检查【2026】","link":"/chatgpt/chatgpt-create-ppt-outline-prompts-pptx-download-layout-20260804"},
      {"text":"ChatGPT学习模式怎么用？Study Mode入口、上传资料、做题与学习计划教程【2026】","link":"/chatgpt/chatgpt-study-mode-entry-upload-material-homework-plan-20260804"},
      {"text":"ChatGPT Projects怎么用？项目指令、上传文件、记忆与项目消失排查【2026】","link":"/chatgpt/chatgpt-projects-instructions-files-memory-missing-troubleshoot-20260804"},
      {"text":"AI视频生成免费工具哪个好用？2026文生视频、图生视频网站、生成器与提示词实测","link":"/chatgpt/ai-video-generation-free-tools-text-image-prompt-20260802"},
      {"text":"AI图片生成免费工具哪个好用？ChatGPT Image 2、Gemini、Grok绘图网站与提示词大全【2026】","link":"/chatgpt/ai-image-generation-free-chatgpt-gemini-grok-prompts-20260802"},
      {"text":"ChatGPT免费版和付费版有什么区别？免费使用、消息额度、图片生成、文件上传与Plus升级【2026】","link":"/chatgpt/chatgpt-plus-pro-free-go-business-plan-comparison-20260728"},
      {"text":"ChatGPT网页版删除的对话能恢复吗？误删、归档、记录消失与数据导出【2026年9月】","link":"/chatgpt/chatgpt-web-deleted-chat-recovery-archive-missing-export-20260731"},
      {"text":"ChatGPT网页版文件无法下载怎么办？代码解释器会话已过期、链接失效与0KB排查【2026年9月】","link":"/chatgpt/chatgpt-web-file-download-expired-session-link-0kb-20260731"},
      {"text":"ChatGPT 记忆已满怎么办？删除、关闭、管理 Memory 与聊天记录区别【2026年7月】","link":"/chatgpt/chatgpt-memory-full-delete-manage-saved-memory-20260730"},
      {"text":"ChatGPT Deep Research 和 Agent 模式有什么区别？研究、执行与额度怎么选【2026年7月】","link":"/chatgpt/chatgpt-deep-research-vs-agent-mode-difference-20260730"},
      {"text":"ChatGPT 模型、Codex 与 API 怎么选？任务难度、速度与成本核验【2026年更新】","link":"/chatgpt/gpt56-sol-terra-luna-chatgpt-codex-api-choice-20260728"},
      {"text":"ChatGPT 免费额度用完了怎么办？消息上限、附件限制与恢复方法【2026年7月】","link":"/chatgpt/chatgpt-free-quota-message-attachment-limit-recovery-20260728"},
      {
        "text": "ChatGPT、Gemini、Claude、Grok哪个好用？国内用户多模型对比与选择（2026）",
        "link": "/chatgpt/gpt-claude-gemini-grok-model-comparison-china-2026-07"
      },



      {"text":"ChatGPT文件上传失败怎么办？PDF、Excel、图片与格式限制排查【2026年8月】","link":"/chatgpt/chatgpt-web-pdf-excel-image-upload-format-privacy-check-20260724"},




      {"text":"ChatGPT网页版免费版：在线使用入口、免费层限制与电脑手机教程【2026年7月更新】","link":"/chatgpt/chatgpt-web-free-version-online-entry-desktop-mobile-20260724"},


      {"text":"ChatGPT网页版登录入口：官网登录、循环跳转、白屏与Cookie排查【2026年7月更新】","link":"/chatgpt/chatgpt-web-login-entry-loop-white-screen-cookie-20260723"},


      {"text":"ChatGPT网页版：无需下载的官网入口、手机电脑使用与登录排错【2026年7月更新】","link":"/chatgpt/chatgpt-web-no-download-how-to-use-2026"},


      {"text":"ChatGPT网页版截图怎么提问？图片上传、文字识别、表格读取与隐私检查【2026年7月】","link":"/chatgpt/chatgpt-web-screenshot-image-upload-ocr-table-privacy-guide-20260721"},

      {"text":"ChatGPT 官网与中文版使用指南：官方入口、登录与模型核验【2026年更新】","link":"/chatgpt/chatgpt-official-chinese-ultimate-guide-gpt56-gpt5-gpt4o-20260720"},
      {"text":"ChatGPT 官网中文版使用攻略：网页版登录、中文设置与安全边界【2026年更新】","link":"/chatgpt/chatgpt-official-chinese-gpt5-domestic-no-vpn-guide-20260720"},
      {"text":"ChatGPT官方网址入口（官网网址登录入口）- ChatGPT中文版","link":"/chatgpt/chatgpt-official-url-login-entry-chinese-version-20260720"},
      

      

      {"text":"ChatGPT网页版登录入口在哪里？电脑手机在线使用、聊天记录与浏览器排查【2026年7月】","link":"/chatgpt/chatgpt-web-login-entry-browser-history-troubleshoot-20260719"},
      {"text":"ChatGPT 网页版消息发送失败怎么办？网络、浏览器会话、文件上传与服务状态排查【2026年7月】","link":"/chatgpt/chatgpt-web-message-send-failed-network-session-file-status-20260716"},
      {"text":"ChatGPT网页版在线使用：手机电脑免下载、登录后文件上传与常见问题【2026年7月】","link":"/chatgpt/chatgpt-web-online-use-mobile-desktop-file-upload-20260713"},
      {"text":"ChatGPT网页版：一直转圈怎么办？网页版在线使用、Cookie和扩展排查【2026年7月】","link":"/chatgpt/chatgpt-web-white-screen-loading-cookie-extension-20260713"},
      {"text":"ChatGPT 官网与中文版使用指南：网页版、注册和第三方入口核验【2026年更新】","link":"/chatgpt/chatgpt-official-chinese-ultimate-guide-gpt5-gpt4o-mirror-register-20260711"},
      {"text":"ChatGPT 模型选择器在哪？网页版和手机端切换与账号权限核验【2026年更新】","link":"/chatgpt/gpt56-model-selector-web-mobile-instant-medium-high-20260711"},
      {"text":"ChatGPT 网页版怎么用？手机浏览器、免下载与模型显示排查【2026年更新】","link":"/chatgpt/gpt56-web-mobile-browser-no-download-free-entry-20260711"},
      {"text":"ChatGPT网页版在线使用：中文版入口、手机电脑免下载与模型核验【2026年更新】","link":"/chatgpt/openai-chatgpt-chinese-guide-gpt5-o3-models-2026"},
      {"text":"ChatGPT网页版：在线入口、免费版与手机浏览器使用排查【2026年更新】","link":"/chatgpt/chatgpt-web-gpt56-online-free-mobile-browser-20260711"},
      {"text":"ChatGPT网页版：国内免下载入口、中文版与第三方平台核验【2026年更新】","link":"/chatgpt/chatgpt-web-no-download-entry-chinese-mirror-gpt56-online-guide-20260710-2"},
      {"text":"ChatGPT网页版：国内在线使用、中文版入口与免下载排查【2026年更新】","link":"/chatgpt/chatgpt-web-gpt56-domestic-online-chinese-entry-no-download-mirror-20260710"},
      {"text":"ChatGPT网页版：官网入口、中文版镜像网站和免下载在线使用教程【2026年7月更新】","link":"/chatgpt/chatgpt-web-official-entry-chinese-mirror-no-download-online-guide-20260710-1"},
      {"text":"ChatGPT网页版：官网入口、国内中文版镜像网站和免下载在线使用教程【2026年7月更新】","link":"/chatgpt/chatgpt-web-official-entry-domestic-chinese-mirror-no-download-online-20260709-4"},
      {"text":"ChatGPT网页版入口：中文版官网、第三方平台与图片功能核验【2026年更新】","link":"/chatgpt/chatgpt-web-entry-chinese-official-domestic-mirror-gpt-image-2-online-20260709-3"},
      {"text":"ChatGPT网页版入口：国内在线使用ChatGPT中文版、官网入口和镜像网站教程【2026年7月更新】","link":"/chatgpt/chatgpt-web-entry-online-chinese-official-mirror-tutorial-20260709-2"},
      {"text":"ChatGPT网页版：国内在线入口、中文版镜像网站和无需下载使用指南【2026年7月更新】","link":"/chatgpt/chatgpt-web-online-entry-chinese-mirror-no-download-guide-20260709"},
      {"text":"ChatGPT网页版入口：国内ChatGPT中文版在线使用、镜像网站和电脑手机教程【2026年7月更新】","link":"/chatgpt/chatgpt-web-entry-chinese-online-mirror-desktop-mobile-20260708"},
      {"text":"ChatGPT网页版：国内在线入口、中文版镜像网站和手机浏览器使用教程【2026年7月更新】","link":"/chatgpt/chatgpt-web-version-china-entry-mobile-browser-2026"},
      {"text":"ChatGPT网页版入口：国内ChatGPT中文版在线使用、镜像网站和手机浏览器教程【2026年7月更新】","link":"/chatgpt/chatgpt-web-version-entry-china-2026-20260708-1"},
      {"text":"ChatGPT网页版打不开怎么办：国内ChatGPT中文版在线入口和镜像网站解决方案【2026年7月更新】","link":"/chatgpt/chatgpt-web-cannot-open-2026"},
      {"text":"ChatGPT中文版网页版：国内在线入口、ChatGPT官网和镜像网站使用指南【2026年7月更新】","link":"/chatgpt/chatgpt-chinese-web-version-guide-2026"},
      {"text":"ChatGPT网页版入口：国内ChatGPT中文版在线使用、官网入口与镜像网站教程【2026年7月更新】","link":"/chatgpt/chatgpt-web-entry-china-online-2026"},
      {"text":"ChatGPT网页版：ChatGPT官网入口、中文版镜像网站与国内在线使用教程【2026年最新】","link":"/chatgpt/chatgpt-web-version-official-entry-guide-2026"},
      {"text":"ChatGPT网页版免下载：国内在线入口、中文版镜像网站与多模型切换指南【2026年7月】","link":"/chatgpt/chatgpt-web-no-download-online-guide-2026"},
      {"text":"ChatGPT网页版入口：国内在线使用ChatGPT中文版、镜像网站与手机教程【2026年最新】","link":"/chatgpt/chatgpt-web-version-entry-china-2026"},
      {"text":"ChatGPT网页版：国内在线使用入口、镜像网站推荐与手机浏览器教程【2026年最新】","link":"/chatgpt/chatgpt-web-version-china-guide-2026"},
      {"text":"ChatGPT网页版免下载使用指南：电脑、手机浏览器和中文版入口对比【2026年最新】","link":"/chatgpt/chatgpt-web-version-no-download-guide-2026"},
      {"text":"ChatGPT网页版手机怎么打开？国内浏览器使用ChatGPT中文版入口教程【2026年最新】","link":"/chatgpt/chatgpt-web-mobile-browser-chinese-entry-2026"},
      {"text":"ChatGPT网页版手机怎么用？国内浏览器打开、免下载和中文版入口教程【2026年7月更新】","link":"/chatgpt/chatgpt-web-version-mobile-browser-tutorial-2026"},
      {"text":"ChatGPT网页版入口：国内免下载使用、手机浏览器打开和中文版教程【2026年7月更新】","link":"/chatgpt/chatgpt-web-version-entry-2026"},
      {"text":"ChatGPT 官网入口与中文版网页版使用指南：国内访问、登录注册、打不开解决办法【2026年7月】","link":"/chatgpt/chatgpt-guanwang-rukou-zhongwenban-webban-2026"},
      
      {"text":"ChatGPT网页版入口：在线使用、手机电脑登录与中文设置指南【2026年更新】","link":"/chatgpt/chatgpt-webpage-entrance-2026-online-no-download-guide"},
      {"text":"ChatGPT网页版在线使用：免下载打开、中文设置与图片功能核验【2026年更新】","link":"/chatgpt/chatgpt-web-online-no-download-gpt55-gpt-image-2-2026"},
      {"text":"ChatGPT 网页版使用教程、ChatGPT 官方入口（2026 国内完整指南）","link":"/chatgpt/chatgpt-webpage-how-to-use-2026"},
      
      {"text":"ChatGPT网页版入口：手机电脑在线使用中文版与多模型工具教程【2026年7月更新】","link":"/chatgpt/chatgpt-web-entry-online-chinese-multimodel-2026"},
      {"text":"ChatGPT手机版入口：手机浏览器、官方 App 与第三方平台辨别【2026年更新】","link":"/chatgpt/chatgpt-mobile-official-entry-2026"},
      {
        "text": "ChatGPT API Key怎么获取：官网价格、调用方法、国内中转ZeoAPI教程",
        "link": "/chatgpt/chatgpt-api-key-how-to-get-official-price-call-zeoapi-2026-07-02"
      },
      {
        "text": "ChatGPT图片生成教程：网页版入口、中文提示词、改图与失败排查【2026年8月】",
        "link": "/chatgpt/chatgpt-image-2-web-entry-gpt-image-2-generate-edit-prompt-limit-2026-07-02"
      },
      {
        "text": "ChatGPT官网打不开怎么办：网页版登录失败、验证码、网络和镜像替代方案",
        "link": "/chatgpt/chatgpt-official-not-open-web-login-failed-captcha-mirror-2026-07-02"
      },
      {
        "text": "ChatGPT网页版和App哪个好：官网入口、电脑版下载、手机端和国内访问",
        "link": "/chatgpt/chatgpt-web-vs-app-official-desktop-mobile-china-2026-07-02"
      },
      {
        "text": "ChatGPT网页版入口在哪：官网登录、在线使用、中文版和打不开解决方法",
        "link": "/chatgpt/chatgpt-web-entry-where-official-login-online-chinese-fix-2026-07-02"
      },
      {
        "text": "ChatGPT在线使用免费吗：网页版、官网入口、镜像网站和中文工具对比",
        "link": "/chatgpt/chatgpt-online-free-web-official-mirror-chinese-tools-compare-2026-07-02"
      },
      {
        "text": "ChatGPT中文版怎么用？网页版入口、中文设置与使用教程【2026年更新】",
        "link": "/chatgpt/chatgpt-chinese-how-to-use-2026"
      },
      {
        "text": "ChatGPT网页版入口怎么打开：官网登录、中文版、免下载使用教程（2026）",
        "link": "/chatgpt/chatgpt-web-how-to-use-official-chinese-no-download-2026"
      },
      {
        "text": "ChatGPT登录入口在哪里：官方网址、网页版登录和国内访问失败解决（2026）",
        "link": "/chatgpt/chatgpt-login-entry-official-url-web-domestic-2026"
      },
      {
        "text": "ChatGPT电脑版下载还是网页版：Windows/Mac安装、免下载入口和安全教程（2026）",
        "link": "/chatgpt/chatgpt-desktop-download-vs-web-version-windows-mac-2026"
      },
      {
        "text": "ChatGPT API Key获取教程：官网、价格、调用方法与ZeoAPI中转",
        "link": "/chatgpt/chatgpt-api-key-official-price-call-zeoapi-guide-2026-07"
      },
      {
        "text": "ChatGPT图片生成教程：网页版入口、中文提示词、改图与失败排查【2026年8月】",
        "link": "/chatgpt/chatgpt-image-2-web-gpt-image-2-prompt-free-guide-2026-07"
      },
      {
        "text": "ChatGPT官网入口网页版登录：打不开、登录失败、国内访问和镜像方案",
        "link": "/chatgpt/chatgpt-official-web-login-failed-domestic-mirror-2026-07"
      },
      {
        "text": "ChatGPT网页版入口：国内在线使用中文版与多模型切换教程【2026年7月更新】",
        "link": "/chatgpt/chatgpt-web-entrance-online-chinese-guide-2026"
      },
      {
        "text": "ChatGPT网页版入口官网：在线使用、登录入口、中文版与免下载教程",
        "link": "/chatgpt/chatgpt-web-entry-official-login-chinese-no-download-2026-07"
      },
      {
        "text": "ChatGPT网页版怎么打开？官网入口、在线使用和中文版方案对比",
        "link": "/chatgpt/chatgpt-web-version-guide-2026"
      },
      {
        "text": "ChatGPT在线使用免费：网页版、中文版、官网入口和镜像网站怎么选",
        "link": "/chatgpt/chatgpt-online-free-web-chinese-official-mirror-2026-07"
      },
      {
        "text": "ChatGPT在线使用入口：网页版免下载、中文版直连与多模型工具对比【2026年7月】",
        "link": "/chatgpt/chatgpt-online-entry-web-version-chinese-2026"
      },
      {
        "text": "ChatGPT中文版入口：国内网页版、官方边界与安全核验指南【2026年更新】",
        "link": "/chatgpt/chatgpt-chinese-entrance-guide-2026"
      },
      {
        "text": "ChatGPT中文版网页版教程：无需下载、中文设置与多模型工具辨别【2026年更新】",
        "link": "/chatgpt/chatgpt-chinese-web-tutorial-gpt5-5-gpt-image-2-2026"
      },
      {
        "text": "ChatGPT网页版在线使用：电脑手机免下载与多模型选择指南【2026年更新】",
        "link": "/chatgpt/chatgpt-chinese-online-gpt55-claude-gemini-2026"
      },
      {
        "text": "Codex CLI安装教程：官网入口、下载、Windows配置与国内使用",
        "link": "/chatgpt/codex-cli-install-official-download-windows-china-2026-07"
      },
      {
        "text": "ChatGPT登录不上怎么办？登录入口、验证码、Access Denied和国内解决方案",
        "link": "/chatgpt/chatgpt-login-access-denied-captcha-phone-fix-2026-06"
      },
      {
        "text": "ChatGPT网页版入口官网2026：登录入口、在线使用、免费下载和国内可用方案",
        "link": "/chatgpt/chatgpt-web-entry-login-online-free-2026-06"
      },
      {
        "text": "ChatGPT下载教程2026：Windows、Mac、iOS、Android官方入口和假App识别",
        "link": "/chatgpt/chatgpt-download-windows-mac-ios-android-official-fake-app-2026-06"
      },
      {
        "text": "四大AI模型怎么选：ChatGPT、Claude、Gemini、Grok任务对比【2026】",
        "link": "/chatgpt/ai-moxing-duibi-gpt-claude-gemini-grok-2026"
      },
      {
        "text": "ChatGPT 打不开/报错解决方案 2026：常见错误一网打尽",
        "link": "/chatgpt/chatgpt-dabukai-baocuo-jiejue-2026"
      },
      {
        "text": "ChatGPT 官网入口打不开怎么办？Access Denied、登录失败与国内访问解决方案（2026）",
        "link": "/chatgpt/chatgpt-guanwang-dabukai-access-denied-jiejue-2026"
      },
      {
        "text": "ChatGPT 国内怎么使用？（官网 + 镜像完整方案）",
        "link": "/chatgpt/chatgpt-china-official-mirror-complete-solution-2026-06"
      },
      {
        "text": "ChatGPT 免费使用全攻略 2026：免费层、额度与功能核验",
        "link": "/chatgpt/chatgpt-mianfei-shiyong-quangonglue-2026"
      },
      {
        "text": "ChatGPT 手机版 App 下载安装教程 2026：iOS与Android全攻略",
        "link": "/chatgpt/chatgpt-shoujiban-app-xiazai-anzhuang-2026"
      },
      {
        "text": "ChatGPT 提示词Prompt大全 2026：万能公式与实战模板合集",
        "link": "/chatgpt/chatgpt-prompt-tishici-daquan-2026"
      },
      {
        "text": "ChatGPT图片生成教程：网页版入口、中文提示词、改图与失败排查【2026年8月】",
        "link": "/chatgpt/chatgpt-image-generation-gpt-image-2-web-guide-2026-06"
      },
      {
        "text": "ChatGPT 网页版在线使用教程 2026：电脑手机入口、登录失败和国内访问",
        "link": "/chatgpt/chatgpt-wangyeban-online-computer-phone-2026-06"
      },
      {
        "text": "ChatGPT 网页版在线使用教程 2026：电脑手机入口、登录失败和免费方案",
        "link": "/chatgpt/chatgpt-web-online-use-login-free-2026-06"
      },
      {
        "text": "ChatGPT 怎么用？2026 新手完整教程（从注册到精通）",
        "link": "/chatgpt/chatgpt-zenme-yong-xinshou-jiaocheng-2026"
      },
      {
        "text": "ChatGPT 中文版和官网有什么区别？网页版入口、镜像站与安全避坑指南（2026）",
        "link": "/chatgpt/chatgpt-zhongwenban-guanwang-qubie-anquan-2026"
      },
      {
        "text": "ChatGPT注册登录教程：官网入口、邮箱验证与安全排查【2026年8月】",
        "link": "/chatgpt/chatgpt-zhuce-jiaocheng-guonei-2026"
      },
      {
        "text": "ChatGPT AI写作与论文教程 2026：从选题到成稿全流程",
        "link": "/chatgpt/chatgpt-ai-xiezuo-lunwen-jiaocheng-2026"
      },
      {
        "text": "ChatGPT App下载教程2026：Windows、iOS、Android官方入口、网页版和假App识别",
        "link": "/chatgpt/chatgpt-app-download-official-web-mobile-safety-2026-06"
      },
      
      {
        "text": "ChatGPT Codex AI编程教程 2026：从装环境到自动写代码",
        "link": "/chatgpt/chatgpt-codex-ai-biancheng-jiaocheng-2026"
      },
      {
        "text": "ChatGPT Plus 订阅与升级教程 2026最新：官方购买、代充与多模型方案",
        "link": "/chatgpt/chatgpt-plus-dingyue-shengji-jiaocheng-2026"
      },
      {
        "text": "ChatGPT登录失败和Access Denied怎么办？2026账号、浏览器和网络排查",
        "link": "/chatgpt/chatgpt-login-failed-access-denied-2026"
      },
      {
        "text": "ChatGPT登录失败怎么办2026：Access Denied、验证码、账号安全和国内替代入口",
        "link": "/chatgpt/chatgpt-login-failed-access-denied-account-fix-2026-06"
      },
      {
        "text": "ChatGPT官网登录入口2026：GPT官网、OpenAI官网入口、网页版和中文版",
        "link": "/chatgpt/chatgpt-official-website-login-entry-2026"
      },
      {
        "text": "ChatGPT官网入口与网页版使用教程 2026：官方网址、在线登录、中文版网页和国内访问",
        "link": "/chatgpt/chatgpt-guanwang-wangyeban-rukou-jiaocheng-2026"
      },
      {
        "text": "ChatGPT国内访问指南2026：官网打不开、中文版和镜像站怎么选",
        "link": "/chatgpt/chatgpt-domestic-access-guide-2026-new"
      },
      {
        "text": "ChatGPT镜像站安全吗2026：中文入口、登录风险和付费避坑",
        "link": "/chatgpt/chatgpt-mirror-sites-safe-or-not-2026"
      },
      {
        "text": "ChatGPT免费使用指南2026：官网免费版、中文入口和额度限制",
        "link": "/chatgpt/chatgpt-free-use-guide-2026-new"
      },
      {
        "text": "ChatGPT提示词大全2026：写作、办公、学习、编程和图片生成",
        "link": "/chatgpt/chatgpt-prompt-prompts-complete-2026-new"
      },
      {
        "text": "ChatGPT图片生成免费怎么用？GPT-Image-2、MJ绘图、提示词和国内入口2026",
        "link": "/chatgpt/chatgpt-image-generation-free-gpt-image-2-mj-prompt-2026-06"
      },
      {
        "text": "ChatGPT网页版在线入口2026：电脑手机浏览器使用和登录教程",
        "link": "/chatgpt/chatgpt-web-version-online-entry-2026"
      },
      {
        "text": "ChatGPT网页版在线使用2026：官网登录、手机电脑入口、免费额度和国内访问",
        "link": "/chatgpt/chatgpt-web-login-free-mobile-desktop-2026-06"
      },
      {
        "text": "ChatGPT写作和论文润色教程2026：Prompt、结构和查重风险",
        "link": "/chatgpt/chatgpt-ai-writing-paper-polish-2026-new"
      },
      {
        "text": "ChatGPT下载安装教程：Windows、Mac、iPhone、Android与网页版全平台使用指南【2026年7月】",
        "link": "/chatgpt/chatgpt-app-download-windows-macos-ios-android-2026"
      },
      {
        "text": "ChatGPT中文版使用指南 2026：官网区别、网页版入口与安全核验",
        "link": "/chatgpt/chatgpt-zhongwen-ban-shiyong-zhinan-2026"
      },
      {
        "text": "ChatGPT中文版在线使用2026：官网区别、中文网页和国内入口",
        "link": "/chatgpt/chatgpt-chinese-version-online-use-2026"
      },
      {
        "text": "ChatGPT 模型更新与国内使用核验 2026：名称、入口与权限说明",
        "link": "/chatgpt/gpt-5-5-fabu-jiexi-guonei-shiyong-2026"
      },
      {
        "text": "GPT、Claude、Gemini、Grok怎么选？2026多模型工具对比和国内入口",
        "link": "/chatgpt/gpt-claude-gemini-grok-model-choice-2026-06"
      }
    ]
  },
  {
    "text": "Grok 教程",
    "collapsed": false,
    "items": [
      {"text":"Grok官网入口：grok.com、x.ai网页版登录与国内访问核验【2026年9月】","link":"/grok/grok-official-entry-grok-com-xai-chinese-domestic-guide-2026-07"},
      
      
      {
        "text": "Grok Imagine怎么用？官网入口、AI视频生成、图片生成、提示词、下载与使用上限【2026】",
        "link": "/grok/grok-imagine-image-video-prompt-download-limit-20260802"
      },
      {
        "text": "Grok Imagine视频生成失败怎么办？文生视频、图生视频与下载排查【2026年9月】",
        "link": "/grok/grok-imagine-video-generation-failed-download-troubleshoot-20260912"
      },
      {
        "text": "Grok无法完成回复怎么办？Was Unable to Finish Replying、服务器无响应与浏览器排查【2026年7月】",
        "link": "/grok/grok-unable-finish-replying-server-browser-troubleshoot-20260731"
      },
      {
        "text": "Grok DeepSearch 和 Think 有什么区别？实时搜索、推理与使用场景【2026年7月】",
        "link": "/grok/grok-deepsearch-vs-think-difference-use-cases-20260730"
      },
      
      {
        "text": "Grok 怎么用？模型名称、搜索与推理模式核验【2026】",
        "link": "/grok/grok-4-3-zenme-yong-jiaocheng-2026"
      },
      {
        "text": "Grok 中文版国内使用指南 2026：官方入口与功能核验",
        "link": "/grok/grok-zhongwen-ban-guonei-shiyong-zhinan-2026"
      },
      {
        "text": "Grok vs ChatGPT 深度对比 2026：热点、写作与任务选择",
        "link": "/grok/grok-vs-chatgpt-duibi-2026"
      }
    ]
  },
  {
    "text": "Claude 教程",
    "collapsed": false,
    "items": [
      {"text":"Claude Code怎么安装？Windows、macOS、VS Code配置与国内访问核对【2026年8月】","link":"/claude/claude-code-install-windows-macos-vscode-domestic-guide-2026-07"},
      {
        "text": "Claude Code MCP怎么配置？配置文件位置、Local/Project/User作用域与连接失败排查【2026年7月】",
        "link": "/claude/claude-code-mcp-config-file-scope-connection-failed-20260731"
      },
      {
        "text": "Claude Code 达到使用上限怎么办？额度恢复、用量检查与节省方法【2026年7月】",
        "link": "/claude/claude-code-usage-limit-reached-reset-check-save-20260730"
      },
      {
        "text": "Claude Code历史会话怎么恢复？resume、continue、会话存储与项目目录教程【2026年9月】",
        "link": "/claude/claude-code-history-resume-continue-session-20260912"
      },
      {
        "text": "Claude 官网入口与中文版使用指南：Claude.com、Claude Code、国内访问和镜像区别（2026年7月）",
        "link": "/claude/claude-official-entry-chinese-claude-code-domestic-guide-2026-07"
      },
      
      {
        "text": "Claude 怎么用 2026：模型名称、长文档与代码任务核验",
        "link": "/claude/claude-4-8-zenme-yong-jiaocheng-2026"
      },
      {
        "text": "Claude 中文版国内使用指南 2026：官方入口与功能核验",
        "link": "/claude/claude-zhongwen-ban-guonei-shiyong-zhinan-2026"
      },
      {
        "text": "Claude 注册教程 2026最新：国内注册全流程与手机验证解决方案",
        "link": "/claude/claude-zhuce-jiaocheng-guonei-2026"
      },
      {
        "text": "Claude vs ChatGPT 深度对比 2026：写作、代码与长文档怎么选",
        "link": "/claude/claude-vs-chatgpt-duibi-2026"
      }
    ]
  },
  {
    "text": "Gemini 教程",
    "collapsed": false,
    "items": [
      {"text":"Gemini CLI安装使用教程：官网、Windows、macOS、终端命令与API区别【2026年9月】","link":"/gemini/gemini-cli-install-use-windows-macos-api-20260909"},
      {"text":"Gemini官网入口：官方网址、中文版网页登录与国内访问核验【2026年8月】","link":"/gemini/gemini-official-entry-chinese-web-domestic-guide-2026-07"},
      
      {
        "text": "Gemini学生认证怎么弄？官网入口、资格验证、无法享受优惠与常见问题【2026】",
        "link": "/gemini/gemini-student-verification-entry-eligibility-failed-20260802"
      },
      {
        "text": "Gemini Canvas怎么做PPT？生成简报、导出Google Slides与下载PowerPoint教程【2026年9月】",
        "link": "/gemini/gemini-canvas-ppt-slides-powerpoint-export-20260731"
      },
      {
        "text": "Gemini 无法读取上传的文件怎么办？PDF、图片、格式与上传限制排查【2026年7月】",
        "link": "/gemini/gemini-file-upload-failed-pdf-image-limit-troubleshoot-20260730"
      },
      
      {
        "text": "Gemini Pro 怎么用 2026：模型名称、文件与图片任务核验",
        "link": "/gemini/gemini-3-1-pro-zenme-yong-jiaocheng-2026"
      },
      {
        "text": "Gemini 中文版国内使用指南 2026：官方入口与功能核验",
        "link": "/gemini/gemini-zhongwen-ban-guonei-shiyong-zhinan-2026"
      },
      {
        "text": "Gemini vs ChatGPT 深度对比 2026：多模态、写作与办公怎么选",
        "link": "/gemini/gemini-vs-chatgpt-duibi-2026"
      }
    ]
  }
]

const articleDateCache = new Map<string, string>()

function articleDate(link: string) {
  const normalized = normalizeRoutePath(link)
  const cached = articleDateCache.get(normalized)
  if (cached !== undefined) return cached

  const candidates: string[] = []
  if (normalized === '/') {
    candidates.push('../index.md')
  } else if (/^\/(chatgpt|grok|claude|gemini)\/?$/.test(normalized)) {
    candidates.push(`..${normalized.replace(/\/$/, '')}/index.md`)
  } else if (/^\/(chatgpt|grok|claude|gemini)\/.+/.test(normalized)) {
    candidates.push(`..${normalized}.md`)
  } else {
    candidates.push(`..${normalized}.md`, `..${normalized}/index.md`)
  }

  for (const candidate of candidates) {
    try {
      const source = readFileSync(fileURLToPath(new URL(candidate, import.meta.url)), 'utf8').replace(/^\uFEFF/, '')
      const frontmatter = source.match(/^---\s*([\s\S]*?)\s*---/)
      const updated = frontmatter?.[1].match(/^updated:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1]
      const date = frontmatter?.[1].match(/^date:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1]
      const value = (updated || date || '').trim()
      articleDateCache.set(normalized, value)
      return value
    } catch {
      // Try the next route shape, such as a section index.
    }
  }

  articleDateCache.set(normalized, '')
  return ''
}

function compactSidebarItems<T extends { link?: string }>(items: T[]) {
  const seen = new Set<string>()
  return items
    .filter((item) => {
      const link = item.link || ''
      if (!link || consolidationTarget(link, true) || seen.has(link)) return false
      seen.add(link)
      return true
    })
    .sort((a, b) => articleDate(b.link || '').localeCompare(articleDate(a.link || '')))
}

function sidebarByPrefix(source: typeof articleSidebar, prefix: string, text: string) {
  const priorityLinks = new Set([
    prefix === '/chatgpt/' ? CHATGPT_OFFICIAL_PILLAR : '',
    prefix === '/chatgpt/' ? CHATGPT_WEB_PILLAR : '',
    prefix === '/chatgpt/' ? CHATGPT_MOBILE_PILLAR : '',
    prefix === '/chatgpt/' ? '/chatgpt/chatgpt-app-download-windows-macos-ios-android-2026' : '',
    prefix === '/chatgpt/' ? '/chatgpt/chatgpt-guanwang-dabukai-access-denied-jiejue-2026' : '',
    prefix === '/chatgpt/' ? '/chatgpt/chatgpt-zhuce-jiaocheng-guonei-2026' : '',
    prefix === '/chatgpt/' ? '/chatgpt/chatgpt-plus-pro-free-go-business-plan-comparison-20260728' : '',
    prefix === '/chatgpt/' ? '/chatgpt/chatgpt-web-voice-microphone-permission-no-sound-browser-troubleshoot-20260720' : '',
    prefix === '/chatgpt/' ? '/chatgpt/chatgpt-web-pdf-excel-image-upload-format-privacy-check-20260724' : '',
    prefix === '/chatgpt/' ? '/chatgpt/chatgpt-codex-web-cli-app-guide-2026-06' : '',
    prefix === '/chatgpt/' ? '/chatgpt/chatgpt-api-key-how-to-get-official-price-call-zeoapi-2026-07-02' : '',
    prefix === '/chatgpt/' ? '/chatgpt/gpt-claude-gemini-grok-model-comparison-china-2026-07' : '',
  ])
  return source
    .map((group) => ({
      ...group,
      text,
      collapsed: false,
      items: compactSidebarItems(group.items.filter((item) => item.link === prefix || item.link.startsWith(prefix))),
    }))
    .map((group) => ({
      ...group,
      items: group.items
        .sort((a, b) => Number(priorityLinks.has(b.link || '')) - Number(priorityLinks.has(a.link || '')))
        .slice(0, prefix === '/chatgpt/' ? 18 : 12),
    }))
    .filter((group) => group.items.length > 0)
}

// AUTO-GENERATED ARTICLE SIDEBAR END

export default defineConfig({
  // 1. 站点元数据
  title: 'ChatGPT 中文网 | ChatGPT 中文版使用指南与官网入口教程',
  titleTemplate: false,
  description:
    'ChatGPT网页版使用指南，整理官网入口、浏览器免下载、手机电脑登录、中文使用、聊天记录同步、文件图片语音和常见故障排查。',
  lang: 'zh-CN',
  // 多页应用模式，利于 SEO（每页独立 HTML）
  mpa: false,
  // 编辑与审计记录只服务本地工作流，不生成公开页面。
  srcExclude: ['research/**', 'FULL-AUDIT-REPORT.md', 'ACTION-PLAN.md'],
  markdown: {
    config(md) {
      const defaultLinkOpen = md.renderer.rules.link_open
      md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const href = tokens[idx].attrGet('href') || ''
        const target = consolidationTarget(href, true)
        const render = () =>
          defaultLinkOpen
            ? defaultLinkOpen(tokens, idx, options, env, self)
            : self.renderToken(tokens, idx, options)
        const removeAttr = (name: string) => {
          if (tokens[idx].attrs) tokens[idx].attrs = tokens[idx].attrs.filter(([key]) => key !== name)
        }

        if (target) {
          tokens[idx].attrSet('href', target)
          removeAttr('target')
          removeAttr('rel')
          return render()
        }

        try {
          const effectiveHref = target || href
          if (!/^https?:\/\//i.test(effectiveHref)) {
            return render()
          }
          const parsed = new URL(effectiveHref)
          const hostname = parsed.hostname.toLowerCase()
          if (SPONSORED_DOMAINS.has(hostname)) {
            tokens[idx].attrSet('rel', 'nofollow sponsored noopener noreferrer')
            tokens[idx].attrSet('target', '_blank')
          } else if (!SITE_HOSTNAMES.has(hostname)) {
            const rel = new Set((tokens[idx].attrGet('rel') || '').split(/\s+/).filter(Boolean))
            rel.add('noopener')
            rel.add('noreferrer')
            tokens[idx].attrSet('rel', [...rel].join(' '))
            tokens[idx].attrSet('target', '_blank')
          } else {
            tokens[idx].attrSet('href', `${parsed.pathname}${parsed.search}${parsed.hash}`)
            removeAttr('target')
            removeAttr('rel')
          }
        } catch {
          // Relative links are handled by VitePress normally.
        }
        return render()
      }
    },
  },

  // 2. sitemap：Bing / Google 爬虫靠它发现页面
  sitemap: {
    hostname: SITE,
    transformItems: (items) => {
      return items
        .filter((item) => {
          const rawUrl = item.url || ''
          let pathname = rawUrl
          try {
            pathname = new URL(rawUrl, SITE).pathname
          } catch {
            // Keep relative sitemap paths as-is.
          }
          return !consolidationTarget(pathname)
        })
        .map((item) => {
          const rawUrl = item.url || ''
          let pathname = rawUrl
          try {
            pathname = new URL(rawUrl, SITE).pathname
          } catch {
            // Keep relative sitemap paths as-is.
          }
          const route = normalizeRoutePath(pathname)
          const url = route.replace(/^\/+/, '')
          const lastmod = articleDate(route)
          let priority = 0.6
          let changefreq: 'daily' | 'weekly' | 'monthly' = 'monthly'
          if (route === '/') {
            priority = 1.0
            changefreq = 'weekly'
          } else if (/^\/(chatgpt|grok|claude|gemini)\/?$/.test(route)) {
            priority = 0.8
            changefreq = 'weekly'
          } else if (/^\/(chatgpt|grok|claude|gemini)\//.test(route)) {
            priority = 0.7
            changefreq = 'weekly'
          }
          const fallbackLastmod = EDITORIAL_LASTMOD[route]
          return {
            ...item,
            ...(lastmod || fallbackLastmod ? { lastmod: lastmod || fallbackLastmod } : {}),
            changefreq: item.changefreq || changefreq,
            priority: item.priority ?? priority,
          }
        })
    },
  },

  // 显示最后更新时间，搜索引擎偏好新鲜内容
  lastUpdated: false,
  // 构建阶段暴露站内死链，避免上线后才发现跳转问题
  ignoreDeadLinks: false,
  // 简洁 URL（去掉 .html）
  cleanUrls: true,

  // 3. 全站 Head（首页 / fallback）
  head: [
    ['meta', { name: 'msvalidate.01', content: '283F4ED132291BB65C882E27214A15B8' }],
    ['meta', { name: 'author', content: `${SITE_NAME}编辑部` }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:image', content: DEFAULT_OG_IMAGE }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: DEFAULT_OG_IMAGE }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1' }],
    ['meta', { name: 'theme-color', content: '#10a37f' }],
    ['meta', { name: 'format-detection', content: 'telephone=no' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    // 网站结构化数据
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE,
        description:
          'ChatGPT 中文网提供 ChatGPT 官网入口、中文版辨别、网页版登录教程与国内使用说明，2026 年持续更新。',
        inLanguage: 'zh-CN',
        publisher: { '@id': `${SITE}/#organization` },
      }),
    ],
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        name: SITE_NAME,
        url: SITE,
        logo: { '@type': 'ImageObject', url: `${SITE}/og-image.png` },
        description: '独立中文 AI 教程与资讯网站，提供官方入口核验、网页使用说明、故障排查和第三方服务边界说明。',
      }),
    ],
  ],

  // 4. 每页动态 SEO meta
  transformHead({ pageData }) {
    const rel = (pageData.relativePath || '')
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '')
    const consolidatedPath = consolidationTarget(rel)
    const url = consolidatedPath
      ? consolidatedPath === '/'
        ? `${SITE}/`
        : `${SITE}${consolidatedPath}`
      : rel
      ? `${SITE}/${rel}`
      : `${SITE}/`
    const isHome = !rel || rel === ''
    const isSectionIndex = /^(chatgpt|grok|claude|gemini)\/?$/.test(rel)
    const infoNames: Record<string, string> = {
      'latest/': '最新更新',
      about: '关于本站',
      privacy: '隐私声明',
      disclaimer: '免责声明',
    }
    const isInfoPage = Object.prototype.hasOwnProperty.call(infoNames, rel)
    const isArticle = !isHome && !isSectionIndex && !consolidatedPath && /^(chatgpt|grok|claude|gemini)\//.test(rel)

    const fm = pageData.frontmatter || {}
    const citations = Array.isArray(fm.sources)
      ? fm.sources.filter((source: unknown) => {
          if (typeof source !== 'string') return false
          try {
            const sourceUrl = new URL(source)
            return sourceUrl.protocol === 'https:' && OFFICIAL_SOURCE_DOMAINS.some(
              (domain) => sourceUrl.hostname === domain || sourceUrl.hostname.endsWith(`.${domain}`)
            )
          } catch {
            return false
          }
        })
      : []
    const pageTitle: string =
      fm.title || pageData.title || (isHome ? SITE_NAME : '')
    const pageDesc: string =
      fm.description || pageData.description || ''
    const pageKeywords = typeof fm.keywords === 'string'
      ? fm.keywords
      : Array.isArray(fm.keywords)
        ? fm.keywords.join(',')
        : ''
    const rawOgImage: string = fm.image || fm.ogImage || DEFAULT_OG_IMAGE
    const ogImage = rawOgImage.startsWith('http') ? rawOgImage : `${SITE}${rawOgImage.startsWith('/') ? '' : '/'}${rawOgImage}`
    let ogImageDimensions: { width: number; height: number } | undefined
    try {
      ogImageDimensions = OG_IMAGE_DIMENSIONS[new URL(rawOgImage, SITE).pathname]
    } catch {
      ogImageDimensions = undefined
    }

    const frontmatterUpdatedMs = fm.updated ? Date.parse(fm.updated) : undefined
    const frontmatterDateMs = fm.date ? Date.parse(fm.date) : undefined
    const explicitUpdatedMs = Number.isFinite(frontmatterUpdatedMs) ? frontmatterUpdatedMs : undefined
    const explicitDateMs = Number.isFinite(frontmatterDateMs) ? frontmatterDateMs : undefined
    const fallbackFileUpdatedMs = (pageData as any).lastUpdated
    const lastUpdatedMs = explicitUpdatedMs || explicitDateMs || fallbackFileUpdatedMs
    const datePublishedISO = explicitDateMs
      ? new Date(explicitDateMs).toISOString()
      : undefined
    const dateModifiedISO = explicitUpdatedMs || explicitDateMs || (!fm.date && fallbackFileUpdatedMs)
      ? new Date((explicitUpdatedMs || explicitDateMs || fallbackFileUpdatedMs) as number).toISOString()
      : undefined

    const head: any[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:type', content: isArticle ? 'article' : 'website' }],
    ]

    if (pageKeywords) head.push(['meta', { name: 'keywords', content: pageKeywords }])

    if (consolidatedPath) {
      head.push(['meta', { name: 'robots', content: 'noindex,follow' }])
    }

    if (pageTitle) {
      head.push(['meta', { property: 'og:title', content: pageTitle }])
      head.push(['meta', { name: 'twitter:title', content: pageTitle }])
    }
    if (pageDesc) {
      head.push(['meta', { name: 'description', content: pageDesc }])
      head.push(['meta', { property: 'og:description', content: pageDesc }])
      head.push(['meta', { name: 'twitter:description', content: pageDesc }])
    }
    head.push(['meta', { property: 'og:image', content: ogImage }])
    head.push(['meta', { name: 'twitter:image', content: ogImage }])
    if (ogImageDimensions) {
      head.push(['meta', { property: 'og:image:width', content: String(ogImageDimensions.width) }])
      head.push(['meta', { property: 'og:image:height', content: String(ogImageDimensions.height) }])
    }

    if (isArticle) {
      if (datePublishedISO)
        head.push(['meta', { property: 'article:published_time', content: datePublishedISO }])
      if (dateModifiedISO)
        head.push(['meta', { property: 'article:modified_time', content: dateModifiedISO }])

      const articleSchema: any = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: pageTitle,
        description: pageDesc,
        url,
        image: ogImage,
        inLanguage: 'zh-CN',
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        author: {
          '@type': 'Organization',
          '@id': `${SITE}/#organization`,
          name: `${SITE_NAME}编辑部`,
          url: `${SITE}/about`,
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${SITE}/#organization`,
          name: SITE_NAME,
          url: SITE,
          logo: { '@type': 'ImageObject', url: `${SITE}/og-image.png` },
        },
      }
      if (datePublishedISO) articleSchema.datePublished = datePublishedISO
      if (dateModifiedISO) articleSchema.dateModified = dateModifiedISO
      if (citations.length > 0) articleSchema.citation = citations
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(articleSchema)])
      const section = rel.split('/')[0]
      const sectionNames: Record<string, string> = {
        chatgpt: 'ChatGPT 教程',
        claude: 'Claude 教程',
        gemini: 'Gemini 教程',
        grok: 'Grok 教程',
      }
      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: sectionNames[section] || section, item: `${SITE}/${section}/` },
            { '@type': 'ListItem', position: 3, name: pageTitle, item: url },
          ],
        }),
      ])
    } else if (isHome || isSectionIndex || isInfoPage) {
      const section = isSectionIndex ? rel.replace(/\/$/, '') : ''
      const sectionNames: Record<string, string> = {
        chatgpt: 'ChatGPT 教程',
        claude: 'Claude 教程',
        gemini: 'Gemini 教程',
        grok: 'Grok 教程',
      }
      const pageName = isInfoPage ? infoNames[rel] : pageTitle
      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: pageName,
          description: pageDesc,
          url,
          inLanguage: 'zh-CN',
          isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE },
          ...(isHome
            ? {
                about: [
                  { '@type': 'Thing', name: 'ChatGPT网页版' },
                  { '@type': 'Thing', name: 'ChatGPT官网入口' },
                  { '@type': 'Thing', name: 'ChatGPT中文版' },
                ],
              }
            : isSectionIndex
              ? { about: { '@type': 'Thing', name: sectionNames[section] || section } }
              : {}),
          ...(dateModifiedISO ? { dateModified: dateModifiedISO } : {}),
        }),
      ])
      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: isHome
            ? [{ '@type': 'ListItem', position: 1, name: '首页', item: `${SITE}/` }]
            : isSectionIndex
              ? [
                { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE}/` },
                { '@type': 'ListItem', position: 2, name: sectionNames[section] || section, item: `${SITE}/${section}/` },
              ]
              : [
                { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE}/` },
                { '@type': 'ListItem', position: 2, name: pageName, item: url },
              ],
        }),
      ])
    }

    return head
  },

  // 5. 主题配置
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'ChatGPT 中文网',

    lastUpdated: {
      text: '最后更新于',
      formatOptions: { dateStyle: 'short', timeStyle: 'medium' },
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '最新更新', link: '/latest/' },
      { text: 'ChatGPT', link: '/chatgpt/' },
      { text: 'Grok', link: '/grok/' },
      { text: 'Claude', link: '/claude/' },
      { text: 'Gemini', link: '/gemini/' },
      { text: '关于本站', link: '/about' },
      { text: '隐私声明', link: '/privacy' },
      { text: '免责声明', link: '/disclaimer' },
    ],

    sidebar: {
      '/chatgpt/': sidebarByPrefix(articleSidebar, '/chatgpt/', 'ChatGPT 网页版与中文版'),
      '/grok/': sidebarByPrefix(articleSidebar, '/grok/', 'Grok 教程'),
      '/claude/': sidebarByPrefix(articleSidebar, '/claude/', 'Claude 教程'),
      '/gemini/': sidebarByPrefix(articleSidebar, '/gemini/', 'Gemini 教程')
    },

    search: {
      provider: 'local',
    },

    outline: { level: [2, 3], label: '本页目录' },

    docFooter: { prev: '上一篇', next: '下一篇' },

    footer: {
      message:
        '免责声明：本站为独立的 ChatGPT 中文教程与 AI 工具信息分享网站，与 OpenAI、Anthropic、Google、xAI 等官方机构无任何隶属或代理关系。',
      copyright: 'Copyright © 2025-2026 ChatGPT 中文网 · chatgpt-web.com',
    },
  },
})
