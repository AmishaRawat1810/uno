export default function Opponent({ player, isActive }) {
  return (
    <div className={`opponent-card ${isActive ? "active" : ""}`}>
      <div className="avatar">{player.name.slice(0, 2).toUpperCase()}</div>
      <div className="opponent-name">{player.name}</div>
      <div className="card-count">{player.cardCount} cards</div>
    </div>
  );
}
