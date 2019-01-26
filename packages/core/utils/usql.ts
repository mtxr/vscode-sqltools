import { exec as execCb } from 'child_process';
import path from 'path';
import { mkdirSync, statSync } from 'fs';
import logger from './logger';

let extRoot: string;
let usqlRootDir: string;

const exec = (command) => new Promise<{ stdout: string; stderr?: string; err?: any }>((resolve, reject) => {
  execCb(command, (err, stdout, stderr) => {
    if (err) return reject({ err, stderr });
    return resolve({ stdout, stderr });
  })
});

const getBinPath = () => path.join(usqlRootDir, 'usql' + (process.platform === 'win32' ? '.exe' : ''));

let installPromise = null;
const install = async (): Promise<void> => {
  if (!installPromise) {
    logger.log(`will try to install usql for ${process.platform}@${process.arch}`);
    // @TODO: add code to download and install usql HERE
    installPromise = Promise.resolve();
    await installPromise;
    logger.log('USQL successfully installed!');
  }
  return installPromise;
}

const checkAndInstall = async (): Promise<void> => {
  if (statSync(getBinPath())) return Promise.resolve();
  return install();
}

const setExtensionData = ({ extPath }) => {
  extRoot = path.normalize(extPath);
  usqlRootDir = path.join(extRoot, 'vendor', 'usql');

  try {
    mkdirSync(usqlRootDir, { recursive: true });
  } catch (e) { /** */ }
}

const runQuery = async ({
  query,
  connectString
}) => {
  await checkAndInstall();
  const { stdout } = await exec(`${getBinPath()} "${connectString}" -j -c "${query}"`);
  return stdout.split('\n');
}

export const USQLModule = {
  checkAndInstall,
  setExtensionData,
  getBinPath,
  runQuery,
  get extRoot() { return extRoot; },
  get usqlRootDir() { return extRoot; },
}

export default USQLModule;