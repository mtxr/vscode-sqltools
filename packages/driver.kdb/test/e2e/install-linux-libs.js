const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../..');
const baseDir = path.join(projectRoot, '.vscode-test', 'apt-libs');
const downloadsDir = path.join(baseDir, 'downloads');
const rootDir = path.join(baseDir, 'root');
const libDir = path.join(rootDir, 'usr', 'lib', 'x86_64-linux-gnu');

const packageGroups = [
  ['libgtk-3-0t64', 'libgtk-3-0'],
  ['libepoxy0'],
  ['libxinerama1'],
  ['libcloudproviders0'],
];

function main() {
  if (process.platform !== 'linux') {
    return;
  }

  if (process.env.KDB_SQLTOOLS_E2E_SKIP_LINUX_LIBS === '1') {
    return;
  }

  if (!commandExists('apt-get') || !commandExists('dpkg-deb')) {
    console.warn('Skipping VS Code Linux runtime library bootstrap: apt-get or dpkg-deb is not available.');
    return;
  }

  fs.mkdirSync(downloadsDir, { recursive: true });
  fs.mkdirSync(rootDir, { recursive: true });

  for (const group of packageGroups) {
    if (groupAlreadyExtracted(group)) {
      continue;
    }
    downloadAndExtractFirstAvailable(group);
  }

  if (fs.existsSync(libDir)) {
    console.log(`Prepared VS Code Linux runtime libraries in ${libDir}`);
  }
}

function groupAlreadyExtracted(group) {
  const probes = {
    'libgtk-3-0t64': 'libgtk-3.so.0',
    'libgtk-3-0': 'libgtk-3.so.0',
    libepoxy0: 'libepoxy.so.0',
    libxinerama1: 'libXinerama.so.1',
    libcloudproviders0: 'libcloudproviders.so.0',
  };

  return group.some(pkg => fs.existsSync(path.join(libDir, probes[pkg] || `${pkg}.so`)));
}

function downloadAndExtractFirstAvailable(packages) {
  const errors = [];
  for (const pkg of packages) {
    try {
      const before = new Set(fs.readdirSync(downloadsDir));
      run('apt-get', ['download', pkg], downloadsDir);
      const deb = fs.readdirSync(downloadsDir)
        .filter(file => file.endsWith('.deb') && !before.has(file))
        .sort()
        .pop()
        || fs.readdirSync(downloadsDir).filter(file => file.startsWith(`${pkg}_`) && file.endsWith('.deb')).sort().pop();

      if (!deb) {
        throw new Error(`apt-get did not produce a .deb for ${pkg}`);
      }

      run('dpkg-deb', ['-x', path.join(downloadsDir, deb), rootDir], projectRoot);
      return;
    } catch (error) {
      errors.push(`${pkg}: ${error.message}`);
    }
  }

  console.warn(`Could not bootstrap optional VS Code Linux package group [${packages.join(', ')}]: ${errors.join('; ')}`);
}

function commandExists(command) {
  const result = cp.spawnSync('command', ['-v', command], { shell: true, stdio: 'ignore' });
  return result.status === 0;
}

function run(command, args, cwd) {
  const result = cp.spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `${command} failed`).trim());
  }
}

main();
