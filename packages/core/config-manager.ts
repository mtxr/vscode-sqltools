import { InvalidActionException } from '@sqltools/core/exception';
import { Settings } from '@sqltools/core/interface';
import packageJson from '@sqltools/extension/package.json';
const { contributes: { configuration: { properties: defaults } } } = packageJson;

let settings: Settings = {};
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

async function update(newSettings: Settings) {
  console.log('Configs reloaded!');
  settings = newSettings;
  onUpdateHooks.forEach(cb => cb());
}

function addOnUpdateHook(handler: () => void) {
  onUpdateHooks.push(handler);
}

const handler = {
  get(_: never, prop: string) {
    if (prop === 'get') return get;
    if (prop === 'update') return update;
    if (prop === 'addOnUpdateHook') return addOnUpdateHook;
    if (prop in settings && typeof settings[prop] !== 'undefined') return settings[prop];
    const key = `sqltools.${prop}`;
    if (key in defaults && typeof defaults[key].default !== 'undefined') return defaults[key].default;
    return null;
  },
  set() {
    throw new InvalidActionException('Cannot set settings value directly!');
  },
};

type ExtendedSettings = Settings & { get?: typeof get, update?: typeof update, addOnUpdateHook?: typeof addOnUpdateHook };
const ConfigManager = new Proxy<ExtendedSettings>(settings, handler);

export default ConfigManager;
