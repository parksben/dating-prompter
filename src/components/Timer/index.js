import React, { useEffect, useRef } from 'react';
import './index.scss';

export default function Timer({
  duration = 15 * 60 * 1000,
  paused = false,
  onFinish = () => {},
}) {
  const container = useRef(null);
  const interval = useRef(null);
  const begin = useRef(performance.now());

  useEffect(() => {
    clearInterval(interval.current);

    if (!paused) {
      begin.current =
        performance.now() -
        (Number(container.current.querySelector('.clock').dataset.tick) || 0);

      interval.current = setInterval(() => {
        const tick = performance.now() - begin.current;

        if (tick > duration) {
          clearInterval(interval.current);
          typeof onFinish === 'function' && onFinish();
          return;
        }

        container.current.querySelector('.clock').dataset.tick = tick;
        container.current.querySelector('.clock').innerText = formatClock(tick);
        container.current.querySelector('.progress').style.width =
          Math.round((10000 * tick) / duration) / 100 + '%';
      }, 1000);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [duration, onFinish, paused]);

  return (
    <div
      className="timer"
      style={{ fontFamily: 'Helvetica Neue' }}
      ref={container}>
      <span className="clock">00 : 00 : 00</span>
      <span className="progress" />
    </div>
  );
}

function formatClock(tick) {
  const secUnit = 1000;
  const minUnit = 60 * secUnit;
  const hourUnit = 60 * minUnit;

  const hour = Math.floor(tick / hourUnit);
  const minute = Math.floor((tick - hour * hourUnit) / minUnit);
  const second = Math.floor(
    (tick - hour * hourUnit - minute * minUnit) / secUnit
  );

  return [hour, minute, second]
    .map((x) => (x < 10 ? `0${x}` : String(x)))
    .join(' : ');
}
