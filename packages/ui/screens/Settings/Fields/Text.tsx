import React from 'react';

export default ({ value = '', helperText = null, onChange, label, type = 'text', hasError = false, ...props }) => (
  <div className={`field ${hasError ? 'has-error' : ''}`}>
    <label>
      {label}
    </label>
    <div>
      <input type={type} value={value} onChange={e => onChange(e.target.value || undefined)} placeholder={label.replace('*', '')} {...props} />
      {helperText && <small>{helperText}</small>}
    </div>
  </div>
);
