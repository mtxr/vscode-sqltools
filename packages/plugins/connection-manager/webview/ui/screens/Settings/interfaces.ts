import { IDriverAlias, IConnection } from '@sqltools/types';
import { Step } from './lib/steps';
import { FormProps } from '@rjsf/core';
import { UIAction } from './actions';
import { ReducerAction } from '../../interfaces';

type ActionKeys = keyof typeof UIAction;
export type SettingsReducerAction<K extends ActionKeys = ActionKeys> = ReducerAction<typeof UIAction[K], SettingsScreenState>;

export interface SettingsScreenState {
  lastDispatchedAction?: SettingsReducerAction;
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
