import React from 'react';

interface Props {
  title: string;
  open?: boolean;
}

interface State {
  open: boolean;
}
export default class Collapsible extends React.Component<Props, State> {
  state = {
    open: false,
  }
  constructor(props: Props) {
    super(props);
    this.state = { open: props.open || false };
  }
  toggle = () => this.setState({
    open: !this.state.open,
  });

  render() {
    return (
      <div className={'collapse ' + (this.state.open ? 'open' : '')}>
        <div className='collapse-toggle' onClick={this.toggle}>
          {this.props.title} <i className='icon' />
        </div>
        <div className='collapsible'>
          {this.props.children}
        </div>
      </div>
    );
  }
}