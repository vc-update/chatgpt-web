---
title: "Claude Code MCP怎么配置？配置文件位置、Local/Project/User作用域与连接失败排查【2026年7月】"
description: "Claude Code MCP怎么配置？本文讲清配置文件位置、Local/Project/User作用域、stdio与HTTP服务器、环境变量、连接失败和Failed to connect排查。"
date: 2026-07-31
updated: 2026-07-31
outline: deep
head:
  - - meta
    - name: keywords
      content: "Claude Code MCP配置,Claude Code MCP配置文件位置,Claude MCP Local Project User,Claude Code MCP连接失败,MCP failed to connect,.mcp.json"
faq:
  - question: "Claude Code MCP 是什么？"
    answer: "MCP 是让 Claude Code 连接外部工具和数据源的协议。配置完成后，Claude Code 可以在授权范围内调用文件、数据库、浏览器、工单或其他服务提供的工具。"
  - question: "Claude Code MCP 配置文件放在哪里？"
    answer: "位置取决于作用域。Local 配置通常保存在用户目录的 Claude 配置中；Project 配置使用项目根目录的 .mcp.json，适合随项目共享；User 配置面向当前用户跨项目使用。请以当前 Claude Code 官方文档和 claude mcp 命令输出为准。"
  - question: "Local、Project、User 作用域怎么选？"
    answer: "只在当前项目、只给自己使用的服务选 Local；需要团队共享的项目配置选 Project；在多个项目都要使用的个人工具选 User。密钥不要提交到 Project 配置。"
  - question: "MCP failed to connect 最常见的原因是什么？"
    answer: "常见原因是命令或可执行文件不存在、JSON 格式错误、工作目录不对、环境变量缺失、端口未监听、传输类型不匹配、OAuth 未完成或进程启动后立即退出。"
  - question: ".mcp.json 可以提交到 Git 吗？"
    answer: "可以用于共享不含秘密的 Project 配置，但不能提交 API Key、访问令牌、数据库密码和个人绝对路径。敏感值应通过环境变量或团队的密钥管理方式提供。"
  - question: "第三方 AI 平台能直接使用本地 MCP 吗？"
    answer: "不一定。网页端多模型平台与本地 Claude Code 的 MCP 环境彼此独立，不能默认访问本地项目、终端或已配置的 MCP 服务器。"
---

# Claude Code MCP怎么配置？配置文件位置、Local/Project/User作用域与连接失败排查【2026年7月】

更新时间：2026年7月31日

Claude Code MCP 配置最容易出错的地方，不是“少复制了一行 JSON”，而是没有先分清**服务器怎么启动、配置放在哪个作用域、秘密从哪里注入，以及 Claude Code 实际在哪个目录运行**。同一个 MCP Server 放在 Local、Project 或 User 作用域，适用范围和安全风险都不同。

> **直接结论：**个人在单个项目中调试，优先使用 Local；需要团队共享且配置不含密钥时，使用项目根目录的 `.mcp.json`；多个项目都要用的个人工具，考虑 User。出现 `failed to connect` 时，按“可执行文件 → 参数 → 环境变量 → 传输类型 → 端口/认证 → Claude Code 日志”的顺序排查。

| 作用域 | 适合场景 | 是否适合提交仓库 | 主要风险 |
| --- | --- | --- | --- |
| Local | 当前项目、当前用户的私人配置 | 通常不提交 | 绝对路径换电脑后失效 |
| Project | 团队共享同一项目的 MCP 定义 | 可提交无密钥配置 | 把 Token 或个人路径带进 Git |
| User | 当前用户在多个项目通用 | 不随项目提交 | 权限范围过大、工具太多影响选择 |

如果只是想处理公开、脱敏的代码解释、长文本或 Codex 类任务，而不是连接本地数据库和工具，可独立评估 [zeogpt.com](https://www.zeogpt.com/register?ref=MRNWDKC3)。它是第三方付费服务，不是 Anthropic 官方 Claude Code，也不会继承你本机的 MCP、终端权限或项目上下文。

## Claude Code MCP 能做什么

MCP（Model Context Protocol）把“模型会聊天”扩展为“模型可以调用经过描述和授权的工具”。常见用途包括：

- 读取受控目录中的文件和文档。
- 查询数据库或内部知识库。
- 访问 GitHub、工单、监控和项目管理系统。
- 调用浏览器自动化、设计工具或开发环境。
- 通过自建服务器包装现有 API。

这也意味着 MCP 不是普通提示词插件。每增加一个服务器，Claude Code 可能获得新的读取、写入或执行能力，配置前必须确认工具列表、参数、权限和数据去向。

## 配置前先确认三件事

### 1. MCP Server 使用哪种传输方式

常见类型包括：

- **stdio**：Claude Code 启动一个本地命令，通过标准输入输出通信。
- **HTTP**：连接已经运行的远程或本地 HTTP 服务。
- 旧教程还可能出现其他传输名称，应以当前服务器和 Claude Code 文档为准。

如果服务器文档要求启动本地命令，却配置成 HTTP URL，或者服务只监听 HTTP 却按 stdio 启动，必然连接失败。

### 2. 命令在普通终端里能不能运行

在把命令交给 Claude Code 之前，先在同一个系统账号和项目目录中手动测试：

```powershell
Get-Command node
Get-Command npx
node --version
npx --version
```

若使用其他运行时，也应先检查对应命令。`ENOENT`、`command not found` 或启动后立即退出，通常不是 MCP 协议问题，而是 PATH、依赖或参数问题。

### 3. 配置应该给谁使用

只给自己用，不代表一定要放 User；只在一个仓库使用的个人数据库工具，Local 往往更合适。Project 只应保存团队可以安全共享的服务器定义，秘密值通过环境变量注入。

## Claude Code MCP 配置的稳妥流程

### 第一步：更新并检查 Claude Code

先确认 Claude Code 能正常启动，再查看当前版本支持的 MCP 命令：

```bash
claude --version
claude mcp --help
claude mcp list
```

CLI 参数会更新，因此不要长期照抄旧文章里的完整命令。以 `claude mcp --help` 和 [Claude Code MCP 官方文档](https://code.claude.com/docs/en/mcp)为准。

### 第二步：用 CLI 添加一个最小配置

官方 CLI 通常提供 `claude mcp add` 一类命令。添加时需要明确：

- 服务器名称。
- 传输类型。
- 命令或 URL。
- 参数。
- 作用域。
- 必需的环境变量。

先添加不需要高权限的测试服务器，再用 `claude mcp list` 检查是否出现。不要一开始就连接生产数据库、公司仓库或拥有写权限的系统。

### 第三步：理解配置文件位置

Claude Code 当前文档把 MCP 配置按作用域管理：

- **Local**：保存当前用户针对该项目的私人配置。官方搜索摘要显示，本地作用域服务器记录在用户目录的 Claude 配置中，而不是简单等同于项目的本地 settings 文件。
- **Project**：使用项目根目录的 `.mcp.json`，适合把无密钥的服务器定义交给团队复用。
- **User**：保存当前用户跨项目可用的 MCP 配置。

不要用“网上说配置都放一个文件”来判断。先运行 `claude mcp list`，再对照当前官方文档确认 Claude Code 实际读取的作用域。

### 第四步：检查 Project 配置是否可共享

一个可提交的 Project 配置应满足：

- 不包含 API Key、Token、密码和 Cookie。
- 不包含只在你电脑存在的绝对路径。
- 命令和依赖有明确安装说明。
- 环境变量只写变量名或占位说明。
- 工具权限与项目用途相符。

提交前可以执行：

```bash
git diff -- .mcp.json
git grep -n -E "(api[_-]?key|token|secret|password)"
```

命中并不一定代表泄露，但必须逐项确认。

## MCP failed to connect 的排查清单

### 1. 命令不存在或路径错误

典型提示包括 `ENOENT`、`spawn failed`、`command not found`。处理方法：

1. 在普通终端运行同一命令。
2. 查看可执行文件的真实路径。
3. 确认 Claude Code 启动时继承了相同 PATH。
4. Windows 上注意 `.cmd`、PowerShell 和路径空格差异。

### 2. 参数顺序或 JSON 格式错误

手动编辑 `.mcp.json` 时，常见错误是多余逗号、引号不成对、把参数写成单个长字符串，或者复制了 JSON 不支持的注释。使用编辑器 JSON 校验，并优先通过 CLI 创建基础配置。

### 3. 环境变量没有传给 MCP 进程

在当前终端能 `echo` 到变量，不代表桌面启动的 Claude Code 或另一个 Shell 一定能继承。检查：

- 变量是否在启动 Claude Code 前设置。
- 变量名大小写是否正确。
- Project 配置是否误写了秘密的实际值。
- 子进程是否需要单独的 env 映射。

任何日志和截图都应先遮住 Token、数据库地址和个人目录。

### 4. 工作目录不对

服务器可能依赖相对路径、配置文件或项目内依赖。如果从其他目录启动就失败，应改用稳定路径，或让服务器显式接收工作目录参数。

### 5. HTTP 服务没有监听或认证未完成

对于 HTTP MCP：

```powershell
Test-NetConnection localhost -Port 3000
curl.exe -I http://localhost:3000/
```

端口能通也不代表协议和认证正确。继续检查 URL 路径、HTTPS 证书、OAuth 回调、反向代理和服务器日志。

### 6. 传输类型不匹配

把普通 REST API URL 直接当成 MCP URL，或者把一个持续运行的 HTTP 服务当成 stdio 命令，是高频错误。必须使用服务器文档明确支持的 MCP 入口和传输方式。

### 7. 服务器启动了但工具没有出现

可能原因包括：

- 服务器没有正确返回工具列表。
- 当前会话在添加配置前已启动，需要重新加载。
- 工具被权限、策略或组织设置禁用。
- 名称冲突或配置处于另一个作用域。

用 `claude mcp list` 确认服务器，再在 Claude Code 中检查当前会话可见的工具，不要只看配置文件存在。

## Local、Project、User 的实际选择案例

| 场景 | 推荐作用域 | 原因 |
| --- | --- | --- |
| 当前仓库连接个人测试数据库 | Local | 不应把个人连接信息共享给团队 |
| 团队统一使用只读文档检索服务 | Project | 可以共享服务器定义，密钥外置 |
| 每个项目都要使用个人浏览器工具 | User | 跨项目复用，但要限制权限 |
| 生产数据库写入工具 | 先不要直接配置 | 应先做只读、审计、审批和最小权限设计 |
| 临时试验未知 MCP 包 | Local + 隔离环境 | 控制影响范围，检查包来源和工具权限 |

## MCP 安全检查

1. 只安装来源清楚、代码或发布者可核验的服务器。
2. 默认使用只读权限，按任务逐步增加。
3. 数据库使用专门低权限账号，不复用管理员凭证。
4. 不把密钥写进 `.mcp.json`、提示词、截图或 Git。
5. 对文件写入、Shell、浏览器登录和生产操作保留人工确认。
6. 定期运行 `claude mcp list`，删除不再使用的服务器。
7. 团队项目为 MCP 配置建立代码审查和变更记录。

## FAQ

### 为什么别人项目里的 .mcp.json 在我电脑上不能用？

常见原因是依赖未安装、命令不在 PATH、使用了对方的绝对路径、环境变量缺失，或组织策略不同。Project 配置可共享，不代表本地运行环境自动一致。

### User 作用域是不是优先级最高？

“范围更广”不等于“优先级最高”。当同名服务器出现在不同作用域时，应查看当前官方文档的冲突规则，并避免复用模糊名称。

### MCP 连接失败和 Claude Code 使用上限有关吗？

通常是两类问题。连接失败多与服务器、配置和认证有关；账号用量问题可参考[Claude Code 达到使用上限怎么办](/claude/claude-code-usage-limit-reached-reset-check-save-20260730)。

### 能把数据库密码直接写进配置文件吗？

不建议，Project 配置尤其不能这样做。使用环境变量、系统密钥链或团队密钥管理服务，并采用低权限凭证。

### 配置完成后需要重启 Claude Code 吗？

部分配置可以动态发现，部分会话可能需要重新加载。添加后先查看 CLI 列表和当前会话工具；若状态不一致，再安全退出并重启。

## 相关阅读与官方核验

- [Claude Code 怎么安装：Windows、macOS 与 VS Code](/claude/claude-code-install-windows-macos-vscode-domestic-guide-2026-07)
- [Claude Code 达到使用上限怎么办](/claude/claude-code-usage-limit-reached-reset-check-save-20260730)
- [Claude Code MCP 官方文档](https://code.claude.com/docs/en/mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)

::: warning 免责声明
本站为独立中文 AI 教程网站，与 Anthropic 及文中第三方服务没有隶属、代理或官方授权关系。Claude Code 命令、配置位置和作用域规则可能更新，请以当前官方文档与本机 `claude mcp --help` 输出为准。连接外部工具前应完成权限、隐私和密钥审查。
:::
