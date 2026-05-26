```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Multiplayer Card Game UI</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="game-board">
      <!-- CENTER GAME AREA -->
      <div class="table-center">
        <!-- DRAW + DISCARD STACK -->
        <div class="card-pile-area">
          <div class="pile draw-pile">
            <div class="card back"></div>
          </div>

          <div class="pile discard-pile">
            <div class="card front wild"></div>
          </div>
        </div>

        <!-- OPTIONAL GAME STATUS -->
        <div class="center-status">
          <div class="current-color red"></div>
          <div class="turn-indicator">
            PLAYER 1 TURN
          </div>
        </div>
      </div>

      <!-- PLAYER POSITIONS -->

      <!-- TOP PLAYER -->
      <div class="player-area player-top">
        <div class="player-info">
          <span class="player-name">PLAYER 2</span>
          <span class="card-count">7 Cards</span>
        </div>

        <div class="hand horizontal">
          <div class="card back"></div>
          <div class="card back"></div>
          <div class="card back"></div>
          <div class="card back"></div>
          <div class="card back"></div>
          <div class="card back"></div>
          <div class="card back"></div>
        </div>
      </div>

      <!-- TOP LEFT PLAYER -->
      <div class="player-area player-top-left">
        <div class="player-info">
          <span class="player-name">PLAYER 3</span>
        </div>

        <div class="hand vertical">
          <div class="card back small"></div>
          <div class="card back small"></div>
          <div class="card back small"></div>
          <div class="card back small"></div>
        </div>
      </div>

      <!-- TOP RIGHT PLAYER -->
      <div class="player-area player-top-right">
        <div class="player-info">
          <span class="player-name">PLAYER 4</span>
        </div>

        <div class="hand vertical">
          <div class="card back small"></div>
          <div class="card back small"></div>
          <div class="card back small"></div>
          <div class="card back small"></div>
        </div>
      </div>

      <!-- BOTTOM LEFT PLAYER -->
      <div class="player-area player-bottom-left">
        <div class="player-info">
          <span class="player-name">PLAYER 5</span>
        </div>

        <div class="hand diagonal-left">
          <div class="card back small"></div>
          <div class="card back small"></div>
          <div class="card back small"></div>
        </div>
      </div>

      <!-- BOTTOM RIGHT PLAYER -->
      <div class="player-area player-bottom-right">
        <div class="player-info">
          <span class="player-name">PLAYER 6</span>
        </div>

        <div class="hand diagonal-right">
          <div class="card back small"></div>
          <div class="card back small"></div>
          <div class="card back small"></div>
        </div>
      </div>

      <!-- MAIN USER -->
      <div class="player-area player-self">
        <div class="player-info self-info">
          <span class="player-name">YOU</span>
          <span class="card-count">8 Cards</span>
        </div>

        <div class="hand self-hand">
          <div class="card green">4</div>
          <div class="card red">⟳</div>
          <div class="card green">⊘</div>
          <div class="card red">5</div>
          <div class="card red">+2</div>
          <div class="card wild">+4</div>
          <div class="card wild">+4</div>
          <div class="card blue">5</div>
        </div>
      </div>
    </div>
  </body>
</html>
```

---

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: Arial, Helvetica, sans-serif;
  background: #03172d;
}

/* MAIN BOARD */

.game-board {
  position: relative;
  width: 100%;
  height: 100vh;

  background: radial-gradient(
    circle at center,
    #0676d6 0%,
    #04539a 35%,
    #032d58 70%,
    #021528 100%
  );
}

/* =========================================
   CENTER GAME TABLE
========================================= */

.table-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.card-pile-area {
  display: flex;
  align-items: center;
  gap: 22px;
}

.pile {
  width: 120px;
  height: 180px;
  position: relative;
}

/* =========================================
   CARD BASE
========================================= */

.card {
  width: 100px;
  height: 150px;
  border-radius: 14px;

  border: 4px solid white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 48px;
  font-weight: bold;

  color: white;

  position: relative;

  user-select: none;
}

/* CARD BACK */

.back {
  background: repeating-linear-gradient(
    45deg,
    #111,
    #111 6px,
    #1f1f1f 6px,
    #1f1f1f 12px
  );

  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

/* CARD COLORS */

.red {
  background: #d62828;
}

.green {
  background: #38b000;
}

.blue {
  background: #1982c4;
}

.yellow {
  background: #ffca3a;
  color: #222;
}

.wild {
  background: linear-gradient(
    135deg,
    red 0% 25%,
    yellow 25% 50%,
    blue 50% 75%,
    green 75% 100%
  );
}

/* =========================================
   CENTER STATUS
========================================= */

.center-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.current-color {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 3px solid white;
}

.turn-indicator {
  color: white;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
}

/* =========================================
   PLAYER AREAS
========================================= */

.player-area {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.player-info {
  color: white;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
}

/* =========================================
   PLAYER POSITIONS
========================================= */

/* TOP */

.player-top {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

/* MAIN USER */

.player-self {
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

/* LEFT */

.player-top-left {
  top: 160px;
  left: 20px;
}

.player-bottom-left {
  bottom: 160px;
  left: 20px;
}

/* RIGHT */

.player-top-right {
  top: 160px;
  right: 20px;
}

.player-bottom-right {
  bottom: 160px;
  right: 20px;
}

/* =========================================
   HAND LAYOUTS
========================================= */

.hand {
  display: flex;
  position: relative;
}

/* MAIN USER HAND */

.self-hand {
  align-items: flex-end;
}

.self-hand .card {
  margin-left: -18px;
  transition: 0.2s;
  cursor: pointer;
}

.self-hand .card:hover {
  transform: translateY(-20px);
  z-index: 10;
}

/* TOP PLAYER */

.horizontal .card {
  margin-left: -45px;
}

/* VERTICAL PLAYERS */

.vertical {
  flex-direction: column;
}

.vertical .card {
  margin-top: -90px;
}

/* DIAGONAL STACKS */

.diagonal-left .card:nth-child(1) {
  transform: rotate(-18deg);
}

.diagonal-left .card:nth-child(2) {
  transform: rotate(-8deg);
  margin-left: 20px;
}

.diagonal-left .card:nth-child(3) {
  transform: rotate(4deg);
  margin-left: 40px;
}

.diagonal-right .card:nth-child(1) {
  transform: rotate(18deg);
}

.diagonal-right .card:nth-child(2) {
  transform: rotate(8deg);
  margin-left: -20px;
}

.diagonal-right .card:nth-child(3) {
  transform: rotate(-4deg);
  margin-left: -40px;
}

/* =========================================
   SMALL CARDS
========================================= */

.small {
  width: 70px;
  height: 105px;
  font-size: 24px;
}

/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 1200px) {
  .card {
    width: 80px;
    height: 120px;
    font-size: 38px;
  }

  .small {
    width: 55px;
    height: 85px;
  }

  .pile {
    width: 90px;
    height: 130px;
  }

  .player-top-left,
  .player-bottom-left {
    left: 8px;
  }

  .player-top-right,
  .player-bottom-right {
    right: 8px;
  }
}

@media (max-width: 900px) {
  .player-top-left,
  .player-bottom-left,
  .player-top-right,
  .player-bottom-right {
    display: none;
  }

  .self-hand .card {
    margin-left: -28px;
  }
}
```

### UI Structure Explanation

The layout is designed around a circular multiplayer card-table concept.

---

# 1. Main Layout Structure

The entire screen is a single game board with:

- Deep blue glowing casino/table background
- Central play area
- Players arranged around the edges
- Bottom player is always the local user
- Supports up to 6 players

The screen is divided like this:

```text
            PLAYER 2

   PLAYER 3          PLAYER 4


           CENTER TABLE


   PLAYER 5          PLAYER 6

              YOU
```

---

# 2. Center Table Area

The middle contains:

- Draw pile
- Discard pile
- Current color indicator
- Turn indicator

This should always remain perfectly centered regardless of screen size.

The discard pile is visually highlighted because it is the active gameplay area.

---

# 3. Player Layout Logic

## Bottom Center → Main User

This is the largest hand.

Requirements:

- Full card visibility
- Hover animation
- Fan-like overlap
- Interactive cards

---

## Top Center → Opponent

Cards face-down horizontally.

Only:

- Card backs
- Username
- Card count

---

## Left/Right Players

Use:

- Vertical stacks
- Smaller cards
- Slight overlap

This saves screen space while supporting 6 players.

---

# 4. Card Design

Each card:

- White thick border
- Rounded corners
- Strong saturated colors
- Large centered symbol/number

Special cards:

- Reverse
- Skip
- Draw Two
- Wild
- Wild +4

should have:

- High contrast
- Bigger iconography

---
