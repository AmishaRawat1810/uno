import Card from "./Card.jsx";
import { isCardValid } from "../utils/cardValidation.js";

export default function Hand({
  hand,
  topCard,
  currentColor,
  drawStack,
  onPlayCard,
  disabled,
}) {
  return (
    <div className="hand-list">
      {hand.length === 0 ? (
        <div className="hand-empty">No cards in hand</div>
      ) : (
        hand.map((card) => {
          const isValid = !disabled && isCardValid(card, topCard, currentColor, drawStack);
          return (
            <Card
              key={card.id}
              card={card}
              onClick={() => onPlayCard(card)}
              disabled={disabled || !isValid}
            />
          );
        })
      )}
    </div>
  );
}
