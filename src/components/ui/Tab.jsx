import React from 'react';

export default function Tab({ active, children, className = '', ...props }) {
  return (
    <div 
      className={`tab ${active ? 'active' : ''} ${className}`.trim()} 
      {...props}
    >
      {children}
    </div>
  );
}
