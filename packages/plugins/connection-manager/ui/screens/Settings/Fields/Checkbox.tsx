import React from 'react';
import FieldWrapper from './FieldWrapper';

export default ({ value = false, helperText = null, onChange, label, type = 'text', ...props }) => (
  <FieldWrapper>
    <label>{label}</label>
    <div>
      <input type='checkbox' checked={!!value} onChange={e => onChange(!!e.target.checked)} {...props} />
      {helperText && <small>{helperText}</small>}
    </div>
  </FieldWrapper>
);
