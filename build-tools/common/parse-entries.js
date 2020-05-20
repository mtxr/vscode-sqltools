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
  let babelOptions = undefined;
  try {
    babelOptions = require(path.join(packagePath, '.babelrc'));
  } catch (error) { }

  return {
    outDir: outDir ? path.resolve(packagePath, outDir) : undefined,
    entry,
    babelOptions
  }
}

module.exports = parseEntries;