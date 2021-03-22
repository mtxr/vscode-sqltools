import { useCallback, useEffect, useReducer, useRef } from 'react';
import { createLogger } from '@sqltools/log/src';
import { UIAction } from '../actions';
import { SettingsScreenState, SettingsReducerAction } from '../interfaces';
import { Step } from '../lib/steps';
import sendMessage from '../../../lib/messages';
import getVscode from '../../../lib/vscode';

const log = createLogger('settings:reducer');

const initialState: SettingsScreenState = {
  lastDispatchedAction: null,
  loading: false,
  driver: null,
  step: Step.CONNECTION_DRIVER_SELECTOR,
  externalMessage: null,
  externalMessageType: null,
  installedDrivers: [],
  schema: {},
  uiSchema: {},
  formData: {},
};

const reducer: React.Reducer<SettingsScreenState, SettingsReducerAction> = (
  state,
  action
) => {
  const { type: actionType, payload } = action;
  log.debug(`ACTION %s %O`, actionType, payload);
  const mutate = (changes: Partial<SettingsScreenState> = {}) => ({
    ...state,
    ...changes,
    lastDispatchedAction: action,
    action: actionType,
  });

  switch (actionType) {
    case UIAction.REQUEST_EDIT_CONNECTION:
      return mutate({
        loading: false,
        step: Step.CONNECTION_FORM,
        externalMessage: null,
        externalMessageType: null,
        ...payload,
      });
    case UIAction.RESPONSE_UPDATE_CONNECTION_SUCCESS:
    case UIAction.RESPONSE_CREATE_CONNECTION_SUCCESS:
      return mutate({
        step: Step.CONNECTION_SAVED,
        loading: false,
        saved: true,
        ...payload,
      });
    case UIAction.RESPONSE_TEST_CONNECTION_SUCCESS:
      return mutate({
        loading: false,
        externalMessage: 'Successfully connected!',
        externalMessageType: 'success',
      });
    case UIAction.RESPONSE_TEST_CONNECTION_WARNING:
      return mutate({
        loading: false,
        externalMessage: (
          (payload && payload.message ? payload.message : payload) || ''
        ).toString(),
        externalMessageType: 'warning',
      });
    case UIAction.RESPONSE_INSTALLED_DRIVERS:
      const installedDrivers = payload as SettingsScreenState['installedDrivers'];
      return mutate({
        loading: false,
        installedDrivers,
      });
    case UIAction.RESPONSE_DRIVER_SCHEMAS:
      const { schema = {}, uiSchema = {} } = payload;
      return mutate({
        loading: false,
        schema,
        uiSchema,
        step: Step.CONNECTION_FORM,
      });
    case UIAction.RESPONSE_UPDATE_CONNECTION_ERROR:
    case UIAction.RESPONSE_CREATE_CONNECTION_ERROR:
    case UIAction.RESPONSE_TEST_CONNECTION_ERROR:
      return mutate({
        loading: false,
        externalMessageType: 'error',
        ...payload,
        externalMessage:
          payload.externalMessage || payload.message || 'Connection failed.',
      });
    case UIAction.SET_STATE:
      return mutate({ ...payload });
    case UIAction.REQUEST_RESET:
      return mutate({ ...initialState, installedDrivers: state.installedDrivers });
    default:
      log.warn(`No handler set for %s`, action);
  }
  return mutate({});
};

let checkDriversInterval;
export const useSettingsReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);

  const setState = useCallback(
    (data: any, cb?: () => any) => {
      dispatch({ type: UIAction.SET_STATE, payload: data });
      cb && cb();
    },
    [state, dispatch]
  );

  const messageHandler = useCallback(
    ev => {
      const { action, payload } = ev.data;
      if (!action) return;
      log.info(`Message received: %s %O`, action, payload || 'NO_PAYLOAD');
      dispatch({ type: action, payload });
    },
    [state, dispatch]
  );

  useEffect(() => {
    switch (state.lastDispatchedAction && state.lastDispatchedAction.type) {
      case UIAction.RESPONSE_INSTALLED_DRIVERS:
        if (
          !checkDriversInterval &&
          (!state.installedDrivers || state.installedDrivers.length === 0)
        ) {
          checkDriversInterval =
            checkDriversInterval ||
            setInterval(() => {
              sendMessage(UIAction.REQUEST_INSTALLED_DRIVERS);
            }, 2000);
        }
        if (state.installedDrivers.length > 0) {
          clearInterval(checkDriversInterval);
          checkDriversInterval = null;
        }
    }
    if (state.lastDispatchedAction && state.lastDispatchedAction.callback) {
      state.lastDispatchedAction.callback();
    }
    return () => {
      clearInterval(checkDriversInterval);
      checkDriversInterval = null;
    };
  }, [state.lastDispatchedAction]);

  useEffect(() => {
    window.addEventListener('message', messageHandler);
    sendMessage(UIAction.NOTIFY_VIEW_READY, true);
    setState({ loading: true });
    sendMessage(UIAction.REQUEST_INSTALLED_DRIVERS);
    return () => window.removeEventListener('message', messageHandler);
  }, []);

  useEffect(() => {
    if (state !== stateRef.current) {
      log.info('STATE => Prev %O Curr %O', stateRef.current, state);
      stateRef.current = state;
    }
    getVscode().setState(state);
    return () => {
      getVscode().setState(null);
    }
  }, [state]);

  return { state, dispatch, setState };
};
