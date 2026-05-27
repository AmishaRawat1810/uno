const { initializeGame, isValidMove, playCard, drawCard } = require('./gameLogic');

describe('UNO game logic', () => {
  test('initializeGame deals 7 cards per player and sets a top card', () => {
    const room = {
      players: [
        { id: 'player1', hand: [] },
        { id: 'player2', hand: [] },
      ],
      deck: [],
      discardPile: [],
      currentPlayer: 0,
      direction: 1,
      currentColor: null,
      drawStack: 0,
      status: 'waiting',
      winner: null,
    };

    initializeGame(room);

    expect(room.status).toBe('playing');
    expect(room.players[0].hand).toHaveLength(7);
    expect(room.players[1].hand).toHaveLength(7);
    expect(room.discardPile).toHaveLength(1);
    expect(room.currentColor).toBeTruthy();
    expect(typeof room.currentColor).toBe('string');
  });

  test('isValidMove allows same color, same number, and wild cards', () => {
    const topCard = { color: 'red', type: 'number', value: 5 };
    expect(isValidMove({ color: 'red', type: 'number', value: 3 }, topCard, 'red')).toBe(true);
    expect(isValidMove({ color: 'green', type: 'number', value: 5 }, topCard, 'red')).toBe(true);
    expect(isValidMove({ color: 'wild', type: 'wild' }, topCard, 'red')).toBe(true);
    expect(isValidMove({ color: 'blue', type: 'skip' }, topCard, 'red')).toBe(false);
  });

  test('isValidMove allows stack cards during active draw stack and rejects normal cards', () => {
    const topCard = { color: 'red', type: 'draw4' };
    expect(isValidMove({ color: 'green', type: 'draw2' }, topCard, 'blue', 6)).toBe(true);
    expect(isValidMove({ color: 'yellow', type: 'draw4' }, topCard, 'blue', 6)).toBe(true);
    expect(isValidMove({ color: 'red', type: 'skip' }, topCard, 'blue', 6)).toBe(false);
    expect(isValidMove({ color: 'red', type: 'number', value: 5 }, topCard, 'blue', 6)).toBe(false);
  });

  test('playCard rejects when play is invalid or not player turn', () => {
    const room = {
      status: 'playing',
      currentPlayer: 0,
      direction: 1,
      currentColor: 'red',
      discardPile: [{ color: 'red', type: 'number', value: 4 }],
      players: [
        { id: 'player1', hand: [{ id: 'blue-5', color: 'blue', type: 'number', value: 5 }] },
        { id: 'player2', hand: [] },
      ],
    };

    const notTurn = playCard(room, 'player2', 'blue-5', null);
    expect(notTurn.success).toBe(false);
    expect(notTurn.message).toBe('Not your turn');

    const invalid = playCard(room, 'player1', 'blue-5', null);
    expect(invalid.success).toBe(false);
    expect(invalid.message).toBe('Invalid move');
  });

  test('drawCard draws one card when deck has one card', () => {
    const room = {
      status: 'playing',
      currentPlayer: 0,
      direction: 1,
      currentColor: 'red',
      discardPile: [{ color: 'red', type: 'number', value: 4 }],
      deck: [{ id: 'red-3', color: 'red', type: 'number', value: 3 }],
      players: [
        { id: 'player1', hand: [] },
      ],
      drawStack: 0,
    };

    const result = drawCard(room, 'player1');
    expect(result.success).toBe(true);
    expect(room.players[0].hand).toHaveLength(1);
  });

  test('playCard skip advances two seats to skip the next player', () => {
    const room = {
      status: 'playing',
      currentPlayer: 0,
      direction: 1,
      currentColor: 'red',
      discardPile: [{ color: 'red', type: 'number', value: 1 }],
      players: [
        {
          id: 'player1',
          hand: [
            { id: 'red-skip', color: 'red', type: 'skip' },
            { id: 'red-5', color: 'red', type: 'number', value: 5 },
          ],
        },
        { id: 'player2', hand: [] },
        { id: 'player3', hand: [] },
      ],
      drawStack: 0,
    };

    const result = playCard(room, 'player1', 'red-skip', null);
    expect(result.success).toBe(true);
    expect(room.currentPlayer).toBe(2);
  });
});
