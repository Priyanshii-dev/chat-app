# One-to-One Chat App (FastAPI + Next.js + Tailwind)

## How it works
- **Backend** (`/backend`): FastAPI app. Each user opens a WebSocket at
  `/ws/{username}`. A `ConnectionManager` keeps a map of `username -> socket`
  and routes messages: `{"to": "someone", "message": "hi"}` gets delivered
  straight to that user's socket (and echoed back to the sender).
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
npm install
npm run dev
```
Frontend runs at `http://localhost:3000`.

## Try it
1. Open `http://localhost:3000` in two different browser windows (or one
   normal + one incognito).
2. Log in as two different usernames, e.g. `alice` and `bob`.
3. Each will see the other appear in the "Online" sidebar. Click their name
   and start chatting — messages arrive instantly over the WebSocket.

## Notes / next steps you might want
- **No persistence yet** — messages only exist in memory/browser state.
  Add a database (SQLite via SQLAlemy, which you already use) if you want
  chat history to survive a refresh.
- **No auth** — usernames aren't verified. Plug in your existing FastAPI
  auth system (JWT) and read the username from the token instead of a
  free-text field.
- **Offline delivery** — if the recipient isn't connected, the message is
  currently dropped. Store undelivered messages and flush them when that
  user reconnects.
- **Typing indicators / read receipts** — easy to add as new WebSocket
  message types (`{"type": "typing", ...}`) handled the same way.
