import React from 'react';

export default function Divider({ className = '', style = {}, ...props }) {
  return (
    <div
      className={`divider ${className}`.trim()}
      style={{
        width: "1px",
        height: "14px",
        background: "var(--border2)",
        margin: "0 4px",
        ...style
      }}
      {...props}
    />
  );
}
