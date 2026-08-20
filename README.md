# BugCatch Analyzer (bug-detector-web)

**BugCatch Analyzer** is a web frontend for an LLM-powered bug detection and
sanitization pipeline. Upload or paste source code, let a large language model
find candidate bugs, verify them with data-flow sanitization, and generate fixed
(sanitized) code — all from a clean, responsive UI.

## Overview

The system is split into two pieces:

- **Backend** — a FastAPI service that runs the LLM analysis, performs
  data-flow sanitization and returns an NDJSON event stream over HTTP. This
  repo is frontend-only; any backend exposing the endpoints documented below
  can be used.
- **Frontend** — this Next.js app. The browser talks to `/api/*`, which Next.js
  proxies to the backend via the `API_BASE_URL` rewrite.

## Features

- Paste code or upload a file (`.java`, `.py`, `.js`, `.ts`, `.cs`, `.txt`)
- Streaming analysis log with per-stage status (started, detection,
  trace result, completed)
- Supported bug types: NPD, DBZ, CI, APT, XSS
- Choose the LLM model used by the backend (`gpt-4.1-mini`, `gpt-4o-mini`)
- One-click fix generation with syntax-highlighted, copy-able sanitized code
- Syntax highlighting powered by [shiki](https://shiki.style) with git-diff
  notation support

## Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/<your-user>/bug-detector-web.git
cd bug-detector-web
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Configure the backend URL

```bash
cp .env.example .env.local
# edit .env.local
```

```env
API_BASE_URL=http://localhost:8000
```

All `/api/*` requests from the browser are proxied to this address by the
rewrites defined in `next.config.ts`.

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 5. (Recommended) Point it at a real backend

Run any backend that exposes these endpoints:

- `POST /api/analysis?model_name=<model>&bug_type=<type>` — accepts a JSON stream
  of events (`stage`, `message`, `trace`, `output`, `result`, `reason`,
  `final_result`).
- `POST /api/sanitize?file_name=<file>&model_name=<model>&bug_type=<type>` —
  returns the sanitized source code as plain text.

> Note: there is no mock backend included in this repo. Without a backend, the
> demo will show an error toast when you hit **Analyze Code**.

## Project Structure

```
├── app/                  # Next.js App Router
│   ├── page.tsx          # Landing page (hero / features / demo / results)
│   ├── layout.tsx        # Root layout + metadata
│   └── globals.css       # Tailwind v4 theme + shiki styles
├── components/
│   ├── demo.tsx          # Tab shell + shared state
│   ├── tab-editor.tsx    # Code input, upload, analyze
│   ├── tab-result.tsx    # Streamed analysis log + summary
│   ├── tab-sanitized.tsx # Generated fixes viewer
│   ├── sanitized-code.tsx
│   ├── code-block.tsx    # Server-side shiki highlighting
│   ├── hero-section.tsx
│   └── ui/               # shadcn/ui components
├── hooks/
│   └── use-copy-to-clipboard.ts
├── lib/
│   ├── shared.ts         # Reusable shiki highlighter
│   ├── types.ts          # Shared type definitions
│   └── utils.ts          # cn() helper
└── public/               # Static assets
```

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router, React 19)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com)
- [shiki](https://shiki.style) for code highlighting
- [lucide-react](https://lucide.dev) icons
- [sonner](https://sonner.emilkowal.ski) toasts

## Contributing

Contributions are welcome! Open an issue or submit a pull request for any
improvements or bug fixes.

## License

MIT — see the [LICENSE](LICENSE) file for details.