import { extensions } from 'vscode';
import Context from '@sqltools/vscode/context';
import PluginResourcesMap, { buildResouceKey } from '@sqltools/util/plugin-resources';
import { IDriverExtensionApi, IIcons } from '@sqltools/types';
import fs from 'fs';
import prepareSchema from './webview/lib/prepare-schema';
import { SettingsScreenState } from './webview/ui/screens/Settings/interfaces';
import { createLogger } from '@sqltools/log/src';

const log = createLogger('ext-util');
export const getDriverSchemas = ({ driver }: { driver: string; } = { driver: null }) => {
  let schema = {};
  let uiSchema = {};
  if (!driver)
    return prepareSchema(schema, uiSchema);
  try {
    schema = JSON.parse(fs.readFileSync(PluginResourcesMap.get<string>(buildResouceKey({ type: 'driver', name: driver, resource: 'connection-schema' }))).toString()) || {};
  }
  catch (error) { }
  try {
    uiSchema = JSON.parse(fs.readFileSync(PluginResourcesMap.get<string>(buildResouceKey({ type: 'driver', name: driver, resource: 'ui-schema' }))).toString()) || {};
  }
  catch (error) { }

  return prepareSchema(schema, uiSchema);
};

export const getInstalledDrivers = async (retry = 0): Promise<SettingsScreenState['installedDrivers']> => {
  if (retry > 20) {
    log.info('stoped trying to find installed drivers.');
    return;
  }
  const driverExtensions: string[] = (Context.globalState.get<{ driver: string[]; }>('extPlugins') || { driver: [] }).driver || [];
  const installedDrivers: SettingsScreenState['installedDrivers'] = [];
  await Promise.all(driverExtensions.map(async (id) => {
    log.info(`getting extension %s information.`, id);
    const ext = await getExtension(id);
    log.info(`loaded extension information %s for driver %s.`, id, ext.driverName);
    if (ext && ext.driverAliases) {
      ext.driverAliases.map(({ displayName, value }) => {
        const iconsPath = PluginResourcesMap.get<IIcons>(buildResouceKey({ type: 'driver', name: value, resource: 'icons' }));
        let icon: string;
        if (iconsPath && iconsPath.default) {
          icon = 'data:application/octet-stream;base64,' + fs.readFileSync(iconsPath.default).toString('base64');
        }
        installedDrivers.push({
          displayName,
          value,
          icon,
        });
      });
    }
  }));

  if (installedDrivers.length === 0 && driverExtensions.length > 0) {
    log.info(`no installed drivers found. retrying.... ${retry +1}.`);
    return new Promise(res => setTimeout(() => res(getInstalledDrivers(retry++)), 250));
  }

  return installedDrivers.sort((a, b) => a.displayName.localeCompare(b.displayName));
};

export const getExtension = async (id: string): Promise<IDriverExtensionApi | null> => {
  try {
    const ext = extensions.getExtension<IDriverExtensionApi>(id);
    if (ext) {
      if (!ext.isActive) {
        await ext.activate();
      }
      return ext.exports;
    }
  } catch (error) {
    log.info(`failed to get installed extension %s. %O`, id, error);
  }
  return null;
};

export const driverPluginExtension = async (driverName: string) => {
  const pluginExtenxionId = PluginResourcesMap.get(buildResouceKey({ type: 'driver', name: driverName, resource: 'extension-id' }));
  log.debug(`Driver name %s. Plugin ext: %s`, driverName, pluginExtenxionId);
  if (!pluginExtenxionId) return null;
  return getExtension(pluginExtenxionId);
};
