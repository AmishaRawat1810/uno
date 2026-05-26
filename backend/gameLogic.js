const { createDeck, shuffleDeck } = require('./deck');
const { CARD_TYPES, ROOM_STATUS, INITIAL_HAND_SIZE } = require('./constants');

function ensureDeck(room) {
  if (room.deck.length > 0) {
    return;
  }

  const topCard = room.discardPile.pop();
  room.deck = shuffleDeck([...room.discardPile]);
  room.discardPile = topCard ? [topCard] : [];
}

function drawCards(room, count) {
  ensureDeck(room);
  const drawn = [];

  while (drawn.length < count && room.deck.length > 0) {
    drawn.push(room.deck.pop());
  }

  return drawn;
}

function dealInitialHands(room) {
  for (const player of room.players) {
    player.hand = drawCards(room, INITIAL_HAND_SIZE);
    player.saidUno = false;
  }
}

function getTopCard(room) {
  return room.discardPile[room.discardPile.length - 1] || null;
}

function isStackCard(card) {
  return card.type === CARD_TYPES.DRAW2 || card.type === CARD_TYPES.DRAW4;
}

function isValidMove(card, topCard, currentColor, drawStack = 0) {
  if (!card || !topCard) return false;

  if (drawStack > 0) {
    return isStackCard(card);
  }

  if (card.type === CARD_TYPES.WILD || card.type === CARD_TYPES.DRAW4) {
    return true;
  }

  if (card.color === currentColor) {
    return true;
  }

  if (card.type === CARD_TYPES.NUMBER && topCard.type === CARD_TYPES.NUMBER) {
    return card.value === topCard.value;
  }

  return card.type === topCard.type;
}

function advanceTurn(room, steps = 1) {
  const playerCount = room.players.length;
  if (playerCount === 0) return;
  room.currentPlayer = ((room.currentPlayer + steps * room.direction) % playerCount + playerCount) % playerCount;
}

function initializeGame(room) {
  room.deck = shuffleDeck(createDeck());
  room.discardPile = [];
  room.currentPlayer = 0;
  room.direction = 1;
  room.currentColor = null;
  room.drawStack = 0;
  room.winner = null;
  room.status = ROOM_STATUS.PLAYING;

  dealInitialHands(room);

  let startingCard = drawCards(room, 1)[0];
  while (startingCard && (startingCard.type === CARD_TYPES.WILD || startingCard.type === CARD_TYPES.DRAW4)) {
    room.deck.unshift(startingCard);
    room.deck = shuffleDeck(room.deck);
    startingCard = drawCards(room, 1)[0];
  }

  if (startingCard) {
    room.discardPile.push(startingCard);
    room.currentColor = startingCard.color === 'wild' ? 'red' : startingCard.color;
  }
}

function applyCardEffect(card, room) {
  if (card.type === CARD_TYPES.SKIP) {
    advanceTurn(room, 1);
    return;
  }

  if (card.type === CARD_TYPES.REVERSE) {
    if (room.players.length === 2) {
      advanceTurn(room, 1);
      return;
    }
    room.direction *= -1;
    advanceTurn(room, 1);
    return;
  }

  if (card.type === CARD_TYPES.DRAW2) {
    room.drawStack += 2;
    advanceTurn(room, 1);
    return;
  }

  if (card.type === CARD_TYPES.DRAW4) {
    room.drawStack += 4;
    advanceTurn(room, 1);
    return;
  }

  advanceTurn(room, 1);
}

function playCard(room, playerId, cardId, chosenColor) {
  if (room.status !== ROOM_STATUS.PLAYING) {
    return { success: false, message: 'Game is not active' };
  }

  const player = room.players.find((item) => item.id === playerId);
  if (!player) {
    return { success: false, message: 'Player not found' };
  }

  if (room.players[room.currentPlayer].id !== playerId) {
    return { success: false, message: 'Not your turn' };
  }

  const cardIndex = player.hand.findIndex((card) => card.id === cardId);
  if (cardIndex === -1) {
    return { success: false, message: 'Card not in hand' };
  }

  const card = player.hand[cardIndex];
  const topCard = getTopCard(room);
  if (!isValidMove(card, topCard, room.currentColor, room.drawStack)) {
    return { success: false, message: 'Invalid move' };
  }

  if ((card.type === CARD_TYPES.WILD || card.type === CARD_TYPES.DRAW4) && !chosenColor) {
    return { success: false, message: 'Must choose a color for wild card' };
  }

  player.hand.splice(cardIndex, 1);
  room.discardPile.push(card);

  if (card.type === CARD_TYPES.WILD || card.type === CARD_TYPES.DRAW4) {
    room.currentColor = chosenColor;
  } else {
    room.currentColor = card.color;
  }

  if (player.hand.length === 0) {
    room.status = ROOM_STATUS.FINISHED;
    room.winner = playerId;
    return { success: true, winner: playerId };
  }

  applyCardEffect(card, room);
  return { success: true };
}

function drawCard(room, playerId) {
  if (room.status !== ROOM_STATUS.PLAYING) {
    return { success: false, message: 'Game is not active' };
  }

  const player = room.players.find((item) => item.id === playerId);
  if (!player) {
    return { success: false, message: 'Player not found' };
  }

  if (room.players[room.currentPlayer].id !== playerId) {
    return { success: false, message: 'Not your turn' };
  }

  if (room.drawStack > 0) {
    const cards = drawCards(room, room.drawStack);
    player.hand.push(...cards);
    room.drawStack = 0;
    advanceTurn(room, 1);
    return { success: true, drawn: cards, drawStackResolved: true };
  }

  const cards = drawCards(room, 1);
  if (cards.length === 0) {
    return { success: false, message: 'No cards left to draw' };
  }

  player.hand.push(cards[0]);
  advanceTurn(room, 1);
  return { success: true, drawn: cards };
}

module.exports = {
  initializeGame,
  isValidMove,
  playCard,
  drawCard,
  getTopCard,
  drawCards,
};
