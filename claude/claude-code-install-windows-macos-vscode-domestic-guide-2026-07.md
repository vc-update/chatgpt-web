---
title: "Claude Code怎么安装？Windows、macOS、VS Code配置与国内访问核对【2026年8月】"
description: "Claude Code 怎么安装？本文分平台整理 Windows、macOS、VS Code 与终端的安装配置步骤，说明官方 npm 包、登录方式、国内访问核对、权限风险与命令找不到的排查清单，帮你第一次跑通。"
keywords: "Claude Code,Claude Code 安装,Claude Code 怎么用,Claude Code VS Code,Claude Code 终端,Claude Code 国内使用,Claude Code 配置"
date: "2026-07-14"
updated: "2026-08-19"
outline: deep
faq:
  - question: "Claude Code 和 Claude 网页版有什么区别？"
    answer: "Claude 网页版是浏览器里的对话界面，适合写作、总结和问答；Claude Code 是运行在终端或 IDE 里的 Agentic 编程工具，能读取代码仓库、修改文件、执行命令。想让 AI 真正参与项目代码，才需要 Claude Code。"
  - question: "安装 Claude Code 一定要 Claude 账号或 API Key 吗？"
    answer: "需要身份凭证才能启动。官方文档说明可用 Claude 账号登录，或配置 API 相关权限。具体登录与计费方式以官方文档为准，不要把 Key 写进公开仓库。"
  - question: "Windows 上安装 Claude Code 需要额外装什么？"
    answer: "除了 Node.js，官方推荐在原生 Windows 上安装 Git for Windows，让 Claude Code 能使用 Bash 工具。缺少它可能导致部分命令无法运行。"
  - question: "命令行提示 claude 找不到怎么办？"
    answer: "多数是 npm 全局路径没进 PATH，或安装未成功。先确认 node v 、 npm v 正常，重新全局安装，再关闭并重开终端；仍不行就检查 npm 全局 bin 目录是否在环境变量里。"
  - question: "国内网络能直接跑通 Claude Code 吗？"
    answer: "Claude 服务在国内访问受限，登录与模型请求可能失败。请先核对官方文档入口是否可达、账号权限是否正常，并注意所在地区的可用性；不要从来路不明页面下载所谓破解版。"
productPromo: "manual"
---

# Claude Code怎么安装？Windows、macOS、VS Code配置与国内访问核对【2026年8月】

最后更新：2026-08-19

<div class="product-recommend-box seo-product-promo">

<p class="product-recommend-title">国内 Claude 与多模型 AI 平台推荐</p>

<p>国内使用 Claude、长文本写作或多模型工具时，可以按任务选择以下第三方平台：</p>

<ul>
  <li>
    <strong>🔥 国内可访问的多模型服务（SnakeGPT）：</strong>
    <a href="https://share.snakegpt.vip/" target="_blank" rel="nofollow sponsored noopener noreferrer">snakegpt.vip</a>
    <span>平台公开页面标称支持多种模型与绘图；具体名称、额度、地区可用性和注册要求以登录后的实际页面为准。</span>
  </li>
  <li>
    <strong>🎨 多模型/多种绘图（GPTCat）：</strong>
    <a href="https://share.gptcat.cc/" target="_blank" rel="nofollow sponsored noopener noreferrer">gptcat.cc</a>
    <span>平台标称支持 GPT、Claude、Gemini、DeepSeek、Grok，以及 MJ、Nano Banana 与 GPT-Image-2 绘图。</span>
  </li>
  <li>
    <strong>💻 Codex/编程训练（ZeoGPT）：</strong>
    <a href="https://www.zeogpt.com/register?ref=MRNWDKC3" target="_blank" rel="nofollow sponsored noopener noreferrer">zeogpt.com</a>
    <span>Codex、代码、长文本和开发任务。</span>
  </li>
</ul>

<p class="product-recommend-disclosure">以上均为邀请链接。SnakeGPT 与 GPTCat 与 ZeoGPT 均为第三方服务，不是相关模型厂商的官方网站或官方产品；所列型号与能力来自平台标称，具体功能与可用性以登录后的实际页面为准。请勿上传账号密码、API Key、合同或其他敏感资料。</p>

</div>

依据 Anthropic 官方 Claude Code 文档核对安装方式与依赖说明。

本站为独立教程博客，并非 Anthropic 或 OpenAI 的官方网站，也不提供 AI 模型对话功能。文中第三方平台仅供参考，手机或电脑上使用模型请打开对应产品的官方网站或产品，不要在本博客站内寻找对话入口。

Claude Code 的安装可以概括为一条主线：先装 Node.js，再用官方 npm 包 `@anthropic-ai/claude-code` 全局安装，在项目目录里运行 `claude`，按提示用 Claude 账号登录或配置 API 权限，即可第一次跑通。Windows 建议额外安装 Git for Windows 以便调用 Bash 工具，macOS 用 Terminal 或 iTerm2 即可。VS Code 里可以配合官方扩展或直接在集成终端运行。国内网络访问 Claude 服务受限，登录与模型请求可能失败，需要按官方文档核对入口和账号权限。下面分平台展开具体步骤、报错核对与避坑清单。

## Claude Code 是什么：终端里的 Agentic 编程工具

Claude Code 和浏览器里的 Claude 聊天不是一回事。按 Anthropic 官方产品页（https://claude.com/product/claude-code ）的说明，它是面向开发者的 Agentic 编码工具，能理解你的代码库、编辑文件、运行命令，帮你完成实际的开发任务，而不只是回答问题。

它适合这些工作：

- 读懂一个陌生项目的结构与主要模块
- 解释报错并给出修复方案
- 直接修改文件、生成测试
- 做代码审查、拆分重构步骤
- 在终端里按你的确认逐步执行命令

判断你要不要它很简单：只写文章、总结文档、翻译文本，用 Claude 网页版就够了；要让 AI 真正参与项目代码，才考虑 Claude Code。想先弄清 Claude 各入口的关系，可以看本站的 [Claude 官网入口与中文版使用指南](/claude/claude-official-entry-chinese-claude-code-domestic-guide-2026-07)。

## 快速选择：代码任务先用哪个入口？

| 需求 | 推荐入口 | 适合场景 |
| --- | --- | --- |
| Claude Code、Codex、代码解释和高额度开发任务 | [ZeoGPT](https://www.zeogpt.com/register?ref=MRNWDKC3) | 开发者、长文本、项目辅助、代码任务 |
| 先用 Claude 风格做低风险代码问答 | [GPTCat](https://share.gptcat.cc/) | 多模型对比、代码解释、同题测试 |
| 日常中文问答和资料总结 | [SnakeGPT](https://share.snakegpt.vip/) | 办公、翻译、轻量学习 |

上表中的 SnakeGPT、GPTCat、ZeoGPT 都是第三方邀请链接，不是 Anthropic 官方工具，也不能替代你对代码、权限和密钥的审查。涉及真实仓库时，先脱敏、看 diff、跑测试，再决定是否采用 AI 的修改。

## 安装前准备：Node 环境、账号与 Git for Windows

正式安装前，先把三件基础准备做好，能省掉大部分报错。

1. Node.js 与终端：Claude Code 通过 npm 包分发，需要 Node.js 环境。建议安装当前 LTS 版本。Windows 用 PowerShell 或 Windows Terminal，macOS 用 Terminal 或 iTerm2。
2. Claude 账号或 API 权限：启动 Claude Code 需要身份凭证。官方文档说明可以用 Claude 账号登录，或配置 API 相关权限。不要把 API Key 写进公开仓库，也不要发给来路不明的插件。示例配置里请统一使用 `<YOUR_API_KEY>` 这样的占位符。
3. Git for Windows（仅原生 Windows）：官方文档（https://code.claude.com/docs/zh-CN/overview ）建议在原生 Windows 上安装 Git for Windows，这样 Claude Code 才能使用 Bash 工具；如果没装，部分依赖 Bash 的命令可能无法运行。

另外强烈建议先准备一个小型测试仓库，第一次不要直接对生产项目开工。

## Windows 安装步骤与常见报错核对

原生 Windows 的推荐路径如下：

1. 安装 Node.js LTS，安装完在新终端里执行 `node -v` 和 `npm -v` 确认版本。
2. 安装 Git for Windows，确保 Claude Code 可以调用 Bash 工具。
3. 打开 PowerShell 或 Windows Terminal，按官方文档全局安装：

```text
npm install -g @anthropic-ai/claude-code
```

4. 进入测试项目目录，运行 `claude` 启动。
5. 按提示用 Claude 账号登录，或配置 API 权限。
6. 先让它只读分析，不要立刻允许大范围修改：

```text
请先阅读这个项目结构，告诉我主要模块、入口文件和可能的测试命令。不要修改任何文件。
```

Windows 常见报错核对：

- `claude` 不是内部或外部命令：npm 全局 bin 目录没进 PATH，或安装没成功。重开终端后仍不行就检查环境变量。
- Bash 相关工具报错：多为未安装 Git for Windows，补装后重试。
- 权限或执行策略被拦：PowerShell 的执行策略可能阻止脚本，按需在受控范围内调整，不要盲目全局放开。

## macOS 安装步骤与终端权限

macOS 的流程更简单一些：

1. 安装 Node.js LTS（可用官方安装包或包管理器），确认 `node -v`、`npm -v` 正常。
2. 打开 Terminal 或 iTerm2。
3. 按官方文档全局安装 `@anthropic-ai/claude-code`。
4. 进入测试项目目录，运行 `claude`。
5. 登录 Claude 账号或配置所需权限。
6. 先让它生成改动计划，再逐步确认执行。

macOS 用户要额外留意系统的隐私与安全弹窗：终端、文件夹访问、开发者工具授权都会弹出请求。只在你理解用途时授予权限，不要随手给不明程序全盘磁盘访问。若用包管理器安装 Node，注意全局 npm 目录的写权限，避免用不必要的 `sudo` 造成后续权限混乱。

## 在 VS Code 中接入 Claude Code

Claude Code 本身更偏终端和项目级任务。在 VS Code 里配合使用有两种常见方式：一是使用官方提供的 IDE 扩展（具体名称与安装方式以官方文档为准，安装后按提示登录），二是直接在 VS Code 的集成终端里运行 `claude` 命令。

推荐的协作方式是让 VS Code 承担"看"、让 Claude Code 承担"改"：

- 左侧资源管理器看文件结构
- 集成终端里运行 Claude Code
- Git 源代码管理面板查看每一处 diff
- 手动审查关键逻辑
- 运行测试确认结果

不要让 AI 修改后直接提交。至少做三件事：看 diff、跑测试、手动确认关键逻辑。VS Code 里配置 Claude Code 与在终端配置 MCP 是两条线，如果你还要接入外部工具，可参考本站的 [Claude Code MCP 配置与连接失败排查](/claude/claude-code-mcp-config-file-scope-connection-failed-20260731)。

## 第一次跑通：初始化、发第一条指令、查看改动

装好之后，用一个安全的小闭环确认它能正常工作：

1. 初始化：在测试项目根目录运行 `claude`，完成登录或权限配置。
2. 只读探路：先发一条"只读、不改文件"的指令，让它解释目录结构和入口，验证它确实读到了你的代码。
3. 小范围修改：给一个明确、局部的任务，例如"给某个函数补充一处空值判断，改动前先说明方案"。
4. 查看改动：在 VS Code 的 Git 面板或用 `git diff` 逐行审查它改了什么。
5. 验证与回滚：跑测试，确认无误再提交；不满意就用 `git checkout` 或撤销改动回到干净状态。

养成"计划 → 改动 → diff → 测试"的习惯，比一次性放权让它大改要安全得多。

## 国内访问与网络受限时的排查思路

Claude 官方服务在国内访问受限，登录、模型请求、npm 包下载都可能出问题。建议按以下顺序排查：

1. 确认 Node.js 与 npm 本身正常（`node -v`、`npm -v`）。
2. 确认官方文档入口是否可访问，判断是网络问题还是安装问题。
3. 检查 Claude 账号与权限是否正常，注意所在地区的可用性说明。
4. 检查终端代理、DNS 与网络环境；npm 下载慢可换用可信镜像源。
5. 绝不要从来路不明页面下载所谓"Claude Code 破解版""绿色版"，避免账号、代码和本地文件泄露。

如果你只是想体验 Claude 的代码解释能力，可以先用低风险方式做同题测试。国内跑通开发工具的整体思路，也可以参考本站的 [Codex CLI 安装教程：官网入口、下载、Windows 配置与国内使用](/chatgpt/codex-cli-install-official-download-windows-china-2026-07)，两者在环境准备与网络排查上有很多相通之处。

## 安装失败与命令找不到的排查清单

- `claude` 命令找不到：确认全局安装成功，npm 全局 bin 目录在 PATH，重开终端。
- 安装报权限错误：Windows 用管理员终端或修正 npm 目录权限；macOS 避免滥用 `sudo`，修正全局目录归属。
- Node 版本过低：升级到当前 LTS。
- 登录失败：核对账号状态与地区可用性，检查网络与代理。
- Bash 工具不可用（Windows）：安装 Git for Windows。
- 下载卡住：更换可信 npm 镜像源，或稍后重试。
- 修改后项目坏了：用 Git 回滚，说明为什么"先 diff 再提交"很重要。

## 安全避坑与事实边界

- 不要把 `.env`、API Key、数据库密码交给不可信环境；示例里只用 `<YOUR_API_KEY>`。
- 不要让 AI 直接修改生产配置或直接提交。
- 不要跳过 Git diff 和测试。
- 不理解命令作用时，不要直接执行。
- 不要把公司私有代码上传到不合规平台。

事实边界：Claude Code 的具体安装命令、登录方式、支持的平台、套餐额度和地区可用性可能随官方更新变化，本文不承诺其长期稳定或在任意地区可用。安装与配置请以下列官方资料为准，本文提供的链接仅供读者复核，不代表已逐条验证其当前细节：

- Claude Code 官方产品页：https://claude.com/product/claude-code
- Claude Code 官方文档（中文）：https://code.claude.com/docs/zh-CN/overview
- Anthropic 开发者文档：https://docs.anthropic.com/
- Claude 官网：https://claude.com/

想进一步理解 Claude Code 的用量与额度机制，可以看本站的 [Claude Code 达到使用上限怎么办](/claude/claude-code-usage-limit-reached-reset-check-save-20260730)。

## 常见问题

### Claude Code 和 Claude 网页版有什么区别？

Claude 网页版是浏览器里的对话界面，适合写作、总结和问答；Claude Code 是运行在终端或 IDE 里的 Agentic 编程工具，能读取代码仓库、修改文件、执行命令。想让 AI 真正参与项目代码，才需要 Claude Code。

### 安装 Claude Code 一定要 Claude 账号或 API Key 吗？

需要身份凭证才能启动。官方文档说明可用 Claude 账号登录，或配置 API 相关权限。具体登录与计费方式以官方文档为准，不要把 Key 写进公开仓库。

### Windows 上安装 Claude Code 需要额外装什么？

除了 Node.js，官方推荐在原生 Windows 上安装 Git for Windows，让 Claude Code 能使用 Bash 工具。缺少它可能导致部分命令无法运行。

### 命令行提示 claude 找不到怎么办？

多数是 npm 全局路径没进 PATH，或安装未成功。先确认 `node -v`、`npm -v` 正常，重新全局安装，再关闭并重开终端；仍不行就检查 npm 全局 bin 目录是否在环境变量里。

### 国内网络能直接跑通 Claude Code 吗？

Claude 服务在国内访问受限，登录与模型请求可能失败。请先核对官方文档入口是否可达、账号权限是否正常，并注意所在地区的可用性；不要从来路不明页面下载所谓破解版。
