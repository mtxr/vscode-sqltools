import * as React from 'react';

interface Props {
  active: boolean;
}

export default class Loading extends React.Component<Props> {
  render() {
    return (
      <div className={this.props.active ? 'loading' : ''}>
        <div className="fullscreen-container backdrop">
          <div className="spinner" />
        </div>
      </div>
    );
  }
}
