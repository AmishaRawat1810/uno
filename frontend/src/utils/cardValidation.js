export function isCardValid(card, topCard, currentColor, drawStack = 0) {
  if (!card || !topCard) return false;

  const isStackCard = (c) => c.type === 'draw2' || c.type === 'draw4';

  // When a draw stack is active, only stacking cards are valid
  if (drawStack > 0) {
    return isStackCard(card);
  }

  // Wild and draw4 are always playable
  if (card.type === 'wild' || card.type === 'draw4') {
    return true;
  }

  // Match by current active color
  if (card.color === currentColor) {
    return true;
  }

  // Match by number value
  if (card.type === 'number' && topCard.type === 'number') {
    return card.value === topCard.value;
  }

  // Match by type (skip, reverse, draw2, etc.)
  return card.type === topCard.type;
}