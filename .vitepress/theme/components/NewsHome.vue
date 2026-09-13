<script setup lang="ts">
import { ArrowRight, BookOpen, Bot, Clock, Code2, CreditCard, Flame, Images, Newspaper } from 'lucide-vue-next'

type Story = {
  title: string
  description: string
  href: string
  category: string
  date: string
  image: string
}

const leadStory: Story = {
  title: 'GPT-6 Astra国内怎么用？ChatGPT官网、中文版与入口核验',
  description:
    '围绕 GPT-6 Astra 热点，核对 ChatGPT 官网与网页版入口，判断模型是否对自己的账号开放，并了解第三方多模型平台的边界。',
  href: '/chatgpt/gpt-6-astra-guonei-shiyong-gptcat-snakegpt-guide-20260906',
  category: 'GPT-6 Astra 热点',
  date: '2026-09-06',
  image: '/images/gpt-6-astra-gptcat-snakegpt-20260906.png',
}

const focusStories: Story[] = [
  {
    title: 'Gemini CLI安装使用教程：Windows、macOS、终端命令与API区别',
    description: '从官方仓库、系统准备和首次授权开始，讲清 Gemini CLI、网页版与 API 的区别，以及项目权限和报错排查。',
    href: '/gemini/gemini-cli-install-use-windows-macos-api-20260909',
    category: 'Gemini CLI 热点',
    date: '2026-09-09',
    image: '/images/news-gemini-study.jpg',
  },
  {
    title: 'GPT Images 2.5是真的吗？图片生成入口与提示词核验',
    description: '围绕 GPT Images 2.5 搜索热点，区分官方发布、账号功能和第三方标称，补充中文提示词与改图方法。',
    href: '/chatgpt/gpt-images-2-5-official-entry-verification-prompt-guide-20260909',
    category: 'AI 绘图热点',
    date: '2026-09-09',
    image: '/images/news-ai-creation.jpg',
  },
  {
    title: 'ChatGPT桌面App官方下载：Windows、Mac、Work与Codex入口区别',
    description: '核对官方桌面端下载来源，区分网页版、Work与Codex，补充假App识别、登录排查和国内第三方平台边界。',
    href: '/chatgpt/chatgpt-desktop-app-download-work-codex-20260907',
    category: '桌面 App 热点',
    date: '2026-09-07',
    image: '/images/news-chatgpt.jpg',
  },
  {
    title: 'ChatGPT官网入口网页版：GPT-6 Astra官方页面怎么核验',
    description: '分清 OpenAI 官网、chatgpt.com 网页版、帮助中心和第三方平台，按登录后的模型菜单判断是否上线。',
    href: '/chatgpt/chatgpt-official-web-entry-gpt-6-astra-verification-2026-09',
    category: '官网核验',
    date: '2026-09-04',
    image: '/images/gpt-6-astra-ultra-work-20260905.png',
  },
  {
    title: 'ChatGPT注册登录教程：官网入口、邮箱验证与安全排查',
    description: '从官方入口、邮箱验证、地区提示和验证码开始，区分注册失败、登录失败与第三方服务账号。',
    href: '/chatgpt/chatgpt-zhuce-jiaocheng-guonei-2026',
    category: '注册登录',
    date: '2026-08-27',
    image: '/images/news-chatgpt.jpg',
  },
  {
    title: 'ChatGPT图片生成教程：中文提示词、改图与失败排查',
    description: '整理网页版生图入口、中文海报提示词、参考图、多轮修改和按钮消失时的检查顺序。',
    href: '/chatgpt/chatgpt-image-2-web-entry-gpt-image-2-generate-edit-prompt-limit-2026-07-02',
    category: 'AI 绘图',
    date: '2026-08-27',
    image: '/images/news-ai-creation.jpg',
  },
]

const latestStories: Story[] = [
  {
    title: 'Gemini CLI安装使用教程：官网、Windows、macOS、终端命令与API区别',
    description: '核对官方仓库与安装来源，讲清终端使用、项目权限、API区别和常见报错。',
    href: '/gemini/gemini-cli-install-use-windows-macos-api-20260909',
    category: 'Gemini CLI 热点',
    date: '2026-09-09',
    image: '/images/news-gemini-study.jpg',
  },
  {
    title: 'AI编程工具怎么选？Claude Code、Gemini CLI、Codex与API平台对比',
    description: '从终端、IDE、代码库、API、权限和成本比较主流 AI 编程入口。',
    href: '/chatgpt/ai-coding-tools-claude-code-gemini-cli-codex-api-20260909',
    category: 'AI 编程热点',
    date: '2026-09-09',
    image: '/images/news-claude-code.jpg',
  },
  {
    title: 'AI Agent是什么？ChatGPT Work、Codex与智能体工具怎么选',
    description: '解释智能体的目标、工具、权限和人工确认边界，区分 Work、Codex 与第三方平台。',
    href: '/chatgpt/ai-agent-chatgpt-work-codex-tools-guide-20260909',
    category: 'AI Agent 热点',
    date: '2026-09-09',
    image: '/images/news-ai-creation.jpg',
  },
  {
    title: 'GPT Images 2.5是真的吗？图片生成入口与提示词核验',
    description: '区分官方发布、账号功能和第三方标称，补充 ChatGPT 图片生成、中文提示词和改图排查。',
    href: '/chatgpt/gpt-images-2-5-official-entry-verification-prompt-guide-20260909',
    category: 'AI 绘图热点',
    date: '2026-09-09',
    image: '/images/news-ai-creation.jpg',
  },
  {
    title: 'ChatGPT桌面App官方下载：Windows、Mac、Work与Codex入口区别',
    description: '核对 Windows、Mac 下载来源，区分桌面 App、网页版、Work 与 Codex，排查假 App 和登录问题。',
    href: '/chatgpt/chatgpt-desktop-app-download-work-codex-20260907',
    category: '桌面 App 热点',
    date: '2026-09-07',
    image: '/images/news-chatgpt.jpg',
  },
  {
    title: 'GPT-6 Astra国内怎么用？官网、中文版与第三方入口核验',
    description: '确认官方 ChatGPT 网页入口、账号模型菜单和第三方多模型平台之间的区别，避免把截图或平台标称当成全量开放证明。',
    href: '/chatgpt/gpt-6-astra-guonei-shiyong-gptcat-snakegpt-guide-20260906',
    category: 'GPT-6 Astra 热点',
    date: '2026-09-06',
    image: '/images/gpt-6-astra-gptcat-snakegpt-20260906.png',
  },
  {
    title: 'ChatGPT官网入口网页版：GPT-6 Astra官方页面与上线核验',
    description: '从官方域名、发布页、帮助中心和登录后的模型菜单入手，判断 GPT-6 Astra 是否真的对当前账号开放。',
    href: '/chatgpt/chatgpt-official-web-entry-gpt-6-astra-verification-2026-09',
    category: '官网核验',
    date: '2026-09-04',
    image: '/images/gpt-6-astra-ultra-work-20260905.png',
  },
  {
    title: 'ChatGPT图片生成教程：网页版入口、中文提示词与改图',
    description: '从打开官方网页版到生成、修改和下载图片，补充中文文字乱码、按钮消失与隐私排查。',
    href: '/chatgpt/chatgpt-image-2-web-entry-gpt-image-2-generate-edit-prompt-limit-2026-07-02',
    category: 'AI 绘图',
    date: '2026-08-27',
    image: '/images/news-ai-creation.jpg',
  },
  {
    title: 'ChatGPT文件上传失败怎么办？格式、权限与浏览器排查',
    description: '覆盖 PDF、Excel、CSV、图片的准备方法，以及上传入口缺失、卡住、拒绝和附件未读取的处理顺序。',
    href: '/chatgpt/chatgpt-web-pdf-excel-image-upload-format-privacy-check-20260724',
    category: '文件处理',
    date: '2026-08-27',
    image: '/images/news-chatgpt.jpg',
  },
  {
    title: 'Claude Code怎么安装？Windows、macOS与VS Code配置',
    description: '按系统核对官方安装方式、终端配置、VS Code 使用和权限风险，遇到命令找不到时逐项排查。',
    href: '/claude/claude-code-install-windows-macos-vscode-domestic-guide-2026-07',
    category: '开发工具',
    date: '2026-08-19',
    image: '/images/news-claude-code.jpg',
  },
  {
    title: 'ChatGPT手机电脑怎么同步？网页版与桌面客户端排查',
    description: '从账号、登录方式和浏览器会话开始检查，处理 ChatGPT 手机、电脑与桌面客户端不同步的问题。',
    href: '/chatgpt/chatgpt-web-desktop-mobile-sync-login-history-browser-settings-20260719',
    category: '多设备使用',
    date: '2026-08-18',
    image: '/images/news-chatgpt.jpg',
  },
  {
    title: 'ChatGPT聊天记录没了怎么办？登录方式与浏览器会话检查',
    description: '从账号、工作区、登录方式和浏览器会话入手，判断历史对话消失是显示问题还是数据问题。',
    href: '/chatgpt/chatgpt-web-chat-history-missing-login-browser-session-export-check-20260719',
    category: '聊天记录',
    date: '2026-08-17',
    image: '/images/news-chatgpt.jpg',
  },
  {
    title: 'ChatGPT网页版怎么用？多设备同步、模型切换与免下载',
    description: '从浏览器打开网页版，核对官方入口，完成登录并了解手机电脑同步和模型切换边界。',
    href: '/chatgpt/chatgpt-web-entrance-china-online-tutorial-2026',
    category: '网页版',
    date: '2026-08-13',
    image: '/images/news-chatgpt.jpg',
  },
  {
    title: 'ChatGPT网页版在线使用：免下载登录与中文版区别',
    description: '区分官方网页版、中文界面和独立第三方服务，按安全顺序检查登录与访问问题。',
    href: '/chatgpt/chatgpt-web-version-free-guide-2026',
    category: '在线使用',
    date: '2026-08-11',
    image: '/images/news-chatgpt.jpg',
  },
  {
    title: 'ChatGPT语音对话怎么用？麦克风没声音如何排查',
    description: '覆盖网页版和手机端入口、中文设置、麦克风权限与按钮消失。',
    href: '/chatgpt/chatgpt-web-voice-microphone-permission-no-sound-browser-troubleshoot-20260720',
    category: '语音对话',
    date: '2026-08-09',
    image: '/images/news-chatgpt.jpg',
  },
  {
    title: 'ChatGPT Work怎么用？入口、下载与Codex区别',
    description: '厘清 Work、普通 ChatGPT 与 Codex 的产品边界，按本地、云端和开发任务选择。',
    href: '/chatgpt/chatgpt-work-entry-download-codex-local-cloud-china-guide-20260805',
    category: 'Work 与 Codex',
    date: '2026-08-06',
    image: '/images/news-chatgpt.jpg',
  },
  {
    title: 'ChatGPT Projects怎么用？文件、指令、记忆与消失排查',
    description: '把长期任务的聊天、资料和固定规则放在同一项目中，并建立可靠备份。',
    href: '/chatgpt/chatgpt-projects-instructions-files-memory-missing-troubleshoot-20260804',
    category: 'Projects',
    date: '2026-08-04',
    image: '/images/news-chatgpt.jpg',
  },
  {
    title: 'AI图片生成工具横评：ChatGPT、Gemini、Grok怎么选',
    description: '中文海报、商品图、人物一致性与局部编辑，按实际任务判断。',
    href: '/chatgpt/ai-image-generation-free-chatgpt-gemini-grok-prompts-20260802',
    category: 'AI 绘图',
    date: '2026-08-02',
    image: '/images/news-ai-creation.jpg',
  },
]

const guides = [
  {
    title: 'ChatGPT 网页版使用教程、官方入口',
    description: '2026 国内完整指南：官网核验、登录、中文设置和手机电脑网页版使用。',
    href: '/chatgpt/chatgpt-webpage-how-to-use-2026',
  },
  {
    title: 'ChatGPT免费额度与附件限制',
    description: '额度用完、消息上限和文件上传受限时怎么判断。',
    href: '/chatgpt/chatgpt-free-quota-message-attachment-limit-recovery-20260728',
  },
  {
    title: 'ChatGPT、Claude、Gemini、Grok 怎么选',
    description: '按写作、代码、图片和长文档任务比较四类模型。',
    href: '/chatgpt/gpt-claude-gemini-grok-model-comparison-china-2026-07',
  },
  {
    title: 'ChatGPT记忆已满与聊天记录管理',
    description: '删除、关闭 Memory，以及找回或导出聊天记录。',
    href: '/chatgpt/chatgpt-memory-full-delete-manage-saved-memory-20260730',
  },
  {
    title: 'Codex CLI、网页版与桌面 App 怎么选',
    description: '按本地开发、云端任务、IDE 和多项目场景选择入口。',
    href: '/chatgpt/chatgpt-codex-web-cli-app-guide-2026-06',
  },
]

const categoryLinks = [
  { label: 'ChatGPT', href: '/chatgpt/' },
  { label: 'Claude', href: '/claude/' },
  { label: 'Gemini', href: '/gemini/' },
  { label: 'Grok', href: '/grok/' },
  { label: 'Codex指南', href: '/chatgpt/chatgpt-codex-web-cli-app-guide-2026-06' },
  { label: '全部更新', href: '/latest/' },
]
</script>

<template>
  <main class="news-home">
    <header class="guide-hero">
      <p class="guide-brand">ChatGPT 中文网</p>
      <h1>ChatGPT 官网最新地址：国内访问与中文版使用指南</h1>
      <p class="guide-tagline">核对 chatgpt.com 官方入口与国内访问条件，整理中文版设置、GPT-6 Astra 模型核验、网页版登录、手机电脑同步、文件图片和常见故障；开发者可继续查看 Codex CLI 与 API 入口区别。最近核验：2026-09-06。</p>
      <div class="guide-actions">
        <a class="guide-action guide-action-primary" href="/chatgpt/gpt-6-astra-guonei-shiyong-gptcat-snakegpt-guide-20260906">
          GPT-6 Astra核验 <ArrowRight :size="17" />
        </a>
        <a class="guide-action guide-action-secondary" href="/chatgpt/chatgpt-official-entry-2026-domestic-chinese-complete-guide-20260720">
          核对ChatGPT官网 <ArrowRight :size="17" />
        </a>
        <a class="guide-action guide-action-secondary" href="/chatgpt/chatgpt-codex-web-cli-app-guide-2026-06">
          Codex入口选择 <ArrowRight :size="17" />
        </a>
      </div>
    </header>

    <section class="product-recommendations" aria-labelledby="product-recommendations-title">
      <div class="product-heading">
        <div>
          <p class="section-kicker">THIRD-PARTY TOOLS</p>
          <h2 id="product-recommendations-title">国内使用与产品选择</h2>
        </div>
        <p>以下是已经在国内形成品牌认知的付费第三方 AI 平台。网页版和中文多模型场景优先看 SnakeGPT、GPTCat；Codex、API 和开发场景可看 ZeoGPT、ZeoAPI。它们都不是 OpenAI、Anthropic、Google 或 xAI 官方产品，具体型号和功能以各平台当前页面为准。</p>
      </div>

      <div class="product-grid">
        <a class="product-card" href="https://www.snakegpt.vip/" target="_blank" rel="nofollow sponsored noopener noreferrer">
          <div class="product-card-title"><Bot :size="19" /><h3>SnakeGPT</h3></div>
          <p>国内已有品牌，支持 GPT-6、Claude、Gemini、Grok 等模型，适合中文问答、写作、翻译和绘图。</p>
          <span>snakegpt.vip <ArrowRight :size="15" /></span>
        </a>
        <a class="product-card" href="https://gptcat.cc/" target="_blank" rel="nofollow sponsored noopener noreferrer">
          <div class="product-card-title"><Images :size="19" /><h3>GPTCat</h3></div>
          <p>国内已有品牌，支持 GPT-6、Claude、Gemini、Grok 等模型，适合同题多模型对比、长文整理和绘图。</p>
          <span>gptcat.cc <ArrowRight :size="15" /></span>
        </a>
        <a class="product-card" href="https://www.zeogpt.com/register?ref=MRNWDKC3" target="_blank" rel="nofollow sponsored noopener noreferrer">
          <div class="product-card-title"><Code2 :size="19" /><h3>ZeoGPT</h3></div>
          <p>平台标称提供网页端多模型与 Codex 开发额度；套餐、额度和可用模型以登录后页面为准，不等同于 OpenAI 官方 API 余额。</p>
          <span>zeogpt.com <ArrowRight :size="15" /></span>
        </a>
        <a class="product-card" href="https://www.zeoapi.com/register?aff=Pe3N" target="_blank" rel="nofollow sponsored noopener noreferrer">
          <div class="product-card-title"><Code2 :size="19" /><h3>ZeoAPI</h3></div>
          <p>适合 API、脚本和应用接入场景；接口、模型、额度、计费与兼容性以平台当前文档和控制台为准。</p>
          <span>zeoapi.com <ArrowRight :size="15" /></span>
        </a>
      </div>

      <p class="recharge-note">
        <Code2 :size="17" /> Codex 安装与配置可参考
        <a href="https://www.zeogpt.com/codex" target="_blank" rel="nofollow sponsored noopener noreferrer">zeogpt.com/codex</a>；该页面同样属于第三方平台，不是 OpenAI 官方文档。
      </p>
      <p class="recharge-note">
        <CreditCard :size="17" /> 已有账号只需要代充，可查看
        <a href="https://gptbuys.com/?ref=SNAKE" target="_blank" rel="nofollow sponsored noopener noreferrer">gptbuys.com</a>；该服务仅用于充值，同样属于第三方服务。
      </p>
    </section>

    <section class="news-masthead" aria-labelledby="latest-news-title">
      <div>
        <p class="news-kicker"><Newspaper :size="16" /> VERIFIED GUIDES</p>
        <h2 id="latest-news-title">最新教程与核验</h2>
        <p class="news-intro">按实际修订日期整理 ChatGPT、Codex、Claude、Gemini 与 Grok 的入口核验、操作教程和故障排查。</p>
      </div>
      <a class="latest-link" href="/latest/">浏览全部更新 <ArrowRight :size="17" /></a>
    </section>

    <nav class="topic-nav" aria-label="内容分类">
      <a v-for="item in categoryLinks" :key="item.href" :href="item.href">{{ item.label }}</a>
    </nav>

    <section class="top-grid" aria-label="核心入口与最新专题">
      <a class="lead-story" :href="leadStory.href">
        <img :src="leadStory.image" :alt="leadStory.title" width="1600" height="1000" fetchpriority="high" decoding="async" />
        <div class="lead-overlay">
          <div class="story-meta"><span>{{ leadStory.category }}</span><time :datetime="leadStory.date">{{ leadStory.date }}</time></div>
          <h2>{{ leadStory.title }}</h2>
          <p>{{ leadStory.description }}</p>
        </div>
      </a>

      <div class="focus-stack">
        <a v-for="story in focusStories" :key="story.href" class="focus-story" :href="story.href">
          <img :src="story.image" :alt="story.title" width="1600" height="1000" loading="lazy" decoding="async" />
          <div>
            <div class="story-meta"><span>{{ story.category }}</span><time :datetime="story.date">{{ story.date }}</time></div>
            <h2>{{ story.title }}</h2>
            <p>{{ story.description }}</p>
          </div>
        </a>
      </div>
    </section>

    <div class="content-grid">
      <section class="latest-section">
        <div class="section-heading">
          <div>
            <p class="section-kicker">LATEST</p>
            <h2>最新教程</h2>
          </div>
          <a href="/latest/">查看全部 <ArrowRight :size="16" /></a>
        </div>

        <div class="story-list">
          <article v-for="story in latestStories" :key="story.href" class="story-row">
            <a class="story-thumb" :href="story.href">
              <img :src="story.image" :alt="story.title" width="1600" height="1000" loading="lazy" decoding="async" />
            </a>
            <div class="story-copy">
              <div class="story-meta"><span>{{ story.category }}</span><time :datetime="story.date"><Clock :size="13" />{{ story.date }}</time></div>
              <h3><a :href="story.href">{{ story.title }}</a></h3>
              <p>{{ story.description }}</p>
            </div>
          </article>
        </div>
      </section>

      <aside class="news-sidebar">
        <section class="sidebar-block">
          <div class="sidebar-title"><Flame :size="18" /><h2>热门指南</h2></div>
          <ol class="guide-list">
            <li v-for="(guide, index) in guides" :key="guide.href">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              <div>
                <h3><a :href="guide.href">{{ guide.title }}</a></h3>
                <p>{{ guide.description }}</p>
              </div>
            </li>
          </ol>
        </section>

        <section class="sidebar-block about-block">
          <div class="sidebar-title"><BookOpen :size="18" /><h2>关于本站</h2></div>
          <p>本站是独立中文 AI 教程与资讯网站，不隶属于 OpenAI、Anthropic、Google 或 xAI。产品能力、价格和开放范围可能变化，请以官方页面为准。</p>
          <a href="/disclaimer">查看免责声明 <ArrowRight :size="15" /></a>
        </section>
      </aside>
    </div>

    <section class="editor-picks">
      <div class="section-heading">
        <div>
          <p class="section-kicker">EDITOR'S PICKS</p>
          <h2>编辑精选</h2>
        </div>
      </div>
      <div class="pick-grid">
        <a href="/chatgpt/gpt-claude-gemini-grok-model-comparison-china-2026-07">
          <img src="/images/news-ai-creation.jpg" alt="ChatGPT、Gemini、Claude、Grok 多模型任务对比" width="1600" height="1000" loading="lazy" decoding="async" />
          <span>模型研究</span>
          <h3>ChatGPT、Gemini、Claude、Grok 怎么选？</h3>
        </a>
        <a href="/chatgpt/chatgpt-webpage-how-to-use-2026">
          <img src="/images/chatgpt-auto-mirror-reference-2026.png" alt="ChatGPT 网页版界面参考" width="1908" height="939" loading="lazy" decoding="async" />
          <span>入门指南</span>
          <h3>ChatGPT 网页版怎么用：入口、登录与模型选择</h3>
        </a>
        <a href="/chatgpt/chatgpt-codex-web-cli-app-guide-2026-06">
          <img src="/images/gpt-5-6-coding-agent-index-cost.png" alt="Codex CLI、网页版与桌面 App 开发入口" width="1600" height="1000" loading="lazy" decoding="async" />
          <span>Codex 开发</span>
          <h3>Codex CLI、网页版还是桌面 App：入口与权限怎么选</h3>
        </a>
      </div>
    </section>
  </main>
</template>
