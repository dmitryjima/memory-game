import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import generateCardsSet from '../utils/generateCardsSet';

import TCardItem, { TCardItemType } from '../types/TCardItem';

export const REVEAL_TIME_MS = 3000;

export const GAME_DIFFICULTIES = ['easy', 'medium', 'hard', 'test'] as const;
export type TDifficultyOption = (typeof GAME_DIFFICULTIES)[number];
export const CHALLENGE_TYPES = ['blind', 'initialReveal'] as const;
export type TChallengeType = (typeof CHALLENGE_TYPES)[number];
export const GAME_MODES = ['single', 'hotseat'] as const;
export type TGameMode = (typeof GAME_MODES)[number];
export const GAME_STATUSES = [
  'start',
  'playing',
  'initialReveal',
  'finished',
] as const;
export type TGameStatus = (typeof GAME_STATUSES)[number];

export const GameStateContext = createContext<{
  // General configs
  difficulty: TDifficultyOption;
  gameType: TCardItemType;
  challengeType: TChallengeType;
  gameMode: TGameMode;
  gameStatus: TGameStatus;
  // Inner values
  isRevealAll: boolean;
  cardsNumber: number;
  cards: TCardItem[];
  selectedCards: TCardItem[];
  revealedCards: TCardItem[];
  // Timers
  gameTimerValue: number;
  selectionTimerValue: number;
  // Hotseat
  currentPlayer: 1 | 2 | undefined;
  player1Score: number;
  player2Score: number;
  // General
  startNewGame: () => void;
  returnToMainMenu: () => void;
  selectDifficulty: (newDifficulty: TDifficultyOption) => void;
  selectGameMode: (mode: TGameMode) => void;
  selectChallengeType: (challengeType: TChallengeType) => void;
  selectGameType: (gameType: TCardItemType) => void;
  // Inner methods
  revealCard: (card: TCardItem) => void;
}>({
  // General configs
  difficulty: 'medium',
  gameType: 'numbers',
  challengeType: 'blind',
  gameMode: 'single',
  // Inner values
  gameStatus: 'start',
  isRevealAll: false,
  cardsNumber: 36,
  cards: [],
  selectedCards: [],
  revealedCards: [],
  // Timers
  gameTimerValue: 0,
  selectionTimerValue: 0,
  // Hotseat
  currentPlayer: undefined,
  player1Score: 0,
  player2Score: 0,
  // General
  startNewGame: () => {},
  returnToMainMenu: () => {},
  selectDifficulty: () => {},
  selectGameMode: () => {},
  selectChallengeType: () => {},
  selectGameType: () => {},
  // Inner methods
  revealCard: () => {},
});

interface IGameStateContextProvider {
  children: React.ReactNode;
}

const GameStateContextProvider: React.FunctionComponent<
  IGameStateContextProvider
> = ({ children }) => {
  // General
  const [difficulty, setDifficulty] = useState<TDifficultyOption>('medium');
  const [gameType, setGameType] = useState<TCardItemType>('numbers');
  const [challengeType, setChallengeType] = useState<TChallengeType>('blind');
  const [gameMode, setGameMode] = useState<TGameMode>('single');

  // Inner values
  const [gameStatus, setGameStatus] = useState<TGameStatus>('start');
  const cardsNumber = useMemo(() => {
    switch (difficulty) {
      case 'test': {
        return 2 * 2;
      }
      case 'easy': {
        return 4 * 4;
      }
      case 'hard': {
        return 8 * 8;
      }
      default: {
        return 6 * 6;
      }
    }
  }, [difficulty]);

  // Cards
  const [cards, setCards] = useState<TCardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<TCardItem[]>([]);
  const [revealedCards, setRevealedCards] = useState<TCardItem[]>([]);
  const [isRevealAll, setIsRevealAll] = useState(false);

  // Timers
  const gameTimerIntervalRef = useRef(0);
  const [gameTimerValue, setGameTimerValue] = useState<number>(0);

  const selectionTimerIntervalValue = useRef(0);
  const [selectionTimerValue, setSelectionTimerValue] = useState<number>(0);

  // Hotseat
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2 | undefined>(
    undefined
  );
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  // Methods implementation
  // General configs methods
  const selectDifficulty = useCallback((difficulty: TDifficultyOption) => {
    setDifficulty(difficulty);
  }, []);

  const selectGameType = useCallback((gameType: TCardItemType) => {
    setGameType(gameType);
  }, []);

  const selectChallengeType = useCallback((challengeType: TChallengeType) => {
    setChallengeType(challengeType);
  }, []);

  const selectGameMode = useCallback((mode: TGameMode) => {
    setGameMode(mode);
  }, []);

  // Gameplay methods
  const launchGameIntervalTimer = useCallback(() => {
    gameTimerIntervalRef.current = setInterval(() => {
      setGameTimerValue((curr) => curr + 100);
    }, 100);
  }, []);

  const resetGameTimerInterval = useCallback(() => {
    clearInterval(gameTimerIntervalRef.current);
  }, []);

  const resetSelectionTimerInterval = useCallback(() => {
    clearInterval(selectionTimerIntervalValue.current);
  }, []);

  const startNewGame = useCallback(() => {
    // Apply values to the players if relevant
    if (gameMode === 'hotseat') {
      setCurrentPlayer(1);
      setPlayer1Score(0);
      setPlayer2Score(0);
    }

    // Reset cards
    setSelectedCards(() => []);
    setRevealedCards(() => []);
    const newCardsSet = generateCardsSet(cardsNumber, gameType);
    setCards(() => newCardsSet);

    // Start the game immediately for the blind type of challenge
    if (challengeType === 'blind') {
      setGameStatus('playing');
      setGameTimerValue(0);
      launchGameIntervalTimer();
    } else {
      // Reveal cards for three seconds for the Initial Reveal
      setGameStatus('initialReveal');
    }
  }, [cardsNumber, challengeType, gameMode, gameType, launchGameIntervalTimer]);

  const returnToMainMenu = useCallback(() => {
    setGameStatus('start');
    setGameTimerValue(0);
    resetGameTimerInterval();
    resetSelectionTimerInterval();

    // Reset cards
    setSelectedCards(() => []);
    setRevealedCards(() => []);

    // Reset players
    setCurrentPlayer(undefined);
    setPlayer1Score(0);
    setPlayer2Score(0);
  }, [resetGameTimerInterval, resetSelectionTimerInterval]);

  // Used in the Card Component
  const revealCard = useCallback(
    (card: TCardItem) => {
      if (selectedCards.length >= 2) {
        return;
      }
      setSelectedCards((curr) => [...curr, card]);
    },
    [selectedCards.length]
  );

  // Context value
  const contextValue = useMemo(
    () => ({
      gameStatus,
      isRevealAll,
      difficulty,
      gameType,
      challengeType,
      gameMode,
      cardsNumber,
      cards,
      selectedCards,
      revealedCards,
      gameTimerValue,
      selectionTimerValue,
      currentPlayer,
      player1Score,
      player2Score,
      startNewGame,
      returnToMainMenu,
      selectDifficulty,
      selectGameMode,
      selectChallengeType,
      selectGameType,
      revealCard,
    }),
    [
      gameStatus,
      isRevealAll,
      difficulty,
      gameType,
      challengeType,
      gameMode,
      cardsNumber,
      cards,
      selectedCards,
      revealedCards,
      gameTimerValue,
      selectionTimerValue,
      currentPlayer,
      player1Score,
      player2Score,
      startNewGame,
      returnToMainMenu,
      selectDifficulty,
      selectGameMode,
      selectChallengeType,
      selectGameType,
      revealCard,
    ]
  );

  // Effects
  // Main score logic
  useEffect(() => {
    let timerTimout: number;
    if (selectedCards.length === 2) {
      if (gameMode !== 'hotseat') {
        setSelectionTimerValue(REVEAL_TIME_MS);

        selectionTimerIntervalValue.current = setInterval(() => {
          setSelectionTimerValue((curr) => curr - 100);
        }, 100);

        timerTimout = setTimeout(() => {
          // Handle match
          if (selectedCards[0].value === selectedCards[1].value) {
            setRevealedCards((curr) => [...curr, ...selectedCards]);
            setSelectedCards(() => []);
          } else {
            // Handle miss
            setSelectedCards(() => []);
          }
        }, REVEAL_TIME_MS);
      } else {
        setSelectionTimerValue(REVEAL_TIME_MS);
        selectionTimerIntervalValue.current = setInterval(() => {
          setSelectionTimerValue((curr) => curr - 100);
        }, 100);
        timerTimout = setTimeout(() => {
          // Handle match
          if (selectedCards[0].value === selectedCards[1].value) {
            if (currentPlayer === 1) {
              setPlayer1Score((curr) => curr + 1);
            } else {
              setPlayer2Score((curr) => curr + 1);
            }
            setRevealedCards((curr) => [...curr, ...selectedCards]);
            setSelectedCards(() => []);
          } else {
            // Handle miss
            setCurrentPlayer((curr) => (curr === 1 ? 2 : 1));
            setSelectedCards(() => []);
          }
        }, REVEAL_TIME_MS);
      }
    }

    return () => {
      clearInterval(selectionTimerIntervalValue.current);
      clearTimeout(timerTimout);
    };
  }, [currentPlayer, gameMode, selectedCards]);

  // Initial Reveal challenge type
  // Show cards and a timer first, then proceed with the game
  useEffect(() => {
    let timerTimout: number;
    if (gameStatus === 'initialReveal') {
      setIsRevealAll(true);

      setSelectionTimerValue(REVEAL_TIME_MS);

      selectionTimerIntervalValue.current = setInterval(() => {
        setSelectionTimerValue((curr) => curr - 100);
      }, 100);
      timerTimout = setTimeout(() => {
        setIsRevealAll(false);
        setGameTimerValue(0);
        launchGameIntervalTimer();
        setGameStatus('playing');
        clearInterval(selectionTimerIntervalValue.current);
      }, REVEAL_TIME_MS);
    }

    return () => {
      clearInterval(selectionTimerIntervalValue.current);
      clearTimeout(timerTimout);
    };
  }, [gameStatus, launchGameIntervalTimer]);

  // Finish the game if all the cards are revealed and the timer is not 0
  // i.e. the game is going on
  useEffect(() => {
    if (revealedCards.length === cards.length && gameTimerValue !== 0) {
      resetGameTimerInterval();
      setGameStatus('finished');
    }
  }, [cards.length, gameTimerValue, resetGameTimerInterval, revealedCards]);

  return (
    <GameStateContext.Provider value={contextValue}>
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateContextProvider;

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error(
      'useGameState must be used inside a `GameStateContextProvider`'
    );
  }

  return context;
}
