import React from 'react';
import './index.scss';

export default function Summary({ children, tip = '' }) {
  return (
    <div className="summary">
      <div className="firework-large" />
      <div className="firework-small" />
      <div className="firework-medium" />
      <div className="content">{children}</div>
      {tip && <div className="tip">- {tip} -</div>}
    </div>
  );
}
