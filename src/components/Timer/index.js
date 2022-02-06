import React, { useCallback, useEffect, useRef } from 'react';
import './index.scss';

export default function Timer({
  duration = 15 * 60 * 1000,
  paused = false,
  onFinish = () => {},
}) {
  const container = useRef(null);
  const interval = useRef(null);
  const begin = useRef(performance.now());

  // 创建 interval 以更新定时器
  const makeInterval = useCallback(
    (isVisibilityChange = false) => {
      clearInterval(interval.current);

      if (!paused) {
        if (!isVisibilityChange) {
          begin.current =
            performance.now() -
            (Number(container.current.querySelector('.clock').dataset.tick) ||
              0);
        }

        interval.current = setInterval(() => {
          const tick = performance.now() - begin.current;

          if (tick > duration) {
            clearInterval(interval.current);
            typeof onFinish === 'function' && onFinish();
            return;
          }

          container.current.querySelector('.progress').style.width =
            Math.round((10000 * tick) / duration) / 100 + '%';

          container.current.querySelector('.clock').dataset.tick = tick;
          container.current.querySelector('.clock').innerText = formatClock(
            Math.max(0, duration - tick)
          );
        }, 1000);
      }
    },
    [duration, onFinish, paused]
  );

  useEffect(() => {
    makeInterval();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        makeInterval(true);
      }
    };

    // 解决 ios 下设备熄屏后定时器停止的问题
    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
      false
    );

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
        false
      );

      clearInterval(interval.current);
    };
  }, [makeInterval]);

  return (
    <div
      className="timer"
      style={{ fontFamily: 'Helvetica Neue' }}
      ref={container}>
      <span className="clock">{formatClock(duration)}</span>
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
