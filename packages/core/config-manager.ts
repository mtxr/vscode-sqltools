import { ISettings as ISettingsProps } from '@sqltools/types';
import { InvalidActionError } from '@sqltools/core/exception';

interface ISettings extends ISettingsProps {
  get?: typeof get;
  replaceAll?: typeof replaceAll;
  addOnUpdateHook?: typeof addOnUpdateHook;
}

let settings: Partial<ISettings> = {};

type KSettings = (keyof ISettingsProps);

const onUpdateHooks: (() => any)[] = [];

function get<
  K extends KSettings = KSettings,
  V = ISettings[K]
>(configKey: K, defaultValue: V | any = null): V {
  if ((settings as any).hasOwnProperty(configKey)) {
    return settings[configKey] as any as V;
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

function replaceAll(newSettings: ISettings) {
  settings = newSettings;
  onUpdateHooks.forEach(cb => cb());
}

function addOnUpdateHook(handler: () => void) {
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
 * @type Readonly<ISettings>
 */
const ConfigRO: Readonly<ISettings> = new Proxy<Readonly<ISettings>>(settings, handler);

export default ConfigRO;


// @TODO move to language server package