import { InvalidActionException } from '@sqltools/core/exception';
import { Settings } from '@sqltools/core/interface';
import packageJson from '@sqltools/extension/package.json';
const { contributes: { configuration: { properties: defaults } } } = packageJson;

let settings: Settings & { inspect?: (prop) => { defaultValue: any } } = {};
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

function update(newSettings: typeof settings) {
  settings = newSettings;
  if (!settings.inspect) {
    // inspect implementation for language server.
    settings.inspect = prop => {
      const key = `sqltools.${prop}`;
      return {
        defaultValue: key in defaults ? defaults[key].default : undefined,
      }
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
    if (prop in settings && typeof settings[prop] !== 'undefined') return settings[prop];
    if (settings.inspect) {
      const data = settings.inspect(prop) || { defaultValue: undefined };
      return data.defaultValue;
    }
    return undefined;
  },
  set() {
    throw new InvalidActionException('Cannot set settings value directly!');
  },
};

type ExtendedSettings = Settings & { get: typeof get, update: typeof update, addOnUpdateHook: typeof addOnUpdateHook };
const ConfigManager = new Proxy<ExtendedSettings>(<any>settings, handler);

export default ConfigManager;
