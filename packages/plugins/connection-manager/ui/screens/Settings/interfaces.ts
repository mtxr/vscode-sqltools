import { IDriverAlias, IConnection } from '@sqltools/types';
import { Step } from './lib/steps';
import { FormProps } from '@rjsf/core';
import { UIAction } from '../../../actions';
export interface SettingsScreenState {
  loading?: boolean;
  step: Step;
  defaultMethod?: string;
  externalMessage: string;
  externalMessageType: 'warning' | 'error' | 'success';
  action: (typeof UIAction)[keyof typeof UIAction];
  saved?: boolean;
  driver?: SettingsScreenState['installedDrivers'][number];
  installedDrivers: ({ icon: string; } & IDriverAlias)[];
  schema: FormProps<IConnection>['schema'];
  uiSchema: FormProps<IConnection>['uiSchema'];
  formData: Partial<IConnection>;
}
