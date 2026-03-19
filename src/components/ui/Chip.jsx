import React from 'react';

export default function Chip({ 
  children, 
  className = '', 
  live, 
  ...props 
}) {
  return (
    <div className={`chip ${live ? 'live' : ''} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
