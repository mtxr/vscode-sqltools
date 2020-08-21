import React, { Component } from "react";
import { WidgetProps } from '@rjsf/core';

interface State {
  value: string;
}

class FileWidget extends Component<WidgetProps, State> {
  state = {
    value: '',
  }
  constructor(props: WidgetProps) {
    super(props);
    const { value } = props;
    this.state = { ...this.state, value };
  }

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.files && event.target.files.length > 0 ? event.target.files[0]['path'] : undefined;
    this.setState({ value }, this.callOnChange);
  };

  onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState({ value }, this.callOnChange);
  }

  callOnChange = () => this.props.onChange(this.state.value);

  componentDidUpdate(prevProps: WidgetProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value }, this.callOnChange);
    }
  }

  inputRef = null;

  render() {
    const { id, readonly, disabled, options } = this.props;
    const { value } = this.state;
    return (
      <span title={value} className="file-field">
        <input type='text' value={value || ''} disabled={readonly || disabled} onChange={this.onChangeInput}/>
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