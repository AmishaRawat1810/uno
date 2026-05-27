import { useEffect, useState } from "react";
import useSocket from "./hooks/useSocket.js";
import Lobby from "./Lobby.jsx";
import Game from "./Game.jsx";

const DEFAULT_PLAYER_NAME = "Player";

export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const {
    socketId,
    roomState,
    notification,
    createRoom,
    joinRoom,
    startGame,
    playCard,
    drawCard,
    sayUno,
    leaveRoom,
  } = useSocket();

  useEffect(() => {
    if (!notification) return undefined;
    setAlertMessage(notification);
    const timeout = setTimeout(() => setAlertMessage(""), 3000);
    return () => clearTimeout(timeout);
  }, [notification]);

  const playerNameValue = playerName.trim();
  const currentPlayerName = playerNameValue;

  const handleCreateRoom = () => {
    if (!createRoom) return;
    if (!playerNameValue) {
      setAlertMessage("Please enter your name before creating a room");
      return;
    }

    createRoom(currentPlayerName, (response) => {
      if (!response.success && response.message)
        setAlertMessage(response.message);
    });
  };

  const handleJoinRoom = () => {
    if (!joinRoom) return;
    if (!playerNameValue) {
      setAlertMessage("Please enter your name before joining a room");
      return;
    }
    if (!roomInput.trim()) {
      setAlertMessage("Please enter a room code to join");
      return;
    }

    joinRoom(roomInput.toUpperCase().trim(), currentPlayerName, (response) => {
      if (!response.success && response.message)
        setAlertMessage(response.message);
    });
  };

  const handleStartGame = () => {
    if (!roomState || !startGame) return;
    startGame(roomState.roomId, (response) => {
      if (!response.success && response.message)
        setAlertMessage(response.message);
    });
  };

  // FIX #1: Uno6Player sets _colorChosen on wild cards after the user picks from
  // its internal popup. When that flag is present we emit immediately with the
  // chosen color — we never open App's own ColorPicker anymore.
  const handleCardPlay = (card) => {
    if (!roomState || !playCard) return;

    // Wild/draw4 that already has a color chosen by Uno6Player's picker
    if ((card.type === "wild" || card.type === "draw4") && card._colorChosen) {
      playCard(roomState.roomId, card.id, card.chosenColor, (response) => {
        if (!response.success && response.message)
          setAlertMessage(response.message);
      });
      return;
    }

    // Normal (non-wild) card — emit straight away
    playCard(roomState.roomId, card.id, null, (response) => {
      if (!response.success && response.message)
        setAlertMessage(response.message);
    });
  };

  const handleDrawCard = () => {
    if (!roomState || !drawCard) return;
    drawCard(roomState.roomId, (response) => {
      if (!response.success && response.message)
        setAlertMessage(response.message);
    });
  };

  const handleSayUno = () => {
    if (!roomState || !sayUno) return;
    sayUno(roomState.roomId, () => setAlertMessage("UNO called!"));
  };

  const handleLeaveRoom = () => {
    if (!roomState || !leaveRoom) return;
    leaveRoom(roomState.roomId, () => {});
  };

  return (
    <div className="app-shell">
      {alertMessage && <div className="alert-banner">{alertMessage}</div>}

      {!roomState || roomState.status === "waiting" ? (
        <Lobby
          playerName={playerName}
          setPlayerName={setPlayerName}
          roomInput={roomInput}
          setRoomInput={setRoomInput}
          onCreate={handleCreateRoom}
          onJoin={handleJoinRoom}
          roomState={roomState}
          socketId={socketId}
          onStart={handleStartGame}
          onLeave={handleLeaveRoom}
        />
      ) : (
        <Game
          roomState={roomState}
          socketId={socketId}
          onPlayCard={handleCardPlay}
          onDrawCard={handleDrawCard}
          onSayUno={handleSayUno}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
      {/* ColorPicker removed from App — Uno6Player manages it internally */}
    </div>
  );
}
