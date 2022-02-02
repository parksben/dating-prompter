import React from 'react';

export default function Conditional({ children, visible }) {
  if (!visible) return null;
  return <>{children}</>;
}
