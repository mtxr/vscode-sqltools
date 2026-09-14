import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  editingCell: { rowIndex: number; columnName: string } | null;
  setEditingCell: (cell: { rowIndex: number; columnName: string } | null) => void;
  edits: { [resultId: string]: { [rowIndex: number]: { [columnName: string]: any } } };
  setEdits: React.Dispatch<React.SetStateAction<{ [resultId: string]: { [rowIndex: number]: { [columnName: string]: any } } }>>;
  saving: boolean;
  setSaving: (saving: boolean) => void;
  toast: { message: string; type: 'success' | 'error' } | null;
  setToast: (toast: { message: string; type: 'success' | 'error' } | null) => void;
};
export type IResultsContext = IResultsContextActions & ResultsScreenState;

export const ResultsContext = React.createContext<IResultsContext>({} as IResultsContext);

export const ResultsProvider = ({ children }: IResultsProviderProps) => {
  const { state, dispatch, setState } = useResultsReducer();
  const stateRef = useRef(state);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnName: string } | null>(null);
  const [edits, setEdits] = useState<{ [resultId: string]: { [rowIndex: number]: { [columnName: string]: any } } }>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const reRunActiveQuery = useCallback(() => {
    const result = state.resultTabs[state.activeTab];
    if (!result) return;
    const { queryType, query, queryParams, pageSize, page, requestId, baseQuery, connId } = result;
    const options = { requestId, resultId: result.resultId, baseQuery, connId };
    
    if (queryType) {
      sendMessage(UIAction.CALL, {
        command: `${process.env.EXT_NAMESPACE}.${queryType}`,
        args: [queryParams, { ...options, page, pageSize: pageSize || 50 }],
      });
    } else {
      sendMessage(UIAction.CALL, {
        command: `${process.env.EXT_NAMESPACE}.executeQuery`,
        args: [query, options],
      });
    }
    setState({ loading: true });
  }, [state, setState]);

  const messageHandler = useCallback(
    ev => {
      const { action, payload } = ev.data;
      if (!action) return;
      
      if (action === UIAction.UPDATE_ROWS_RESPONSE) {
        const { success, resultId, updatedRowCount } = payload;
        setSaving(false);
        if (success) {
          setToast({ message: `Successfully updated ${updatedRowCount} row(s).`, type: 'success' });
          setEdits(prev => {
            const next = { ...prev };
            delete next[resultId];
            return next;
          });
          reRunActiveQuery();
        } else {
          // Do not show local error toast, native VS Code notification handles it
        }
        return;
      }

      log.info(`Message received: %s %O`, action, payload || 'NO_PAYLOAD');
      dispatch({ type: action, payload });
    },
    [state, dispatch, reRunActiveQuery]
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
    return () => window.removeEventListener('message', messageHandler);
  }, [messageHandler]);

  useEffect(() => {
    sendMessage(UIAction.NOTIFY_VIEW_READY, true);
    setState({ loading: true });
  }, []);

  useEffect(() => {
    if (state.showConsole) {
      openMessagesConsole();
    }
  }, [state.showConsole]);

  useEffect(() => {
    sendMessage(UIAction.REQUEST_SYNC_CONSOLE_MESSAGES, state.resultTabs[state.activeTab]?.messages ?? []);
  }, [state, state.activeTab]);

  return (
    <ResultsContext.Provider value={{
      ...state,
      dispatch,
      setState,
      editingCell,
      setEditingCell,
      edits,
      setEdits,
      saving,
      setSaving,
      toast,
      setToast,
    }}>{children}</ResultsContext.Provider>
  );
};

interface IResultsProviderProps {
  children: React.ReactNode;
}
