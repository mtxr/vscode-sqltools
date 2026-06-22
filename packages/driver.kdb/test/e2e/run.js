const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const {
  downloadAndUnzipVSCode,
  resolveCliPathFromVSCodeExecutablePath,
  runTests,
} = require('@vscode/test-electron');

const SQLTOOLS_EXTENSION_ID = 'mtxr.sqltools';

async function main() {
  if (shouldStartDisplayServer()) {
    process.exit(await runWithDisplayServer());
  }

  const projectRoot = path.resolve(__dirname, '../..');
  const testRoot = path.join(projectRoot, '.vscode-test', 'e2e');
  const userDataDir = path.join(testRoot, 'user-data');
  const extensionsDir = path.join(testRoot, 'extensions');
  const workspacePath = path.join(__dirname, 'workspace');
  const extensionTestsPath = path.join(__dirname, 'suite');

  configureLinuxRuntimeLibraryPath(projectRoot);
  fs.mkdirSync(testRoot, { recursive: true });
  fs.rmSync(userDataDir, { recursive: true, force: true });
  fs.mkdirSync(userDataDir, { recursive: true });
  fs.mkdirSync(extensionsDir, { recursive: true });

  const vscodeExecutablePath = await downloadAndUnzipVSCode({
    version: process.env.KDB_SQLTOOLS_E2E_VSCODE_VERSION || 'stable',
  });
  const sqltoolsInstalled = await ensureSqlToolsExtension(vscodeExecutablePath, extensionsDir, userDataDir);

  await runTests({
    vscodeExecutablePath,
    extensionDevelopmentPath: projectRoot,
    extensionTestsPath,
    extensionTestsEnv: {
      KDB_SQLTOOLS_E2E_SQLTOOLS_INSTALLED: sqltoolsInstalled ? '1' : '0',
    },
    launchArgs: [
      workspacePath,
      '--extensions-dir',
      extensionsDir,
      '--user-data-dir',
      userDataDir,
    ],
  });
}

function shouldStartDisplayServer() {
  return process.platform === 'linux'
    && !process.env.DISPLAY
    && !process.env.KDB_SQLTOOLS_E2E_XVFB
    && (Boolean(findExecutable('xvfb-run')) || Boolean(findExecutable('Xvfb')));
}

async function runWithDisplayServer() {
  if (findExecutable('xvfb-run') && findExecutable('xauth')) {
    return runWithXvfbRun();
  }

  if (findExecutable('Xvfb')) {
    return runWithDirectXvfb();
  }

  throw new Error('No DISPLAY is set and neither xvfb-run nor Xvfb is available.');
}

function runWithXvfbRun() {
  const xvfbRun = findExecutable('xvfb-run');
  const result = cp.spawnSync(xvfbRun, ['-a', process.execPath, __filename], {
    env: Object.assign({}, process.env, { KDB_SQLTOOLS_E2E_XVFB: '1' }),
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }
  return result.status === null ? 1 : result.status;
}

async function runWithDirectXvfb() {
  const xvfb = cp.spawn(findExecutable('Xvfb'), ['-displayfd', '1', '-screen', '0', '1280x1024x24', '-nolisten', 'tcp'], {
    stdio: ['ignore', 'pipe', 'inherit'],
  });

  try {
    const display = await readDisplayNumber(xvfb);
    const result = cp.spawnSync(process.execPath, [__filename], {
      env: Object.assign({}, process.env, {
        DISPLAY: `:${display}`,
        KDB_SQLTOOLS_E2E_XVFB: '1',
      }),
      stdio: 'inherit',
    });

    if (result.error) {
      throw result.error;
    }
    return result.status === null ? 1 : result.status;
  } finally {
    xvfb.kill();
  }
}

function readDisplayNumber(xvfb) {
  return new Promise((resolve, reject) => {
    let output = '';
    const timeout = setTimeout(() => reject(new Error('Timed out waiting for Xvfb to start')), 10000);

    xvfb.once('error', error => {
      clearTimeout(timeout);
      reject(error);
    });
    xvfb.once('exit', code => {
      clearTimeout(timeout);
      reject(new Error(`Xvfb exited before reporting a display number with code ${code}`));
    });
    xvfb.stdout.on('data', chunk => {
      output += chunk.toString('utf8');
      const match = output.match(/\d+/);
      if (match) {
        clearTimeout(timeout);
        resolve(match[0]);
      }
    });
  });
}

function findExecutable(command) {
  const result = cp.spawnSync(process.platform === 'win32' ? 'where' : 'command', process.platform === 'win32' ? [command] : ['-v', command], {
    encoding: 'utf8',
    shell: process.platform !== 'win32',
  });

  if (result.status !== 0) {
    return null;
  }

  return result.stdout.split(/\r?\n/).find(Boolean) || null;
}

function configureLinuxRuntimeLibraryPath(projectRoot) {
  if (process.platform !== 'linux') {
    return;
  }

  const candidates = [
    process.env.KDB_SQLTOOLS_E2E_RUNTIME_LIB_DIR,
    path.join(projectRoot, '.vscode-test', 'apt-libs', 'root', 'usr', 'lib', 'x86_64-linux-gnu'),
  ].filter(Boolean);

  const existing = candidates.filter(candidate => fs.existsSync(candidate));
  if (existing.length === 0) {
    return;
  }

  process.env.LD_LIBRARY_PATH = existing
    .concat(process.env.LD_LIBRARY_PATH ? [process.env.LD_LIBRARY_PATH] : [])
    .join(path.delimiter);
}

async function ensureSqlToolsExtension(vscodeExecutablePath, extensionsDir, userDataDir) {
  if (process.env.KDB_SQLTOOLS_E2E_SKIP_SQLTOOLS_INSTALL === '1') {
    return hasInstalledExtension(extensionsDir, SQLTOOLS_EXTENSION_ID);
  }

  if (hasInstalledExtension(extensionsDir, SQLTOOLS_EXTENSION_ID) && process.env.KDB_SQLTOOLS_E2E_FORCE_SQLTOOLS_INSTALL !== '1') {
    return true;
  }

  const cliPath = resolveCliPathFromVSCodeExecutablePath(vscodeExecutablePath);
  const args = [
    '--extensions-dir',
    extensionsDir,
    '--user-data-dir',
    userDataDir,
    '--install-extension',
    SQLTOOLS_EXTENSION_ID,
    '--force',
  ];

  const result = cp.spawnSync(cliPath, args, {
    env: process.env,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status === 0 && hasInstalledExtension(extensionsDir, SQLTOOLS_EXTENSION_ID)) {
    return true;
  }

  if (process.env.KDB_SQLTOOLS_E2E_ALLOW_SQLTOOLS_INSTALL_FAILURE === '1') {
    console.warn(`Could not install ${SQLTOOLS_EXTENSION_ID}; continuing with driver-only VS Code host tests.`);
    return false;
  }

  throw new Error(`Failed to install ${SQLTOOLS_EXTENSION_ID} into ${extensionsDir}. Set KDB_SQLTOOLS_E2E_ALLOW_SQLTOOLS_INSTALL_FAILURE=1 to run the driver-only fallback.`);
}

function hasInstalledExtension(extensionsDir, extensionId) {
  if (!fs.existsSync(extensionsDir)) {
    return false;
  }

  const prefix = `${extensionId.toLowerCase()}-`;
  return fs.readdirSync(extensionsDir).some(entry => entry.toLowerCase().startsWith(prefix));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
