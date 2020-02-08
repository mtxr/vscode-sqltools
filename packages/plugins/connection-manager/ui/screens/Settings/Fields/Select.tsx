import React from 'react';
import FieldWrapper from './FieldWrapper';

export default ({ value = '', options = [], helperText = null, onChange, label, type = 'text', ...props }) => {
  const optionsMapped = options.map((o, k) => {
    return (
      <option
        value={typeof o !== 'string' ? o.value : o}
        key={k}>
          {typeof o !== 'string' ? o.text : o}
      </option>
    );
  });
  return (
    <FieldWrapper>
      <label>{label}</label>
      <div>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          {...props}
        >
          {optionsMapped}
        </select>
        {helperText && <small>{helperText}</small>}
      </div>
    </FieldWrapper>
  );
};
