import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { clipboardInsert } from '../../lib/utils';
import styles from './style.m.scss';
interface SyntaxProps {
  language?: string;
  width?: string;
  code?: any;
  strong?: boolean;
  allowCopy?: boolean;
  style?: React.CSSProperties;
}

const Syntax = ({
  code,
  language,
  width,
  style,
  strong,
  allowCopy,
}: SyntaxProps) => {
  const [id] = useState(`syntax-${(Math.random() * 1000).toFixed(0)}`);
  const [copyMsg, setMessage] = useState('Copy');

  useEffect(() => {
    let mounted = true;
    setTimeout(() => {
      if (mounted) {
        setMessage('Copy');
      }
    }, 1000);
    return () => {
      mounted = false;
    };
  }, [copyMsg]);

  const transformedCode = useMemo(() => transformCode(code, language), [
    code,
    language,
  ]);

  const copyCode = useCallback(() => {
    clipboardInsert(JSON.stringify(code, null, 2));
    setMessage('Copied!');
  }, [setMessage, code]);

  return (
    <main className={styles.syntaxContainer} style={{ width: width, ...style }}>
      <section
        id={id}
        className={`${strong ? styles.syntaxStrongBg : styles.syntax} ${
          language ? 'syntax-' + language : ''
        }`}
        dangerouslySetInnerHTML={{ __html: transformedCode }}
      ></section>
      {allowCopy && (
        <button
          className={styles.copyCodeButton}
          type='button'
          onClick={copyCode}
        >
          {copyMsg}
        </button>
      )}
    </main>
  );
};

export default Syntax;

const transformCode = (code: string, language: string) => {
  if (typeof code === 'string') {
    return code;
  }

  if (language === 'json' && typeof code === 'object') {
    return JSON.stringify(code, null, 2)
      .replace(/( *)(".+"):/g, '$1<span class="key">$2</span>:')
      .replace(/: (".+")/g, ': <span class="string">$1</span>')
      .replace(/: ([0-9]+(\.[0-9]+)?)/g, ': <span class="number">$1</span>')
      .replace(/: (null|true|false)/g, ': <span class="bool">$1</span>');
  }
  return JSON.stringify(code);
};
