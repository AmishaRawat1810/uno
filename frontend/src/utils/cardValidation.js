export function isCardValid(card, topCard, currentColor) {
  if (!card || !topCard) return false;

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
