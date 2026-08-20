# BugCatch Analyzer — Backend

FastAPI service that powers the BugCatch Analyzer web app. It runs the LLM-based
bug detection pipeline: a large language model finds candidate bugs in Java
source code, the framework verifies them with data-flow sanitization, and the
model generates fixed (sanitized) code.

## Endpoints

- `POST /api/analysis?model_name=<model>&bug_type=<type>` — receives an uploaded
  source file, runs the detection + sanitization pipeline and streams back an
  NDJSON event stream.
- `POST /api/sanitize?file_name=<file>&model_name=<model>&bug_type=<type>` —
  reads the stored sanitization log for a previously analyzed file and returns
  the sanitized source code as plain text.

Bug types: `dbz`, `npd`, `xss`, `ci`, `apt`.

## Getting Started

```bash
cd backend

# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Build the tree-sitter Java parser (requires git + a C compiler)
cd lib
python build.py
cd ..

# 3. Set your OpenAI API key
#    (backend loads .env or .env.local from this directory)
echo "OPENAI_API_KEY=sk-xxx" > .env.local

# 4. Run the server
python src/index.py
```

Open [http://localhost:8000/docs](http://localhost:8000/docs) for the Swagger UI.

The frontend proxies `/api/*` to this server through `API_BASE_URL`
(default `http://localhost:8000`).

## Project Structure

```
├── src/
│   ├── index.py            # FastAPI app
│   ├── pipeline.py         # Detection + sanitization pipeline
│   ├── data/               # Code transformation (obfuscation)
│   ├── model/              # LLM wrapper, detector, prompt utils
│   ├── parser/             # Bug report parsing
│   ├── prompt/             # LLM prompt templates (dbz/npd/xss/ci/apt/sanitize)
│   └── sanitizer/          # Data-flow sanitization passes
├── lib/
│   └── build.py            # Builds the tree-sitter Java parser (.so)
└── log/                    # Stored logs (initial detection, sanitization)
```
