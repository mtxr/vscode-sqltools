import React from 'react';
import { clipboardInsert } from '../lib/utils';

interface SyntaxProps {
  language?: string;
  code: any;
  strong?: boolean;
}

interface SyntaxState {
  copyMsg: string;
}
export default class Syntax extends React.Component<SyntaxProps, SyntaxState> {
  private id = `syntax-${(Math.random() * 1000).toFixed(0)}`;
  private interval = null;

  constructor(props) {
    super(props);
    this.state = {
      copyMsg: 'Copy',
    };
  }
  copyCode = () => {
    clipboardInsert(JSON.stringify(this.props.code, null, 2));
    this.setState({ copyMsg: 'Copied!' }, () => {
      clearTimeout(this.interval);
      this.interval = setTimeout(() => {
        this.setState({ copyMsg: 'Copy' });
      }, 1000);
    });
  }

  renderCode = (code) => {
    if (this.props.language === 'json' && typeof code === 'object') {
      return JSON.stringify(code, null, 2 )
      .replace(/( *)(".+") *:/g, '$1<span class="key">$2</span>:')
      .replace(/: *(".+")/g, ': <span class="string">$1</span>')
      .replace(/: *([0-9]+(\.[0-9]+)?)/g, ': <span class="number">$1</span>')
      .replace(/: *(null|true|false)/g, ': <span class="bool">$1</span>');
    }
    if (typeof code === 'string') {
      return code;
    }
    return JSON.stringify(code);
  }
  public render() {
    return (
      <div className='relative syntax-container'>
        <div
          id={this.id}
          className={`syntax ${this.props.language} ${this.props.strong ? 'strong-bg' : ''}`}
          dangerouslySetInnerHTML={{ __html: this.renderCode(this.props.code) }}
        ></div>
        <button className='btn copy-code' type='button' onClick={this.copyCode}>{this.state.copyMsg}</button>
      </div>
    );
  }
}