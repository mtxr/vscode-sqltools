import React, { useCallback, useEffect, useRef } from 'react';
import { useResultsReducer } from './reducer';
import { ResultsScreenState } from '../interfaces';
import { openMessagesConsole } from '../hooks/useContextAction';
import sendMessage from '../../../lib/messages';
import { UIAction } from '../actions';
import { createLogger } from '@sqltools/log/src';
import getVscode from '../../../lib/vscode';

const log = createLogger('Results:reducer');

export interface IResultsContextActions {
  dispatch: ReturnType<typeof useResultsReducer>['dispatch'];
  setState: (data: any, cb?: () => void) => any;
};
export type IResultsContext = IResultsContextActions & ResultsScreenState;

export const ResultsContext = React.createContext<IResultsContext>({} as IResultsContext);

export const ResultsProvider = ({ children }: IResultsProviderProps) => {
  const { state, dispatch, setState } = useResultsReducer();
  const stateRef = useRef(state);

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
    if (state !== stateRef.current) {
      log.info('STATE => Prev %O Curr %O', stateRef.current, state);
      stateRef.current = state;
    }
    getVscode().setState(state);
    return () => {
      getVscode().setState(null);
    }
  }, [state]);

  useEffect(() => {
    window.addEventListener('message', messageHandler);
    sendMessage(UIAction.NOTIFY_VIEW_READY, true);
    setState({ loading: true });
    return () => window.removeEventListener('message', messageHandler);
  }, []);

  useEffect(() => {
    if (state.hasError) {
      openMessagesConsole();
    }
  }, [state.hasError]);

  useEffect(() => {
    sendMessage(UIAction.REQUEST_SYNC_CONSOLE_MESSAGES, state.resultTabs[state.activeTab]?.messages ?? []);
  }, [state, state.activeTab]);

  return (
    <ResultsContext.Provider value={{
      ...state,
      dispatch,
      setState,
    }}>{children}</ResultsContext.Provider>
  );
};

interface IResultsProviderProps {
  children: React.ReactNode;
}
