# Contributing

Thank you for your interest in contributing! Here's everything you need to get started.

## Prerequisites

- Node.js 18+
- npm 9+
- Git

## Local setup

```bash
git clone https://github.com/mael-app/cv-generator-public.git
cd cv-generator-public
npm install
cp cv.example.json cv.json
npm start
```

The editor is available at **http://localhost:3000**.

## Development workflow

### Branch naming

Use the format `type/short-description`, e.g.:

- `feat/dark-mode`
- `fix/color-extraction-timeout`
- `chore/update-deps`

### Commit messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Commitlint is enforced via a git hook.

Examples:

```
feat: add dark mode support
fix: handle missing company logo gracefully
docs: update Docker instructions
chore: upgrade puppeteer to v25
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`.

### Available scripts

| Script              | Description                |
| ------------------- | -------------------------- |
| `npm start`         | Dev server with hot reload |
| `npm test`          | Run tests                  |
| `npm run lint`      | ESLint check               |
| `npm run lint:fix`  | ESLint auto-fix            |
| `npm run format`    | Prettier formatting        |
| `npm run typecheck` | TypeScript type check      |
| `npm run build`     | Compile TypeScript         |

### Pre-commit hooks

Husky runs `lint-staged` on every commit — it will automatically lint and format staged files. If the hook fails, fix the reported issues before committing.

## Submitting a pull request

1. Fork the repo and create a branch from `main`.
2. Write or update tests for your changes.
3. Make sure `npm test`, `npm run lint`, and `npm run typecheck` all pass.
4. Open a PR and fill in the template.

## Reporting issues

Please use the GitHub issue templates:

- **Bug report** — unexpected behavior, errors, crashes
- **Feature request** — new ideas or improvements

## Code style

- TypeScript strict mode is enabled — avoid `any` where possible.
- All new services/utils should have corresponding `*.test.ts` files.
- Run `npm run format` before pushing if your editor doesn't auto-format.

## Questions?

Open a [GitHub Discussion](../../discussions) or an issue.
