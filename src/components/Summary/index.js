import React from 'react';
import classnames from 'classnames';
import './index.scss';

export default function Summary({ level, children, tip = '' }) {
  return (
    <div className={classnames('summary', `summary-${level}`)}>
      <div className="content">{children}</div>
      {tip && <div className="tip">- {tip} -</div>}
    </div>
  );
}
