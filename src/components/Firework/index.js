import React from 'react';
import './index.scss';

export default function Firework({ children, tip = '' }) {
  return (
    <div className="firework">
      <div className="firework-large" />
      <div className="firework-small" />
      <div className="firework-medium" />
      <div className="content">{children}</div>
      {tip && <div className="tip">- {tip} -</div>}
    </div>
  );
}
