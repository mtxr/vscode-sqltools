import React from 'react';
import { useSettingsReducer } from './reducer';
import { SettingsScreenState } from '../interfaces';

export interface ISettingsContextActions {
  dispatch: ReturnType<typeof useSettingsReducer>['dispatch'];
  setState: (data: any, cb?: () => void) => any;
};
export type ISettingsContext = ISettingsContextActions & SettingsScreenState;

export const SettingsContext = React.createContext<ISettingsContext>({} as ISettingsContext);

export const SettingsProvider = ({ children }: ISettingsProviderProps) => {
  const { state, dispatch, setState } = useSettingsReducer();

  return (
    <SettingsContext.Provider value={{
      ...state,
      dispatch,
      setState,
    }}>{children}</SettingsContext.Provider>
  );
};

interface ISettingsProviderProps {
  children: React.ReactNode;
}
