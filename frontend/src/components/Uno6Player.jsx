import React from "react";
import "../styles/uno6player.css";

const POSITION_CLASSES = [
  "p5",
  "top",
  "p6",
  "left",
  "right",
  "p3",
  "bot",
  "p4",
];

function PlayerZone({ player, index, isSelf, isActive }) {
  const pos = POSITION_CLASSES[index % POSITION_CLASSES.length];
  const avatarClass = `player-avatar av${(index % 6) + 1}`;

  return (
    <div className={`player-zone ${pos} ${isActive ? "active" : ""}`}>
      <div className="player-label">
        <div className={avatarClass}>{player.name.slice(0, 2).toUpperCase()}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="player-name">{player.name}</span>
          <span className="card-count">{player.cardCount ?? 0} cards</span>
        </div>
      </div>

      <div className={`hand ${pos === "top" || pos === "bot" ? "horizontal" : "vertical"}`}>
        {Array.from({ length: player.cardCount || 4 }).map((_, i) => (
          <div key={i} className="card back"><div className="card-back-logo" /></div>
        ))}
      </div>
    </div>
  );
}

export default function Uno6Player({ roomState = { players: [] }, socketId, onPlayCard, onDrawCard, onSayUno }) {
  const players = roomState.players || [];
  const myHand = roomState.myHand || [];
  const opponents = players.filter((p) => p.id !== socketId);

  return (
    <div className="scene">
      {opponents.map((p, i) => (
        <PlayerZone
          key={p.id || i}
          player={p}
          index={i}
          isActive={p.id === roomState.currentPlayer}
        />
      ))}

      <div className="table-felt">
        <div className="direction-indicator">↻</div>
        <div className="center-area">
          <div className="special-mode-badge">SPECIAL<br/>MODE</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginRight: 8 }}>
            <div className="side-btn btn-num">{players.length}</div>
            <div className="side-btn btn-draw" onClick={() => onDrawCard && onDrawCard()}>⬡</div>
          </div>

          <div className="deck-pile" style={{ position: "relative", width: 72, height: 108 }}>
            <div className="card back" style={{ position: "absolute", transform: "rotate(-3deg) translate(-4px,3px)" }}><div className="card-back-logo"/></div>
            <div className="card back" style={{ position: "absolute", transform: "rotate(1deg) translate(1px,-1px)" }}><div className="card-back-logo"/></div>
            <div className="card back" style={{ position: "absolute" }}><div className="card-back-logo"/></div>
          </div>

          <div style={{ position: "relative" }}>
            <div className="card wild active-discard" style={{ transform: "rotate(-4deg)", position: "absolute", top: 0, left: 0 }}>
              <span className="card-corner tl">W</span>
              <div className="card-inner-diamond"><span>+4</span></div>
              <span className="card-corner br">W</span>
            </div>
            <div className="card wild active-discard" style={{ position: "relative", zIndex: 1 }}>
              <span className="card-corner tl">W</span>
              <div className="card-inner-diamond"></div>
              <span className="card-corner br">W</span>
            </div>
          </div>

          <div className="color-chooser">
            <div className="color-dot yellow" onClick={() => onPlayCard && onPlayCard({ type: 'wild', chosenColor: 'yellow' })} />
            <div className="color-dot red" onClick={() => onPlayCard && onPlayCard({ type: 'wild', chosenColor: 'red' })} />
            <div className="color-dot green" onClick={() => onPlayCard && onPlayCard({ type: 'wild', chosenColor: 'green' })} />
            <div className="color-dot blue" onClick={() => onPlayCard && onPlayCard({ type: 'wild', chosenColor: 'blue' })} />
          </div>

          <div className="side-btn btn-next" style={{ marginLeft: 8 }}>▶</div>
        </div>
      </div>

      <div className={`player-zone bot ${roomState.currentPlayer === socketId ? 'active' : ''}`}>
        <div className="hand horizontal self-hand">
          {myHand.map((card) => (
            <div
              key={card.id || Math.random()}
              className={`card ${card.type === "wild" || card.type === "draw4" ? "wild" : card.color || "red"}`}
              onClick={() => onPlayCard && onPlayCard(card)}
            >
              <span className="card-corner tl">{card.label || card.value || ""}</span>
              <div className="card-inner-diamond"><span>{card.label || card.value || ""}</span></div>
              <span className="card-corner br">{card.label || card.value || ""}</span>
            </div>
          ))}
        </div>
        <div className="player-label">
          <div className="player-avatar av1">{(players.find(p=>p.id===socketId)?.name || 'You').slice(0,2).toUpperCase()}</div>
          <span className="player-name">{(players.find(p=>p.id===socketId)?.name) || 'You'}</span>
          <span className="card-count">{(players.find(p=>p.id===socketId)?.cardCount) ?? myHand.length} cards</span>
        </div>
      </div>
    </div>
  );
}
