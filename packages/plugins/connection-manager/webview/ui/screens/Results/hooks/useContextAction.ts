import { UIAction } from '../actions';
import sendMessage from '../../../lib/messages';
import { MenuActions } from '../constants';
import { useCallback } from 'react';
import useCurrentResult from './useCurrentResult';
import useResultsContext from './useResultsContext';
import { IQueryOptions } from '@sqltools/types';

const getCommand = (cmd: string) => `${process.env.EXT_NAMESPACE}.${cmd}`;

const getFileType = (choice: MenuActions) => Object.values(MenuActions).includes(choice) ? (choice === MenuActions.SaveJSONOption ? 'json' : 'csv') : undefined;

export const openMessagesConsole = () => sendMessage(UIAction.CALL, { command: `${process.env.EXT_NAMESPACE}ViewConsoleMessages.focus` });

export default function useContextAction() {
  const { setState } = useResultsContext();
  const { result, options } = useCurrentResult();

  const openResults = useCallback((choice?: MenuActions.SaveCSVOption | MenuActions.SaveJSONOption | any) => {
    if (!result) return;
    sendMessage(UIAction.CALL, {
      command: getCommand('openResults'),
      args: [{
        ...options,
        fileType: getFileType(choice),
      }],
    });
  }, [result]);

  const exportResults = useCallback((choice?: MenuActions.SaveCSVOption | MenuActions.SaveJSONOption | any) => {
    if (!result) return;
    sendMessage(UIAction.CALL, {
      command: getCommand('saveResults'),
      args: [{
        ...options,
        fileType: getFileType(choice),
      }],
    });
  }, [result]);

  const reRunQuery = useCallback(() => {
    if (!result) return;
    const { queryType, query, queryParams, pageSize, page } = result;
    if (queryType) {
      sendMessage(UIAction.CALL, {
        command: `${process.env.EXT_NAMESPACE}.${queryType}`,
        args: [queryParams, { ...options, page: page, pageSize: pageSize || 50 }],
      });
      return setState({ loading: true });
    }
    sendMessage(UIAction.CALL, {
      command: `${process.env.EXT_NAMESPACE}.executeQuery`,
      args: [
        query,
        options as IQueryOptions
      ],
    });
    return setState({ loading: true });
  }, [result]);

  return { openResults, exportResults, reRunQuery };
}
