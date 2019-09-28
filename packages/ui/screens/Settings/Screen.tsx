import React from 'react';
import Loading from '@sqltools/ui/components/Loading';
import { WebviewMessageType } from '@sqltools/ui/lib/interfaces';
import { ConnectionInterface } from '@sqltools/core/interface';
import { Container } from '@material-ui/core';
import DatabaseSelector from './Widget/DatabaseSelector';
import availableDialects from './lib/availableDialects';
import { Step, totalSteps } from './lib/steps';
import ConnectionInfo from './Widget/ConnectionInfo';
import getVscode from '@sqltools/ui/lib/vscode';
import '@sqltools/ui/sass/app.scss';
import ConnectionCreated from './Widget/ConnectionCreated';

enum ConnectionMethod {
  ServerAndPort = 'Server and Port',
  SocketFile = 'Socket File',
  ConnectionString = 'Connection String'
};

interface SettingsScreenState {
  loading?: boolean;
  step: Step;
  connectionSettings: ConnectionInterface;
  defaultMethod?: string,
  externalMessage: string,
  externalMessageType: string,
  errors: {[id: string]: boolean};
  action: 'create' | 'update' | 'updateConnectionSuccess' | 'createConnectionSuccess';
  saved?: boolean;
  globalSetting?: boolean;
}

export default class SettingsScreen extends React.Component<{}, SettingsScreenState> {
  messagesHandler = ({ action, payload }: WebviewMessageType<any>) => {
    console.log(`Message received: ${action}`, ...[ payload ]);
    switch(action) {
      case 'editConnection':
        const conn = payload.conn || {};
        this.setState({
          action: 'update',
          loading: true,
          connectionSettings: conn,
          step: Step.CONNECTION_INFO,
          externalMessage: null,
          externalMessageType: null,
          globalSetting: payload.globalSetting,
          defaultMethod: (
            conn.socketPath ? ConnectionMethod.SocketFile : (
              conn.connectString ? ConnectionMethod.ConnectionString : ConnectionMethod.ServerAndPort
            )
          )
        }, this.validateSettings);
        break;
      case 'updateConnectionSuccess':
      case 'createConnectionSuccess':
        this.setState({ step: Step.CONNECTION_CREATED, loading: false, connectionSettings: payload.connInfo, action, saved: true });
        break;
      case 'testConnectionSuccess':
        this.setState({ loading: false, externalMessage: 'Connection test successfull!', externalMessageType: 'success' });
        break;
      case 'testConnectionWarning':
        this.setState({
          loading: false,
          externalMessage: ((payload && payload.message ? payload.message : payload) || '').toString(),
          externalMessageType: 'warning'
        });
        break;
      case 'updateConnectionError':
      case 'createConnectionError':
      case 'testConnectionError':
        this.setState({
          loading: false,
          externalMessage: ((payload && payload.message ? payload.message : payload) || '').toString(),
          externalMessageType: 'error'
        });
        break;
      case 'reset':
        this.reset();
      default:
        break;
    }
  }

  reset = (cb = undefined) => {
    this.setState(this.initialState, cb);
  }

  readonly initialState: SettingsScreenState = {
    action: 'create',
    errors: {},
    loading: false,
    connectionSettings: {
      askForPassword: true,
    } as ConnectionInterface,
    step: Step.CONNECTION_TYPE,
    externalMessage: null,
    externalMessageType: null,
  };

  state = this.initialState;

  constructor(props) {
    super(props);
    window.addEventListener('message', ev => this.messagesHandler(ev.data as WebviewMessageType));
  }

  toggleGlobal = globalSetting => this.setState({ globalSetting });

  updateConnectionSettings = (options: Partial<ConnectionInterface> = {}, cb?: any) => this.setState({
    connectionSettings: {
      ...this.state.connectionSettings,
      ...options,
    }
  }, () => this.validateSettings(cb))

  componentDidMount() {
    this.setState({ loading: false });
    getVscode().postMessage({ action: 'viewReady', payload: true });
  }

  public focusField = (field) => {
    try {
      document.getElementById(field) && document.getElementById(field).focus();
    } catch (e) { /**/ }
  }

  driverSelector = (dialect: (typeof availableDialects)[string]) => {
    this.updateConnectionSettings({
      dialect: dialect.value,
      port: dialect.value === 'SQLite' ? undefined : (this.state.connectionSettings.port || dialect.port || null),
      server: dialect.value === 'SQLite' ? undefined : (this.state.connectionSettings.server || 'localhost' || null),
      askForPassword: dialect.value !== 'SQLite' ? this.initialState.connectionSettings.askForPassword : undefined,
    }, () => this.setState({ step: Step.CONNECTION_INFO }));

  }

  validateSettings = (cb = undefined) => {
    const requiredFields = availableDialects[this.state.connectionSettings.dialect].requiredProps(this.state.connectionSettings);
    Object.keys(this.state.connectionSettings).forEach(key => {
      if (typeof this.state.connectionSettings[key] === 'undefined') return;
      if (this.state.connectionSettings[key] === null) return;
      if (this.state.connectionSettings[key] === '') return;
      delete requiredFields[key]
    });
    this.setState({ loading: false, errors: requiredFields }, cb);
  }

  submitSettings = (e) => {
    e.preventDefault();
    this.validateSettings(() => {
      if (Object.keys(this.state.errors).length > 0) return;
      const { id: editId, ...connInfo } = this.state.connectionSettings;
      this.setState({ loading: true }, () => {
        getVscode().postMessage({
          action: !editId ? 'createConnection' : 'updateConnection',
          payload: {
            editId,
            connInfo,
            globalSetting: !!this.state.globalSetting
          }
        });
      });
    });
  }

  testConnection = () => {
    this.setState({ loading: true }, () => {
      getVscode().postMessage({
        action: 'testConnection',
        payload: {
          connInfo: this.state.connectionSettings,
        }
      });
    });
  }


  goTo = (step: Step) => this.setState({ step });

  public render() {
    const { step } = this.state;
    return (
      <>
        <Container maxWidth='md' className={`blur ${this.state.loading ? 'blur-active' : ''}`}>
          <h3>
            Connection Assistant
            <small style={{ float: 'right' }}>
              {
                this.state.step - 1 >= Step.CONNECTION_TYPE
                && <a onClick={() => this.goTo(this.state.step - 1)}>{'<'}</a>
              }
              Step {this.state.step}/{totalSteps}
              {
                this.state.step + 1 <= Step.CONNECTION_CREATED
                && this.state.connectionSettings.dialect
                && (this.state.step + 1 !== Step.CONNECTION_CREATED || this.state.saved)
                && <a onClick={() => this.goTo(this.state.step + 1)}>{'>'}</a>
              }
            </small>
          </h3>
          {step === Step.CONNECTION_TYPE && (
            <DatabaseSelector
              onSelect={this.driverSelector}
              selected={this.state.connectionSettings['dialect']}
            />
          )}
          {step === Step.CONNECTION_INFO && (
            <ConnectionInfo
              updateSettings={this.updateConnectionSettings}
              submit={this.submitSettings}
              testConnection={this.testConnection}
              state={this.state}
              toggleGlobal={this.toggleGlobal}
            />
          )}
          {step === Step.CONNECTION_CREATED && (
            <ConnectionCreated
              settings={this.state.connectionSettings}
              action={this.state.action}
              reset={() => this.reset()}
            />
          )}
        </Container>
        <Loading active={this.state.loading} />
      </>
    );
  }
}
