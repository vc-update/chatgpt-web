# chatgpt-web.com SEO 行动计划

> 更新日期：2026-09-06  
> 目标：提高 Bing 对 ChatGPT 官网、ChatGPT 中文版、ChatGPT 网页版及具体任务页面的理解和点击承接能力。

## 执行顺序

### P0：接入真实 Bing 数据

状态：待验证  
原因：当前没有真实查询、CTR、平均排名和索引数据，不能可靠判断哪些页面应该改标题、合并或删除。

操作：

1. 在 Bing Webmaster 中确认 `https://www.chatgpt-web.com/sitemap.xml` 的提交和读取状态。
2. 导出近 28 天查询数据，按“官网/官网入口、中文版、网页版/在线使用、注册登录、打不开、下载、图片/文件、Codex/API”分组。
3. 对排名 4-20、高曝光低 CTR、曝光增长和排名下降页面执行 URL Inspection。
4. 只对有证据的页面执行 Keep、Merge、Repurpose、Noindex 或 Remove。

验收：有 URL、关键词、曝光、点击、CTR、平均排名和索引状态的可复核表。

### P1：补强低入链高价值页面

状态：待筛选  
证据：站内链接脚本发现 25 个只有 1 条入链的页面。

第一批候选：

- `/chatgpt/chatgpt-dabukai-baocuo-jiejue-2026`
- `/chatgpt/chatgpt-shoujiban-app-xiazai-anzhuang-2026`
- `/chatgpt/chatgpt-ai-xiezuo-lunwen-jiaocheng-2026`
- `/chatgpt/chatgpt-plus-dingyue-shengji-jiaocheng-2026`
- `/chatgpt/chatgpt-mianfei-shiyong-quangonglue-2026`

修改规则：

- 打不开页面：从网页版支柱页或官网打不开页面加入“ChatGPT官网打不开与 Access Denied 排查”锚文本。
- 手机版下载页：从网页版手机教程加入“ChatGPT 手机版 App 下载安装教程”锚文本。
- AI 写作页：从写作相关文章加入“ChatGPT AI 写作与论文教程”锚文本。
- Plus 页面：从免费版/额度文章加入“ChatGPT Plus 订阅与升级区别”锚文本。
- 免费使用页：从中文版免费额度页加入“ChatGPT免费使用与额度限制”锚文本。

每个页面先增加 1 条最相关正文内链，重新构建并运行 `npm run seo:qa`，不批量添加全站链接。

### P1：校验并维护 GPT-6 Astra 热点文章

目标页面：

- `/chatgpt/chatgpt-official-web-entry-gpt-6-astra-verification-2026-09`
- `/chatgpt/chatgpt-web-entry-work-6-astra-ultra-login-guide-202609`

当前状态：三篇 9 月热点文章均已进入 sitemap、最新页和 sidebar，线上页面返回 200；本次部署已由 Vercel inspection 确认为 Ready，官方发布页和帮助中心抓取仍返回 403。

维护规则：

- 保留 chatgpt.com、openai.com、帮助中心和账号内模型菜单的分工说明。
- 保留“官方页面存在不等于所有账号开放”的判断边界。
- 暂不补写未经官方正文核验的参数、价格、基准分、API 名称和全量开放范围。
- 官方正文恢复可访问后，重新核对标题、Description、正文和 FAQ。

### P2：按 Bing CTR 数据优化元数据

候选页面：

- `/chatgpt/chatgpt-prompt-prompts-complete-2026-new`
- `/chatgpt/chatgpt-mirror-sites-safe-or-not-2026`
- `/chatgpt/chatgpt-domestic-access-guide-2026-new`
- `/chatgpt/chatgpt-free-use-guide-2026-new`
- `/chatgpt/chatgpt-ai-writing-paper-polish-2026-new`

已确认问题：这些页面的 Description 较短，部分只有 32-45 个字符。修改前先确认它们有真实曝光或属于重要主题支柱，避免为没有搜索需求的旧页面制造无效更新。

修改要求：

- Title 以一个核心意图开头，避免同时承接官网、入口、中文版和网页版四个主意图。
- Description 直接回答用户能得到什么，加入步骤、风险或适用场景，不堆叠关键词。
- 保留原 URL、原始 `date` 和自 canonical；只更新 `updated` 和正文确有变化的页面。

### P2：补充真实编辑归属

目标：所有重点热点文章和支柱页。

建议：在文章开头或更新时间附近显示真实的“ChatGPT 中文网编辑部”或实际作者信息，并链接到关于本站页面。正文署名应与 Article schema 的作者保持一致，不虚构专家身份、测试经历或官方关系。

### P2：测量性能后再拆包

当前证据：构建提示 JS chunk 超过 500 kB，但 PageSpeed 本次没有返回 LCP、INP、CLS 数值。

下一步：

1. 对首页、ChatGPT 支柱页和最新页分别测量移动端 Lighthouse/PageSpeed。
2. 记录 LCP、INP、CLS、首屏资源和 JS 传输体积。
3. 只有确认性能瓶颈后，才考虑搜索组件、主题脚本或新闻首页组件的动态加载。

### P3：重新评估 AI crawler

当前策略：GPTBot、ClaudeBot、Google-Extended 等多个 crawler 被 robots 阻止，`llms.txt` 本身质量检查为 95/100。

决策点：先明确是否希望 AI 搜索引用本站内容，再决定是否调整 robots。调整后需要重新验证 robots、sitemap 和正式页面抓取，不把 crawler 放开等同于排名提升。

## 发布验收清单

每次内容或内链修改后执行：

- `npm run build`
- `npm run seo:qa`
- 检查 sitemap 唯一 URL 数量和新页面 `lastmod`
- 检查新页面 Title、Description、canonical、单一 H1、Article/BreadcrumbList
- 检查 2-4 条正文内链是否指向规范 URL
- 检查 `robots.txt`、`sitemap.xml`、`llms.txt`
- 生产发布后独立请求正式域名并记录 HTTP 状态
- Bing Webmaster 中提交或检查对应 URL

## 当前不执行的高风险动作

- 不把所有文章 canonical 到首页。
- 不批量制造日期更新。
- 不继续创建“官网/入口/中文版/网页版”的近重复文章。
- 不在缺少 Bing 数据时批量 noindex、删除或大规模重定向。
- 不把第三方 SnakeGPT、GPTCat、ZeoGPT 或 ZeoAPI 写成官方服务。
- 不根据 GPT-6 Astra 的社交媒体截图编造模型参数、价格或开放范围。

## 当前验收结论

技术 SEO 没有新的严重阻断；本地构建和 SEO QA 已通过，当前构建为 108 个 sitemap URL、166 个源页面扫描，生产部署已确认 Ready。今天最值得做的是接入 Bing Webmaster 数据，然后从真实有曝光的页面中挑选少量 URL 做内链和 CTR 优化。
