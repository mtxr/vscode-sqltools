import { Settings } from './interface';
import packageJson from '../extension/package.json';
const { contributes: { configuration: { properties: defaults } } } = packageJson;

let settings: Settings = {};
export function get(configKey: string, defaultValue: any = null): any[] | string | boolean | number {
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

export function setSettings(newSettings: Settings) {
  settings = newSettings;
}

const handler = {
  get(target, prop) {
    if (prop === 'get') return get;
    if (prop === 'setSettings') return setSettings;
    if (prop in settings && typeof settings[prop] !== 'undefined') return settings[prop];
    const key = `sqltools.${prop}`;
    if (key in defaults && typeof defaults[key].default !== 'undefined') return defaults[key].default;
    return null;
  },
  set(target, prop, value) {
    return false;
  },
};

type ExtendedSettings = Settings & { get?(...args): any, setSettings?(...args): void };
const settingsProxy = new Proxy<ExtendedSettings>(settings, handler);

export default settingsProxy;
