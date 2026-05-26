# UNO Game MVP

A real-time multiplayer UNO card game built with React, Vite, Express, and
Socket.IO.

## Project Structure

```
/
├── backend/          # Node.js + Express server
│   ├── server.js
│   ├── socket.js
│   ├── gameLogic.js
│   ├── deck.js
│   ├── store.js
│   ├── utils.js
│   ├── constants.js
│   ├── package.json
│   └── node_modules/
├── frontend/         # React + Vite client
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── node_modules/
├── endpoints.md      # API endpoint documentation
└── prompt.md         # Architecture and design spec
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm start          # Start on http://localhost:4000
npm run dev        # Start with auto-reload (nodemon)
npm test           # Run backend tests
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # Start Vite dev server on http://localhost:5173
npm run build      # Build for production
```

## Game Features

- ✅ 2–6 players per room
- ✅ Real-time multiplayer using Socket.IO
- ✅ Classic UNO rules (number, skip, reverse, draw2, draw4, wild)
- ✅ Backend-authoritative game logic
- ✅ Card validity checking (invalid cards are disabled in UI)
- ✅ Room creation and joining via 4-character room codes
- ✅ Turn-based play system
- ✅ Winner detection

## Running Both

In separate terminals:

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev
```

Then open `http://localhost:5173` in your browser.

## Testing

```bash
cd backend && npm test
```

## Architecture

- **Backend is authoritative**: all game logic runs server-side
- **Frontend never validates rules**: it only sends intents/actions
- **State broadcast**: server sends updated state to all clients via Socket.IO
- **In-memory storage**: rooms and players stored in `Map()` during gameplay
