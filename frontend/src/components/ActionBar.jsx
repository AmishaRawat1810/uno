export default function ActionBar({
  onDrawCard,
  onSayUno,
  onLeaveRoom,
  canSayUno,
  disabled,
}) {
  return (
    <div className="action-bar">
      <button type="button" onClick={onDrawCard} disabled={disabled}>
        Draw Card
      </button>
      <button
        type="button"
        onClick={onSayUno}
        disabled={!canSayUno || disabled}
      >
        UNO!
      </button>
      <button type="button" className="secondary danger" onClick={onLeaveRoom}>
        Leave
      </button>
    </div>
  );
}
