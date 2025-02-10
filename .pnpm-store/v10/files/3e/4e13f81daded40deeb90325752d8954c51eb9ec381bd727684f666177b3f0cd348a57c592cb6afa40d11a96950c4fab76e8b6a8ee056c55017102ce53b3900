import { promise } from 'matched';

/* eslint-disable consistent-return, no-param-reassign */
const entry = '\0rollup:plugin-multi-entry:entry-point';
function multiEntry(conf) {
  let include = [];
  let exclude = [];

  let exporter = path => `export * from ${JSON.stringify(path)};`;

  function configure(config) {
    if (typeof config === 'string') {
      include = [config];
    } else if (Array.isArray(config)) {
      include = config;
    } else {
      include = config.include || [];
      exclude = config.exclude || [];

      if (config.exports === false) {
        exporter = path => `import ${JSON.stringify(path)};`;
      }
    }
  }

  if (conf) {
    configure(conf);
  }

  return {
    options(options) {
      if (options.input && options.input !== entry) {
        configure(options.input);
      }

      options.input = entry;
    },

    resolveId(id) {
      if (id === entry) {
        return entry;
      }
    },

    load(id) {
      if (id === entry) {
        if (!include.length) {
          return Promise.resolve('');
        }

        const patterns = include.concat(exclude.map(pattern => `!${pattern}`));
        return promise(patterns, {
          realpath: true
        }).then(paths => paths.map(exporter).join('\n'));
      }
    }

  };
}

export default multiEntry;
