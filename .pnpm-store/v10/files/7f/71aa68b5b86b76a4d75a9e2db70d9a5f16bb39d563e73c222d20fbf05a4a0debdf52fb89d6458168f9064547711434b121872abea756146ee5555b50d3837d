import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const require = (path2) => createRequire(fileURLToPath(`file://${resolve("node_modules")}`))(path2);
async function exec(name) {
  const build = require("aria-build");
  await build.run(name);
}

export { exec, require };
