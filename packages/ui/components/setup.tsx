import React, { ReactElement, ReactNode } from 'react';
import {
  bool,
  gtz,
  inRange,
  int,
  notEmpty,
  ValidationFunction,
} from './../lib/utils';
import Loading from './loading';

let vscode;

declare var acquireVsCodeApi: any;

function getVscode() {
  vscode = vscode || acquireVsCodeApi();
  return vscode;
}

const dialectDefaultPorts = {
  MySQL: 3306,
  MSSQL: 1433,
  PostgreSQL: 5432,
};

interface SyntaxProps {
  language?: string;
  code: string;
}

interface SyntaxState {
  copyMsg: string;
}
class Syntax extends React.Component<SyntaxProps, SyntaxState> {
  private id = `syntax-${(Math.random() * 1000).toFixed(0)}`;
  private interval = null;

  constructor(props) {
    super(props);
    this.state = {
      copyMsg: 'Copy',
    };
  }
  public copyCode(e) {
    e.preventDefault();
    e.stopPropagation();
    let msg = 'Copied!';
    const range = document.createRange();
    try {
      range.selectNode(document.getElementById(this.id));
      window.getSelection().addRange(range);
      if (!document.execCommand('copy')) {
        throw new Error('Failed!');
      }
    } catch (err) {
      msg = 'Failed :(';
    }
    window.getSelection().removeRange(range);
    this.setState({ copyMsg: msg }, () => {
      clearTimeout(this.interval);
      this.interval = setTimeout(() => {
        this.setState({ copyMsg: 'Copy' });
      }, 1000);
    });
    return false;
  }
  public render() {
    return (
      <div className='relative'>
        <div
          id={this.id}
          className={`syntax ${this.props.language}`}
          dangerouslySetInnerHTML={{ __html: this.props.code }}
        ></div>
        <button className='btn copy-code' type='button' onClick={this.copyCode.bind(this)}>{this.state.copyMsg}</button>
      </div>
    );
  }
}

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
  check?: ValidationFunction[];
  cb?: Function;
  parse?: Function;
  show?: string;
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

export default class Setup extends React.Component<{}, SetupState> {

  public static storageKey = 'sqltools.setupConnection';

  public static saveLocal = (data) => {
    storage.setItem(Setup.storageKey, JSON.stringify(data));
  }

  public static loadLocal = () => {
    const local = storage.getItem(Setup.storageKey);
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
      check: [notEmpty],
    },
    server: {
      label: 'Server',
      default: '127.0.0.1',
      check: [notEmpty],
    },
    dialect: {
      label: 'Dialects',
      values: Object.keys(dialectDefaultPorts),
      default: Object.keys(dialectDefaultPorts)[0],
      check: [notEmpty],
      cb: () => {
        const newState = Object.assign({}, this.state);
        newState.data.port = dialectDefaultPorts[this.state.data.dialect] || 3306;
        newState.fields.domain.show = this.state.data.dialect !== 'MSSQL' ? 'hidden' : undefined;
        this.setState(newState, this.validateFields);
      },
    },
    port: {
      label: 'Port', type: 'number',
      default: 3306,
      check: [notEmpty, inRange(1, 65535)],
      parse: int,
    },
    database: {
      label: 'Database',
      check: [notEmpty],
    },
    username: {
      label: 'Username',
      check: [notEmpty],
    },
    askForPassword: {
      label: 'Prompt for password?',
      values: [{ text: 'No', value: 'false' }, { text: 'Yes', value: 'true' }],
      default: 'false',
      parse: bool,
      cb: () => {
        const parse = this.state.fields.askForPassword.parse;
        const newState = Object.assign({}, this.state);
        newState.fields.password.show = parse(this.state.data.askForPassword) ? 'hidden' : undefined;
        this.setState(newState, this.validateFields);
      },
    },
    password: {
      show: undefined,
      label: 'Password',
    },
    domain: {
      show: 'hidden',
      label: 'Domain',
      info: 'For MSSQL/Azure only',
    },
    connectionTimeout: {
      label: 'Connection Timeout',
      info: 'in seconds',
      type: 'number',
      default: 15,
      check: [notEmpty, gtz],
      parse: int,
    },
  };
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    const data = Setup.loadLocal() || Setup.generateConnData(this.baseFields);
    this.state = {
      loading: true,
      data,
      fields: this.baseFields,
      errors: {},
      onSaveError: null,
      saved: null,
    };
  }

  public handleChange(e) {
    const { name, value } = e.target;
    const newData = Object.assign({}, this.state.data, {
      [name]: value,
    });
    this.setState({ data: newData, saved: null, onSaveError: null }, () => {
      const errors = this.validateField(name);
      Setup.saveLocal(this.state.data);
      this.setState({ errors }, () => {
        if (!this.state.fields[name].cb) return;
        this.state.fields[name].cb();
      });
    });
  }

  public validateField(field) {
    const checks = this.state.fields[field].check || [];
    const errors = Object.assign({}, this.state.errors);
    checks.forEach((c) => {
      if (c(this.state.data[field])) {
        errors[field] = null;
      } else {
        errors[field] = c.errorMessage;
      }
    });
    return Object.keys(errors).reduce((p, f) => {
      if (!errors[f]) return p;
      p[f] = errors[f];
      return p;
    }, {});
  }

  public handleSubmit(e) {
    this.setState({ loading: true });
    e.preventDefault();
    getVscode().postMessage({
      action: 'bla',
      data: { a: 1 }
    });
    // fetch(`${(window as any).apiUrl}/api/create-connection`, {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json, text/plain, */*',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ connInfo: this.getParsedFormData() }),
    // })
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((res) => {
    //     const newState = { loading: false } as SetupState;
    //     if (res.success) {
    //       newState.saved = `<strong>${res.data.connInfo.name}</strong> added to your settings!`;
    //       storage.removeItem(Setup.storageKey);
    //       newState.data = Setup.generateConnData(this.state.fields);
    //     } else {
    //       newState.onSaveError = res.error;
    //     }
    //     this.setState(newState, this.validateFields);
    //   })
    //   .catch((err) => {
    //     this.setState({
    //       onSaveError: (err || '').toString(),
    //     });
    //   });

    return false;
  }
  public validateFields(cb = (() => void 0)) {
    let errors = {};
    Object.keys(this.state.fields).forEach((f) => {
      errors = Object.assign({}, errors, this.validateField(f));
    });
    this.setState({
      errors: Object.keys(errors).reduce((p, f) => {
        if (errors[f] === null || typeof errors[f] === 'undefined') return p;
        p[f] = errors[f];
        return p;
      }, {}),
    }, cb);
  }

  public componentDidMount() {
    this.setState({loading: false }, () => {
      this.validateFields(() => {
        document.getElementsByTagName('input')[0].focus();
      });
    });
  }

  public focusField(field) {
    try {
      document.getElementById(field).focus();
    } catch (e) { /**/ }
  }

  public getParsedFormData() {
    return Object.keys(this.state.data)
      .reduce((d, k) => {
        if (this.state.fields[k].show === 'hidden') {
          return d;
        }
        const parse = this.state.fields[k].parse || ((v) => (v === '' ? null : v));
        d[k] = parse(this.state.data[k]);
        return d;
      }, {});
  }

  public render() {
    const formFields = Object.keys(this.state.fields).map((f, i) => {
      const field = this.state.fields[f];
      if (field.show === 'hidden') return null;
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
            min='1'
            max='65535'
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
      <div className='fix-height'>
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
              <div style={{
                display: Object.keys(this.state.errors).length === 0 ? 'none' : 'initial',
              }}>
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
            </div>
          </div>
        </form>
        <Loading toggle={this.state.loading} />
      </div>
    );
  }
}
