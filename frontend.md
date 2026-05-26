# UNO Frontend MVP Design Spec

## 🎨 Visual Design System

### Overall Style

- Casual tabletop card game UI
- UNO-style bright colors
- Floating cards with soft shadows
- Slight 3D depth (hover lift effect)
- Wooden table background feel (or textured green table)

---

## 🎯 Core Color Palette

### UNO Card Colors

```txt
Red:    #E53935
Yellow: #FDD835
Green:  #43A047
Blue:   #1E88E5
```

### UI Neutrals

```txt
Table background: #2E7D32 (or wood texture)
Card white: #FFFFFF
Text: #1C1C1C
Disabled: #BDBDBD
```

### Game States

```txt
Valid move glow: #00E676
Invalid move: #FF5252
Active player highlight: #FFC107
```

---

## 🧱 Layout Structure

### Game Screen Layout

```txt
------------------------------------------------
| Opponents (top row)                          |
| avatar + name + card count                  |
------------------------------------------------
|                                              |
|            Discard Pile (center)            |
|        + current color indicator            |
|                                              |
------------------------------------------------
| Your Hand (bottom fixed scroll)             |
| clickable cards                             |
------------------------------------------------
| Action Bar                                  |
| [Draw Card] [UNO Button]                    |
------------------------------------------------
```

---

## 🃏 Card UI Rules

### Card States

- Normal → white/colored card
- Hover → lift + shadow increase
- Disabled → opacity 50–70%
- Selected → glow border

### Interaction

- Click card → attempt play
- Click deck → draw card (only your turn)

---

## 👥 Player UI

### Opponents

- Avatar circle
- Name below avatar
- Card count badge
- Highlight current player

### Current Player Indicator

- Pulsing glow ring
- Highlight border animation

---

## 🔄 Turn System UX

### Your Turn

- Full opacity hand
- Glow effect on playable cards (optional)

### Not Your Turn

- Hand dimmed slightly
- Cards non-clickable

---

## 🎬 Animations (Lightweight MVP)

- Card play → move to center pile (fast transition)
- Draw card → slide from deck to hand
- Turn change → fade highlight swap
- Invalid move → shake animation

---

## 📡 Frontend State Usage

Frontend ONLY uses:

```txt
room.currentPlayer
room.players (id, name, cardCount)
room.myHand
room.topCard
room.currentColor
room.status
```

No rule logic on frontend.

---

## 🧩 Component Breakdown

### Core Components

- `Game.jsx` → main orchestrator
- `Hand.jsx` → user cards
- `Card.jsx` → single card UI
- `Opponent.jsx` → other players
- `TopCard.jsx` → discard pile
- `ColorPicker.jsx` → wild card UI
- `ActionBar.jsx` → draw + UNO buttons

---

## 🔌 Interaction Rules

### Card Play

- Emit `play_card`
- Pass cardId + chosenColor (if wild)

### Draw Card

- Emit `draw_card`

### UNO Button

- Enabled when `hand.length === 2`
- Emits `say_uno`

---

## 📱 Layout Priority

Recommended MVP approach:

```txt
Desktop-first (primary)
→ easily playable in browser
→ better debugging for multiplayer
```

---

## 🎯 UX Goals

- Instant readability of game state
- Zero confusion about turn
- Fast interactions (<100ms feel)
- Minimal UI clutter
