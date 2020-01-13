import React from 'react';
import FieldWrapper from './FieldWrapper';

export default ({ value = '', helperText = null, onChange, label, type = 'text', hasError = false, ...props }) => (
  <FieldWrapper hasError={hasError}>
    <label>{label}</label>
    <div>
      <input type={type} value={value} onChange={e => onChange(e.target.value || undefined)} placeholder={label.replace('*', '')} {...props} />
      {helperText && <small>{helperText}</small>}
    </div>
  </FieldWrapper>
);
