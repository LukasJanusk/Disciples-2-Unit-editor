# Disciples-2-Unit-editor

## Monorepo layout

```text
server/   Python FastAPI backend for DBF unit loading and editing
client/   React + Vite frontend
defaults/ game DBF source files
assets/   project assets
```

## Server setup

Create the virtual environment:

```bash
# Windows (cmd / PowerShell)
py -m venv .venv

# macOS / Linux
python3 -m venv .venv
```

Activate it:

```bash
# Windows Command Prompt (cmd)
.venv\Scripts\activate.bat

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# macOS / Linux / Git Bash
source .venv/bin/activate
```

Install backend dependencies:

```bash
python -m pip install -r server/requirements.txt
```

Run the backend:

```bash
python -m server.main
```

If you prefer running without activation, use the interpreter path directly:

```bash
# Windows
.venv\Scripts\python -m server.main

# macOS / Linux
.venv/bin/python -m server.main
```

Storage location depends on `APP_ENV`:

```text
APP_ENV=dev   -> ./storage/Globals
APP_ENV=prod  -> %LOCALAPPDATA%/Disciples2UnitEditor/Globals on Windows
```

Development defaults to `APP_ENV=dev`. Packaged desktop builds should set `APP_ENV=prod` before starting the backend.

The backend port can also be overridden with `APP_PORT`. If it is not set, the backend uses `8000`.

The backend runs on `http://127.0.0.1:8000`.

Allowed frontend origins:

```text
http://localhost:5173
http://127.0.0.1:5173
```

Available endpoints:

```text
GET /units
GET /units/{unit_id}
POST /units/{unit_id}
```

Example edit request:

```bash
curl -X POST http://127.0.0.1:8000/units/g000uu0001 \
  -H "Content-Type: application/json" \
  -d '{"changes": {"LEVEL": 2, "HIT_POINT": 120}}'
```

## Client setup

Install frontend dependencies:

```bash
cd client
npm install
```

Run the frontend:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Run tests:

```bash
npm run test
```

## Root scripts

From the repo root:

```bash
npm run client:dev
npm run client:build
npm run client:test
npm run client:lint
npm run server:dev
npm run desktop:dev
npm run backend:build
npm run desktop:build
```

`npm run server:dev` currently uses a Unix-style path. On Windows terminals, run one of these instead:

```bash
# after activating the venv (all OS)
python -m server.main

# without activation on Windows
.venv\Scripts\python -m server.main
```

## Desktop packaging

Install root desktop dependencies:

```bash
npm install
```

Install backend dependencies, including PyInstaller:

```bash
# Windows Command Prompt (cmd)
.venv\Scripts\activate.bat

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# macOS / Linux / Git Bash
source .venv/bin/activate

python -m pip install -r server/requirements.txt
```

For desktop development, run the Vite client first and then start Electron from the repo root:

```bash
npm run client:dev
npm run desktop:dev
```

To build the packaged backend bundle only:

```bash
npm run backend:build
```

To build the Windows installer:

```bash
npm run desktop:build
```

Notes:

```text
- The Electron launcher starts the backend automatically.
- Packaged runs use APP_ENV=prod automatically.
- The backend bundle is written to ./dist/backend.
- The desktop installer output is written to ./dist-desktop.
- For a real Windows NSIS installer, run the desktop build on Windows.
```

When you are done, leave the virtual environment with:

```bash
deactivate
```
