import { ISettings as ISettingsProps } from '@sqltools/types';
import { InvalidActionError } from '@sqltools/core/exception';
import { workspace, ConfigurationChangeEvent, Uri } from 'vscode';
import { EXT_CONFIG_NAMESPACE } from '@sqltools/core/constants';
import Context from './context';

interface ISettings extends ISettingsProps {
  get?: typeof get;
  update?: typeof update;
  addOnUpdateHook?: typeof addOnUpdateHook;
}

type KSettings = (keyof ISettingsProps);

interface STConfigurationChangeEvent extends ConfigurationChangeEvent {
  affectsConfig(section: KSettings, resource?: Uri): boolean;
  /**
   * VSCode config
   *
   * @param {string} section
   * @param {Uri} [resource]
   * @returns {boolean}
   * @memberof STConfigurationChangeEvent
   */
  affectsConfiguration(section: string, resource?: Uri): boolean;
}

const onUpdateHooks: ((event?: STConfigurationChangeEvent) => any)[] = [];

function get<
  K extends KSettings = KSettings,
  V = ISettings[K]
>(configKey: K, defaultValue: V | any = null): V {
  const result = workspace.getConfiguration().get<V>(`${EXT_CONFIG_NAMESPACE}.${configKey}`);
  if (typeof result === 'undefined') return defaultValue;
  return result as V;
}

function update<K extends KSettings = KSettings, V = ISettings[K]>(configKey: KSettings, value: V) {
  return workspace.getConfiguration().update(`${EXT_CONFIG_NAMESPACE}.${configKey}`, value);
}

function addOnUpdateHook(handler: typeof onUpdateHooks[number]) {
  onUpdateHooks.push(handler);
}

const handler = {
  get(_: never, prop: string) {
    if (prop === 'update') return update;
    if (prop === 'get') return get;
    if (prop === 'addOnUpdateHook') return addOnUpdateHook;
    return get(prop as KSettings);
  },
  set() {
    throw new InvalidActionError('Cannot set settings value directly!');
  },
};

const Config = new Proxy<ISettings>({}, handler);

export default Config;

Context.onRegister(() => {
  Context.subscriptions.push(workspace.onDidChangeConfiguration(event => {
    const affectsConfiguration = event.affectsConfiguration;
    const affectsConfig = (section: KSettings, resource?: Uri) => {
      return affectsConfiguration(`${EXT_CONFIG_NAMESPACE}.${section}`, resource);
  };
    onUpdateHooks.forEach(cb => cb({ affectsConfig, affectsConfiguration }));
  }));
});