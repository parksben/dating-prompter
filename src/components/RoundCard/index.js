import React from 'react';
import classnames from 'classnames';
import './index.scss';

export default function RoundCard({ round = 1, tip = '' }) {
  return (
    <div className={classnames('round-card', `round-${round}`)}>
      <div className="title">ROUND {round}</div>
      {tip && <div className="tip">- {tip} -</div>}
    </div>
  );
}
