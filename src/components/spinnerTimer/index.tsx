import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { REVEAL_TIME_MS, useGameState } from '../../contexts/gameStateContext';

const SpinnerTimer: React.FunctionComponent = () => {
  const { selectionTimerValue } = useGameState();
  const lineRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    if (lineRef.current) {
      const percentage = selectionTimerValue / REVEAL_TIME_MS;

      lineRef.current?.style.setProperty(
        '--stroke-dasharray',
        `${percentage}, 100`
      );

      lineRef.current?.style.setProperty('transition', `0.1s linear`);
    }
  }, [selectionTimerValue]);

  return (
    <SContainer>
      <div className='spinnerWrapper'>
        <svg viewBox='-25 -25 50 50' className='spinner'>
          <circle className='ring' cx='0' cy='0' r='22' />
          <circle
            ref={lineRef}
            className='line'
            cx='0'
            cy='0'
            r='22'
            pathLength='1'
          />
        </svg>
      </div>
    </SContainer>
  );
};

export default SpinnerTimer;

const SContainer = styled.div`
  position: absolute;
  left: calc(50% - 1.5em);
  top: 5em;

  width: 3em;
  height: 3em;

  .spinnerWrapper {
    transform: rotate(-90deg);
  }

  circle {
    fill: none;
    stroke-linecap: butt;
    stroke-width: 3;
  }

  .ring {
    stroke: #000;
    opacity: 0.1;
  }

  @media (prefers-color-scheme: dark) {
    .ring {
      stroke: #c1c1c1;
      opacity: 0.5;
    }
  }

  .line {
    stroke: #62cbf2;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: var(--stroke-dasharray);
  }

  @media (min-width: 764px) {
  }
`;
