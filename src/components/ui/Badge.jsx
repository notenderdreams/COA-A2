import React from 'react';

export default function Badge({ className = '', variant = '', children, ...props }) {
  let baseClass = 'schip';
  if (variant) baseClass += ` sc-${variant}`;
  return (
    <span className={`${baseClass} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
