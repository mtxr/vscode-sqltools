import React, { Component } from "react";
import { WidgetProps } from '@rjsf/core';

interface State {
  value: string;
  name: string;
}

class FileWidget extends Component<WidgetProps, State> {
  state = {
    value: '',
    name: '',
  }
  constructor(props: WidgetProps) {
    super(props);
    const { value } = props;
    this.state = { ...this.state, value };
  }

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.files && event.target.files.length > 0 ? event.target.files[0]['path'] : undefined;
    const name = event.target.files && event.target.files.length > 0 ? event.target.files[0].name : undefined;
    this.setState({
      value,
      name,
    }, () => {
      this.props.onChange(this.state.value);
    });

  };

  inputRef = null;

  render() {
    const { id, readonly, disabled, options } = this.props;
    const { name, value } = this.state;
    return (
      <span title={value} className="file-field">
        <input type='text' value={name || ''} readOnly disabled />
        <button type='button' disabled={readonly || disabled}>
          <input
            ref={ref => (this.inputRef = ref)}
            id={id}
            type="file"
            disabled={readonly || disabled}
            onChange={this.onChange}
            accept={options.accept as any}
          />
          Select File
        </button>
      </span>
    );
  }
}

export default FileWidget;