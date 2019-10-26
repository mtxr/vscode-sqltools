import envPaths from 'env-paths';
import path from 'path';
import fs from 'fs';
import EnvironmentException from './../exception/environment';

const SQLTOOLS_PATHS = envPaths('vscode-sqltools', { suffix: null });
let home: string;

if (!fs.existsSync(SQLTOOLS_PATHS.config)) {
  fs.mkdirSync(SQLTOOLS_PATHS.config);
}
if (!fs.existsSync(SQLTOOLS_PATHS.data)) {
  fs.mkdirSync(SQLTOOLS_PATHS.data);
}
if (!fs.existsSync(SQLTOOLS_PATHS.cache)) {
  fs.mkdirSync(SQLTOOLS_PATHS.cache);
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
      throw new EnvironmentException('Could not find user home path');
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
    if(!fs.existsSync(from) || (fs.existsSync(from) && fs.existsSync(to))) return task;

    fs.renameSync(from, to);
    task.migrated = true;

    console.log(`Migrated ${from} to ${to}`);

    return task;
  });
}

export const RUNNING_INFO_FILENAME = 'runningInfo.json';
export const SESSION_FILES_DIRNAME = 'session';