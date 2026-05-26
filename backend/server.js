const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { rooms } = require('./store');
const { initSocketHandlers } = require('./socket');
const { createRoomId } = require('./utils');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/rooms', (req, res) => {
  const { playerName } = req.body || {};
  const roomId = createRoomId();
  rooms.set(roomId, {
    id: roomId,
    status: 'waiting',
    players: [],
    deck: [],
    discardPile: [],
    currentPlayer: 0,
    direction: 1,
    currentColor: null,
    winner: null,
    drawStack: 0,
    ownerName: playerName || null,
  });

  res.status(201).json({ roomId });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.json({
    id: room.id,
    status: room.status,
    playerCount: room.players.length,
  });
});

app.delete('/api/rooms/:roomId', (req, res) => {
  const deleted = rooms.delete(req.params.roomId);
  res.json({ success: deleted });
});

initSocketHandlers(io);

const port = process.env.PORT || 4000;
if (require.main === module) {
  server.listen(port, () => {
    console.log(`UNO backend running on http://localhost:${port}`);
  });
}

module.exports = {
  app,
  server,
  io,
};
