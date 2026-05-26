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
  const isHost = roomState?.players?.[0]?.id === socketId;

  return (
    <main className="lobby-shell">
      <section className="panel lobby-panel">
        <div className="lobby-header">
          <div className="game-title">4 COLORS</div>
          <div className="top-actions">
            <button className="quit-btn">⬅ QUIT</button>
          </div>
        </div>

        <h2 className="panel-title">Join or Create</h2>

        <div className="form-row">
          <label htmlFor="playerName">Your name</label>
          <input
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="themed-input"
          />
        </div>

        <div className="action-grid">
          <button type="button" className="primary" onClick={onCreate}>
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
            <button type="button" className="primary" onClick={onJoin}>
              Join Room
            </button>
          </div>
        </div>
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
            <button type="button" className="secondary" onClick={onLeave}>
              Leave Room
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
