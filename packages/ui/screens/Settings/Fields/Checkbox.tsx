import React from 'react';

export default ({ value = false, helperText = null, onChange, label, type = 'text', ...props }) => (
  <div className='field'>
    <label>
      {label}
    </label>
    <div>
      <input type='checkbox' checked={!!value} onChange={e => onChange(!!e.target.checked)} {...props} />
      {helperText && <small>{helperText}</small>}
    </div>
  </div>
);
