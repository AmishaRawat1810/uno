export default function Opponent({ player, isActive }) {
  const unoWarning = player.cardCount === 1;

  return (
    <div
      className={`player-seat ${isActive ? "active-player" : ""} ${
        unoWarning ? "uno-warning" : ""
      }`}
    >
      <div className="status-ring" />
      {unoWarning && <div className="uno-alert">UNO!</div>}

      <div className="player-area">
        <div className="player-info">
          <span className="player-name">{player.name}</span>
          <span className="card-count">{player.cardCount} cards</span>
        </div>

        <div className="hand horizontal">
          {Array.from({ length: Math.min(player.cardCount, 5) }).map(
            (_, index) => (
              <div key={index} className="card back small" />
            ),
          )}
          {player.cardCount > 5 && (
            <div className="card back small more-count">
              +{player.cardCount - 5}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
