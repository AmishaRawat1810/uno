import { useEffect, useState } from "react";
import useSocket from "./hooks/useSocket.js";
import Lobby from "./Lobby.jsx";
import Game from "./Game.jsx";
import ColorPicker from "./components/ColorPicker.jsx";

const DEFAULT_PLAYER_NAME = "Player";

export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
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
    if (!notification) {
      return undefined;
    }

    setAlertMessage(notification);
    const timeout = setTimeout(() => setAlertMessage(""), 3000);
    return () => clearTimeout(timeout);
  }, [notification]);

  const currentPlayerName = playerName.trim() || DEFAULT_PLAYER_NAME;

  const handleCreateRoom = () => {
    if (!createRoom) return;

    createRoom(currentPlayerName, (response) => {
      if (!response.success && response.message) {
        setAlertMessage(response.message);
      }
    });
  };

  const handleJoinRoom = () => {
    if (!joinRoom) return;

    joinRoom(roomInput.toUpperCase().trim(), currentPlayerName, (response) => {
      if (!response.success && response.message) {
        setAlertMessage(response.message);
      }
    });
  };

  const handleStartGame = () => {
    if (!roomState || !startGame) return;

    startGame(roomState.roomId, (response) => {
      if (!response.success && response.message) {
        setAlertMessage(response.message);
      }
    });
  };

  const handleCardPlay = (card) => {
    if (!roomState || !playCard) return;
    if (card.type === "wild" || card.type === "draw4") {
      setSelectedCard(card);
      return;
    }

    playCard(roomState.roomId, card.id, null, (response) => {
      if (!response.success && response.message) {
        setAlertMessage(response.message);
      }
    });
  };

  const handleWildPlay = (chosenColor) => {
    if (!roomState || !selectedCard || !playCard) return;

    playCard(roomState.roomId, selectedCard.id, chosenColor, (response) => {
      if (!response.success && response.message) {
        setAlertMessage(response.message);
      }
      setSelectedCard(null);
    });
  };

  const handleDrawCard = () => {
    if (!roomState || !drawCard) return;

    drawCard(roomState.roomId, (response) => {
      if (!response.success && response.message) {
        setAlertMessage(response.message);
      }
    });
  };

  const handleSayUno = () => {
    if (!roomState || !sayUno) return;

    sayUno(roomState.roomId, () => {
      setAlertMessage("UNO called!");
    });
  };

  const handleLeaveRoom = () => {
    if (!roomState || !leaveRoom) return;

    leaveRoom(roomState.roomId, () => {
      setSelectedCard(null);
    });
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>UNO MVP</h1>
          <p>Real-time multiplayer with React + Socket.IO.</p>
        </div>
        <div className="status-pill">
          {socketId ? "Connected" : "Connecting..."}
        </div>
      </header>

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

      {selectedCard && (
        <ColorPicker
          onChoose={(color) => handleWildPlay(color)}
          onCancel={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
