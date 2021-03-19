import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { clipboardInsert } from '../lib/utils';
import '../sass/syntax.scss'; // @TODO CSS modules

interface SyntaxProps {
  language?: string;
  width?: string;
  code?: any;
  strong?: boolean;
  allowCopy?: boolean;
  style?: React.CSSProperties;
}

const Syntax = ({ code, language, width, style, strong, allowCopy }: SyntaxProps) => {
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

  const transformedCode = useMemo(() => transformCode(code, language), [code, language]);

  const copyCode = useCallback(() => {
    clipboardInsert(JSON.stringify(code, null, 2));
    setMessage('Copied!');
  }, [setMessage, code]);

  return (
    <div className="relative syntax-container" style={{ width: width, ...style }}>
      <div
        id={id}
        className={`syntax ${language} ${strong ? 'strong-bg' : ''}`}
        dangerouslySetInnerHTML={{ __html: transformedCode }}
      ></div>
      {allowCopy && (
        <button className="copy-code" type="button" onClick={copyCode}>
          {copyMsg}
        </button>
      )}
    </div>
  );
};

export default Syntax;

const transformCode = (code: string, language: string) => {
  if (typeof code === 'string') {
    return code;
  }

  if (language === 'json' && typeof code === 'object') {
    return JSON.stringify(code, null, 2)
      .replace(/( *)(".+") *:/g, '$1<span class="key">$2</span>:')
      .replace(/: *(".+")/g, ': <span class="string">$1</span>')
      .replace(/: *([0-9]+(\.[0-9]+)?)/g, ': <span class="number">$1</span>')
      .replace(/: *(null|true|false)/g, ': <span class="bool">$1</span>');
  }
  return JSON.stringify(code);
};
