import React from 'react';
import classnames from 'classnames';
import './index.scss';

export default function Button({ className = '', children, ...otherProps }) {
  return (
    <div className={classnames('nice-button', className)} {...otherProps}>
      {children}
    </div>
  );
}
