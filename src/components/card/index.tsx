import { useMemo } from 'react';
import styled, { css, keyframes } from 'styled-components';

import TCardItem from '../../types/TCardItem';
import { useGameState } from '../../contexts/gameStateContext';

const Card: React.FunctionComponent<TCardItem> = ({ id, value, type }) => {
  const { revealedCards, selectedCards, isRevealAll, revealCard } =
    useGameState();
  const isDisabled = useMemo(
    () =>
      selectedCards.findIndex((v) => v.id === id) !== -1 ||
      revealedCards.findIndex((v) => v.id === id) !== -1 ||
      selectedCards.length > 1 ||
      isRevealAll,
    [id, isRevealAll, revealedCards, selectedCards]
  );
  const isSelected = useMemo(
    () => selectedCards.findIndex((v) => v.id === id) !== -1 || isRevealAll,
    [id, isRevealAll, selectedCards]
  );
  const isRevealed = useMemo(
    () => revealedCards.findIndex((v) => v.id === id) !== -1,
    [id, revealedCards]
  );

  return (
    <SContainerButton
      disabled={isDisabled}
      $isSelected={isSelected}
      $isRevealed={isRevealed}
      onClick={() =>
        revealCard({
          id,
          value,
        })
      }
    >
      <div className='innerContainer'>
        <div className='cardFrontFace' />
        <div className='cardBackFace'>
          {type === 'numbers' ? value : <SImg src={value} />}
        </div>
      </div>
    </SContainerButton>
  );
};

export default Card;

const FadeOutSuccessAnimation = keyframes`
	0% {
		opacity: 100%;
	}
	25% {
		opacity: 100%;
	}
	99% {
		opacity: 0%;
	}
	100% {
		opacity: 0%;
		visibility: hidden;
	}
`;

const SContainerButton = styled.button<{
  $isSelected: boolean;
  $isRevealed: boolean;
}>`
  display: flex;
  box-sizing: border-box;
  background: transparent;
  padding: 0;
  width: 2.5em;
  height: 2.5em;
  border-radius: 0.6em;
  border-color: transparent;
  border-width: 0;

  &:hover,
  &:focus,
  &:focus-visible {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
  }

  &:not(:disabled):hover,
  &:not(:disabled):active,
  &:not(:disabled):focus,
  &:not(:disabled):focus-visible {
    cursor: pointer;
    outline: none;
    .innerContainer {
      box-shadow: 0 4px 8px 0 rgba(71, 128, 236, 0.959);
    }
  }

  .innerContainer {
    border-radius: 0.6em;
    background: transparent;

    position: relative;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  }

  .cardBackFace {
    border-radius: 0.6em;

    position: absolute;
    width: 100%;
    height: 100%;

    backface-visibility: hidden;
    overflow: hidden;

    background-color: #f8f7ee;
    color: #090909;
    transform: rotateY(180deg);

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: x-large;
  }

  .cardFrontFace {
    border-radius: 0.6em;
    position: absolute;
    width: 100%;
    height: 100%;

    background: rgb(36, 89, 108);
    background: linear-gradient(
      57deg,
      rgba(36, 89, 108, 1) 0%,
      rgba(68, 224, 255, 0.925) 72%,
      rgba(166, 226, 238, 0.7659090909090909) 100%
    );

    backface-visibility: hidden;
  }

  ${({ $isSelected }) =>
    $isSelected
      ? css`
          .innerContainer {
            transform: rotateY(180deg);
          }
        `
      : null};

  ${({ $isRevealed }) =>
    $isRevealed
      ? css`
          animation: ${FadeOutSuccessAnimation} 0.8s linear forwards;
          .cardBackFace {
            background-color: rgb(198, 245, 177);
          }
          .innerContainer {
            transform: rotateY(180deg);
          }
        `
      : null};

  @media (min-width: 764px) {
    width: 6.5em;
    height: 6.5em;
  }
`;

const SImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;
