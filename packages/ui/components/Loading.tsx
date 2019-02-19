import * as React from 'react';

interface Props {
  toggle: boolean;
}

export default class Loading extends React.Component<Props> {
  render() {
    return (
      <div className={this.props.toggle ? 'loading' : ''}>
        <div className="fullscreen-container backdrop">
          <div className="spinner" />
        </div>
      </div>
    );
  }
}
