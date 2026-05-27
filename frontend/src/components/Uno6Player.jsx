import React, { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// STYLES — injected into <head> once
// ─────────────────────────────────────────────────────────────────────────────
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@400;600;700&display=swap');

:root {
  --c-red:    #e02020;
  --c-green:  #19b84a;
  --c-blue:   #1890e8;
  --c-yellow: #f5c518;
  --c-purple: #8e44ad;
  --card-dark: #111827;
  --text-bright: #cde8ff;
  --text-muted: rgba(180,215,255,0.5);
  --gold: #f5c518;
  --radius: 10px;
  --shadow: 0 4px 18px rgba(0,0,0,0.55);
}

/* ── LOCK TO FULL VIEWPORT — zero scroll ── */
html, body, #root {
  margin: 0; padding: 0;
  width: 100%; height: 100%;
  overflow: hidden;
  background: #07172e;
}

.uno-scene {
  position: fixed;
  inset: 0;
  font-family: 'Exo 2', sans-serif;
  color: var(--text-bright);
  background: #07172e;
  overflow: hidden;
}

/* ── FELT (elliptical table in center) ── */
.uno-felt {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 46vw;
  height: 46vh;
  min-width: 340px;
  min-height: 260px;
  background: radial-gradient(ellipse at center, #0f3460 0%, #091d38 100%);
  border-radius: 50%;
  box-shadow:
    0 0 0 6px rgba(30,90,160,0.3),
    0 0 60px rgba(20,70,140,0.45),
    inset 0 0 40px rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.direction-ring {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  width: 80px; height: 80px;
  border-radius: 50%;
  border: 2px dashed rgba(80,180,255,0.22);
  color: rgba(80,180,255,0.3);
  font-size: 24px;
  display: flex; align-items: center; justify-content: center;
  animation: spinRing 8s linear infinite;
  pointer-events: none;
}
@keyframes spinRing {
  from { transform: translate(-50%,-50%) rotate(0deg); }
  to   { transform: translate(-50%,-50%) rotate(360deg); }
}

.center-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  position: relative;
  z-index: 1;
}

/* draw-stack badge */
.draw-stack-badge {
  background: linear-gradient(135deg,#c0392b,#e74c3c);
  border-radius: 8px;
  padding: 3px 9px;
  font-family: 'Orbitron', sans-serif;
  font-size: 11px; font-weight: 700;
  color: #fff; letter-spacing: 1px;
  flex-shrink: 0;
}

/* current-color pip below table */
.current-color-pip {
  position: absolute;
  bottom: -24px; left: 50%;
  transform: translateX(-50%);
  display: flex; align-items: center; gap: 5px;
  font-family: 'Orbitron', sans-serif;
  font-size: 8px; letter-spacing: 1px;
  color: var(--text-muted);
  white-space: nowrap;
  pointer-events: none;
}
.current-color-dot {
  width: 12px; height: 12px;
  border-radius: 3px;
  border: 1.5px solid rgba(255,255,255,0.3);
  flex-shrink: 0;
}

/* ── CARD BASE ── */
.uno-card {
  width: 68px; height: 102px;
  border-radius: var(--radius);
  background: var(--card-dark);
  border: 2.5px solid rgba(255,255,255,0.18);
  box-shadow: var(--shadow);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  user-select: none;
  box-sizing: border-box;
}
.uno-card:hover:not(.u-disabled):not(.u-back) {
  transform: translateY(-6px) scale(1.05);
  box-shadow: 0 14px 30px rgba(0,0,0,0.75);
}
.uno-card.u-disabled {
  opacity: 0.35;
  cursor: not-allowed;
  filter: grayscale(0.25);
}
.uno-card.u-disabled:hover { transform: none !important; }
.uno-card.u-valid {
  border-color: rgba(255,255,255,0.8);
  box-shadow: 0 0 0 3px rgba(255,255,200,0.28), var(--shadow);
}

/* back of card */
.u-back {
  cursor: default;
  background: linear-gradient(135deg,#111827,#1a2a44);
}
.u-back:hover { transform: none !important; box-shadow: var(--shadow) !important; }
.card-back-logo {
  width: 44px; height: 44px;
  transform: rotate(45deg);
  background: conic-gradient(var(--c-red) 0% 25%, var(--c-yellow) 25% 50%, var(--c-green) 50% 75%, var(--c-blue) 75% 100%);
  border-radius: 4px; position: relative;
}
.card-back-logo::after {
  position: absolute; top: 50%; left: 50%;
  transform: rotate(-45deg) translate(-50%,-50%);
  font-family: 'Orbitron', sans-serif;
  font-size: 10px; font-weight: 900; color: rgba(0,0,0,0.6);
}

/* diamond */
.card-diamond {
  width: 48px; height: 48px;
  transform: rotate(45deg);
  border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
}
.card-diamond span {
  transform: rotate(-45deg);
  font-family: 'Orbitron', sans-serif;
  font-size: 17px; font-weight: 900;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0,0,0,0.7);
  white-space: nowrap; line-height: 1;
}
.card-c-red    .card-diamond { background: var(--c-red); }
.card-c-green  .card-diamond { background: var(--c-green); }
.card-c-blue   .card-diamond { background: var(--c-blue); }
.card-c-yellow .card-diamond { background: var(--c-yellow); }
.card-c-yellow .card-diamond span { color: #111; }
.card-wild     .card-diamond {
  background: conic-gradient(var(--c-red) 0% 25%, var(--c-yellow) 25% 50%, var(--c-green) 50% 75%, var(--c-blue) 75% 100%);
}
.card-wild .card-diamond span { color: #111; font-size: 12px; }

.card-corner {
  position: absolute;
  font-family: 'Orbitron', sans-serif;
  font-size: 9px; font-weight: 700;
  color: rgba(255,255,255,0.8);
  line-height: 1; z-index: 2;
}
.card-c-yellow .card-corner { color: rgba(0,0,0,0.5); }
.card-corner.tl { top: 4px; left: 5px; }
.card-corner.br { bottom: 4px; right: 5px; transform: rotate(180deg); }

.u-active-discard {
  border-color: rgba(255,255,255,0.7) !important;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.18), 0 8px 28px rgba(0,0,0,0.55) !important;
}

/* ── DECK ── */
.deck-wrap { position: relative; }
.deck-pile {
  position: relative; width: 68px; height: 102px;
  cursor: pointer; transition: transform 0.15s;
}
.deck-pile:hover { transform: scale(1.06); }
.deck-shadow {
  position: absolute; width: 68px; height: 102px;
  border-radius: var(--radius);
  background: linear-gradient(135deg,#111827,#1a2a44);
  border: 2.5px solid rgba(255,255,255,0.11);
}
.deck-shadow:nth-child(1) { transform: rotate(-3deg) translate(-4px,3px); }
.deck-shadow:nth-child(2) { transform: rotate(1deg) translate(1px,-1px); }
.deck-top-card {
  position: absolute; top: 0; left: 0;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.deck-pile.deck-active .deck-top-card {
  border-color: rgba(100,210,255,0.55) !important;
  box-shadow: 0 0 0 2px rgba(100,210,255,0.25), 0 0 12px rgba(100,210,255,0.2) !important;
}
.deck-pile.deck-must-draw .deck-top-card {
  border-color: var(--c-yellow) !important;
  animation: deckPulse 1.1s ease-in-out infinite;
}
@keyframes deckPulse {
  0%,100% { box-shadow: 0 0 0 3px rgba(245,197,24,0.55), 0 0 22px rgba(245,197,24,0.4); }
  50%      { box-shadow: 0 0 0 5px rgba(245,197,24,0.75), 0 0 34px rgba(245,197,24,0.55); }
}
.deck-label {
  position: absolute; bottom: -18px; left: 50%;
  transform: translateX(-50%);
  font-family: 'Orbitron', sans-serif;
  font-size: 7px; letter-spacing: 1px;
  color: var(--gold); white-space: nowrap;
  pointer-events: none;
}

/* ── DISCARD ── */
.discard-pile { position: relative; width: 68px; height: 102px; }
.discard-under {
  position: absolute; top: 0; left: 0;
  transform: rotate(-5deg);
  z-index: 0;
}
.discard-top { position: absolute; top: 0; left: 0; z-index: 1; }

/* ── OPPONENT SEAT (absolutely positioned around table) ── */
.opp-seat {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  /* transform-origin center so rotation faces the table */
}
.opp-seat .seat-cards {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.opp-seat .seat-cards .u-back {
  margin-right: -20px;
}
.opp-seat .seat-cards .u-back:last-child { margin-right: 0; }

/* ── PLAYER LABEL ── */
.plabel {
  display: flex; align-items: center; gap: 7px;
  background: rgba(10,30,65,0.85);
  border: 1px solid rgba(80,150,255,0.2);
  border-radius: 20px;
  padding: 3px 9px 3px 4px;
  white-space: nowrap;
  backdrop-filter: blur(4px);
  flex-shrink: 0;
}
.plabel.active-label {
  border-color: rgba(80,200,255,0.7);
  box-shadow: 0 0 12px rgba(80,200,255,0.3);
}
.pavatar {
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  color: #fff; flex-shrink: 0;
}
.av1{background:var(--c-blue);}
.av2{background:var(--c-red);}
.av3{background:var(--c-green);}
.av4{background:var(--c-yellow);color:#111!important;}
.av5{background:var(--c-purple);}
.av6{background:#e67e22;}
.pname {
  font-family: 'Orbitron', sans-serif;
  font-size: 8px; font-weight: 700; letter-spacing: 1px;
  text-transform: uppercase; color: var(--text-bright);
}
.pcards {
  font-family: 'Orbitron', sans-serif;
  font-size: 7px; color: var(--gold);
}
.uno-badge {
  background: linear-gradient(135deg,var(--c-red),#ff6b6b);
  color: #fff; font-family: 'Orbitron', sans-serif;
  font-size: 7px; font-weight: 900;
  padding: 1px 5px; border-radius: 3px;
  animation: unoPulse 1s infinite;
}
@keyframes unoPulse { 0%,100%{opacity:1}50%{opacity:0.6} }

/* ── SELF HAND ZONE (bottom, full width) ── */
.self-zone {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 16px 10px;
  z-index: 2;
}
.self-hand {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 6px 4px 0;
}
.self-hand::-webkit-scrollbar { display: none; }
.self-hand .uno-card {
  flex-shrink: 0;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
}
.self-hand .uno-card:not(.u-disabled):hover {
  transform: translateY(-12px) scale(1.06) !important;
  z-index: 10;
}
.self-meta {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
}

/* ── COLOR PICKER OVERLAY ── */
.cpicker-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.72);
  display: flex; align-items: center; justify-content: center;
  animation: fadeIn 0.15s ease;
}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.cpicker-box {
  background: #0e2448;
  border: 1px solid rgba(80,150,255,0.4);
  border-radius: 18px;
  padding: 26px 30px;
  text-align: center;
  box-shadow: 0 24px 70px rgba(0,0,0,0.85);
  animation: scaleIn 0.18s ease;
}
@keyframes scaleIn{from{transform:scale(0.85);opacity:0}to{transform:scale(1);opacity:1}}
.cpicker-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 10px; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase;
  color: var(--text-bright); margin-bottom: 16px;
}
.cpicker-grid {
  display: grid;
  grid-template-columns: repeat(2, 70px);
  gap: 10px; margin-bottom: 14px;
}
.cpicker-btn {
  width: 70px; height: 70px;
  border-radius: 12px;
  border: 2px solid rgba(255,255,255,0.15);
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  font-size: 8px; font-weight: 700; letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 0.12s, box-shadow 0.12s;
  display: flex; align-items: center; justify-content: center;
}
.cpicker-btn:hover{transform:scale(1.1);box-shadow:0 6px 20px rgba(0,0,0,0.5);}
.cpicker-btn.red   {background:var(--c-red);   color:rgba(255,255,255,0.9);}
.cpicker-btn.green {background:var(--c-green); color:rgba(255,255,255,0.9);}
.cpicker-btn.blue  {background:var(--c-blue);  color:rgba(255,255,255,0.9);}
.cpicker-btn.yellow{background:var(--c-yellow);color:rgba(0,0,0,0.7);}
.cpicker-cancel {
  background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.15);
  border-radius:8px; color:var(--text-muted);
  font-family:'Orbitron',sans-serif;
  font-size:8px; padding:6px 18px;
  cursor:pointer; letter-spacing:1px;
  transition:background 0.15s;
}
.cpicker-cancel:hover{background:rgba(255,255,255,0.14);}

/* ── END SCREENS ── */
.endscreen-overlay {
  position: fixed; inset: 0; z-index: 300;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.82);
  animation: fadeIn 0.3s ease;
}
.endscreen-box {
  text-align: center; padding: 48px 60px;
  border-radius: 22px; border: 1px solid rgba(255,255,255,0.15);
  animation: scaleIn 0.25s ease;
}
.endscreen-win  { background: linear-gradient(145deg,#0b2e12,#0e4020); }
.endscreen-lose { background: linear-gradient(145deg,#2b0b0b,#3f1010); }
.endscreen-icon { font-size: 76px; margin-bottom: 12px; }
.endscreen-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 36px; font-weight: 900; letter-spacing: 4px; margin-bottom: 8px;
}
.endscreen-win  .endscreen-title { color: var(--c-yellow); }
.endscreen-lose .endscreen-title { color: var(--c-red); }
.endscreen-sub { font-size: 14px; color: var(--text-muted); margin-bottom: 28px; }
.endscreen-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.25); border-radius: 10px;
  color: var(--text-bright); font-family: 'Orbitron', sans-serif;
  font-size: 10px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; padding: 11px 34px; cursor: pointer;
  transition: background 0.15s;
}
.endscreen-btn:hover { background: rgba(255,255,255,0.2); }
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function cardLabel(card) {
  if (!card) return "?";
  if (card.type === "number") return String(card.value);
  if (card.type === "draw2") return "+2";
  if (card.type === "draw4") return "+4";
  if (card.type === "wild") return "W";
  if (card.type === "skip") return "⊘";
  if (card.type === "reverse") return "↺";
  return card.type?.toUpperCase?.() ?? "?";
}

function cardColorClass(card) {
  if (!card) return "";
  if (card.type === "wild" || card.type === "draw4") return "card-wild";
  return `card-c-${card.color || "wild"}`;
}

// ── Card validation — explicit rules, no ambiguity ───────────────────────────
// Bug #3 root cause: a skip card with color "green" should be playable on any
// green card OR on any other skip. Both are covered below.
function isCardValid(card, topCard, currentColor, drawStack = 0) {
  if (!card || !topCard) return false;
  // When stacking, only stack cards are valid
  if (drawStack > 0) return card.type === "draw2" || card.type === "draw4";
  // Wilds are always playable
  if (card.type === "wild" || card.type === "draw4") return true;
  // Same active color
  if (card.color === currentColor) return true;
  // Same number value
  if (
    card.type === "number" &&
    topCard.type === "number" &&
    card.value === topCard.value
  )
    return true;
  // Same type (skip-on-skip, reverse-on-reverse, draw2-on-draw2)
  // but ONLY when not a number — already covered above
  if (card.type !== "number" && card.type === topCard.type) return true;
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function UnoCard({
  card,
  onClick,
  disabled,
  valid,
  style: extraStyle = {},
  className = "",
}) {
  const label = cardLabel(card);
  const cls = [
    "uno-card",
    cardColorClass(card),
    disabled ? "u-disabled" : "",
    valid ? "u-valid" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div
      className={cls}
      style={extraStyle}
      onClick={disabled ? undefined : onClick}
    >
      <span className="card-corner tl">{label}</span>
      <div className="card-diamond">
        <span>{label}</span>
      </div>
      <span className="card-corner br">{label}</span>
    </div>
  );
}

function BackCard({ style: extraStyle = {} }) {
  return (
    <div className="uno-card u-back" style={extraStyle}>
      <div className="card-back-logo" />
    </div>
  );
}

function DeckPile({ isMyTurn, canPlayAny, onClick }) {
  const mustDraw = isMyTurn && !canPlayAny;
  const active = isMyTurn && canPlayAny;
  const cls = [
    "deck-pile",
    mustDraw ? "deck-must-draw" : active ? "deck-active" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="deck-wrap">
      <div className={cls} onClick={isMyTurn ? onClick : undefined}>
        <div className="deck-shadow" />
        <div className="deck-shadow" />
        <div className="uno-card u-back deck-top-card">
          <div className="card-back-logo" />
        </div>
      </div>
      {mustDraw && <div className="deck-label">TAP TO DRAW</div>}
    </div>
  );
}

function DiscardPile({ topCard, prevCard }) {
  return (
    <div className="discard-pile">
      {prevCard && (
        <div className="discard-under">
          <UnoCard card={prevCard} disabled />
        </div>
      )}
      {topCard ? (
        <div className="discard-top">
          <UnoCard card={topCard} disabled className="u-active-discard" />
        </div>
      ) : (
        <div className="uno-card u-back" style={{ opacity: 0.3 }} />
      )}
    </div>
  );
}

function PlayerLabel({ player, idx, isActive }) {
  return (
    <div className={`plabel ${isActive ? "active-label" : ""}`}>
      <div className={`pavatar av${(idx % 6) + 1}`}>
        {(player.name || "?").slice(0, 2).toUpperCase()}
      </div>
      <span className="pname">{player.name}</span>
      <span className="pcards">{player.cardCount ?? 0}c</span>
      {player.cardCount === 1 && <span className="uno-badge">UNO</span>}
    </div>
  );
}

// ── Opponent seat: positioned absolutely, rotated to face center ──────────────
// angle is in radians, measured from top (12-o'clock), clockwise.
// cx, cy are the center of the table in px.
// rx, ry are the radii of the ellipse on which seats are placed.
function OpponentSeat({ player, idx, angle, cx, cy, rx, ry, isActive }) {
  // Seat center on ellipse
  const sx = cx + rx * Math.sin(angle);
  const sy = cy - ry * Math.cos(angle);

  // How many cards to show (cap at 7, show "+N" text)
  const count = Math.min(player.cardCount || 0, 7);
  const extra = (player.cardCount || 0) - 7;

  // Cards fan
  const OVERLAP = 20; // px overlap between cards
  const cardW = 44;
  const cardH = 66;
  const totalW = count * cardW - (count - 1) * OVERLAP;

  // Label above or below depending on angle
  // Top half (angle < π): label below cards; bottom half: label above
  const labelBelow = Math.cos(angle) > 0; // cos>0 means top half

  return (
    <div
      style={{
        position: "absolute",
        left: sx,
        top: sy,
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        zIndex: 2,
      }}
    >
      {!labelBelow && (
        <PlayerLabel player={player} idx={idx} isActive={isActive} />
      )}

      {/* Card fan */}
      <div
        style={{
          position: "relative",
          width: Math.max(totalW, cardW),
          height: cardH,
          flexShrink: 0,
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <BackCard
            key={i}
            style={{
              position: "absolute",
              left: i * (cardW - OVERLAP),
              top: 0,
              width: cardW,
              height: cardH,
            }}
          />
        ))}
        {extra > 0 && (
          <div
            style={{
              position: "absolute",
              right: -28,
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "Orbitron",
              fontSize: 9,
              color: "var(--gold)",
            }}
          >
            +{extra}
          </div>
        )}
      </div>

      {labelBelow && (
        <PlayerLabel player={player} idx={idx} isActive={isActive} />
      )}
    </div>
  );
}

function ColorPicker({ onChoose, onCancel }) {
  return (
    <div className="cpicker-overlay" onClick={onCancel}>
      <div className="cpicker-box" onClick={(e) => e.stopPropagation()}>
        <div className="cpicker-title">Choose a color</div>
        <div className="cpicker-grid">
          {["red", "green", "blue", "yellow"].map((c) => (
            <button
              key={c}
              className={`cpicker-btn ${c}`}
              onClick={() => onChoose(c)}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
        <button className="cpicker-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function WinScreen({ playerName, onLeave }) {
  return (
    <div className="endscreen-overlay">
      <div className="endscreen-box endscreen-win">
        <div className="endscreen-icon">🏆</div>
        <div className="endscreen-title">YOU WIN!</div>
        <div className="endscreen-sub">
          Congratulations{playerName ? `, ${playerName}` : ""}!<br />
          You played your last card!
        </div>
        <button className="endscreen-btn" onClick={onLeave}>
          Back to Lobby
        </button>
      </div>
    </div>
  );
}

function LoseScreen({ winnerName, onLeave }) {
  return (
    <div className="endscreen-overlay">
      <div className="endscreen-box endscreen-lose">
        <div className="endscreen-icon">💀</div>
        <div className="endscreen-title">YOU LOSE</div>
        <div className="endscreen-sub">
          {winnerName
            ? `${winnerName} went out first.`
            : "Better luck next time."}
        </div>
        <button className="endscreen-btn" onClick={onLeave}>
          Back to Lobby
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Uno6Player({
  roomState = {},
  socketId,
  onPlayCard,
  onDrawCard,
  onSayUno,
  onLeaveRoom,
}) {
  const [pendingWild, setPendingWild] = useState(null);
  const sceneRef = useRef(null);
  const [dims, setDims] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  // Inject styles once
  useEffect(() => {
    if (!document.getElementById("uno6p-styles")) {
      const tag = document.createElement("style");
      tag.id = "uno6p-styles";
      tag.textContent = STYLE;
      document.head.appendChild(tag);
    }
    return () => {
      const el = document.getElementById("uno6p-styles");
      if (el) el.remove();
    };
  }, []);

  // Track viewport size for ellipse math
  useEffect(() => {
    const onResize = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const players = roomState.players || [];
  const myHand = roomState.myHand || [];
  const topCard = roomState.topCard;
  const prevCard = roomState.prevTopCard;
  const currentColor = roomState.currentColor;
  const drawStack = roomState.drawStack || 0;
  const isMyTurn = roomState.currentPlayer === socketId;
  const me = players.find((p) => p.id === socketId);
  const myIdx = players.findIndex((p) => p.id === socketId);
  const opponents = players.filter((p) => p.id !== socketId);

  const validCards = isMyTurn
    ? myHand.filter((c) => isCardValid(c, topCard, currentColor, drawStack))
    : [];
  const canPlayAny = validCards.length > 0;

  const gameOver = roomState.status === "finished" || roomState.winner != null;
  const winnerPlayer = gameOver
    ? players.find((p) => p.id === roomState.winner)
    : null;
  const iWon = gameOver && roomState.winner === socketId;
  const iLost = gameOver && !iWon;
  const directionSymbol = roomState.direction === -1 ? "↺" : "↻";

  const handleCardClick = (card) => {
    if (!isMyTurn) return;
    if (!isCardValid(card, topCard, currentColor, drawStack)) return;
    if (card.type === "wild" || card.type === "draw4") {
      setPendingWild(card);
      return;
    }
    onPlayCard && onPlayCard(card);
  };

  const handleColorChosen = (color) => {
    if (!pendingWild) return;
    onPlayCard &&
      onPlayCard({ ...pendingWild, _colorChosen: true, chosenColor: color });
    setPendingWild(null);
  };

  // ── Ellipse geometry ────────────────────────────────────────────────────────
  // Table center = viewport center
  // Reserve ~220px at bottom for self hand
  const W = dims.w;
  const H = dims.h;
  const cx = W / 2;
  // Push table center slightly above mid to leave room for self hand
  const cy = H / 2 - 30;

  // Seat ellipse radii — opponents sit outside the felt
  const rx = W * 0.38; // horizontal radius
  const ry = (H - 220) * 0.44; // vertical radius (leave space at bottom for self)

  // Spread opponents evenly around the top arc (from ~200° to ~340° going clockwise,
  // i.e. from bottom-left, up through top, to bottom-right — avoiding the bottom
  // sector reserved for the local player).
  // Angles in radians, 0 = top (12-o'clock), clockwise positive.
  const totalPlayers = players.length;
  const orderedOpponents =
    myIdx >= 0
      ? [...players.slice(myIdx + 1), ...players.slice(0, myIdx)]
      : opponents;
  const seatingStep = (2 * Math.PI) / Math.max(totalPlayers, 2);
  const oppAngles = orderedOpponents.map(
    (_, i) => Math.PI + seatingStep * (i + 1),
  );

  return (
    <>
      <div className="uno-scene" ref={sceneRef}>
        {/* Felt table */}
        <div className="uno-felt">
          <div
            className="direction-ring"
            style={{
              animationDirection:
                roomState.direction === -1 ? "reverse" : "normal",
            }}
          >
            {directionSymbol}
          </div>
          <div className="center-area">
            {drawStack > 0 && (
              <div className="draw-stack-badge">+{drawStack}</div>
            )}
            <DeckPile
              isMyTurn={isMyTurn}
              canPlayAny={canPlayAny}
              onClick={() => isMyTurn && onDrawCard && onDrawCard()}
            />
            <DiscardPile topCard={topCard} prevCard={prevCard} />
          </div>

          {currentColor && (
            <div className="current-color-pip">
              <div
                className="current-color-dot"
                style={{ background: `var(--c-${currentColor})` }}
              />
              {currentColor.toUpperCase()}
            </div>
          )}
        </div>

        {/* Opponent seats — placed absolutely around the ellipse */}
        {orderedOpponents.map((p, i) => (
          <OpponentSeat
            key={p.id || i}
            player={p}
            idx={i}
            angle={oppAngles[i]}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            isActive={p.id === roomState.currentPlayer}
          />
        ))}

        {/* Self zone — pinned to bottom */}
        <div className="self-zone">
          <div className="self-hand">
            {myHand.length === 0 ? (
              <div
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "Orbitron",
                  fontSize: 11,
                  padding: "16px 0",
                }}
              >
                No cards in hand
              </div>
            ) : (
              myHand.map((card) => {
                const valid =
                  isMyTurn &&
                  isCardValid(card, topCard, currentColor, drawStack);
                return (
                  <UnoCard
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card)}
                    disabled={!isMyTurn || !valid}
                    valid={valid}
                  />
                );
              })
            )}
          </div>

          <div className="self-meta">
            {me && <PlayerLabel player={me} idx={myIdx} isActive={isMyTurn} />}
            <button
              onClick={onSayUno}
              disabled={!isMyTurn || myHand.length !== 2}
              style={{
                background:
                  myHand.length === 2 && isMyTurn
                    ? "linear-gradient(135deg,var(--c-red),#ff6b6b)"
                    : "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                padding: "4px 13px",
                fontFamily: "Orbitron",
                fontSize: 10,
                fontWeight: 900,
                color: "#fff",
                cursor:
                  myHand.length === 2 && isMyTurn ? "pointer" : "not-allowed",
                letterSpacing: 2,
                opacity: myHand.length === 2 && isMyTurn ? 1 : 0.3,
                transition: "opacity 0.2s, background 0.2s",
              }}
            >
              UNO!
            </button>
            <button
              onClick={onLeaveRoom}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "4px 11px",
                fontFamily: "Orbitron",
                fontSize: 9,
                color: "var(--text-muted)",
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
              LEAVE
            </button>
          </div>
        </div>
      </div>

      {pendingWild && (
        <ColorPicker
          onChoose={handleColorChosen}
          onCancel={() => setPendingWild(null)}
        />
      )}

      {iWon && <WinScreen playerName={me?.name} onLeave={onLeaveRoom} />}
      {iLost && (
        <LoseScreen winnerName={winnerPlayer?.name} onLeave={onLeaveRoom} />
      )}
    </>
  );
}
