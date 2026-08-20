# BugCatch Analyzer (bug-detector-web)

**BugCatch Analyzer** is a full-stack web app for LLM-powered bug detection and
sanitization. Upload or paste Java source code, let a large language model find
candidate bugs, verify them with data-flow sanitization, and generate fixed
(sanitized) code — all from a clean, responsive UI.

## Overview

The system is split into two pieces:

- **Backend** (`backend/`) — a FastAPI service that runs the LLM-based
  detection + sanitization pipeline and streams an NDJSON event stream over
  HTTP.
- **Frontend** — this Next.js app. The browser talks to `/api/*`, which Next.js
  proxies to the backend via the `API_BASE_URL` rewrite.

## Features

- Paste code or upload a file (`.java`, `.py`, `.js`, `.ts`, `.cs`, `.txt`)
- Streaming analysis log with per-stage status (started, detection,
  trace result, completed)
- Supported bug types: DBZ, NPD, XSS, CI, APT
- Choose the LLM model used by the backend (`gpt-4.1-mini`, `gpt-4o-mini`)
- One-click fix generation with syntax-highlighted, copy-able sanitized code
- Syntax highlighting powered by [shiki](https://shiki.style) with git-diff
  notation support

## Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/Hunge-cute/bug-detector-web.git
cd bug-detector-web
```

### 2. Set up the backend

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Build the tree-sitter Java parser (requires git + a C compiler)
cd lib
python build.py
cd ..

# Set your OpenAI API key
echo "OPENAI_API_KEY=sk-xxx" > .env.local

# Run the FastAPI server
python src/index.py
```

Open [http://localhost:8000/docs](http://localhost:8000/docs) for the Swagger UI.

### 3. Set up the frontend

```bash
cd ..   # back to the repo root

npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 4. Configure the backend URL

```bash
cp .env.example .env.local
# edit .env.local
```

```env
API_BASE_URL=http://localhost:8000
```

All `/api/*` requests from the browser are proxied to this address by the
rewrites defined in `next.config.ts`.

### 5. Run the frontend

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

## API

### `POST /api/analysis?model_name=<model>&bug_type=<type>`

Receives an uploaded source file, runs the detection + sanitization pipeline and
returns a stream of NDJSON events:

| Field          | Description                                   |
| -------------- | --------------------------------------------- |
| `stage`        | `started` \| `detection` \| `trace_result` \| `completed` |
| `message`      | Human-readable status message                 |
| `trace`        | Trace of the detection step                   |
| `output`       | Raw output of the trace step                  |
| `result`       | Detection result                              |
| `reason`       | Explanation for the detection result          |
| `final_result` | Final verdict                                 |

### `POST /api/sanitize?file_name=<file>&model_name=<model>&bug_type=<type>`

Reads the stored sanitization log for a previously analyzed file and returns the
sanitized source code as plain text.

Bug types: `dbz`, `npd`, `xss`, `ci`, `apt`.

## Project Structure

```
├── app/                  # Next.js App Router
│   ├── page.tsx          # Landing page (hero / features / demo / results)
│   ├── layout.tsx        # Root layout + metadata
│   └── globals.css       # Tailwind v4 theme + shiki styles
├── backend/              # FastAPI service
│   ├── src/
│   │   ├── index.py      # FastAPI app
│   │   ├── pipeline.py   # Detection + sanitization pipeline
│   │   ├── data/         # Code transformation
│   │   ├── model/        # LLM wrapper, detector, prompt utils
│   │   ├── parser/       # Bug report parsing
│   │   ├── prompt/       # LLM prompt templates
│   │   └── sanitizer/    # Data-flow sanitization passes
│   ├── lib/              # tree-sitter Java parser build
│   └── requirements.txt
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
- [FastAPI](https://fastapi.tiangolo.com) (Python backend)

## Contributing

Contributions are welcome! Open an issue or submit a pull request for any
improvements or bug fixes.

## License

MIT — see the [LICENSE](LICENSE) file for details.
