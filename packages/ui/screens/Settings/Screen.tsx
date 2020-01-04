import React from 'react';
import Loading from '@sqltools/ui/components/Loading';
import { IConnection } from '@sqltools/types';
import { Container } from '@material-ui/core';
import DriverSelector from './Widget/DriverSelector';
import availableDrivers from './lib/availableDrivers';
import { Step, totalSteps } from './lib/steps';
import ConnectionInfo from './Widget/ConnectionInfo';
import getVscode from '@sqltools/ui/lib/vscode';
import ConnectionCreated from './Widget/ConnectionCreated';
import logger from '@sqltools/core/log';
import '@sqltools/ui/sass/app.scss';
import { IWebviewMessage } from '@sqltools/ui/interfaces';

const log = logger.extend('settings');

enum ConnectionMethod {
  ServerAndPort = 'Server and Port',
  SocketFile = 'Socket File',
  ConnectionString = 'Connection String'
};

interface SettingsScreenState {
  loading?: boolean;
  step: Step;
  connectionSettings: IConnection;
  defaultMethod?: string,
  externalMessage: string,
  externalMessageType: string,
  errors: {[id: string]: boolean};
  action: 'create' | 'update' | 'updateConnectionSuccess' | 'createConnectionSuccess';
  saved?: boolean;
  globalSetting?: boolean;
  transformToRelative?: boolean;
}

export default class SettingsScreen extends React.Component<any, SettingsScreenState> {
  messagesHandler = ({ action, payload }: IWebviewMessage<any>) => {
    if (!action) return;
    log(`Message received: %s %O`, action, payload || 'NO_PAYLOAD');
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
        log.extend('warn')(`No handler set for %s`, action);
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
    } as IConnection,
    step: Step.CONNECTION_TYPE,
    externalMessage: null,
    externalMessageType: null,
  };

  state = this.initialState;

  constructor(props) {
    super(props);
    window.addEventListener('message', ev => this.messagesHandler(ev.data as IWebviewMessage));
  }

  toggleGlobal = globalSetting => this.setState({ globalSetting });

  toggleUseRelative = transformToRelative => this.setState({ transformToRelative });

  updateConnectionSettings = (options: Partial<IConnection> = {}, cb?: any) => this.setState({
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

  driverSelector = (driver: (typeof availableDrivers)[string]) => {
    this.updateConnectionSettings({
      driver: driver.value,
      port: driver.value === 'SQLite' ? undefined : (this.state.connectionSettings.port || driver.port || null),
      server: driver.value === 'SQLite' ? undefined : (this.state.connectionSettings.server || 'localhost' || null),
      askForPassword: driver.value !== 'SQLite' ? this.initialState.connectionSettings.askForPassword : undefined,
    }, () => this.setState({ step: Step.CONNECTION_INFO }));

  }

  validateSettings = (cb = undefined) => {
    const requiredFields = availableDrivers[this.state.connectionSettings.driver].requiredProps(this.state.connectionSettings);
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
            globalSetting: !!this.state.globalSetting,
            transformToRelative: this.state.transformToRelative
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

  openConnectionFile = () => getVscode().postMessage({ action: 'openConnectionFile' });

  public render() {
    const { step } = this.state;
    return (
      <>
        <Container maxWidth='md' className={`blur ${this.state.loading ? 'blur-active' : ''}`}>
          <h3>
            Connection Assistant
            <small style={{ float: 'right' }} className='stepper'>
              {
                this.state.step - 1 >= Step.CONNECTION_TYPE
                && <a onClick={() => this.goTo(this.state.step - 1)}>{'<'}</a>
              }
              Step {this.state.step}/{totalSteps}
              {
                this.state.step + 1 <= Step.CONNECTION_CREATED
                && this.state.connectionSettings.driver
                && (this.state.step + 1 !== Step.CONNECTION_CREATED || this.state.saved)
                && <a onClick={() => this.goTo(this.state.step + 1)}>{'>'}</a>
              }
            </small>
          </h3>
          {step === Step.CONNECTION_TYPE && (
            <DriverSelector
              onSelect={this.driverSelector}
              selected={this.state.connectionSettings['driver']}
            />
          )}
          {step === Step.CONNECTION_INFO && (
            <ConnectionInfo
              updateSettings={this.updateConnectionSettings}
              submit={this.submitSettings}
              testConnection={this.testConnection}
              state={this.state}
              toggleGlobal={this.toggleGlobal}
              toggleUseRelative={this.toggleUseRelative}
              openConnectionFile={this.openConnectionFile}
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
