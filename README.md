# CV Generator

[![CI](https://github.com/mael-app/cv-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/mael-app/cv-generator/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)

Generate a professionally styled CV/Resume PDF with **dynamic brand color extraction** from company logos. Fill in your details via a web editor, hit Generate, and get a ready-to-send PDF — automatically styled with your target company's brand color.

## Features

- **Web editor** with real-time preview
- **Brand color extraction** from company logos (Clearbit → Google favicon → fallback)
- **PDF generation** via Puppeteer (A4, print-optimized)
- Profile photo upload
- History of the last 10 generated PDFs
- Docker-ready

## Quick start

```bash
npm install
cp cv.example.json cv.json
```

1. Edit `cv.json` with your details.

2. Add your photo and set the path in `cv.json` (`header.picturePath`).
   - Easiest: put the image at the project root and set e.g. `"picturePath": "me.png"`.
   - Alternatively, use the web editor upload — it will set the path automatically.

3. Start the dev server:

```bash
npm start
```

The editor is available at **http://localhost:3000**.

## Generating a PDF

**Via the web editor** — open http://localhost:3000, fill in your details, and click Generate.

**Via URL** — pass a `domain` to auto-extract the brand color:

```
http://localhost:3000/generate-cv?domain=credit-agricole.fr
```

**Via CLI** (requires server running):

```bash
npm run create -- apple.com
```

The PDF is saved to the `output/` folder.

## Docker

```bash
docker build -t cv-generator .
docker run -p 3000:3000 cv-generator
```

## Scripts

| Script                       | Description                |
| ---------------------------- | -------------------------- |
| `npm start`                  | Dev server with hot reload |
| `npm test`                   | Run tests                  |
| `npm run build`              | Compile TypeScript         |
| `npm run lint`               | ESLint check               |
| `npm run lint:fix`           | ESLint auto-fix            |
| `npm run format`             | Prettier formatting        |
| `npm run typecheck`          | TypeScript type check      |
| `npm run create -- <domain>` | Generate PDF from CLI      |

## Tech stack

- **Runtime:** Node.js, Express 5, TypeScript
- **PDF:** Puppeteer (headless Chrome)
- **Templating:** EJS
- **Validation:** Zod
- **Color extraction:** get-image-colors

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
