import styled from 'styled-components';

import { useGameState } from '../../contexts/gameStateContext';

import Card from '../card';

interface IGrid {}

const Grid: React.FunctionComponent<IGrid> = () => {
  const { cards } = useGameState();

  return (
    <SContainer $numColumns={Math.sqrt(cards.length)}>
      {cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          value={card.value}
          type={card.type || 'numbers'}
        />
      ))}
    </SContainer>
  );
};

export default Grid;

const SContainer = styled.div<{
  $numColumns: number;
}>`
  display: grid;
  grid-template-columns: ${({ $numColumns }) => `repeat(${$numColumns}, 1fr);`};
  gap: 1em;
`;
