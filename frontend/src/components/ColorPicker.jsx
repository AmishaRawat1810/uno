const colors = ["red", "blue", "green", "yellow"];

export default function ColorPicker({ onChoose, onCancel }) {
  return (
    <div className="picker-overlay">
      <div className="picker-panel">
        <h3>Choose a color</h3>
        <div className="picker-grid">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`picker-button ${color}`}
              onClick={() => onChoose(color)}
            >
              {color}
            </button>
          ))}
        </div>
        <button type="button" className="picker-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
