# One-to-One Chat App (FastAPI + Next.js + Tailwind)

## How it works
- **Backend** (`/backend`): FastAPI app. Each user opens a WebSocket at
  `/ws/{username}`. A `ConnectionManager` keeps a map of `username -> socket`
  and routes messages: `{"to": "someone", "message": "hi"}` gets persisted to
  a SQLite database and delivered straight to that user's socket (and echoed
  back to the sender). A duplicate username connecting while the first is
  still online gets rejected with WebSocket close code `4001`.
- **Persistence**: Every message is saved via SQLAlchemy to `backend/chat.db`
  (SQLite, created automatically on first run — no setup needed).
  `GET /api/messages/{u1}/{u2}` returns the full history between two users;
  the frontend calls this the first time you open a conversation, so history
  survives refreshes and new browsers/devices. Set the `DATABASE_URL` env var
  if you'd rather point this at Postgres.
- **Frontend** (`/frontend`): Next.js (App Router) + Tailwind. Login screen
  asks for a username, connects a WebSocket, shows who's online in a sidebar,
  and renders a chat bubble UI for whoever you select.

## Run the backend
```bash
cd backend
python -m venv venv
source venv/bin/activate      # on Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend runs at `http://localhost:8000`.

## Run the frontend
```bash
cd frontend
cp .env.local.example .env.local   # points the frontend at the backend on :8000
npm install
npm run dev
```
Frontend runs at `http://localhost:3000`.

> The `.env.local` step is only needed when running frontend/backend as
> separate dev servers like this. If you're going through the Caddyfile
> (`:9000`) or a devtunnels URL instead, skip it — same-origin requests work
> automatically there.

## Try it
1. Open `http://localhost:3000` in two different browser windows (or one
   normal + one incognito).
2. Log in as two different usernames, e.g. `alice` and `bob`.
3. Each will see the other appear in the "Online" sidebar. Click their name
   and start chatting — messages arrive instantly over the WebSocket.

## Notes / next steps you might want
- **No auth** — usernames aren't verified. Plug in your existing FastAPI
  auth system (JWT) and read the username from the token instead of a
  free-text field.
- **Offline delivery** — if the recipient isn't connected, the message is
  currently dropped. Store undelivered messages and flush them when that
  user reconnects.
- **Typing indicators / read receipts** — easy to add as new WebSocket
  message types (`{"type": "typing", ...}`) handled the same way.