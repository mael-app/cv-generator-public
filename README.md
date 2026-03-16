# CV Generator

[![CI](https://github.com/mael-app/cv-generator-public/actions/workflows/ci.yml/badge.svg)](https://github.com/mael-app/cv-generator-public/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)

Generate a professionally styled CV/Resume PDF with **dynamic brand color extraction** from company logos. Fill in your details via the dashboard, hit Generate, and get a ready-to-send PDF — automatically styled with your target company's brand color.

## Features

- **Dashboard editor** — fill in all CV sections directly in the browser
- **Brand color extraction** from company logos (Clearbit → Google favicon → fallback)
- **PDF generation** via Puppeteer (A4, print-optimized)
- Profile photo upload (JPEG / PNG / GIF, max 5 MB)
- Light / dark PDF theme
- Import / export CV data as JSON
- **API support** — generate PDFs programmatically via HTTP
- No server-side persistence — all data stays in your browser
- Docker-ready

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:3000**, fill in your details, and click **Generate PDF**.

## API usage

Generate PDFs programmatically — no auth required.

```bash
# Step 1 — Generate (returns a one-time download URL)
RESPONSE=$(curl -s -X POST http://localhost:3000/api/generate \
  -F "cv=<cv-data.json" \
  -F "photo=@photo.jpg" \
  -F "domain=apple.com" \
  -F "theme=light")

# Step 2 — Download the PDF (link expires in 5 min, single use)
curl -s "http://localhost:3000$(echo $RESPONSE | jq -r '.downloadUrl')" \
  -o cv.pdf
```

| Parameter | Description                                                             |
| --------- | ----------------------------------------------------------------------- |
| `cv`      | JSON file matching the CV schema — **required**                         |
| `photo`   | Profile photo (JPEG / PNG / GIF, max 5 MB) — optional                   |
| `domain`  | Company domain for brand color extraction (e.g. `apple.com`) — optional |
| `color`   | Hex color override, takes precedence over domain — optional             |
| `theme`   | `light` or `dark` — default: `light`                                    |

The `POST /api/generate` response: `{ "downloadUrl": "/api/download/<token>", "expiresIn": 300 }`

The download link is **single-use** and expires after **5 minutes**.

## Docker

```bash
docker build -t cv-generator-public .
docker run -p 3000:3000 cv-generator-public
```

## Scripts

| Script              | Description                |
| ------------------- | -------------------------- |
| `npm run dev`       | Dev server with hot reload |
| `npm run build`     | Production build           |
| `npm start`         | Start production server    |
| `npm run lint`      | ESLint check               |
| `npm run typecheck` | TypeScript type check      |

## Tech stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **PDF:** Puppeteer (headless Chrome), EJS templating
- **UI:** Tailwind CSS, shadcn/ui, next-themes
- **Validation:** Zod
- **Color extraction:** get-image-colors

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
