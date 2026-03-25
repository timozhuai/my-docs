# Agent Guidelines for This Repository

This is a VuePress 2.x static documentation site built with VuePress Theme Hope. The project uses pnpm as the package manager and primarily contains Chinese markdown documentation.

## Build Commands

```bash
# Development
pnpm dev:vite        # Start Vite dev server (recommended)
pnpm dev:vite-clean  # Start Vite dev server with clean cache
pnpm dev:webpack     # Start Webpack dev server (alternative)

# Build
pnpm build:vite      # Build for production with Vite (recommended)
pnpm build:webpack   # Build for production with Webpack (alternative)

# Linting
pnpm lint            # Run prettier --check --write (format all files)
pnpm lint:check      # Run prettier --check (check without fixing)
pnpm lint:md         # Run markdownlint-cli2 on all .md files

# Testing
pnpm test            # No tests configured (echo warning and exit 0)

# Debug
pnpm dev:vite-debug  # Start dev server with VuePress debug output
```

### Running a Single Test

No test framework is configured for this project. The `pnpm test` command simply exits with 0.

## Code Style Guidelines

### General Project Structure

- Source files in `src/` directory
- Documentation content in `.md` files
- VuePress configuration in `src/.vuepress/` directory
- Generated output in `dist/` directory (never edit directly)

### Markdown Formatting Rules

The project uses markdownlint-cli2 with the following rules:

- **Headers**: Use ATX-style (`#`, `##`, `###`) - no setext-style
- **Lists**: Use dashes (`-`) for unordered lists
- **Thematic breaks**: Use `---` (three dashes)
- **Line length**: No limit (MD013 disabled)
- **Sibling headers**: MD024 allows same name headers in different files
- **Code blocks**: Use fenced code blocks with language identifiers
- **HTML**: Limited to `br`, `script`, `Badge`, `Catalog` elements only

### Prettier Configuration

- Run `pnpm lint` to format all files automatically
- Ignored directories: `dist/`, `node_modules/`
- See `.prettierignore` for specific files with unusual formatting
- Prettier handles markdown, JSON, YAML, and other text formats

### Naming Conventions

- Directory names: kebab-case (e.g., `node-js`, `vscode`, `mini-app`)
- File names: kebab-case (e.g., `README.md`, `getting-started.md`)
- URL paths in docs: kebab-case
- Avoid spaces and special characters in file/directory names

### Project Organization

```
src/
├── .vuepress/          # VuePress configuration
├── code/               # Programming related docs
│   ├── language/       # Language tutorials (js, python, etc.)
│   ├── website/        # Web development
│   ├── vue/            # Vue.js
│   └── node-js/        # Node.js
├── note/               # Personal notes (mac, wsl, flutter)
├── software/           # Software tools (vscode, git, mysql)
├── linux/              # Linux/Unix related
├── physics/            # Physics notes
├── design/             # Design/UI related
├── teaching/           # Teaching materials
├── piece/              # Articles/essays (seasonal collections)
├── about/              # About page
└── README.md           # Home page
```

### Import/Module Style

This is a documentation site, not a typical JavaScript project:

- No custom JavaScript/TypeScript source files to write
- VuePress plugins configured in `package.json`
- Theme configuration in `src/.vuepress/config.ts` or similar

### TypeScript Usage

- `tsconfig.json` exists but is primarily for VuePress tooling
- No custom TypeScript code required in this project
- TypeScript is used internally by VuePress and its plugins

### Error Handling

- No runtime error handling needed (static site generation)
- Lint errors should be fixed before committing
- Build errors will stop deployment - fix all warnings

### Content Guidelines

- Write primarily in Chinese (Simplified)
- Use clear, descriptive headers
- Include code examples with language labels
- Keep paragraphs concise and scannable
- Use proper punctuation (Chinese punctuation for Chinese text)

## Development Workflow

1. **Create/edit markdown files** in `src/` directory
2. **Preview locally**: Run `pnpm dev:vite` to start dev server
3. **Format code**: Run `pnpm lint` before committing
4. **Check markdown**: Run `pnpm lint:md` for quality control
5. **Build for production**: Run `pnpm build:vite` to generate static output
6. **Deploy**: Contents of `dist/` folder are ready for deployment

## Key Configuration Files

| File                      | Purpose                                     |
| ------------------------- | ------------------------------------------- |
| `package.json`            | Dependencies, scripts, and VuePress plugins |
| `.markdownlint-cli2.mjs`  | Markdown linting rules                      |
| `.prettierignore`         | Files to skip formatting                    |
| `tsconfig.json`           | TypeScript configuration                    |
| `src/.vuepress/config.ts` | VuePress site configuration                 |

## Important Notes

- This is a personal blog/knowledge base using VuePress Theme Hope
- Content is primarily Chinese technical documentation
- No unit tests exist in this project
- Focus on markdown content quality and proper VuePress configuration
- The `dist/` folder is generated output - never edit directly
- Avoid committing `node_modules/` or `dist/` to version control
