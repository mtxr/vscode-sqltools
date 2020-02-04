import envPaths from 'env-paths';
import path from 'path';
import fs from 'fs';
import EnvironmentError from './../exception/environment';
import logger from '@sqltools/core/log';
import { EXT_NAMESPACE } from '../constants';

const log = logger.extend('persistence');
const SQLTOOLS_PATHS = envPaths(`vscode-${EXT_NAMESPACE}`, { suffix: null });
let home: string;

if (!fs.existsSync(SQLTOOLS_PATHS.config)) {
  fs.mkdirSync(SQLTOOLS_PATHS.config);
  log.extend('debug')(`Created config path ${SQLTOOLS_PATHS.config}`);
}
if (!fs.existsSync(SQLTOOLS_PATHS.data)) {
  fs.mkdirSync(SQLTOOLS_PATHS.data);
  log.extend('debug')(`Created data path ${SQLTOOLS_PATHS.data}`);
}
if (!fs.existsSync(SQLTOOLS_PATHS.cache)) {
  fs.mkdirSync(SQLTOOLS_PATHS.cache);
  log.extend('debug')(`Created cache path ${SQLTOOLS_PATHS.cache}`);
}

if (!fs.existsSync(getDataPath('node_modules'))) {
  fs.mkdirSync(getDataPath('node_modules'));
  log.extend('debug')(`Created node_modules path ${getDataPath('node_modules')}`);
}

/**
   * Get user home path
   *
   * @throws {EnvironmentException} Can't find user path from wnv
   * @returns {string} Returns user path as string
   */
export function getHome(...args: string[]): string {
  if (!home) {
    if (process && process.env && (process.env.HOME || process.env.USERPROFILE)) {
      home = process.env.HOME || process.env.USERPROFILE;
    } else {
      throw new EnvironmentError('Could not find user home path');
    }
  }
  return path.resolve(home, ...args);
}

export function getConfigPath(...args: string[]) {
  return path.resolve(SQLTOOLS_PATHS.config, ...args);
}

export function getDataPath(...args: string[]) {
  return path.resolve(SQLTOOLS_PATHS.data, ...args);
}

export function getCachePath(...args: string[]) {
  return path.resolve(SQLTOOLS_PATHS.cache, ...args);
}

export function migrateFilesToNewPaths() {
  log.extend('debug')(`Checking file paths migration needed`);
  const toMigrate = [
    {
      from: getHome('.sqltools-setup'),
      to: getConfigPath(RUNNING_INFO_FILENAME),
      migrated: false,
    },
    {
      from: getHome('.SQLTools'),
      to: getDataPath(SESSION_FILES_DIRNAME)
    }
  ];
  toMigrate.map((task) => {
    const { from, to } = task;
    if(fs.existsSync(to)) {
      log.extend('debug')(`Destination file ${to} already exists. Skipping...`);
      return task;
    };
    if(!fs.existsSync(from)) {
      log.extend('debug')(`Origin file ${from} doesnt exists. Skipping...`);
      return task;
    };

    fs.renameSync(from, to);
    task.migrated = true;

    log.extend('info')(`Migrated file from ${from} to ${to}`);

    return task;
  });
}

export const RUNNING_INFO_FILENAME = 'runningInfo.json';
export const SESSION_FILES_DIRNAME = 'session';