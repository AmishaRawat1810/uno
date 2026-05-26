# UNO Game Rules (MVP + Correct Action Cards)

---

# 🎯 Objective

First player to:

```txt
play all cards in hand
```

---

# 🃏 Card Types

## Number Cards

- 0–9 in 4 colors:
  - Red
  - Yellow
  - Green
  - Blue

---

## Action Cards

### 1. Skip

- Next player loses turn

---

### 2. Reverse

- Reverses turn direction
- 2 players → acts as Skip

---

### 3. Draw Two (➕2)

- Next player draws 2 cards
- Next player loses turn
- Can be stacked with +2 or +4

---

## Wild Cards

### 4. Wild

- Player chooses color

---

### 5. Wild Draw Four (➕4 / Draw +4)

- Player chooses color
- Next player draws 4 cards
- Next player loses turn
- Can be stacked with +2 or +4

---

# 🚨 STACKING RULE (IMPORTANT)

Stacking applies ONLY to:

```txt
Draw Two (+2)
Wild Draw Four (+4)
```

---

## Stack Rule

A player may respond to a +2 or +4 by playing:

```txt
+2 OR +4
```

Color does NOT matter.

---

## Stack Accumulation

```txt id="stack"
drawStack += 2 or 4 per card played
```

Example:

```txt
+2 → +4 → +2 = drawStack = 8
```

---

## Stack Resolution

When stacking ends:

```txt
player draws total drawStack
turn skips to next player
drawStack resets to 0
```

---

# 🔁 Turn Rules

On a turn, player may:

## Play card if:

```txt
same color OR same number/type OR wild
```

## OR draw:

- Draw 1 card
- End turn (MVP simplified behavior)

---

# ⏭ Skip Rule

- Next player loses turn

---

# 🔁 Reverse Rule

- Changes direction
- 2 players → acts as Skip

---

# 🌈 Wild Rule

- Player chooses next color

---

# 🏆 Win Condition

```txt
hand.length === 0
```

---

# ⚙️ Backend Rule

Backend must track:

- drawStack
- currentPlayer
- direction
- validation of +2 / +4
- discard pile

---

# 🚫 MVP Exclusions

- +4 challenge rule ❌
- scoring system ❌
- timers ❌
- reconnection recovery ❌
