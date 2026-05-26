const { COLORS } = require('./constants');

function createRoomId() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < 4; i += 1) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

function getPublicRoomInfo(room) {
  return {
    id: room.id,
    status: room.status,
    playerCount: room.players.length,
  };
}

function serializeRoomState(room, playerId) {
  const myPlayer = room.players.find((player) => player.id === playerId);
  return {
    roomId: room.id,
    topCard: room.discardPile[room.discardPile.length - 1] || null,
    currentColor: room.currentColor,
    currentPlayer: room.players[room.currentPlayer]?.id || null,
    direction: room.direction,
    status: room.status,
    players: room.players.map((player) => ({
      id: player.id,
      name: player.name,
      cardCount: player.hand.length,
    })),
    myHand: myPlayer ? [...myPlayer.hand] : [],
    winner: room.winner,
  };
}

function normalizePlayerName(name) {
  if (!name || typeof name !== 'string') return 'Player';
  return name.trim().substring(0, 20) || 'Player';
}

function isValidColor(color) {
  return COLORS.includes(color);
}

module.exports = {
  createRoomId,
  getPublicRoomInfo,
  serializeRoomState,
  normalizePlayerName,
  isValidColor,
};
