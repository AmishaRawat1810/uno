export default function Lobby({
  playerName,
  setPlayerName,
  roomInput,
  setRoomInput,
  onCreate,
  onJoin,
  roomState,
  socketId,
  onStart,
  onLeave,
}) {
  const playerNameValue = playerName.trim();
  const isHost = roomState?.players?.[0]?.id === socketId;
  const canCreate = playerNameValue.length > 0;
  const canJoin = playerNameValue.length > 0 && roomInput.trim().length > 0;
  const hasEnteredName = playerNameValue.length > 0;

  return (
    <main className="lobby-shell">
      <section className="panel lobby-panel">
        <div className="lobby-header">
          <div className="game-title">UNO</div>
          <div className="top-actions">
            <button className="quit-btn">⬅ QUIT</button>
          </div>
        </div>

        <h2 className="panel-title">
          {hasEnteredName
            ? "Create or join a room"
            : "Welcome — enter your name"}
        </h2>

        <div className="form-row">
          <label htmlFor="playerName">
            {hasEnteredName ? "Player name" : "Your name"}
          </label>
          <input
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="themed-input"
          />
        </div>

        {hasEnteredName ? (
          <div className="action-grid">
            <button
              type="button"
              className="primary"
              onClick={onCreate}
              disabled={!canCreate}
            >
              Create Room
            </button>
            <div className="join-group">
              <input
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                placeholder="Room code"
                maxLength={4}
                className="themed-input room-code"
              />
              <button
                type="button"
                className="primary"
                onClick={onJoin}
                disabled={!canJoin}
              >
                Join Room
              </button>
            </div>
          </div>
        ) : (
          <p className="hint-text">
            Enter your name first. Once your name is set, you can create or join
            a room.
          </p>
        )}
      </section>

      {roomState && (
        <section className="panel room-summary themed-panel">
          <h3>Room {roomState.roomId}</h3>
          <p className="room-status">Status: {roomState.status}</p>
          <div className="player-list">
            {roomState.players.map((player, idx) => (
              <div key={player.id} className="player-card themed-player">
                <div className={`avatar av${(idx % 6) + 1}`}>
                  {player.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong>{player.name}</strong>
                  <div className="card-count">{player.cardCount} cards</div>
                </div>
              </div>
            ))}
          </div>
          <div className="room-actions">
            {isHost && (
              <button type="button" className="primary" onClick={onStart}>
                Start Game
              </button>
            )}
            <button
              type="button"
              className="secondary danger"
              onClick={onLeave}
            >
              Leave Room
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
