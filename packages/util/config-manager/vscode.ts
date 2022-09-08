if (process.env.PRODUCT !== 'ext') { throw 'Cant use config-manager module outside of VS Code context'; }

import { InvalidActionError } from '@sqltools/util/exception';
import { workspace } from 'vscode';
import { EXT_CONFIG_NAMESPACE } from '@sqltools/util/constants';
import Context from '@sqltools/vscode/context';
import { OnUpdateConfigHandler, IConfig, KeysOfSettings } from '@sqltools/types';

const onUpdateHooks: OnUpdateConfigHandler[] = [];

const get: IConfig['get'] = (configKey, defaultValue = null) => {
  const result = workspace.getConfiguration().get(`${EXT_CONFIG_NAMESPACE}.${configKey}`);
  if (typeof result === 'undefined') return defaultValue;
  return result;
}

const update: IConfig['update'] = (configKey, value) => {
  return Promise.resolve(workspace.getConfiguration().update(`${EXT_CONFIG_NAMESPACE}.${configKey}`, value));
}

const addOnUpdateHook: IConfig['addOnUpdateHook'] = (handler) => {
  onUpdateHooks.push(handler);
}

const handler = {
  get(_: never, prop: string) {
    if (prop === 'get') return get;
    if (prop === 'update') return update;
    if (prop === 'addOnUpdateHook') return addOnUpdateHook;
    if (prop === 'replaceAll') throw 'replaceAll is not necessary within VS Code context. You can use `get` anytime to get fresh data.';
    return get(prop as KeysOfSettings);
  },
  set() {
    throw new InvalidActionError('Cannot set settings value directly!');
  },
};

const Config = new Proxy<IConfig>({} as IConfig, handler);

export default Config;

Context.onRegister(() => {
  Context.subscriptions.push(workspace.onDidChangeConfiguration(event => {
    const affectsConfiguration = event.affectsConfiguration;
    const affectsConfig = (section: KeysOfSettings, resource?: any) => {
      return affectsConfiguration(`${EXT_CONFIG_NAMESPACE}.${section}`, resource);
    };
    onUpdateHooks.forEach(cb => cb({ event: { affectsConfig, affectsConfiguration } }));
  }));
});