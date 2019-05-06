import React, { ChangeEvent, EventHandler } from 'react';

interface State {
  value: string;
  name: string;
}

interface Props {
  onChange: EventHandler<ChangeEvent<any>>;
  name: string;
  id: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
}

export class FileInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const value = this.props.value || undefined
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
    return this.props.onChange({
      target: {
        type: 'text',
        name: this.props.name,
        id: this.props.id,
        value: this.state.value
      }
    } as any);
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
      <div style={{ position: 'relative', display: 'flex' }} title={this.state.value}>
        <input
          style={{ flex: 1 }}
          type="text"
          id={this.props.id}
          name={this.props.name}
          placeholder={this.props.placeholder}
          value={this.state.name}
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
    );
  }
}
