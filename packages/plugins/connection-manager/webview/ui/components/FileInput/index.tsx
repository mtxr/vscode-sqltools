import React, { useCallback, useEffect, useRef, useState } from "react";
import { WidgetProps } from '@rjsf/core';
import styles from "./style.m.scss";


const FileInput = ({ value: initialValue = '', id, readonly, disabled, options, onChange }: WidgetProps) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);
  const initialValueRef = useRef(initialValue);

  useEffect(() => {
    if (initialValue !== initialValueRef.current) {
      initialValueRef.current = initialValue;
      updateFieldValue(initialValue);
    }
  }, [initialValue]);

  const updateFieldValue = useCallback((v: string) => {
    setValue(v);
    onChange && onChange(v);
  }, [value])

  return (
    <span title={value} className={styles.fileField}>
      <input type='text' value={value || ''} disabled={readonly || disabled} onChange={e => updateFieldValue(e.target.value)}/>
      <button type='button' disabled={readonly || disabled}>
        <input
          ref={inputRef}
          id={id}
          type="file"
          disabled={readonly || disabled}
          onChange={(e) => updateFieldValue(e.target.files && e.target.files.length > 0 ? e.target.files[0]['path'] : undefined)}
          accept={options.accept as any}
        />
        Select File
      </button>
    </span>
  );
}

export default FileInput;