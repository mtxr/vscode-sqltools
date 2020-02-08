import { workspace } from 'vscode';
import { ISettings as ISettingsProps } from '@sqltools/types';
import { InvalidActionError } from '@sqltools/core/exception';

interface ISettings extends ISettingsProps {
  get?: typeof get;
  update?: typeof update;
  addOnUpdateHook?: typeof addOnUpdateHook;
  inspect?: (prop) => { defaultValue: any };
}

let settings: Partial<ISettings> = {};
const onUpdateHooks: (() => any)[] = [];
function get(configKey: string, defaultValue: any = null): any[] | string | boolean | number {
  const keys: string [] = configKey.split('.');

  let setting = settings as any;
  for (const key of keys) {
    if (!setting.hasOwnProperty(key) || typeof setting[key] === 'undefined') {
      return defaultValue;
    }
    setting = setting[key];
  }
  return setting;
}

function update(newSettings: ISettings) {
  settings = newSettings;
  if (!settings.inspect) {
    // inspect implementation for language server.
    settings.inspect = () => {
      throw new Error(`Inspect doesnt exist within ${process.env.PRODUCT} context`);
    };
  }
  onUpdateHooks.forEach(cb => cb());
}

function addOnUpdateHook(handler: () => void) {
  onUpdateHooks.push(handler);
}

const handler = {
  get(_: never, prop: string) {
    if (prop === 'update') return update;
    if (prop === 'get') return get;
    if (prop === 'addOnUpdateHook') return addOnUpdateHook;
    if (prop === 'telemetry') return !!settings.telemetry && workspace.getConfiguration('telemetry').get('enableTelemetry', false));
    if (prop in settings && typeof settings[prop] !== 'undefined') return settings[prop];
    if (settings.inspect) {
      const data = settings.inspect(prop) || { defaultValue: undefined };
      return data.defaultValue;
    }
    return undefined;
  },
  set() {
    throw new InvalidActionError('Cannot set settings value directly!');
  },
};

const ConfigManager = new Proxy<ISettings>(settings, handler);

export default ConfigManager;
