import Hand from "./components/Hand.jsx";
import Opponent from "./components/Opponent.jsx";
import TopCard from "./components/TopCard.jsx";
import ActionBar from "./components/ActionBar.jsx";

export default function Game({
  roomState,
  socketId,
  onPlayCard,
  onDrawCard,
  onSayUno,
  onLeaveRoom,
}) {
  const currentPlayer = roomState.players.find(
    (player) => player.id === roomState.currentPlayer,
  );
  const isMyTurn = socketId === roomState.currentPlayer;

  return (
    <main className="game-shell">
      <section className="opponent-row">
        {roomState.players
          .filter((player) => player.id !== socketId)
          .map((player) => (
            <Opponent
              key={player.id}
              player={player}
              isActive={player.id === roomState.currentPlayer}
            />
          ))}
      </section>

      <section className="table-area">
        <TopCard
          topCard={roomState.topCard}
          currentColor={roomState.currentColor}
        />
        <div className="turn-banner">
          {isMyTurn
            ? "Your turn"
            : `${currentPlayer?.name || "Waiting"}'s turn`}
        </div>
      </section>

      <section className="hand-area">
        <Hand
          hand={roomState.myHand}
          topCard={roomState.topCard}
          currentColor={roomState.currentColor}
          drawStack={roomState.drawStack}
          onPlayCard={onPlayCard}
          disabled={!isMyTurn}
        />
      </section>

      <ActionBar
        onDrawCard={onDrawCard}
        onSayUno={onSayUno}
        onLeaveRoom={onLeaveRoom}
        canSayUno={roomState.myHand.length === 2}
        disabled={!isMyTurn}
      />
    </main>
  );
}
