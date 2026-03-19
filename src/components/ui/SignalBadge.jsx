import React from 'react';

export default function SignalBadge({ 
  signalName, 
  value, 
  variantClass = '', 
  className = '', 
  ...props 
}) {
  const activeClass = value ? `on ${variantClass}`.trim() : '';
  return (
    <div className={`sp ${activeClass} ${className}`.trim()} {...props}>
      {signalName.replace(/_/g, ' ')} = <b>{value}</b>
    </div>
  );
}
