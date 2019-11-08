import React from 'react';
import FieldWrapper from './FieldWrapper';

interface State {
  value: string;
  name: string;
  useRaw: boolean;
}

interface Props {
  onChange: Function;
  value: string;
  label: string;
  disabled?: boolean;
  hasError?: boolean;
}

class FileInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const value = this.props.value || ''
    let name: string;
    if (value) {
      const startIndex = (value.indexOf('\\') >= 0 ? value.lastIndexOf('\\') : value.lastIndexOf('/'));
      name = value.substring(startIndex);
      if (name.indexOf('\\') === 0 || name.indexOf('/') === 0) {
          name = name.substring(1);
      }
    }
    this.state = { value, name, useRaw: false };
  }

  onChange = () => {
    return this.props.onChange({ file: this.state.value, transformToRelative: !this.state.useRaw });
  };

  onChangeFile = () => {
    const value = this.fileField.current.files && this.fileField.current.files.length > 0 ? this.fileField.current.files[0]['path'] : undefined;
    const name = this.fileField.current.files && this.fileField.current.files.length > 0 ? this.fileField.current.files[0].name : undefined;

    this.setState({
      value,
      name,
      useRaw: false
    }, this.onChange);
  }

  onTypePath = (value) => this.setState({ value, name: value, useRaw: true }, this.onChange);

  fileField = React.createRef<HTMLInputElement>();

  render() {
    return (
      <FieldWrapper hasError={this.props.hasError} file>
        <label>{this.props.label}</label>
        <div title={this.state.value}>
          <input
            type="text"
            placeholder="File or remote path"
            value={this.state.name || ''}
            onChange={e => this.onTypePath(e.target.value || '')}
            disabled={this.props.disabled || false}
          />
          <button type="button">
            <input
              type="file"
              ref={this.fileField}
              onChange={this.onChangeFile}
            />
            Select file
          </button>
        </div>
      </FieldWrapper>
    );
  }
}

export default FileInput;