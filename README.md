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
python3 -m venv .venv
```

Activate it:

```bash
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
```

When you are done, leave the virtual environment with:

```bash
deactivate
```
