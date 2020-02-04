import { ISettings as ISettingsProps } from '@sqltools/types';
import { InvalidActionError } from '@sqltools/core/exception';

interface ISettings extends ISettingsProps {
  get?: typeof get;
  update?: typeof update;
  addOnUpdateHook?: typeof addOnUpdateHook;
}

let settings: Partial<ISettings> = {};
const onUpdateHooks: ((event?: { affectsConfiguration?: (section: string, resource?: any) => boolean; }) => any)[] = [];
function get(configKey: string, defaultValue: any = null): any[] | string | boolean | number {
  if ((settings as any).hasOwnProperty(configKey)) {
    return settings[configKey];
  }
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

function update(newSettings: ISettings, event?: { affectsConfiguration: (section: string, resource?: any) => boolean; }) {
  settings = newSettings;
  onUpdateHooks.forEach(cb => cb(event));
}

function addOnUpdateHook(handler: () => void) {
  onUpdateHooks.push(handler);
}

const handler = {
  get(_: never, prop: string) {
    if (prop === 'update') return update;
    if (prop === 'get') return get;
    if (prop === 'addOnUpdateHook') return addOnUpdateHook;
    if (prop in settings && typeof settings[prop] !== 'undefined') return settings[prop];
    return undefined;
  },
  set() {
    throw new InvalidActionError('Cannot set settings value directly!');
  },
};

const ConfigManager = new Proxy<ISettings>(settings, handler);

export default ConfigManager;
