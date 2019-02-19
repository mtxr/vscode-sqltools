import React from 'react';

interface SyntaxProps {
  language?: string;
  code: string;
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
  public copyCode(e) {
    e.preventDefault();
    e.stopPropagation();
    let msg = 'Copied!';
    const range = document.createRange();
    try {
      range.selectNode(document.getElementById(this.id));
      window.getSelection().addRange(range);
      if (!document.execCommand('copy')) {
        throw new Error('Failed!');
      }
    } catch (err) {
      msg = 'Failed :(';
    }
    window.getSelection().removeRange(range);
    this.setState({ copyMsg: msg }, () => {
      clearTimeout(this.interval);
      this.interval = setTimeout(() => {
        this.setState({ copyMsg: 'Copy' });
      }, 1000);
    });
    return false;
  }
  public render() {
    return (
      <div className='relative'>
        <div
          id={this.id}
          className={`syntax ${this.props.language}`}
          dangerouslySetInnerHTML={{ __html: this.props.code }}
        ></div>
        <button className='btn copy-code' type='button' onClick={this.copyCode.bind(this)}>{this.state.copyMsg}</button>
      </div>
    );
  }
}