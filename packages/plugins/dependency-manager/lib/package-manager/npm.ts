import { commandExists } from '@sqltools/core/utils';
import runPromise from './../run';
import { SpawnOptions } from 'child_process';

export function cli(args: ReadonlyArray<string>, options: SpawnOptions = {}) {
  if (!commandExists('npm')) {
    throw new Error('You need to install node@6 or newer and npm first to install dependencies. Install it and restart to continue.');
  }
  return runPromise('npm', args, {shell: true, ...options });
}

export async function install(args: string | string[], options: SpawnOptions = {}) {
  return cli(['install', ...(Array.isArray(args) ? args : [args]) ], options);
}

export async function run(scriptName: string, options: SpawnOptions = {}) {
  return cli(['run', scriptName ], options);
}

export default {
  cli,
  run,
  install
}