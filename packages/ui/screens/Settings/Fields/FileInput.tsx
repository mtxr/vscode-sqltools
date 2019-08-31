import React from 'react';

interface State {
  value: string;
  name: string;
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
    this.state = { value, name };
  }

  onChange = () => {
    return this.props.onChange(this.state.value);
  };

  onChangeFile = () => {
    const value = this.fileField.current.files && this.fileField.current.files.length > 0 ? this.fileField.current.files[0]['path'] : undefined;
    const name = this.fileField.current.files && this.fileField.current.files.length > 0 ? this.fileField.current.files[0].name : undefined;

    this.setState({
      value,
      name,
    }, this.onChange);
  }

  fileField = React.createRef<HTMLInputElement>();

  render() {
    return (
      <div className={`field ${this.props.hasError ? 'has-error' : ''}`}>
        <label>{this.props.label}</label>
        <div style={{ position: 'relative', display: 'flex' }} title={this.state.value}>
          <input
            style={{ flex: 1 }}
            type="text"
            placeholder="Click to select a file"
            value={this.state.name || ''}
            disabled
          />
          <input
            style={{
              opacity: 0,
              position: 'absolute',
              flex: 1,
              cursor: 'pointer',
              width: '100%',
              padding: '4px 0',
            }}
            type="file"
            ref={this.fileField}
            onChange={this.onChangeFile}
          />
        </div>
      </div>
    );
  }
}

export default FileInput;