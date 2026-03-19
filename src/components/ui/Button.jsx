import React from 'react';

export default function Button({ 
  className = '', 
  variant = 'default', 
  active,
  disabled,
  children, 
  ...props 
}) {
  let baseClass = 'btn';
  if (variant && variant !== 'default') {
    baseClass += ` ${variant}`;
  }
  if (active) baseClass += ' act';

  return (
    <button 
      className={`${baseClass} ${className}`.trim()} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
