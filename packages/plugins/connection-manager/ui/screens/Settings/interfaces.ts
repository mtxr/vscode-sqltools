import { IDriverAlias } from '@sqltools/types';
import { Step } from './lib/steps';
export interface SettingsScreenState {
  loading?: boolean;
  step: Step;
  defaultMethod?: string;
  externalMessage: string;
  externalMessageType: string;
  errors: {
    [id: string]: boolean;
  };
  action: 'create' | 'update' | 'updateConnectionSuccess' | 'createConnectionSuccess';
  saved?: boolean;
  driver?: SettingsScreenState['installedDrivers'][number];
  installedDrivers: ({
    icon: string;
  } & IDriverAlias)[];
}
