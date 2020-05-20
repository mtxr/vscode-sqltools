import React from 'react';
import Loading from '@sqltools/plugins/connection-manager/ui/components/Loading';
import { Container } from '@material-ui/core';
import DriverSelector from './Widget/DriverSelector';
import { Step, totalSteps } from './lib/steps';
import ConnectionSettingsForm from './Widget/ConnectionSettingsForm';
import ConnectionCreated from './Widget/ConnectionCreated';
import logger from '@sqltools/util/log';
import '@sqltools/plugins/connection-manager/ui/sass/app.scss';
import { IWebviewMessage } from '@sqltools/plugins/connection-manager/ui/interfaces';
import sendMessage from '../../lib/messages';
import { SettingsScreenState } from './interfaces';
import { IConnection } from '@sqltools/types';
import { UIAction } from '../../../actions';

const log = logger.extend('settings');

export default class SettingsScreen extends React.Component<any, SettingsScreenState> {
  messagesHandler = ({ action, payload }: IWebviewMessage<any>) => {
    if (!action) return;
    log(`Message received: %s %O`, action, payload || 'NO_PAYLOAD');
    switch(action) {
      case UIAction.REQUEST_EDIT_CONNECTION:
        // @TODO
        // const conn = payload.conn || {};
        // return this.setState({
        //   action: 'update',
        //   loading: true,
        //   connectionSettings: conn,
        //   step: Step.CONNECTION_INFO,
        //   externalMessage: null,
        //   externalMessageType: null,
        //   globalSetting: payload.globalSetting,
        //   defaultMethod: (
        //     conn.socketPath ? ConnectionMethod.SocketFile : (
        //       conn.connectString ? ConnectionMethod.ConnectionString : ConnectionMethod.ServerAndPort
        //     )
        //   )
        // }, this.validateSettings);
        break;
      case UIAction.RESPONSE_UPDATE_CONNECTION_SUCCESS:
      case UIAction.RESPONSE_CREATE_CONNECTION_SUCCESS:
        // @TODO
        // return this.setState({ step: Step.CONNECTION_CREATED, loading: false, connectionSettings: payload.connInfo, action, saved: true });
        break;
      case UIAction.RESPONSE_TEST_CONNECTION_SUCCESS:
        return this.setState({ loading: false, externalMessage: 'Successfully connected!', externalMessageType: 'success' });
      case UIAction.RESPONSE_TEST_CONNECTION_WARNING:
        return this.setState({
          loading: false,
          externalMessage: ((payload && payload.message ? payload.message : payload) || '').toString(),
          externalMessageType: 'warning'
        });
      case UIAction.RESPONSE_INSTALLED_DRIVERS:
        const installedDrivers = (payload as SettingsScreenState['installedDrivers']);
        return this.setState({
          loading: false,
          installedDrivers,
        });
      case UIAction.RESPONSE_UPDATE_CONNECTION_ERROR:
      case UIAction.RESPONSE_CREATE_CONNECTION_ERROR:
      case UIAction.RESPONSE_TEST_CONNECTION_ERROR:
        return this.setState({
          loading: false,
          externalMessage: ((payload && payload.message ? payload.message : payload) || '').toString(),
          externalMessageType: 'error'
        });
      case UIAction.REQUEST_RESET:
        return this.reset();
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
    driver: null,
    step: Step.CONNECTION_TYPE,
    externalMessage: null,
    externalMessageType: null,
    installedDrivers: []
  };

  state = this.initialState;

  constructor(props: any) {
    super(props);
    window.addEventListener('message', ev => this.messagesHandler(ev.data as IWebviewMessage));
  }

  componentDidMount() {
    sendMessage(UIAction.NOTIFY_VIEW_READY, true);
    this.setState({ loading: true }, () => {
      sendMessage(UIAction.REQUEST_INSTALLED_DRIVERS);
    });
  }

  onSelectDriver = (driver: (SettingsScreenState['installedDrivers'])[number]) => {
    this.setState({ loading: true, driver });
    // this.updateConnectionSettings({
    //   driver: driver.value,
    //   port: driver.value === 'SQLite' ? undefined : (this.state.connectionSettings.port || driver.port || null),
    //   server: driver.value === 'SQLite' ? undefined : (this.state.connectionSettings.server || 'localhost' || null),
    //   askForPassword: driver.value !== 'SQLite' ? this.initialState.connectionSettings.askForPassword : undefined,
    // }, () => this.setState({ step: Step.CONNECTION_INFO }));

  }

  onSubmitSetting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // @TODO
    // this.validateSettings(() => {
    //   if (Object.keys(this.state.errors).length > 0) return;
    //   const { id: editId, ...connInfo } = this.state.connectionSettings;
    //   this.setState({ loading: true }, () => {
    //     sendMessage(!editId ? 'createConnection' : 'updateConnection', {
    //       editId,
    //       connInfo,
    //       globalSetting: !!this.state.globalSetting,
    //       transformToRelative: this.state.transformToRelative
    //     });
    //   });
    // });
  }

  onTestConnection = () => {
    // @TODO
    // this.setState({ loading: true }, () => {
    //   sendMessage('testConnection', {
    //     connInfo: this.state.connectionSettings,
    //   });
    // });
  }


  goTo = (step: Step) => this.setState({ step });

  onOpenConnectionFile = () => sendMessage(UIAction.REQUEST_OPEN_CONNECTION_FILE);

  public render() {
    const { step, driver, loading, installedDrivers, saved, action, errors } = this.state;
    return (
      <>
        <Container maxWidth='md' className={`blur ${loading ? 'blur-active' : ''}`}>
          <h3>
            Connection Assistant
            <small style={{ float: 'right' }} className='stepper'>
              {
                step - 1 >= Step.CONNECTION_TYPE
                && <a onClick={() => this.goTo(step - 1)}>{'<'}</a>
              }
              Step {step}/{totalSteps}
              {
                step + 1 <= Step.CONNECTION_CREATED
                && driver
                && (step + 1 !== Step.CONNECTION_CREATED || saved)
                && <a onClick={() => this.goTo(step + 1)}>{'>'}</a>
              }
            </small>
          </h3>
          {step === Step.CONNECTION_TYPE && (
            <DriverSelector
              loading={loading}
              drivers={installedDrivers}
              onSelect={this.onSelectDriver}
              selected={driver}
            />
          )}
          {step === Step.CONNECTION_INFO && (
            <ConnectionSettingsForm
              installedDrivers={installedDrivers}
              submit={this.onSubmitSetting}
              testConnection={this.onTestConnection}
              openConnectionFile={this.onOpenConnectionFile}
              action={action}
              errors={errors}
              driver={driver}
            />
          )}
          {step === Step.CONNECTION_CREATED && (
            <ConnectionCreated
              settings={{} as IConnection}
              driver={driver}
              action={action}
              reset={this.reset}
            />
          )}
        </Container>
        <Loading active={loading} />
      </>
    );
  }
}
