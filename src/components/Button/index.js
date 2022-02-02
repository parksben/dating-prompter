import React from 'react';
import classnames from 'classnames';
import './index.scss';

export default function Button({
  className = '',
  children,
  size = 'medium',
  disabled = false,
  ...otherProps
}) {
  return (
    <div
      className={classnames('nice-button', className, size, { disabled })}
      {...otherProps}>
      {children}
    </div>
  );
}
