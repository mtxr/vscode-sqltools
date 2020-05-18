const path = require('path');

function parseEntries(entries, packagePath) {
  let outDir = undefined;
  const entry = Object.keys(entries).reduce((agg, name) => {
    outDir = outDir || entries[name].outDir;
    return {
      ...agg,
      [name]: path.resolve(packagePath, entries[name].file || entries[name]),
    };
  }, {});
  return {
    outDir: outDir ? path.resolve(packagePath, outDir) : undefined,
    entry
  }
}

module.exports = parseEntries;