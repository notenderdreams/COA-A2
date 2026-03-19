import React from 'react';

export default function Tag({ 
  children, 
  type, 
  active, 
  done, 
  className = '', 
  ...props 
}) {
  let cls = 'qtag';
  if (type === 'R' || type === 'r') cls += ' r';
  if (type === 'W' || type === 'w') cls += ' w';
  if (active) cls += ' act';
  if (done) cls += ' done';
  
  return (
    <span className={`${cls} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
