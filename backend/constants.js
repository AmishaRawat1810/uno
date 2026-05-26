const COLORS = ['red', 'blue', 'green', 'yellow'];
const SPECIAL_TYPES = ['skip', 'reverse', 'draw2', 'wild', 'draw4'];
const CARD_TYPES = {
  NUMBER: 'number',
  SKIP: 'skip',
  REVERSE: 'reverse',
  DRAW2: 'draw2',
  WILD: 'wild',
  DRAW4: 'draw4',
};
const ROOM_STATUS = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  FINISHED: 'finished',
};
const INITIAL_HAND_SIZE = 7;

module.exports = {
  COLORS,
  SPECIAL_TYPES,
  CARD_TYPES,
  ROOM_STATUS,
  INITIAL_HAND_SIZE,
};
