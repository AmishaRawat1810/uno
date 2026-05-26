const colorMap = {
  red: "#E53935",
  yellow: "#FDD835",
  green: "#43A047",
  blue: "#1E88E5",
  wild: "#424242",
};

export default function Card({ card, onClick, disabled }) {
  const background = colorMap[card.color] || "#FFFFFF";

  return (
    <button
      type="button"
      className="card"
      onClick={onClick}
      disabled={disabled}
      style={{ background }}
    >
      <div className="card-label">
        {card.type === "number" ? card.value : card.type.toUpperCase()}
      </div>
      {card.color === "wild" ? <div className="card-subtitle">WILD</div> : null}
    </button>
  );
}
