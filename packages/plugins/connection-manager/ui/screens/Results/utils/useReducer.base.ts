import React, { useRef, useReducer as useReducerDefault, useEffect } from 'react';
import logger from '@sqltools/util/log';

const log = logger.extend('reducer');

type ReducerHook = <R extends React.Reducer<any, any>>(
  reducer: R,
  initialState: React.ReducerState<R>
) => [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>, React.MutableRefObject<React.ReducerState<R>>];

const useReducer: ReducerHook = (reducer, initialState) => {
  let stateRef = useRef(initialState);
  const [state, dispatchOriginal] = useReducerDefault(reducer, initialState);

  const dispatch: typeof dispatchOriginal = (action) => {
    log('action => %s %O', action.type, action);
    return dispatchOriginal(action);
  }

  useEffect(() => {
    log('prev state => %O', stateRef.current);
    log('curr state => %O', state);
    stateRef.current = state;
  }, [state]);

  return [state, dispatch, stateRef];
}

export default useReducer