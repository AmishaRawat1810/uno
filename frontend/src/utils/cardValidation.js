export function isCardValid(card, topCard, currentColor, drawStack = 0) {
  if (!card || !topCard) return false;

  const isStackCard = (c) => c.type === 'draw2' || c.type === 'draw4';

  if (drawStack > 0) {
    return isStackCard(card);
  }

  if (card.type === 'wild' || card.type === 'draw4') {
    return true;
  }

  if (card.color === currentColor) {
    return true;
  }

  if (card.type === 'number' && topCard.type === 'number') {
    return card.value === topCard.value;
  }

  return card.type === topCard.type;
}
