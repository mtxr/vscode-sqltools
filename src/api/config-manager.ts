import Settings from './interface/settings';

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

export default {
  get,
  setSettings,
};
