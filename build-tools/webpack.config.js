const path = require('path');
const fs = require('fs');

require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env'),
});

const constants = require('./constants');
const { author, version, packagesDir, outdir } = constants;

// const copyEntries = [];
module.exports = function (env = {}) {
  env.pkg = env.pkg || [];
  if (typeof env.pkg === 'string') {
    env.pkg = [env.pkg];
  }
  const webpackConfigs = [];
  console.log(`
  #################################

    Building version version ${version}
    by ${author}
    Output dir: ${outdir}
    Display Name: ${constants.DISPLAY_NAME}
    IS_PRODUCTION: ${constants.IS_PRODUCTION}

  #################################
  `);

  fs.readdirSync(packagesDir).forEach(pkg => {
    if (env.pkg.length > 0 && env.pkg.indexOf(pkg) === -1) {
      return console.log(`Skipping @sqltools/${pkg}`);
    }
    const pkgPath = `${packagesDir}/${pkg}`;
    if (!fs.lstatSync(pkgPath).isDirectory()) return;
    if (!fs.existsSync(`${pkgPath}/build.json`)) return;

    console.log(`Reading package @sqltools/${pkg} config`);
    const buildJson = require(`${pkgPath}/build.json`);

    if (buildJson.patch) {
      buildJson.patch.forEach(patch => {
        const transformer = transformers[patch.type];
        transformer(pkgPath, patch);
      });
    }

    if (buildJson.build) {
      console.log(`\t>> Found ${buildJson.build.length} build entries`);
      buildJson.build.forEach(({ entries, type, externals = {} }) => {
        webpackConfigs.push({
          mode: constants.IS_PRODUCTION ? 'production' : 'development',
          ...require(`./webpack/${type}.config.js`)({
            entries,
            packagePath: pkgPath,
            externals,
          }),
        });
      });
    } else {
      console.log(`\t>> no build entries`);
    }
  });

  return webpackConfigs;
};

const transformers = {
  contentReplace: (pkgPath, { entries, regexStr, replacement }) => {
    const regex = new RegExp(regexStr, 'mi');

    Object.entries(entries).forEach(([outfileName, sourceFileName]) => {
      let content = fs.readFileSync(path.resolve(pkgPath, sourceFileName)).toString();
      content = content.replace(regex, replacement);
      fs.writeFileSync(path.resolve(pkgPath, outfileName), content);
    });
  },
};
