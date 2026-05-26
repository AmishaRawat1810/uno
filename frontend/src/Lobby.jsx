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
      <section className="panel">
        <h2>Lobby</h2>
        <div className="form-row">
          <label htmlFor="playerName">Your name</label>
          <input
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="action-grid">
          <button type="button" onClick={onCreate}>
            Create Room
          </button>
          <div className="join-group">
            <input
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              placeholder="Room code"
              maxLength={4}
            />
            <button type="button" onClick={onJoin}>
              Join Room
            </button>
          </div>
        </div>
      </section>

      {roomState && (
        <section className="panel room-summary">
          <h3>Room {roomState.roomId}</h3>
          <p>Status: {roomState.status}</p>
          <div className="player-list">
            {roomState.players.map((player) => (
              <div key={player.id} className="player-card">
                <div className="avatar">
                  {player.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong>{player.name}</strong>
                  <div>{player.cardCount} cards</div>
                </div>
              </div>
            ))}
          </div>
          <div className="room-actions">
            {isHost && (
              <button type="button" onClick={onStart}>
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
