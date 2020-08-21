import React from 'react';
import { Container } from '@material-ui/core';
import DriverSelector from './Widget/DriverSelector';
import { Step } from './lib/steps';
import ConnectionSettingsForm from './Widget/ConnectionSettingsForm';
import ConnectionCreated from './Widget/ConnectionCreated';
import { createLogger } from '@sqltools/log/src';
import sendMessage from '../../lib/messages';
import { SettingsScreenState } from './interfaces';
import { IConnection } from '@sqltools/types';
import { UIAction } from '../../../../actions';
import Header from './Header';
import { ISubmitEvent, IChangeEvent } from '@rjsf/core';
import { IWebviewMessage } from '../../interfaces';
import Loading from '../../components/Loading';
import styles from '../../sass/generic.m.scss';

const log = createLogger('settings');

export default class SettingsScreen extends React.Component<any, SettingsScreenState> {
  checkDriversInterval: NodeJS.Timeout;
  messagesHandler = ({ action, payload }: IWebviewMessage<any>) => {
    if (!action) return;
    log.info(`Message received: %s %O`, action, payload || 'NO_PAYLOAD');
    switch(action) {
      case UIAction.REQUEST_EDIT_CONNECTION:
        return this.setState({
          action: UIAction.REQUEST_EDIT_CONNECTION,
          loading: false,
          step: Step.CONNECTION_FORM,
          externalMessage: null,
          externalMessageType: null,
          ...payload,
        });
      case UIAction.RESPONSE_UPDATE_CONNECTION_SUCCESS:
      case UIAction.RESPONSE_CREATE_CONNECTION_SUCCESS:
        return this.setState({
          step: Step.CONNECTION_CREATED,
          loading: false,
          action,
          saved: true,
          ...payload,
        });
      case UIAction.RESPONSE_TEST_CONNECTION_SUCCESS:
        return this.setState({
          loading: false,
          externalMessage: 'Successfully connected!',
          externalMessageType: 'success',
        });
      case UIAction.RESPONSE_TEST_CONNECTION_WARNING:
        return this.setState({
          loading: false,
          externalMessage: ((payload && payload.message ? payload.message : payload) || '').toString(),
          externalMessageType: 'warning'
        });
      case UIAction.RESPONSE_INSTALLED_DRIVERS:
        const installedDrivers = (payload as SettingsScreenState['installedDrivers']);
        if (!installedDrivers || installedDrivers.length === 0) {
          this.checkDriversInterval = this.checkDriversInterval || setInterval(() => {
            sendMessage(UIAction.REQUEST_INSTALLED_DRIVERS);
          }, 2000);
        }
        if (installedDrivers.length > 0) {
          clearInterval(this.checkDriversInterval);
          this.checkDriversInterval = null;
        }
        return this.setState({
          loading: false,
          installedDrivers,
        });
      case UIAction.RESPONSE_DRIVER_SCHEMAS:
        const { schema = {}, uiSchema = {} } = payload;
        return this.setState({
          loading: false,
          schema,
          uiSchema,
        }, () => this.goTo(Step.CONNECTION_FORM));
      case UIAction.RESPONSE_UPDATE_CONNECTION_ERROR:
      case UIAction.RESPONSE_CREATE_CONNECTION_ERROR:
      case UIAction.RESPONSE_TEST_CONNECTION_ERROR:
        return this.setState({
          loading: false,
          externalMessageType: 'error',
          ...payload,
          externalMessage: payload.externalMessage || payload.message || 'Connection failed.',
        });
      case UIAction.REQUEST_RESET:
        return this.reset();
      default:
        log.warn(`No handler set for %s`, action);
        break;
    }
  }

  reset = () => {
    this.setState(this.initialState, () => this.loadDrivers());
  }

  readonly initialState: SettingsScreenState = {
    action: UIAction.REQUEST_CREATE_CONNECTION,
    loading: false,
    driver: null,
    step: Step.CONNECTION_TYPE,
    externalMessage: null,
    externalMessageType: null,
    installedDrivers: [],
    schema: {},
    uiSchema: {},
    formData: {}
  };

  state = this.initialState;

  componentDidMount() {
    window.addEventListener('message', ev => this.messagesHandler(ev.data as IWebviewMessage));
    sendMessage(UIAction.NOTIFY_VIEW_READY, true);
    this.loadDrivers();
  }

  loadDrivers = () => {
    this.setState({ loading: true }, () => {
      sendMessage(UIAction.REQUEST_INSTALLED_DRIVERS);
    });
  }

  onSelectDriver = (driver: SettingsScreenState['driver']) => {
    if (!driver) {
      return this.setState({ loading: false, driver, formData: { } });
    }
    this.setState({ loading: true, driver, formData: { driver: driver.value } }, () => {
      sendMessage(UIAction.REQUEST_DRIVER_SCHEMAS, { driver: this.state.driver.value });
    });
  }

  onSubmitSetting = (data: ISubmitEvent<IConnection>) => {
    if (data.errors.length > 0) return;
    const { id: editId, ...connInfo } = data.formData;
    this.setState({ loading: true }, () => {
      sendMessage(!editId ? UIAction.REQUEST_CREATE_CONNECTION : UIAction.REQUEST_UPDATE_CONNECTION, {
        editId,
        connInfo,
        globalSetting: false,
      });
    });
  }

  onChangeFormData = (data: IChangeEvent<IConnection>) => {
    this.setState({ formData: data.formData });
  }

  onTestConnection = () => {
    this.setState({ loading: true }, () => {
      sendMessage(UIAction.REQUEST_TEST_CONNECTION, {
        connInfo: this.state.formData,
      });
    });
  }

  goTo = (step: Step) => this.setState({ step });

  onOpenConnectionFile = () => sendMessage(UIAction.REQUEST_OPEN_CONNECTION_FILE);

  public render() {
    const {
      step,
      driver,
      loading,
      installedDrivers,
      saved,
      action,
      schema,
      uiSchema,
      formData,
      externalMessage,
      externalMessageType,
    } = this.state;
    return (
      <>
        <Container maxWidth='md' className={loading ? styles.blurActive : styles.blur}>
          <Header step={step} driver={driver} saved={saved} goTo={this.goTo}/>
          {step === Step.CONNECTION_TYPE && (
            <DriverSelector
              loading={loading}
              drivers={installedDrivers}
              onSelect={this.onSelectDriver}
              selected={driver}
            />
          )}
          {step === Step.CONNECTION_FORM && (
            <ConnectionSettingsForm
              schema={schema}
              uiSchema={uiSchema}
              installedDrivers={installedDrivers}
              onSubmit={this.onSubmitSetting}
              testConnection={this.onTestConnection}
              openConnectionFile={this.onOpenConnectionFile}
              action={action}
              driver={driver}
              onChange={this.onChangeFormData}
              formData={formData}
              testResults={{
                externalMessage,
                externalMessageType
              }}
            />
          )}
          {step === Step.CONNECTION_CREATED && (
            <ConnectionCreated
              formData={formData}
              driver={driver}
              action={action}
              reset={this.reset}
            />
          )}
        </Container>
        {loading && <Loading />}
      </>
    );
  }
}
