export default function TopCard({ topCard, currentColor, drawStack }) {
  return (
    <div className="top-card-panel">
      <div className="top-card-label">Discard pile</div>
      <div className="top-card-body">
        <div className="current-color">Current: {currentColor || "None"}</div>
        {topCard ? (
          <div className="top-card-inner">
            <div className="card-value">
              {topCard.type === "number"
                ? topCard.value
                : topCard.type.toUpperCase()}
            </div>
            <div className="card-color">{topCard.color}</div>
          </div>
        ) : (
          <div className="top-card-empty">No card yet</div>
        )}
        {drawStack > 0 && (
          <div className="draw-stack-pill">Stack: {drawStack}</div>
        )}
      </div>
    </div>
  );
}
