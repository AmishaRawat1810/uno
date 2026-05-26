# REST Endpoints

## Base URL

```txt
/api
```

---

# Health

## GET /api/health

### Response

```json
{
  "status": "ok"
}
```

---

# Rooms

## POST /api/rooms

Creates a new room.

### Request

```json
{
  "playerName": "John"
}
```

### Response

```json
{
  "roomId": "ABCD"
}
```

---

## GET /api/rooms/:roomId

Returns public room info.

### Response

```json
{
  "id": "ABCD",
  "status": "waiting",
  "playerCount": 3
}
```

---

## DELETE /api/rooms/:roomId

Deletes room.

### Response

```json
{
  "success": true
}
```

---

# Socket.IO Events

# Client → Server

## create_room

### Request

```json
{
  "playerName": "John"
}
```

### Response

```json
{
  "roomId": "ABCD"
}
```

---

## join_room

### Request

```json
{
  "roomId": "ABCD",
  "playerName": "Mike"
}
```

### Response

```json
{
  "success": true
}
```

---

## start_game

### Request

```json
{
  "roomId": "ABCD"
}
```

### Response

```json
{
  "success": true
}
```

---

## play_card

### Request

```json
{
  "roomId": "ABCD",
  "cardId": "red-5",
  "chosenColor": "blue"
}
```

### Response

```json
{
  "success": true
}
```

---

## draw_card

### Request

```json
{
  "roomId": "ABCD"
}
```

### Response

```json
{
  "success": true
}
```

---

## say_uno

### Request

```json
{
  "roomId": "ABCD"
}
```

### Response

```json
{
  "success": true
}
```

---

## leave_room

### Request

```json
{
  "roomId": "ABCD"
}
```

### Response

```json
{
  "success": true
}
```

---

# Server → Client Events

## room_updated

### Response

```json
{
  "roomId": "ABCD",
  "topCard": {
    "color": "red",
    "type": "number",
    "value": 5
  },
  "currentColor": "red",
  "currentPlayer": "socket-id",
  "direction": 1,
  "status": "playing",
  "players": [
    {
      "id": "socket-id",
      "name": "John",
      "cardCount": 5
    }
  ],
  "myHand": []
}
```

---

## invalid_move

### Response

```json
{
  "message": "Not your turn"
}
```

---

## player_joined

### Response

```json
{
  "playerName": "Mike"
}
```

---

## player_left

### Response

```json
{
  "playerId": "socket-id"
}
```

---

## player_won

### Response

```json
{
  "playerId": "socket-id"
}
```

---

## game_started

### Response

```json
{
  "success": true
}
```
