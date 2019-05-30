import React, { ReactNode, FormEvent, ChangeEventHandler } from 'react';
import { getConnectionId } from "@sqltools/core/utils/get-connection-stuff";
import {
  bool,
  gtz,
  inRange,
  int,
  notEmpty,
  ValidationFunction,
} from '@sqltools/ui/lib/utils';
import Loading from '@sqltools/ui/components/Loading';
import { WebviewMessageType } from '@sqltools/ui/lib/interfaces';
import Syntax from '@sqltools/ui/components/Syntax';
import getVscode from '@sqltools/ui/lib/vscode';
import '@sqltools/ui/sass/app.scss';
import { DOCS_ROOT_URL } from '@sqltools/core/constants';
import { ConnectionInterface, DatabaseDialect } from '@sqltools/core/interface';
import { FileInput } from './FileInput';

const relativeToWorkspace = (file: string, workspaces: string[] = []) => {
  if (!file) return file;

  const workspaceFolder = workspaces.find(w => file.startsWith(w));
  if (workspaceFolder) {
    return file.replace(workspaceFolder, '');
  }
  return file;
}

const requirements = [
  'Node 6 or newer. 7 or newer is prefered.',
];

const availableDialects = {
  MySQL: {
    port: 3306,
    value: 'MySQL',
    text: 'MySQL',
  },
  MSSQL: {
    port: 1433,
    value: 'MSSQL',
    text: 'MSSQL',
  },
  PostgreSQL: {
    port: 5432,
    value: 'PostgreSQL',
    text: 'PostgreSQL',
  },
  OracleDB: {
    port: 1521,
    value: 'OracleDB',
    text: 'OracleDB (Node Native)',
    experimental: true,
    showHelperText: true,
    requirements,
  },
  SQLite: {
    value: 'SQLite',
    text: 'SQLite (Node Native)',
    showHelperText: true,
    requirements,
  },
  SAPHana: {
    value: 'SAPHana',
    text: 'SAP Hana',
    port: 30000,
    host: '127.0.0.1',
    user: '<enter user>',
    password: '<enter password>',
    showHelperText: true
  }
};

const ConnectionMethod = {
  ServerAndPort: 'Server and Port',
  Socket: 'Socket File',
  ConnectionString: 'Connection String',
}
const connectionMethods = [ConnectionMethod.ServerAndPort, ConnectionMethod.Socket, ConnectionMethod.ConnectionString];

interface FieldWrapperProps {
  field: Field;
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
        <div className='col-8 capitalize no-margin-right flex-full'>
          {html}
          {info}
        </div>
      </div>
    );
  }
}
interface Field {
  label: string;
  placeholder?: string;
  info?: string;
  values?: Array<string | { text: string; value: any }>;
  default?: any;
  type?: 'checkbox' | 'file' | 'text' | 'number' | 'password';
  validators?: ValidationFunction[];
  postUpdateHook?: Function;
  parse?: Function;
  visible?: boolean;
  minMax?: {
    min?: number,
    max?: number,
  };
}

interface SetupState {
  loading?: boolean;
  data?: any; // tbd
  beforeEditData?: any;
  fields: { [id: string]: Field };
  errors: { [field: string]: string };
  onSaveError?: string;
  saved?: JSX.Element;
  workspaces: string[]
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

  baseFields: { [id: string]: Field } = {
    name: {
      label: 'Connection Name',
      validators: [notEmpty],
    },
    dialect: {
      label: 'Dialects',
      values: Object.values(availableDialects),
      default: availableDialects.MySQL.value,
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
          newState.fields.connectionMethod.visible = false;
          newState.fields.connectString.visible = false;
          newState.fields.socketPath.visible = false;
        } else {
          if (this.state.fields.database.type === 'file') {
            newState.data.database = undefined;
          }
          newState.data.port = (availableDialects[this.state.data.dialect] ? availableDialects[this.state.data.dialect].port : null) || availableDialects.MySQL.port;
          newState.fields.port.visible = true;
          newState.fields.server.visible = true;
          newState.fields.username.visible = true;
          newState.fields.password.visible = true;
          newState.fields.askForPassword.visible = true;
          newState.fields.connectionTimeout.visible = true;
          newState.fields.database.type = 'text';
          if (!newState.fields.connectionMethod.visible) {
            newState.data.connectionMethod = ConnectionMethod[0];
            newState.fields.connectionMethod.visible = true;
          }
        }


        if (this.state.data.dialect === 'SAPHana') {
          newState.fields.database.label = 'Schema';
        } else {
          newState.fields.database.label = 'Database';
        }

        this.setState(newState, this.validateFields);
      },
    },
    connectionMethod: {
      label: 'Connection Method',
      values: connectionMethods,
      default: connectionMethods[0],
      postUpdateHook: () => {
        const newState = Object.assign({}, this.state);
        switch (this.state.data.connectionMethod) {
          case ConnectionMethod.ConnectionString:
            newState.fields.server.visible = false;
            newState.fields.port.visible = false;
            newState.fields.database.visible = false;
            newState.fields.username.visible = false;
            newState.fields.password.visible = false;
            newState.fields.askForPassword.visible = false;
            newState.fields.socketPath.visible = false;
            newState.fields.connectString.visible = true;
            break;
          case ConnectionMethod.Socket:
            newState.fields.server.visible = false;
            newState.fields.port.visible = false;
            newState.fields.database.visible = true;
            newState.fields.username.visible = true;
            newState.fields.password.visible = true;
            newState.fields.askForPassword.visible = true;
            newState.fields.socketPath.visible = true;
            newState.fields.connectString.visible = false;
            break;
          case ConnectionMethod.ServerAndPort:
            newState.fields.server.visible = true;
            newState.fields.port.visible = true;
            newState.fields.socketPath.visible = false;
            newState.fields.connectString.visible = false;
            newState.fields.database.visible = true;
            newState.fields.username.visible = true;
            newState.fields.password.visible = true;
            newState.fields.askForPassword.visible = true;
            break;
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
      default: availableDialects.MySQL.port,
      validators: [notEmpty, inRange(1, 65535)],
      parse: int,
      minMax: {
        min: 1,
        max: 65535,
      },
    },
    socketPath: {
      visible: false,
      type: 'file',
      label: 'Socket File',
      validators: [notEmpty],
    },
    connectString: {
      visible: false,
      type: 'text',
      label: 'Connection String',
      validators: [notEmpty],
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
    password: {
      label: 'Password',
      placeholder: 'Leave empty to be prompted',
      postUpdateHook: () => {
        const newState = Object.assign({}, this.state);
        if (notEmpty(this.state.data.password)) {
          newState.fields.askForPassword.visible = false;
        } else {
          newState.fields.askForPassword.visible = true;
          newState.data.askForPassword = true;
        }
        this.setState(newState, this.validateFields);
      },
    },
    askForPassword: {
      label: 'Ask password?',
      type: 'checkbox',
      info: 'Uncheck if you want to use empty passwords',
      default: true,
      parse: bool
    },
    connectionTimeout: {
      label: 'Connection Timeout',
      info: 'in seconds',
      type: 'number',
      default: 30,
      validators: [notEmpty, gtz],
      parse: int,
      minMax: {
        min: 0,
      }
    },
    isGlobal: {
      label: 'Save to global settings?',
      info: 'If checked, will save to global settings',
      type: 'checkbox',
      default: false,
      parse: bool,
    }
  };

  messagesHandler = ({ action, payload }: WebviewMessageType<any>) => {
    console.log(`Message received: ${action}`, ...[ payload ]);
    switch(action) {
      case 'editConnection':
        this.setState({
          beforeEditData: payload.conn,
          loading: true,
          data: payload.conn,
          fields: this.baseFields,
          errors: {},
          onSaveError: null,
          saved: null,
        }, async () => {
          const conn: ConnectionInterface = payload.conn;
          await this.updateField({
            value: conn.dialect,
            name: 'dialect',
          });
          if (conn.port) {
            await this.updateField({
              value: conn.port,
              name: 'port',
            });
          }
          if (conn.socketPath) {
            await this.updateField({
              value: ConnectionMethod.Socket,
              name: 'connectionMethod',
            });
          } else if (conn.connectString) {
            await this.updateField({
              value: ConnectionMethod.ConnectionString,
              name: 'connectionMethod',
            });
          } else {
            await this.updateField({
              value: ConnectionMethod.ServerAndPort,
              name: 'connectionMethod',
            });
          }


          // if (conn.database) {
          //   await this.updateField({
          //     value: conn.database,
          //     name: 'database',
          //   });
          // }
          // Object.keys(this.baseFields).forEach(async (name) => {
          //   if (typeof conn[name] === 'undefined') return;
          //   await this.updateField({
          //     value: this.state.data[name],
          //     checked: this.state.data[name],
          //     name,
          //   });
          // });
          this.componentDidMount();
        });
        break;
      case 'updateConnectionSuccess':
      case 'createConnectionSuccess':
        const newState: SetupState = {
          workspaces: [],
          loading: false,
          data: SettingsScreen.loadLocal() || SettingsScreen.generateConnData(this.baseFields),
          fields: this.baseFields,
          errors: {},
          onSaveError: null,
          saved: null,
        };
        newState.saved = (
          <div>
            <strong>{payload.connInfo.name}</strong>
            {action !== 'updateConnectionSuccess' ? ' added to your settings!' : ' was updated!'}
            <a onClick={this.reset} className="btn danger" href={encodeURI(`command:${process.env.EXT_NAME || 'sqltools'}.deleteConnection?${JSON.stringify(payload.connInfo.id)}`)}>Delete {payload.connInfo.name}</a>
            <a onClick={this.reset} className="btn" href={encodeURI(`command:${process.env.EXT_NAME || 'sqltools'}.selectConnection?${JSON.stringify(payload.connInfo.id)}`)}>Connect now</a>
          </div>
        );
        newState.data = SettingsScreen.generateConnData(this.state.fields);
        this.setState(newState, this.validateFields);
        document.querySelector('html').scrollTop = 0;
        break;
      case 'updateConnectionError':
      case 'createConnectionError':
        this.setState({
          loading: false,
          onSaveError: ((payload && payload.message ? payload.message : payload) || '').toString(),
        });
        break;
      case 'setWorkspaces':
          this.setState({
            workspaces: payload || []
          });
      case 'reset':
        this.reset();
      default:
        break;
    }
  }

  reset = () => {
    const data = SettingsScreen.loadLocal() || SettingsScreen.generateConnData(this.baseFields);
    this.setState({
      loading: true,
      beforeEditData: undefined,
      data,
      fields: this.baseFields,
      errors: {},
      onSaveError: null,
      saved: null,
    }, () => this.componentDidMount());
  }

  constructor(props) {
    super(props);
    const data = SettingsScreen.loadLocal() || SettingsScreen.generateConnData(this.baseFields);
    this.state = {
      workspaces: [],
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

  handleChange: ChangeEventHandler = (e) => this.updateField(e.target as any);

  updateField = async ({
    checked,
    value,
    name
  }: {
    checked?: string | boolean;
    value?: any;
    name: string;
  }) => {
    value = this.state.fields[name].type === 'checkbox' ? Boolean(checked) : value;

    if (this.state.fields[name].visible === false) return this.validateFields();

    const newData = { ...this.state.data, [name]: value };
    return new Promise((resolve) => {
      this.setState({ data: newData, saved: null, onSaveError: null }, () => {
        if (!this.state.fields[name].postUpdateHook) {
          this.validateFields();
          return resolve();
        };
        this.state.fields[name].postUpdateHook();
        this.validateFields();
        return resolve();
      });
    })
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
    if (this.state.beforeEditData) {
      return void getVscode().postMessage({
        action: 'updateConnection',
        payload: { connInfo: this.getParsedFormData(), isGlobal: this.state.data.isGlobal, editId: getConnectionId(this.state.beforeEditData) }
      });
    }
    getVscode().postMessage({
      action: 'createConnection',
      payload: { connInfo: this.getParsedFormData(), isGlobal: this.state.data.isGlobal }
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

  public focusField = (field) => {
    try {
      document.getElementById(field).focus();
    } catch (e) { /**/ }
  }

  public getVisibleFields() {
    return Object.keys(this.state.fields)
      .filter(k => this.state.fields[k].visible || typeof this.state.fields[k].visible === 'undefined');
  }

  public getParsedFormData(workspaces: string[] = []) {
    const data = this.getVisibleFields()
      .reduce((d, k) => {
        const parse = this.state.fields[k].parse || ((v) => (v === '' ? null : v));
        d[k] = parse(this.state.data[k]);
        return d;
      }, {});

      data['password'] = data['password'] || undefined;

      if (data['dialect'] === DatabaseDialect.SQLite) {
        data['database'] = relativeToWorkspace(data['database'], workspaces)
      }

      delete data['isGlobal'];
      delete data['connectionMethod'];

      return data;
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
            key={i}
            onChange={this.handleChange}
            disabled={this.state.loading}
          >
            {options}
          </select>
        );
      } else if (field.type === 'file') {
        formField = (
          <FileInput
            id={`input-${f}`}
            key={i}
            name={f}
            onChange={this.handleChange}
            disabled={this.state.loading}
            value={this.state.data[f] || ''}
          />
        );
      } else {
        let fieldProps: any = {
          value: this.state.data[f] || '',
        };
        if (field.type === 'number') {
          fieldProps = {
            value: this.state.data[f] || '',
            ...field.minMax,
          };
        }

        if (field.type === 'checkbox') {
          fieldProps = {
            checked: !!this.state.data[f],
          }
        }

        formField = (
          <input
            type={field.type || 'text'}
            id={`input-${f}`}
            name={f}
            placeholder={field.placeholder || field.label}
            onChange={this.handleChange}
            disabled={this.state.loading}
            key={i}
            {...fieldProps}
          />
        );
      }

      return (
        <FieldWrapper field={field} key={i} i={i} component={formField} />
      );
    });

    return (
      <div className='fullscreen-container settings-screen'>
        <form onSubmit={this.handleSubmit} className='container'>
          <div className='row'>
            <div className='col-12'>
              <h3>{this.state.beforeEditData ? `Editing ${this.state.beforeEditData.name}` : 'Setup a new connection'}</h3>
            </div>
          </div>
          {((this.state.saved || this.state.onSaveError) ?
            (
              <div className='row'>
                <div className='col-12 messages radius'>
                  <div className={`message ${this.state.saved ? 'success' : 'error'}`}>
                    {this.state.saved ? this.state.saved : (
                      <span dangerouslySetInnerHTML={{__html: this.state.onSaveError}}></span>
                    )}
                  </div>
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
                  >
                    {this.state.beforeEditData ? 'Update' : 'Create' }
                  </button>
                </div>
              </div>
            </div>
            <div className='col-6'>
              {this.state.data.dialect && availableDialects[this.state.data.dialect].showHelperText ? (
                <div>
                  <h5 className="no-margin-top">Attention: Beta Feature</h5>
                  <div className='messages radius'>
                    <div className='message radius attention'>
                      This connection dialect <strong>{this.state.data.dialect}</strong> is new and might not work for some machines.
                      Please, open an issue at <a href='https://github.com/mtxr/vscode-sqltools/issues'>GitHub</a> if it doesn't work for you.
                      {(availableDialects[this.state.data.dialect].requirements || []).length > 0 ? (
                        <div>
                          <strong>Requirements:</strong>
                          <ul>
                            {(availableDialects[this.state.data.dialect].requirements || []).map(r => (<li key={r}>{r}</li>))}
                          </ul>
                        </div>
                      ) : null}
                      <div>You can find more information <a href={`${DOCS_ROOT_URL}/connections/${this.state.data.dialect.toLowerCase()}`}>here</a>.</div>
                    </div>
                  </div>
                </div>
              ) : null}
              <div><h5 className={this.state.data.dialect && availableDialects[this.state.data.dialect].showHelperText ? '' : 'no-margin-top'}>Preview</h5></div>
              <Syntax code={this.getParsedFormData(this.state.workspaces)} language='json' strong/>
              {Object.keys(this.state.errors).length ? (
                <div>
                  <h5>Validations</h5>
                  <div className='messages radius'>
                    {(Object.keys(this.state.errors).map((f, k) => {
                      return (
                        <div
                          key={k}
                          onClick={() => this.focusField(`input-${f}`)}
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
