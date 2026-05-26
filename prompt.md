# UNO Web App MVP Architecture

## Tech Stack

### Frontend

- React
- Vite
- socket.io-client

### Backend

- Node.js
- Express
- Socket.IO

### Storage

- In-memory state using `Map()`

---

# Core Architecture

## Principles

- Backend is authoritative
- Frontend never validates rules
- All game logic is pure functions
- Clients only emit intents/actions
- Backend broadcasts updated state

---

# Game Modes (MVP)

Supported:

- 2–6 players
- Classic UNO rules
- Single room per game
- Real-time multiplayer

Not Supported:

- AI bots
- Ranked matchmaking
- Persistence/database
- Reconnect recovery
- Stacking house rules
- Jump-in
- 7-0 rules

---

# Data Model

## Room Object

```js
{
  id: "ABCD",
  players: [],
  deck: [],
  discardPile: [],
  currentPlayer: 0,
  direction: 1,
  currentColor: "red",
  status: "waiting", // waiting | playing | finished
  winner: null,
  drawStack: 0
}
```

---

## Player Object

```js
{
  id: socket.id,
  name: "John",
  hand: [],
  saidUno: false,
  connected: true
}
```

---

## Card Structure

```js
{
  id: "red-5",
  color: "red",
  type: "number", // number | skip | reverse | draw2 | wild | draw4
  value: 5
}
```

Examples:

```js
{ color: "red", type: "skip" }
{ color: "wild", type: "draw4" }
```

---

# Backend Folder Structure

```txt
backend/
│
├── server.js
├── socket.js
├── store.js
├── gameManager.js
├── gameLogic.js
├── deck.js
├── constants.js
└── utils.js
```

---

# Frontend Folder Structure

```txt
frontend/
│
├── App.jsx
├── Lobby.jsx
├── Game.jsx
├── components/
│   ├── Hand.jsx
│   ├── Card.jsx
│   ├── Opponent.jsx
│   ├── TopCard.jsx
│   └── ColorPicker.jsx
│
├── hooks/
│   └── useSocket.js
│
└── socket.js
```

---

# Socket Events

## Client → Server

### create_room

```js
{
  playerName;
}
```

Response:

```js
{
  roomId;
}
```

---

### join_room

```js
{
  roomId, playerName;
}
```

---

### start_game

Only room owner can start.

```js
{
  roomId;
}
```

---

### play_card

```js
{
  roomId, cardId, chosenColor; // only for wild cards
}
```

---

### draw_card

```js
{
  roomId;
}
```

---

### say_uno

```js
{
  roomId;
}
```

---

### leave_room

```js
{
  roomId;
}
```

---

# Server → Client Events

## room_updated

Main synchronized game state.

```js
{
  room;
}
```

---

## game_started

```js
{
  room;
}
```

---

## invalid_move

```js
{
  message;
}
```

---

## player_won

```js
{
  playerId;
}
```

---

## player_joined

```js
{
  playerName;
}
```

---

## player_left

```js
{
  playerId;
}
```

---

# Game Rules

## Match Rules

A card is playable if:

```txt
same color
OR same value/type
OR wild card
```

---

## Turn Rules

Only current player can:

- play card
- draw card

Otherwise:

- emit invalid_move

---

## Draw Rules

If player has no valid card:

- must draw 1 card

If drawn card is playable:

- player may play it immediately
- OR skip voluntarily

MVP Simplification:

- auto-end turn after draw

---

## Reverse Rules

### 3+ players

Changes direction:

```txt
1 -> clockwise
-1 -> counter-clockwise
```

### 2 players

Acts as Skip.

---

## Skip Rules

Next player loses turn.

---

## Draw Two Rules

Next player:

- draws 2 cards
- loses turn

No stacking.

---

## Wild Rules

Player chooses:

- red
- blue
- green
- yellow

Backend updates:

```js
room.currentColor = chosenColor;
```

---

## Wild Draw Four Rules

Player:

- chooses color

Next player:

- draws 4 cards
- loses turn

MVP simplification:

- no challenge system

---

## UNO Rules

When player has 1 card:

- must emit `say_uno`

If player forgets:

- no penalty in MVP

---

## Win Condition

Player wins when:

```js
player.hand.length === 0;
```

Game status becomes:

```js
finished;
```

---

# Game Flow

## Lobby Flow

```txt
Create Room
→ Share Room ID
→ Players Join
→ Host Starts Game
```

---

## Game Start Flow

Backend:

1. create deck
2. shuffle
3. deal 7 cards/player
4. initialize discard pile
5. choose first player
6. broadcast room_updated

---

# Turn Flow

```txt
Player Turn
↓
play_card OR draw_card
↓
Backend validates
↓
Apply effects
↓
Advance turn
↓
Broadcast updated state
```

---

# Core Functions

## gameLogic.js

### createDeck()

Returns full UNO deck.

---

### shuffleDeck(deck)

Fisher-Yates shuffle.

---

### dealCards(players, deck)

Deals 7 cards each.

---

### isValidMove(card, topCard, currentColor)

Returns boolean.

---

### playCard(room, playerId, cardId)

Responsibilities:

- validate turn
- validate move
- remove card from hand
- apply special effects
- update discard pile
- update color
- check winner
- advance turn

---

### drawCard(room, playerId)

Responsibilities:

- draw from deck
- reshuffle discard if needed
- add card to hand
- end turn

---

### nextPlayer(room, steps = 1)

Handles:

- reverse direction
- skip effects

---

### applyCardEffect(card, room)

Handles:

- skip
- reverse
- draw2
- draw4

---

# Turn Algorithm

## Normal Turn

```txt
Current Player
↓
Validate Action
↓
Apply Card
↓
Apply Effects
↓
Move To Next Player
↓
Broadcast State
```

---

## Draw Card Flow

```txt
Player Draws
↓
Card Added To Hand
↓
Turn Ends
↓
Next Player
```

---

# State Broadcast Optimization

Do NOT send full opponent hands.

Instead:

```js
{
  players: [
    {
      id,
      name,
      cardCount,
    },
  ];
}
```

Current player receives:

- full own hand

Others receive:

- only counts

---

# Recommended State Shape Sent To Client

```js
{
  roomId,
    topCard,
    currentColor,
    currentPlayer,
    direction,
    players,
    myHand,
    status;
}
```

---

# store.js

```js
export const rooms = new Map();
```

Key:

```js
roomId;
```

Value:

```js
roomObject;
```

---

# Cleanup Rules

When player disconnects:

- remove from room

If room empty:

- delete room

If game in progress:

- end game immediately (MVP)

---

# Minimal Validation Rules

Backend must validate:

- room exists
- player exists
- game started
- correct turn
- valid card
- chosenColor exists for wild
- card belongs to player

Never trust frontend.

---

# Recommended Constants

## Colors

```js
["red", "blue", "green", "yellow"];
```

---

## Special Types

```js
[
  "skip",
  "reverse",
  "draw2",
  "wild",
  "draw4",
];
```

---

# MVP Optimizations (Important)

To save Copilot tokens:

## Avoid

- Redux
- Database
- Authentication
- Complex state machines
- Reconnection logic
- Microservices
- Testing setup
- TypeScript initially

---

## Keep Logic

- inside pure utility functions
- small files
- single room state object

---

# Suggested Build Order

## Phase 1

- Socket connection
- Room creation/join

## Phase 2

- Deck generation
- Deal cards

## Phase 3

- Turn system

## Phase 4

- Card validation

## Phase 5

- Special cards

## Phase 6

- Winner detection

## Phase 7

- UI polish

---

# Token-Efficient Copilot Strategy

Instead of asking:

```txt
Build full UNO backend
```

Ask:

```txt
Create playCard(room, playerId, cardId) for UNO using this room schema...
```

Small targeted prompts save massive tokens.

Best prompt pattern:

```txt
Generate ONLY the function.
No explanation.
Use existing room schema.
Do not refactor unrelated code.
```
