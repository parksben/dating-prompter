import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import './index.scss';

export default function PageLayout({
  className = '',
  children,
  style = {},
  ...otherProps
}) {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let timer;

    const handleResize = () => {
      clearTimeout(timer);

      setTimeout(() => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 200);
    };

    window.addEventListener('resize', handleResize, false);

    return () => {
      window.removeEventListener('resize', handleResize, false);
    };
  }, []);

  return (
    <div
      className={classnames('page-wrapper', className)}
      style={{ ...size, ...style }}
      {...otherProps}>
      <div className="page-inner">{children}</div>
    </div>
  );
}
