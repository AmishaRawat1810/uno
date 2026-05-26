const { rooms } = require('./store');
const { createRoomId, serializeRoomState, normalizePlayerName, isValidColor } = require('./utils');
const { initializeGame, playCard, drawCard } = require('./gameLogic');
const { ROOM_STATUS } = require('./constants');

function sendRoomUpdate(io, room) {
  for (const player of room.players) {
    const socket = io.sockets.sockets.get(player.id);
    if (!socket) continue;
    socket.emit('room_updated', serializeRoomState(room, player.id));
  }
}

function findRoomBySocketId(socketId) {
  for (const room of rooms.values()) {
    if (room.players.some((player) => player.id === socketId)) {
      return room;
    }
  }
  return null;
}

function removePlayerFromRoom(room, socketId) {
  const index = room.players.findIndex((player) => player.id === socketId);
  if (index === -1) {
    return null;
  }

  const [removedPlayer] = room.players.splice(index, 1);
  if (room.players.length === 0) {
    rooms.delete(room.id);
    return removedPlayer;
  }

  if (room.status === ROOM_STATUS.PLAYING) {
    room.status = ROOM_STATUS.FINISHED;
    room.winner = null;
  }

  if (room.currentPlayer >= room.players.length) {
    room.currentPlayer = 0;
  }

  return removedPlayer;
}

function initSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('create_room', (data, callback) => {
      const playerName = normalizePlayerName(data?.playerName);
      const roomId = createRoomId();
      const room = {
        id: roomId,
        status: ROOM_STATUS.WAITING,
        players: [
          {
            id: socket.id,
            name: playerName,
            hand: [],
            saidUno: false,
            connected: true,
          },
        ],
        deck: [],
        discardPile: [],
        currentPlayer: 0,
        direction: 1,
        currentColor: null,
        winner: null,
        drawStack: 0,
      };

      rooms.set(roomId, room);
      socket.join(roomId);
      sendRoomUpdate(io, room);
      if (typeof callback === 'function') {
        callback({ success: true, roomId });
      }
    });

    socket.on('join_room', (data, callback) => {
      const { roomId, playerName } = data || {};
      const room = rooms.get(roomId);
      if (!room) {
        return callback?.({ success: false, message: 'Room not found' });
      }

      if (room.status !== ROOM_STATUS.WAITING) {
        return callback?.({ success: false, message: 'Game already started' });
      }

      if (room.players.length >= 6) {
        return callback?.({ success: false, message: 'Room is full' });
      }

      const normalized = normalizePlayerName(playerName);
      const player = {
        id: socket.id,
        name: normalized,
        hand: [],
        saidUno: false,
        connected: true,
      };

      room.players.push(player);
      socket.join(roomId);
      io.to(roomId).emit('player_joined', { playerName: normalized });
      sendRoomUpdate(io, room);
      if (typeof callback === 'function') {
        callback({ success: true });
      }
    });

    socket.on('start_game', (data, callback) => {
      const { roomId } = data || {};
      const room = rooms.get(roomId);
      if (!room) {
        return callback?.({ success: false, message: 'Room not found' });
      }

      if (room.players[0]?.id !== socket.id) {
        return callback?.({ success: false, message: 'Only the host can start the game' });
      }

      if (room.players.length < 2) {
        return callback?.({ success: false, message: 'Need at least 2 players to start' });
      }

      initializeGame(room);
      sendRoomUpdate(io, room);
      io.to(roomId).emit('game_started', { success: true });
      if (typeof callback === 'function') {
        callback({ success: true });
      }
    });

    socket.on('play_card', (data, callback) => {
      const { roomId, cardId, chosenColor } = data || {};
      const room = rooms.get(roomId);
      if (!room) {
        return callback?.({ success: false, message: 'Room not found' });
      }

      const result = playCard(room, socket.id, cardId, chosenColor);
      if (!result.success) {
        socket.emit('invalid_move', { message: result.message });
        return callback?.({ success: false, message: result.message });
      }

      sendRoomUpdate(io, room);
      if (result.winner) {
        io.to(roomId).emit('player_won', { playerId: result.winner });
      }
      return callback?.({ success: true });
    });

    socket.on('draw_card', (data, callback) => {
      const { roomId } = data || {};
      const room = rooms.get(roomId);
      if (!room) {
        return callback?.({ success: false, message: 'Room not found' });
      }

      const result = drawCard(room, socket.id);
      if (!result.success) {
        socket.emit('invalid_move', { message: result.message });
        return callback?.({ success: false, message: result.message });
      }

      sendRoomUpdate(io, room);
      return callback?.({ success: true });
    });

    socket.on('say_uno', (data, callback) => {
      const { roomId } = data || {};
      const room = rooms.get(roomId);
      if (!room) {
        return callback?.({ success: false, message: 'Room not found' });
      }

      const player = room.players.find((item) => item.id === socket.id);
      if (player) {
        player.saidUno = true;
        sendRoomUpdate(io, room);
      }

      return callback?.({ success: true });
    });

    function leaveRoom(socket, callback) {
      const room = findRoomBySocketId(socket.id);
      if (!room) {
        return callback?.({ success: false, message: 'Not in a room' });
      }

      const player = removePlayerFromRoom(room, socket.id);
      socket.leave(room.id);
      if (room.players.length > 0) {
        io.to(room.id).emit('player_left', { playerId: player.id });
        sendRoomUpdate(io, room);
      }

      if (typeof callback === 'function') {
        callback({ success: true });
      }
    }

    socket.on('leave_room', (data, callback) => {
      leaveRoom(socket, callback);
    });

    socket.on('disconnect', () => {
      const room = findRoomBySocketId(socket.id);
      if (!room) {
        return;
      }
      const player = removePlayerFromRoom(room, socket.id);
      if (!player) {
        return;
      }

      if (room.players.length > 0) {
        io.to(room.id).emit('player_left', { playerId: player.id });
        sendRoomUpdate(io, room);
      }
    });
  });
}

module.exports = {
  initSocketHandlers,
};
