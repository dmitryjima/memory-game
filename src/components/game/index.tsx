import { useCallback } from 'react';
import styled from 'styled-components';

import {
  GAME_DIFFICULTIES,
  GAME_MODES,
  TChallengeType,
  TDifficultyOption,
  TGameMode,
  useGameState,
} from '../../contexts/gameStateContext';
import { TCardItemType } from '../../types/TCardItem';
import formatMs from '../../utils/formatMs';

import Grid from '../grid';
import SpinnerTimer from '../spinnerTimer';

const Game: React.FunctionComponent = () => {
  const {
    gameStatus,
    difficulty,
    gameMode,
    gameType,
    challengeType,
    currentPlayer,
    player1Score,
    player2Score,
    gameTimerValue,
    selectionTimerValue,
    startNewGame,
    returnToMainMenu,
    selectDifficulty,
    selectGameMode,
    selectChallengeType,
    selectGameType,
  } = useGameState();

  const screenSwitcher = useCallback(() => {
    if (gameStatus === 'start') {
      return (
        <SMenuScreen>
          <SItem>
            <label htmlFor='select_difficulty'>Difficulty:{` `}</label>
            <select
              id='select_difficulty'
              value={difficulty}
              onChange={(e) =>
                selectDifficulty(e.target.value as TDifficultyOption)
              }
            >
              {GAME_DIFFICULTIES.map((v) => (
                <option key={v} value={v}>
                  {`${v[0].toUpperCase()}${v.slice(1)}`}
                </option>
              ))}
            </select>
          </SItem>
          <SItem>
            <label htmlFor='select_gameType'>Game Type:{` `}</label>
            <select
              id='select_gameType'
              value={gameType}
              onChange={(e) => selectGameType(e.target.value as TCardItemType)}
            >
              <option value={'images'}>Images</option>
              <option value={'numbers'}>Numbers</option>
            </select>
          </SItem>
          <SItem>
            <label htmlFor='select_challengeType'>Challenge Type: {` `}</label>
            <select
              id='select_challengeType'
              value={challengeType}
              onChange={(e) =>
                selectChallengeType(e.target.value as TChallengeType)
              }
            >
              <option value={'blind'}>Blind</option>
              <option value={'initialReveal'}>Initial Reveal</option>
            </select>
          </SItem>
          <SItem>
            <label htmlFor='select_gameMode'>Game Mode:{` `}</label>
            <select
              id='select_gameMode'
              value={gameMode}
              onChange={(e) => selectGameMode(e.target.value as TGameMode)}
            >
              {GAME_MODES.map((v) => (
                <option key={v} value={v}>
                  {`${v[0].toUpperCase()}${v.slice(1)}`}
                </option>
              ))}
            </select>
          </SItem>
          <SMenuButton onClick={() => startNewGame()}>Play</SMenuButton>
        </SMenuScreen>
      );
    } else if (gameStatus === 'playing' || gameStatus === 'initialReveal') {
      return (
        <SGameScreen>
          {selectionTimerValue !== 0 ? <SpinnerTimer /> : null}
          {gameMode === 'hotseat' ? (
            <>
              <SPlayer1Score>
                <h2>Player 1</h2>
                <h2>Points: {player1Score}</h2>
              </SPlayer1Score>
              <SPlayer2Score>
                <h2>Player 2</h2>
                <h2>Points: {player2Score}</h2>
              </SPlayer2Score>
            </>
          ) : null}
          <Grid />
          <SMenuButton
            style={{ marginTop: '2em' }}
            onClick={() => returnToMainMenu()}
          >
            Main Menu
          </SMenuButton>
        </SGameScreen>
      );
    } else if (gameStatus === 'finished') {
      return (
        <SMenuScreen>
          {gameMode === 'single' ? (
            <>
              <h2>Nice!</h2>
              <h3>Score: {formatMs(gameTimerValue)}</h3>
              <SMenuButton onClick={() => startNewGame()}>
                Play Again
              </SMenuButton>
              <SMenuButton onClick={() => returnToMainMenu()}>
                Main Menu
              </SMenuButton>
            </>
          ) : (
            <>
              <h2>
                {player1Score} : {player2Score}{' '}
              </h2>
              <h3>
                {player1Score > player2Score
                  ? 'Player 1 wins!'
                  : 'Player 2 wins!'}
              </h3>
              <h4>Time: {formatMs(gameTimerValue)}</h4>
              <SMenuButton onClick={() => startNewGame()}>
                Play Again
              </SMenuButton>
              <SMenuButton onClick={() => returnToMainMenu()}>
                Main Menu
              </SMenuButton>
            </>
          )}
        </SMenuScreen>
      );
    }
  }, [
    challengeType,
    difficulty,
    gameMode,
    gameStatus,
    gameTimerValue,
    gameType,
    player1Score,
    player2Score,
    returnToMainMenu,
    selectChallengeType,
    selectDifficulty,
    selectGameMode,
    selectGameType,
    selectionTimerValue,
    startNewGame,
  ]);

  return (
    <SContainer
      $currentPlayer={
        gameMode === 'hotseat' && gameStatus === 'playing'
          ? currentPlayer
          : undefined
      }
    >
      <SHeading>Memory Game</SHeading>
      <SGameContainer>{screenSwitcher()}</SGameContainer>
    </SContainer>
  );
};

export default Game;

const SContainer = styled.div<{
  $currentPlayer?: number | undefined;
}>`
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;

  box-shadow: ${({ $currentPlayer }) => {
    if ($currentPlayer) {
      if ($currentPlayer === 1) {
        return '0px 0px 149px 34px rgba(23, 72, 171, 0.573) inset';
      } else {
        return '0px 0px 149px 34px rgba(171, 23, 68, 0.374) inset';
      }
    } else {
      return 'none';
    }
  }};

  @media (prefers-color-scheme: dark) {
    box-shadow: ${({ $currentPlayer }) => {
      if ($currentPlayer) {
        if ($currentPlayer === 1) {
          return '0px 0px 149px 34px rgba(125, 163, 239, 0.767) inset';
        } else {
          return '0px 0px 149px 34px rgba(233, 129, 160, 0.605) inset';
        }
      } else {
        return 'none';
      }
    }};
  }
`;

const SGameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
`;

const SMenuScreen = styled.div`
  margin-top: 10em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1em;
`;

const SHeading = styled.h1`
  font-size: 2em;
  margin-top: 0;
  margin-bottom: 2em;
`;

const SMenuButton = styled.button``;

const SItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5em;
`;

const SGameScreen = styled.div`
  margin-top: 2em;
`;

const SPlayer1Score = styled.div`
  position: absolute;
  left: 2em;
  top: 2em;

  color: #00118d;

  @media (prefers-color-scheme: dark) {
    -webkit-text-stroke: 1px white;
  }
`;

const SPlayer2Score = styled.div`
  position: absolute;
  right: 2em;
  top: 2em;

  color: #9c020f;

  @media (prefers-color-scheme: dark) {
    -webkit-text-stroke: 1px white;
  }
`;
