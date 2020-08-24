import { IDriverAlias, IConnection } from '@sqltools/types';
import { Step } from './lib/steps';
import { FormProps } from '@rjsf/core';
import { UIAction } from '../../../../actions';

type ActionKeys = keyof typeof UIAction;
export interface ReducerAction<K extends ActionKeys = ActionKeys> {
  type: typeof UIAction[K];
  payload?: Partial<SettingsScreenState> & { [k: string]: any };
  callback?: () => any;
}

export interface SettingsScreenState {
  lastDispatchedAction?: ReducerAction;
  loading?: boolean;
  step: Step;
  defaultMethod?: string;
  externalMessage: string;
  externalMessageType: 'warning' | 'error' | 'success';
  saved?: boolean;
  driver?: IDriver;
  installedDrivers: IDriver[];
  schema: FormProps<IConnection>['schema'];
  uiSchema: FormProps<IConnection>['uiSchema'];
  formData: Partial<IConnection>;
}

export type IDriver = { icon: string } & IDriverAlias;
