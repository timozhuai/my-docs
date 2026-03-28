# Agent Guidelines

VuePress 2.x 静态文档站点，使用 pnpm 和 VuePress Theme Hope。

## Commands

```bash
pnpm dev:vite        # 开发服务器
pnpm dev:vite-clean  # 清除缓存后启动
pnpm build:vite      # 构建生产版本
pnpm lint             # 格式化代码
pnpm lint:md         # 检查 markdown
```

无测试框架。

## Code Style

### Markdown 规则

- 标题：ATX 风格 (`#`, `##`, `###`)
- 列表：使用 `-`
- 分隔线：`---`
- 代码块：使用 fenced code 并标注语言

### 命名规范

- 目录/文件名：kebab-case（如 `node-js`, `getting-started.md`）

### 其他

- 源文件在 `src/`
- 输出在 `dist/`（不直接编辑）
- 主要内容为中文文档

## Workflow

1. 编辑 `src/` 下的 `.md` 文件
2. `pnpm dev:vite` 预览
3. `pnpm lint` 格式化后提交
4. `pnpm build:vite` 构建部署
