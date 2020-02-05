import { IConfig, OnUpdateConfigHandler, ConfigChangeEvent } from '@sqltools/types';
import { InvalidActionError } from '@sqltools/util/exception';

let settings: IConfig = {} as IConfig;

const onUpdateHooks: OnUpdateConfigHandler[] = [];

const get: IConfig['get'] = (configKey, defaultValue = null) =>  {
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

const throwIfAccess = (name: string) => () => {throw `${name} is not available. Config Manager is in read-only mode.`};

const handlerEventAccess: ConfigChangeEvent = { affectsConfig: throwIfAccess('affectsConfig'), affectsConfiguration: throwIfAccess('affectsConfiguration') }

const replaceAll: IConfig['replaceAll'] = (newSettings: IConfig) => {
  settings = newSettings;
  onUpdateHooks.forEach(cb => cb({ settings: newSettings, event: handlerEventAccess }));
}

const addOnUpdateHook: IConfig['addOnUpdateHook'] = (handler) => {
  onUpdateHooks.push(handler);
}

const handler = {
  get(_: never, prop: string) {
    if (prop === 'replaceAll') return replaceAll;
    if (prop === 'update') throw 'update is not available. Config Manager is in read-only mode.';
    if (prop === 'get') return get;
    if (prop === 'addOnUpdateHook') return addOnUpdateHook;
    if (prop in settings && typeof settings[prop] !== 'undefined') return settings[prop];
    return undefined;
  },
  set() {
    throw new InvalidActionError('Cannot set settings value directly!');
  },
};

/**
 * Readonly configuration
 *
 * @type Readonly<IConfig>
 */
const ConfigRO: Readonly<IConfig> = new Proxy<Readonly<IConfig>>(settings, handler);

export default ConfigRO;
