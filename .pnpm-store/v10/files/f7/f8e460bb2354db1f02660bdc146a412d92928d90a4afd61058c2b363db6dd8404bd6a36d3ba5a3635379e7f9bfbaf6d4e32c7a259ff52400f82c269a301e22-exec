#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const { ensureArray } = require('ensure-type');
const sort = require('gulp-sort');
const vfs = require('vinyl-fs');
const scanner = require('../lib');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .usage('[options] <file ...>')
  .option('--config <config>', 'Path to the config file (default: i18next-scanner.config.js)', 'i18next-scanner.config.js')
  .option('--output <path>', 'Path to the output directory (default: .)');

program.on('--help', () => {
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ i18next-scanner --config i18next-scanner.config.js --output /path/to/output \'src/**/*.{js,jsx}\'');
  console.log('    $ i18next-scanner --config i18next-scanner.config.js "src/**/*.{js,jsx}"');
  console.log('    $ i18next-scanner "/path/to/src/app.js" "/path/to/assets/index.html"');
  console.log('');
});

program.parse(process.argv);

const options = program.opts();

if (!options.config) {
  program.help();
  process.exit(1);
}

let config = {};
try {
  // eslint-disable-next-line import/no-dynamic-require
  config = require(path.resolve(options.config));
} catch (err) {
  console.error('i18next-scanner:', err);
  process.exit(1);
}

{ // Input
  config.input = (program.args.length > 0) ? program.args : ensureArray(config.input);
  config.input = config.input.map((s) => {
    s = s.trim();

    // On Windows, arguments contain spaces must be enclosed with double quotes, not single quotes.
    if (s.match(/(^'.*'$|^".*"$)/)) {
      // Remove first and last character
      s = s.slice(1, -1);
    }
    return s;
  });

  if (config.input.length === 0) {
    program.help();
    process.exit(1);
  }
}

{ // Output
  config.output = options.output || config.output;

  if (!config.output) {
    config.output = '.';
  }
}

vfs.src(config.input)
  .pipe(sort()) // Sort files in stream by path
  .pipe(scanner(config.options, config.transform, config.flush))
  .pipe(vfs.dest(config.output));
