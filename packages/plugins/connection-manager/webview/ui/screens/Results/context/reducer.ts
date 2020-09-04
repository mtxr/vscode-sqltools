import { useCallback, useReducer } from 'react';
import { createLogger } from '@sqltools/log/src';
import { UIAction } from '../actions';
import { ResultsScreenState, ResultsReducerAction } from '../interfaces';
import sendMessage from '../../../lib/messages';

const log = createLogger('Results:reducer');

const initialState: ResultsScreenState = {
  loading: true,
  hasError: false,
  resultTabs: [],
  activeTab: 0,
};

const reducer: React.Reducer<ResultsScreenState, ResultsReducerAction> = (
  state,
  action
) => {
  const { type: actionType, payload } = action;
  log.debug(`ACTION %s %O`, actionType, payload);
  const mutate = (changes: Partial<ResultsScreenState> = {}) => ({
    ...state,
    ...changes,
  });

  switch (actionType) {
    case UIAction.SET_STATE:
    case UIAction.RESPONSE_RESULTS:
      return mutate({
        activeTab: 0,
        loading: false,
        ...payload,
      });
    case UIAction.REQUEST_STATE:
      sendMessage(UIAction.RESPONSE_STATE, state);
      return state;
    case UIAction.REQUEST_RESET:
      return mutate(initialState);
    default:
      log.warn(`No handler set for %s`, action);
  }
  return state;
};

export const useResultsReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setState = useCallback(
    (data: any, cb?: () => any) => {
      dispatch({ type: UIAction.SET_STATE, payload: data });
      cb && cb();
    },
    [state, dispatch]
  );

  return { state, dispatch, setState };
};
