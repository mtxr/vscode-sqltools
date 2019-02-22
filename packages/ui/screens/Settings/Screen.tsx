import React, { ReactNode, FormEvent, ChangeEventHandler } from 'react';
import {
  bool,
  gtz,
  inRange,
  int,
  notEmpty,
  ValidationFunction,
} from '../../lib/utils';
import Loading from '../../components/Loading';
import { WebviewMessageType } from 'lib/interfaces';
import Syntax from '../../components/Syntax';
import '../../sass/app.scss';
import getVscode from '@sqltools/ui/lib/vscode';

const dialectDefaultPorts = {
  MySQL: 3306,
  MSSQL: 1433,
  PostgreSQL: 5432,
  OracleDB: 1521,
  SQLite: null
};

interface FieldWrapperProps {
  field: any; // to be defined
  component: ReactNode;
  i: number;
}

class FieldWrapper extends React.Component<FieldWrapperProps> {
  public render() {
    const field = this.props.field;
    const info = field.info ? <small>({field.info})</small> : null;
    const html = this.props.component;
    return (
      <div className={'row ' + (this.props.i === 0 ? 'no-margin-first-top' : '')}>
        <div className='col-4 no-margin-left capitalize'>{field.label}</div>
        <div className='col-8 capitalize no-margin-right'>
          {html}
          {info}
        </div>
      </div>
    );
  }
}
interface Field {
  label: string;
  values?: Array<string | { text: string; value: any }>;
  default?: any;
  type?: string;
  validators?: ValidationFunction[];
  postUpdateHook?: Function;
  parse?: Function;
  visible?: boolean;
}

interface SetupState {
  loading?: boolean;
  data?: any; // tbd
  fields: { [id: string]: Field };
  errors: { [field: string]: string };
  onSaveError?: string;
  saved?: string;
}

const storage = { data: {}, setItem: undefined, getItem: undefined, removeItem: undefined };

storage.setItem = (key: string, value: string) => storage.data[key] = value;
storage.getItem = (key: string) => storage.data[key];
storage.removeItem = (key: string) => delete storage.data[key];

export default class SettingsScreen extends React.Component<{}, SetupState> {

  public static storageKey = 'sqltools.setupConnection';

  public static saveLocal = (data) => {
    storage.setItem(SettingsScreen.storageKey, JSON.stringify(data));
  }

  public static loadLocal = () => {
    const local = storage.getItem(SettingsScreen.storageKey);
    if (!local) return null;
    return JSON.parse(local);
  }

  public static generateConnData = (fields) => {
    return Object.keys(fields).reduce((obj, f) => {
      obj[f] = typeof fields[f].default !== 'undefined' ? fields[f].default : '';
      return obj;
    }, {});
  }

  baseFields = {
    name: {
      label: 'Connection Name',
      validators: [notEmpty],
    },
    dialect: {
      label: 'Dialects',
      values: Object.keys(dialectDefaultPorts),
      default: Object.keys(dialectDefaultPorts)[0],
      validators: [notEmpty],
      postUpdateHook: () => {
        const newState = Object.assign({}, this.state);
        if (this.state.data.dialect === 'SQLite') {
          newState.fields.port.visible = false;
          newState.fields.server.visible = false;
          newState.fields.username.visible = false;
          newState.fields.password.visible = false;
          newState.fields.askForPassword.visible = false;
          newState.fields.connectionTimeout.visible = false;
          newState.fields.database.type = 'file';
        } else {
          if (this.state.fields.database.type === 'file') {
            newState.data.database = undefined;
          }
          newState.data.port = dialectDefaultPorts[this.state.data.dialect] || dialectDefaultPorts.MySQL;
          newState.fields.domain.visible = this.state.data.dialect === 'MSSQL';
          newState.fields.port.visible = true;
          newState.fields.server.visible = true;
          newState.fields.username.visible = true;
          newState.fields.password.visible = true;
          newState.fields.askForPassword.visible = true;
          newState.fields.connectionTimeout.visible = true;
          newState.fields.database.type = 'text';
        }
        this.setState(newState, this.validateFields);
      },
    },
    server: {
      label: 'Server',
      default: '127.0.0.1',
      validators: [notEmpty],
    },
    port: {
      label: 'Port',
      type: 'number',
      default: dialectDefaultPorts.MySQL,
      validators: [notEmpty, inRange(1, 65535)],
      parse: int,
    },
    database: {
      type: 'text',
      label: 'Database',
      validators: [notEmpty],
    },
    username: {
      label: 'Username',
      validators: [notEmpty],
    },
    askForPassword: {
      label: 'Prompt for password?',
      values: [{ text: 'No', value: false }, { text: 'Yes', value: true }],
      default: 'false',
      parse: bool,
      postUpdateHook: () => {
        const parse = this.state.fields.askForPassword.parse;
        const newState = Object.assign({}, this.state);
        newState.fields.password.visible = !parse(this.state.data.askForPassword);
        this.setState(newState, this.validateFields);
      },
    },
    password: {
      validators:[notEmpty],
      label: 'Password',
    },
    domain: {
      visible: false,
      label: 'Domain',
      info: 'For MSSQL/Azure only',
    },
    connectionTimeout: {
      label: 'Connection Timeout',
      info: 'in seconds',
      type: 'number',
      default: 15,
      validators: [notEmpty, gtz],
      parse: int,
    },
  };

  messagesHandler = ({ action, payload }: WebviewMessageType<any>) => {
    switch(action) {
      case 'createConnectionSuccess':
        const data = SettingsScreen.loadLocal() || SettingsScreen.generateConnData(this.baseFields);
        const newState: SetupState = {
          loading: false,
          data,
          fields: this.baseFields,
          errors: {},
          onSaveError: null,
          saved: null,
        };
        newState.saved = `<strong>${payload.connInfo.name}</strong> added to your settings!`;
        newState.data = SettingsScreen.generateConnData(this.state.fields);
        this.setState(newState, this.validateFields);
        break;

      case 'createConnectionError':
        this.setState({
          onSaveError: (payload || '').toString(),
        });
        break;

      default:
        break;
    }
  }

  constructor(props) {
    super(props);
    const data = SettingsScreen.loadLocal() || SettingsScreen.generateConnData(this.baseFields);
    this.state = {
      loading: true,
      data,
      fields: this.baseFields,
      errors: {},
      onSaveError: null,
      saved: null,
    };
    window.addEventListener('message', (ev) => {
      return this.messagesHandler(ev.data as WebviewMessageType);
    });
  }

  public handleChange: ChangeEventHandler = (e) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (this.state.fields[name].visible === false) return this.validateFields();
    let filePath;
    if (this.state.fields[name].type === 'file' && files && files.length > 0) {
      filePath = (files[0] as any).path;
    }

    const newData = { ...this.state.data, [name]: filePath || value };
    this.setState({ data: newData, saved: null, onSaveError: null }, () => {
      if (!this.state.fields[name].postUpdateHook) return this.validateFields();
      this.state.fields[name].postUpdateHook();
      this.validateFields();
    });
  }

  public validateField(field) {
    const checks = this.state.fields[field].validators || [];
    const errors = {};
    checks.forEach((c) => {
      let message;
      if (message = c.call(this, this.state.data[field])) {
        errors[field] = null;
      } else {
        errors[field] = c.errorMessage || message;
      }
    });
    return Object.keys(errors).reduce((p, f) => {
      if (!errors[f]) return p;
      p[f] = errors[f];
      return p;
    }, {});
  }

  public handleSubmit = (e: FormEvent) => {
    this.setState({ loading: true });
    e.preventDefault();
    getVscode().postMessage({
      action: 'createConnection',
      payload: { connInfo: this.getParsedFormData(), isGlobal: false }
    });
    return false;
  }
  public validateFields() {
    let errors = {};
    this.getVisibleFields().forEach((f) => {
      errors = { ...errors, ...this.validateField(f) };
    });
    this.setState({
      errors: Object.keys(errors).reduce((p, f) => {
        if (errors[f] === null || typeof errors[f] === 'undefined') return p;
        p[f] = errors[f];
        return p;
      }, {}),
    });
  }

  public componentDidMount() {
    this.setState({loading: false }, () => {
      document.getElementsByTagName('input')[0].focus();
      this.validateFields();
    });
  }

  public focusField(field) {
    try {
      document.getElementById(field).focus();
    } catch (e) { /**/ }
  }

  public getVisibleFields() {
    return Object.keys(this.state.fields)
      .filter(k => this.state.fields[k].visible || typeof this.state.fields[k].visible === 'undefined');
  }

  public getParsedFormData() {
    return this.getVisibleFields()
      .reduce((d, k) => {
        const parse = this.state.fields[k].parse || ((v) => (v === '' ? null : v));
        d[k] = parse(this.state.data[k]);
        return d;
      }, {});
  }

  public render() {
    const formFields = this.getVisibleFields()
    .map((f, i) => {
      const field = this.state.fields[f];
      let formField;
      if (Array.isArray(field.values)) {
        const options = field.values.map((o, k) => {
          return (
            <option
              value={typeof o !== 'string' ? o.value : o}
              key={k}>
                {typeof o !== 'string' ? o.text : o}
            </option>
          );
        });
        formField = (
          <select
            name={f}
            value={this.state.data[f]}
            id={`input-${f}`}
            onChange={this.handleChange}
            disabled={this.state.loading}
          >
            {options}
          </select>
        );
      } else if (field.type === 'file') {
        formField = (
          <input
            type="file"
            id={`input-${f}`}
            name={f}
            placeholder={field.label}
            onChange={this.handleChange}
            disabled={this.state.loading}
          />
        );
      } else {
        formField = (
          <input
            type={field.type || 'text'}
            id={`input-${f}`}
            name={f}
            placeholder={field.label}
            value={this.state.data[f]}
            onChange={this.handleChange}
            disabled={this.state.loading}
            { ...(field.type === 'number' ? {
              min: 1,
              max: 65535,
            } : {})}
          />
        );
      }

      return (
        <FieldWrapper field={field} key={i} i={i} component={formField} />
      );
    });
    const connInfo = JSON.stringify(this.getParsedFormData(), null, 2 )
      .replace(/( *)(".+") *:/g, '$1<span class="key">$2</span>:')
      .replace(/: *(".+")/g, ': <span class="string">$1</span>')
      .replace(/: *([0-9]+(\.[0-9]+)?)/g, ': <span class="number">$1</span>')
      .replace(/: *(null|true|false)/g, ': <span class="bool">$1</span>');
    return (
      <div className='fullscreen-container'>
        <form onSubmit={this.handleSubmit} className='container'>
          <div className='row'>
            <div className='col-12'>
              <h3>Setup a new connection</h3>
            </div>
          </div>
          {((this.state.saved || this.state.onSaveError) ?
            (
              <div className='row'>
                <div className='col-12 messages radius'>
                  <div className={`message ${this.state.saved ? 'success' : 'error'}`}
                  dangerouslySetInnerHTML={{__html: this.state.saved || this.state.onSaveError}}></div>
                </div>
              </div>
            )
            : null
          )}
          <div className='row'>
            <div className='col-6'>
              <div className='row'>
                <div className='col-12 no-margin'>
                  <h5 className='no-margin-top'>Connection Information</h5>
                </div>
              </div>
              {formFields}
              <div className='row'>
                <div className='col-4 no-margin-left'>&nbsp;</div>
                <div className='col-8'>
                  <button
                    className='btn capitalize'
                    type='submit'
                    disabled={Object.keys(this.state.errors).length > 0}
                  >Create</button>
                </div>
              </div>
            </div>
            <div className='col-6'>
              <div><h5 className='no-margin-top'>Preview</h5></div>
              <Syntax code={connInfo} language='json'/>
              {Object.keys(this.state.errors).length ? (
                <div>
                  <h5>Validations</h5>
                  <div className='messages radius'>
                    {(Object.keys(this.state.errors).map((f, k) => {
                      return (
                        <div
                          key={k}
                          onClick={this.focusField.bind(this, `input-${f}`)}
                          className='message error pointer'
                          dangerouslySetInnerHTML={{
                            __html: this.state.errors[f]
                              .replace('{0}', `<strong>${this.state.fields[f].label}</strong>`),
                          }}
                        ></div>
                      );
                    }))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </form>
        <Loading active={this.state.loading} />
      </div>
    );
  }
}
