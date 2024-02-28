import { v4 as uuidv4 } from 'uuid';
import TCardItem, { TCardItemType } from '../types/TCardItem';

export default function generateCardsSet(
  numberOfCards: number,
  setType?: TCardItemType
): TCardItem[] {
  let currentIdx = numberOfCards;
  let randomIdx: number;
  const newCardsSet: TCardItem[] = [];

  // Seed the array with values
  if (setType === 'images') {
    for (let i = 0; i < numberOfCards; i++) {
      const value = (i % (numberOfCards / 2)) + 1;
      const obj: TCardItem = {
        id: uuidv4(),
        value: `https://randomfox.ca/images/${value}.jpg`,
        type: 'images',
      };

      newCardsSet.push(obj);
    }
  } else {
    for (let i = 0; i < numberOfCards; i++) {
      const value = (i % (numberOfCards / 2)) + 1;
      const obj: TCardItem = {
        id: uuidv4(),
        value: `${value}`,
        type: 'numbers',
      };

      newCardsSet.push(obj);
    }
  }

  // Shuffle the array
  while (currentIdx > 0) {
    randomIdx = Math.floor(Math.random() * currentIdx);
    currentIdx--;

    // And swap it with the current element.
    [newCardsSet[currentIdx], newCardsSet[randomIdx]] = [
      newCardsSet[randomIdx],
      newCardsSet[currentIdx],
    ];
  }

  return newCardsSet;
}
