const { COLORS, CARD_TYPES } = require('./constants');

function createDeck() {
  const deck = [];
  let idCounter = 0;

  for (const color of COLORS) {
    deck.push({
      id: `${color}-0-${idCounter++}`,
      color,
      type: CARD_TYPES.NUMBER,
      value: 0,
    });

    for (let value = 1; value <= 9; value += 1) {
      for (let copy = 0; copy < 2; copy += 1) {
        deck.push({
          id: `${color}-${value}-${idCounter++}`,
          color,
          type: CARD_TYPES.NUMBER,
          value,
        });
      }
    }

    for (const type of [CARD_TYPES.SKIP, CARD_TYPES.REVERSE, CARD_TYPES.DRAW2]) {
      for (let copy = 0; copy < 2; copy += 1) {
        deck.push({
          id: `${color}-${type}-${idCounter++}`,
          color,
          type,
        });
      }
    }
  }

  for (let i = 0; i < 4; i += 1) {
    deck.push({
      id: `wild-${i}-${idCounter++}`,
      color: 'wild',
      type: CARD_TYPES.WILD,
    });
    deck.push({
      id: `draw4-${i}-${idCounter++}`,
      color: 'wild',
      type: CARD_TYPES.DRAW4,
    });
  }

  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

module.exports = {
  createDeck,
  shuffleDeck,
};
