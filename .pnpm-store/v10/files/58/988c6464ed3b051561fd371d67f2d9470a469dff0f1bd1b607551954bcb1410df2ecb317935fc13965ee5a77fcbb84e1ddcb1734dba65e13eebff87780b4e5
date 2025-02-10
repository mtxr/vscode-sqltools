import { promises, exists, existsSync, statSync, watch as watch$2 } from 'fs';
import { exec as exec$1 } from 'child_process';
import { globFiles as globFiles$1, mkdirp as mkdirp$1, clean as clean$1, copyFiles as copyFiles$1, symlinkDir as symlinkDir$1, unlinkDir as unlinkDir$1, unlinkFile as unlinkFile$1, symlinkFile as symlinkFile$1 } from 'aria-fs';
import { promisify } from 'util';
import { join, resolve, parse, basename, dirname, extname, sep } from 'path';
import { builtinModules } from 'module';
import * as pluginUrl from '@rollup/plugin-url';
export { pluginUrl as url };
import { createSourceFile, ScriptTarget, transform as transform$1, createPrinter, isImportDeclaration, updateImportDeclaration, createStringLiteral, visitEachChild } from 'typescript';
import * as ts from 'typescript';
export { ts };
export { default as minifyHTML } from 'rollup-plugin-minify-html-literals';
export { default as json } from '@rollup/plugin-json';
import MagicString from 'magic-string';
export { default as MagicString } from 'magic-string';
import { rollup as rollup$1, watch as watch$1 } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
export { default as nodeResolve } from '@rollup/plugin-node-resolve';
import { createHash } from 'crypto';
import { EventEmitter } from 'events';

const copyFile = promises.copyFile;
const writeFile = promises.writeFile;
const rename = promises.rename;
const readdir = promises.readdir;
const readFile = promises.readFile;
const stats = promises.stat;
const unlink = promises.unlink;
const symlink = promises.symlink;
const fstat = promises.fstat;
const readlink = promises.readlink;
const mkdir = promises.mkdir;
const lstat = promises.lstat;

const nodeMajorVersion = parseInt(process.versions.node.split(".")[0]);
const exist = promisify(exists);
const exec = promisify(exec$1);
const globFiles = globFiles$1;
const mkdirp = mkdirp$1;
const clean = clean$1;
const copyFiles = copyFiles$1;
const symlinkDir = symlinkDir$1;
const unlinkDir = unlinkDir$1;
const unlinkFile = unlinkFile$1;
const symlinkFile = symlinkFile$1;

const DEFAULT_DEST = "dist";
const DEFAULT_SOURCE = "src";
const DEFAULT_VALUES = Object.freeze({
  DIST_FOLDER: join(baseDir(), DEFAULT_DEST),
  SOURCE_FOLDER: join(baseDir(), DEFAULT_SOURCE),
  ROLLUP_EXTERNALS: ["child_process", "path", "fs", "stream", "util", "crypto", "events", "http", "net", "url", ...builtinModules]
});
function baseDir() {
  var _a;
  return (_a = process.env.APP_ROOT_PATH) != null ? _a : resolve();
}
function getInputEntryFile(input) {
  return parse(basename(input)).name;
}
function getPackageNameSync(filePath) {
  const pkg = require(filePath != null ? filePath : join(baseDir(), "package.json"));
  return pkg.name;
}
function onwarn(options) {
  !options.code.includes("THIS_IS_UNDEFINED") && console.log("Rollup warning: ", options.message);
}

async function getPackage(filePath) {
  const pkg = await import(filePath != null ? filePath : join(baseDir(), "package.json"));
  return pkg.default || pkg;
}
async function getPackageName(filePath) {
  const pkg = await getPackage(filePath);
  return pkg.name;
}

function getInputEntryFile$1(input) {
  return parse(basename(input)).name;
}
function getModule(options) {
  var _a, _b;
  const formats = (_b = (_a = options.format) == null ? void 0 : _a.split(",")) != null ? _b : [];
  return formats.includes("es") && formats.length > 1 ? `${options.name}.es.js` : `${options.name}.js`;
}
async function deleteKeys(pkg) {
  const keys = ["scripts", "devDependencies", "entry", "output", "format", "filePath"];
  await Promise.all(keys.map((key) => delete pkg[key]));
}
async function copyPackageFile(options) {
  var _a, _b, _c;
  const {filePath, entry, typings, format} = options != null ? options : {};
  const pkgTemp = (options == null ? void 0 : options.name) ? options : await getPackage(filePath);
  const name = entry ? getInputEntryFile$1(options.entry) : pkgTemp.name;
  const outfile = join((_a = options == null ? void 0 : options.output) != null ? _a : DEFAULT_DEST, "package.json");
  await deleteKeys(pkgTemp);
  const module = (_b = options == null ? void 0 : options.module) != null ? _b : getModule({
    format,
    name
  });
  const pkg = {
    ...pkgTemp,
    ...{
      main: (_c = options == null ? void 0 : options.main) != null ? _c : `${name}.js`
    },
    ...{
      module
    },
    ...{
      typings: typings != null ? typings : `${name}.d.ts`
    }
  };
  await writeFile(outfile, JSON.stringify(pkg, null, 2));
}

async function copyReadMeFile(options) {
  var _a, _b;
  const fileName = "README.md";
  const src = (_a = options == null ? void 0 : options.filePath) != null ? _a : join(baseDir(), fileName);
  const destPath = join((_b = options == null ? void 0 : options.output) != null ? _b : DEFAULT_DEST, fileName);
  await exist(src) && await copyFile(src, destPath);
}

async function findTargetBuild(target, config) {
  const mod = `aria-${target}`;
  try {
    const aria = await import(mod);
    await aria.build(config);
  } catch (e) {
    return Promise.reject({
      code: e.code,
      message: `${mod} not found. npm install ${mod} or yarn add ${mod}`
    });
  }
}

const DEFAULT_OUT_DIR = "dist";

async function getAriaConfig(config) {
  const ROLLUP_CONFIG_PATH = join(baseDir(), config != null ? config : "aria.config.ts");
  if (existsSync(ROLLUP_CONFIG_PATH)) {
    const ariaConfig = await import(ROLLUP_CONFIG_PATH).then((c) => c.default);
    return ariaConfig;
  }
  return null;
}

function getEntryFile(pkgName) {
  const entryFiles = ["index.ts", "index.js", "main.ts", "main.js", `${pkgName}.ts`, `${pkgName}.js`];
  for (const entry of entryFiles) {
    const file = join("src", entry);
    if (existsSync(file)) {
      return file;
    }
  }
  throw new Error("Entry file is not exist.");
}

function getExternalDeps(options) {
  var _a, _b, _c;
  return [...(_b = (_a = options.external) == null ? void 0 : _a.split(",")) != null ? _b : [], ...(_c = options.dependencies) != null ? _c : []];
}
function entryFile(formats, entry, module) {
  return (Array.isArray(formats) ? formats : [formats]).length === 1 ? `${entry}.js` : `${entry}.${module != null ? module : "es"}.js`;
}
function updateExternalWithResolve(options = {}) {
  const {resolve, external} = options;
  if (typeof resolve == "boolean" && resolve) {
    return [];
  }
  if (typeof resolve == "string") {
    const resolves = resolve.split(",");
    const externals = external.filter((value) => !resolves.includes(value));
    return externals;
  }
  return external != null ? external : [];
}
function parseConfig(options) {
  if (options == null ? void 0 : options.config) {
    return options.config;
  }
  const c = "aria.config.ts";
  if (options == null ? void 0 : options.entry) {
    const filePath = join(dirname(options.entry), c);
    if (existsSync(filePath)) {
      return filePath;
    }
  }
  return c;
}
function getPkgDependencies(pkgJson) {
  const dependencies = pkgJson.dependencies ? Object.keys(pkgJson.dependencies) : [];
  const devDependencies = pkgJson.devDependencies ? Object.keys(pkgJson.devDependencies) : [];
  const peerDependencies = pkgJson.peerDependencies ? Object.keys(pkgJson.peerDependencies) : [];
  return [...dependencies, ...devDependencies, ...peerDependencies];
}
function mergeGlobals(globals, optionGlobals) {
  function createGlobals(globals2) {
    const keys = Object.keys(globals2);
    return keys.map((key) => {
      return `${key}=${globals2[key]}`;
    });
  }
  const localConfigGlobals = globals ? createGlobals(globals) : [];
  const localOptionGlobals = optionGlobals ? optionGlobals.split(",") : [];
  return [...new Set([...localConfigGlobals, ...localOptionGlobals])].join(",");
}
function parsePlugins(plugins) {
  return Array.isArray(plugins) ? [...plugins] : {
    before: [...(plugins == null ? void 0 : plugins.before) || []],
    after: [...(plugins == null ? void 0 : plugins.after) || []]
  };
}

const replacePlugin = require("@rollup/plugin-replace");
const rollup = rollup$1;
const watch = watch$1;
function commonjs(options) {
  const common = require("@rollup/plugin-commonjs");
  return common(options);
}
function terser(options) {
  const {terser: terser2} = require("rollup-plugin-terser");
  return terser2({
    output: {
      comments: false
    },
    ...options != null ? options : {}
  });
}

function getMain(args) {
  const {outDir, name, formats, format} = args;
  return !formats.includes("cjs") ? entryFile(format, join(outDir, name)) : entryFile(formats, join(outDir, name), format);
}
function createOutputFile(args) {
  const {outDir, name, formats, format} = args;
  switch (format) {
    case "cjs":
      return join(outDir, `${name}.js`);
    case "es":
      return getMain({
        outDir,
        name,
        formats
      });
    case "umd":
      return entryFile(formats, join(outDir, name), format);
  }
}
function getGlobals(globals = "") {
  const results = globals.split(",");
  const entries = new Map(results.map((global) => global.split("=")));
  return Object.fromEntries(entries);
}
function buildConfig(options) {
  var _a, _b;
  const {pkgName, entry, dependencies, declaration, compress, globals, name, resolve, format} = options;
  const outDir = options.output.replace("./", "");
  const sourcemap = (_a = options.sourcemap) != null ? _a : false;
  const formats = format.split(",");
  const input = entry != null ? entry : getEntryFile(pkgName);
  const isCompressFormat = (format2) => compress && typeof compress == "string" && compress.split(",").includes(format2);
  const output = formats.map((format2) => {
    const file = entry ? entryFile(format2.includes("cjs") ? format2 : formats, join(outDir, getInputEntryFile(entry)), format2) : createOutputFile({
      outDir,
      format: format2,
      formats,
      name: pkgName
    });
    const plugins2 = [...isCompressFormat(format2) ? [terser()] : []];
    const output2 = {
      sourcemap,
      format: format2,
      plugins: plugins2,
      file,
      ...format2.includes("umd") ? {
        name,
        globals: {
          ...getGlobals(globals)
        }
      } : {}
    };
    return output2;
  });
  const plugins = (_b = options.plugins) != null ? _b : [];
  const external = updateExternalWithResolve({
    resolve,
    external: getExternalDeps({
      external: options.external,
      dependencies
    })
  });
  const configOptions = {
    input,
    external,
    plugins,
    output,
    tsconfig: {
      compilerOptions: {
        declaration: declaration != null ? declaration : false
      }
    },
    compress: compress && typeof compress == "boolean" ? compress : false
  };
  return configOptions;
}

function swcPlugin(options) {
  let swc;
  const jsc = {
    parser: {
      syntax: "typescript",
      decorators: true,
      dynamicImport: true,
      tsx: true
    },
    target: "es2019",
    ...options != null ? options : {}
  };
  return {
    name: "aria-swc",
    buildStart: async () => {
      swc = await import('@swc/core');
    },
    transform(code, id) {
      return swc.transform(code, {
        filename: id,
        sourceMaps: true,
        jsc
      });
    }
  };
}

function transformCode(service, options) {
  return async function(code, id) {
    var _a;
    const result = await service.transform(code, {
      loader: extname(id).slice(1),
      target: "es2018",
      sourcemap: true,
      sourcefile: id,
      ...options != null ? options : {}
    });
    return {
      code: ((_a = result.js) != null ? _a : "").replace(/\/\/# sourceMappingURL.*/, ""),
      map: result.jsSourceMap
    };
  };
}
function esBuildPlugin(options) {
  var _a, _b;
  let service = void 0;
  const transformOptions = (_a = options == null ? void 0 : options.transformOptions) != null ? _a : {};
  const extensions = [...[transformOptions.loader], ...(_b = options == null ? void 0 : options.extensions) != null ? _b : []];
  return {
    name: "esbuild",
    buildStart: async () => {
      if (!service) {
        const esbuild = await import('esbuild');
        service = await esbuild.startService();
      }
    },
    transform(code, id) {
      if (!extensions.includes(extname(id).slice(1)) && id.includes("node_modules"))
        return;
      return transformCode(service, transformOptions)(code, id);
    },
    buildEnd: (error) => error && service.stop(),
    generateBundle: () => service.stop(),
    writeBundle: () => service.stop()
  };
}

function pathResolver(extensions) {
  const _extensions = ["ts", "js", "tsx", "jsx", ...extensions != null ? extensions : []];
  const resolveFile = (resolved, index = false) => {
    for (const extension of _extensions) {
      const file = index ? join(resolved, `index.${extension}`) : `${resolved}.${extension}`;
      if (existsSync(file))
        return file;
    }
  };
  return function resolveId(id, origin) {
    if (!origin)
      return id;
    const resolved = join(dirname(origin), id);
    const file = resolveFile(resolved);
    if (file)
      return file;
    if (existsSync(resolved) && statSync(resolved).isDirectory()) {
      const coreFile = resolveFile(resolved, true);
      if (coreFile)
        return coreFile;
    }
  };
}
function resolvePathPlugin(extenstions) {
  return {
    name: "resolve-path",
    resolveId: pathResolver(extenstions)
  };
}

function buildPlugins({swc, esbuild}) {
  return [...esbuild || swc ? [resolvePathPlugin()] : [], ...esbuild ? [esBuildPlugin({
    transformOptions: {
      jsxFactory: "React.createElement",
      jsxFragment: "React.Fragment"
    }
  })] : [], ...swc ? [swcPlugin()] : []];
}
function flatPlugins(plugins) {
  return [...(plugins == null ? void 0 : plugins.hasOwnProperty("before")) ? plugins.before : [], ...Array.isArray(plugins) ? plugins : [], ...(plugins == null ? void 0 : plugins.hasOwnProperty("after")) ? plugins.after : []];
}
function createConfig(options) {
  var _a;
  const {esbuild, swc} = options;
  const config = options.config;
  const {input, output, commonOpts, compress} = config;
  const mutiplyEntryPlugin = () => Array.isArray(input) ? [require("@rollup/plugin-multi-entry")()] : [];
  const outputs = Array.isArray(output) ? output : [output];
  const plugins = [...mutiplyEntryPlugin(), ...flatPlugins(config.plugins), ...buildPlugins({
    swc,
    esbuild
  }), commonjs(commonOpts), nodeResolve(), ...compress ? [terser()] : []];
  const external = [...(_a = config.external) != null ? _a : [], ...DEFAULT_VALUES.ROLLUP_EXTERNALS];
  const opts = {
    input,
    plugins,
    external,
    output: outputs
  };
  return opts;
}

function createConfigOptions(options) {
  const {esbuild: esbuild2, swc} = options;
  const config = createConfig({
    swc,
    esbuild: esbuild2,
    config: options.config
  });
  const outputs = config.output;
  const plugins = config.plugins;
  return {
    input: config.input,
    external: config.external,
    plugins,
    output: outputs
  };
}
async function esbuild(options) {
  const {config, esbuild: esbuild2, swc, write} = options;
  const opts = Array.isArray(config) ? config : [config];
  return Promise.all(opts.map(async (opt) => {
    const {input, plugins, external, output} = createConfigOptions({
      swc,
      esbuild: esbuild2,
      config: opt
    });
    const bundle = await rollup({
      input,
      plugins,
      external,
      onwarn
    });
    const execute = () => write ? bundle.write : bundle.generate;
    return Promise.all(output.map(execute()));
  }));
}

async function getName(hasConfig, name) {
  return hasConfig ? name != null ? name : await getPackageName() : void 0;
}
async function getDtsLib(hasConfig) {
  return hasConfig ? await import('rollup-plugin-dts') : void 0;
}
async function esbuildDts(options) {
  const {config, write} = options;
  const opts = Array.isArray(config) ? config : [config];
  const configs = opts.filter((opt) => {
    var _a, _b;
    return (_b = (_a = opt.tsconfig) == null ? void 0 : _a.compilerOptions) == null ? void 0 : _b.declaration;
  });
  const hasConfig = configs.length > 0;
  const [name, dts] = await Promise.all([getName(hasConfig, options.name), getDtsLib(hasConfig)]);
  return Promise.all(configs.map(async (opt) => {
    const {input, external, output} = opt;
    const outputs = Array.isArray(output) ? output[0] : output;
    const bundle = await rollup({
      input,
      external: [...external != null ? external : [], ...DEFAULT_VALUES.ROLLUP_EXTERNALS],
      plugins: [dts.default()]
    });
    const file = join(dirname(outputs.file), `${name}.d.ts`);
    return write ? bundle.write({
      file
    }) : bundle.generate({
      file
    });
  }));
}

async function buildConfigOptions(options) {
  const {pkgName, output, format, esbuild: esbuild2, swc, write} = options;
  const pkgJson = await getPackage();
  const opts = {
    name: pkgName,
    config: buildConfig(options),
    esbuild: esbuild2,
    swc,
    pkg: {
      ...pkgJson,
      output,
      format
    },
    write
  };
  return opts;
}
async function createOptions(options) {
  return !options.config || typeof options.config == "string" ? await buildConfigOptions(options) : options;
}
async function bundle(options) {
  var _a, _b, _c;
  const opts = await createOptions(options);
  const args = {
    ...(_a = opts.pkg) != null ? _a : {}
  };
  await mkdir((_c = (_b = opts.pkg) == null ? void 0 : _b.output) != null ? _c : DEFAULT_DEST, {
    recursive: true
  });
  await Promise.all([esbuild(opts), esbuildDts(opts), copyPackageFile({
    ...args
  }), copyReadMeFile({
    ...args
  })]);
}

function bundlerOptions(options = {}) {
  var _a;
  let swc, esbuild2;
  esbuild2 = !options.swc && typeof options.esbuild == "boolean" ? options.esbuild : !options.swc ? true : (_a = options.esbuild) != null ? _a : false;
  swc = !esbuild2;
  return {
    swc,
    esbuild: esbuild2
  };
}
async function handler(options) {
  var _a;
  const {entry, output, config, format, write} = options;
  const {esbuild: esbuild2, swc} = bundlerOptions(options);
  const [ariaConfig, pkgJson] = await Promise.all([getAriaConfig(parseConfig({
    config,
    entry
  })), getPackage(), options.clean && clean(options.clean)]);
  const pkgName = pkgJson.name;
  const dependencies = getPkgDependencies(pkgJson);
  const globals = mergeGlobals((_a = ariaConfig == null ? void 0 : ariaConfig.output) == null ? void 0 : _a.globals, options.globals);
  const plugins = parsePlugins(ariaConfig == null ? void 0 : ariaConfig.plugins);
  const args = {
    pkgName,
    dependencies,
    ...options,
    plugins,
    globals
  };
  const configOptions = buildConfig(args);
  const buildArgs = {
    config: configOptions,
    name: pkgName,
    esbuild: esbuild2,
    swc,
    write
  };
  options.target ? await findTargetBuild(options.target, [configOptions]) : await bundle({
    ...buildArgs,
    pkg: {
      ...pkgJson,
      output,
      format,
      entry
    }
  });
}

const getCliOptions = () => ({
  package: "aria-build",
  command: "build",
  options: [{
    alias: "-i, --entry",
    description: "Entry modules"
  }, {
    alias: "-d, --declaration",
    description: "Generates corresponding .d.ts file",
    defaultValue: false
  }, {
    alias: "-f, --format",
    description: "Build specified formats",
    defaultValue: "es,cjs"
  }, {
    alias: "-o, --output",
    description: "Directory to place build files into",
    defaultValue: "dist"
  }, {
    alias: "-c, --config",
    description: "config file of aria-build. i.e aria.config.ts"
  }, {
    alias: "-w, --watch",
    description: "Rebuilds on any change  (default false)",
    defaultValue: false
  }, {
    alias: "--external",
    description: "Specify external dependencies"
  }, {
    alias: "--name",
    description: "Specify name exposed in UMD builds"
  }, {
    alias: "--globals",
    description: "Specify global dependencies"
  }, {
    alias: "--compress",
    description: "Compress or minify the output"
  }, {
    alias: "--sourcemap",
    description: "Generate sourcemap",
    defaultValue: false
  }, {
    alias: "--resolve",
    description: "Resolve dependencies"
  }, {
    alias: "--target",
    description: "Target framework or library to build (i.e react or vue)"
  }, {
    alias: "--clean",
    description: "Clean the dist folder default (dist)",
    defaultValue: "dist"
  }, {
    alias: "--write",
    description: "Write the output to disk default to true",
    defaultValue: true
  }, {
    alias: "--bundler",
    description: "Bundler to enabled default (esbuild), esbuild | swc | ts",
    defaultValue: "esbuild"
  }, {
    alias: "--esbuild",
    description: "Enabled esbuild plugin to use transform ts,js,jsx,tsx"
  }, {
    alias: "--swc",
    description: "Enabled swc plugin to transform ts,js,jsx,tsx"
  }]
});

async function run(version) {
  const cliOptions = getCliOptions();
  const program = require("sade")(cliOptions.package, true);
  await Promise.all(cliOptions.options.map((option) => {
    var _a;
    program.option(option.alias, option.description, (_a = option.defaultValue) != null ? _a : null);
  }));
  program.version(version).action(handler).parse(process.argv);
}

function replace(string, needle, replacement, options = {}) {
  if (typeof string !== "string") {
    throw new TypeError(`Expected input to be a string, got ${typeof string}`);
  }
  if (!(typeof needle === "string" && needle.length > 0) || !(typeof replacement === "string" || typeof replacement === "function")) {
    return string;
  }
  let result = "";
  let matchCount = 0;
  let prevIndex = options.fromIndex > 0 ? options.fromIndex : 0;
  if (prevIndex > string.length) {
    return string;
  }
  while (true) {
    const index = string.indexOf(needle, prevIndex);
    if (index === -1) {
      break;
    }
    matchCount++;
    const replaceStr = typeof replacement === "string" ? replacement : replacement(needle, matchCount, string, index);
    const beginSlice = matchCount === 1 ? 0 : prevIndex;
    result += string.slice(beginSlice, index) + replaceStr;
    prevIndex = index + needle.length;
  }
  if (matchCount === 0) {
    return string;
  }
  return result + string.slice(prevIndex);
}

function isGlob(file) {
  return /(\*.*)|(\*.[a-z]{2})/g.test(file);
}
async function replaceContent(options) {
  var _a;
  const extensions = [".js", ...(_a = options == null ? void 0 : options.extensions) != null ? _a : []];
  const {filename, strToFind, strToReplace} = options;
  if (extensions.includes(extname(filename))) {
    let content = await readFile(filename, "utf8");
    if (content.includes(strToFind)) {
      content = replace(content, strToFind, strToReplace);
      await writeFile(filename, content);
    }
  }
}
function createOutfile(file, dest, recursive) {
  if (recursive) {
    const paths = [...file.replace(`.${sep}`, "").split(sep)];
    paths.shift();
    return join(dest, paths.join(sep));
  }
  return join(dest, basename(file));
}
async function copyAssets(options) {
  const {targets} = options;
  await Promise.all(targets.map(async (target) => {
    const files = await globFiles(target.src, true);
    await Promise.all(files.map(async (file) => {
      const outfile = createOutfile(file, target.dest, target.recursive);
      await mkdir(dirname(outfile), {
        recursive: true
      });
      await copyFile(file, outfile);
      target.replace && await target.replace(outfile);
    }));
  }));
}

function copy(options) {
  var _a, _b;
  const hook = (_a = options == null ? void 0 : options.hook) != null ? _a : "buildEnd";
  const targets = (_b = options == null ? void 0 : options.targets) != null ? _b : [];
  return {
    name: "copy",
    [hook]: async () => {
      await copyAssets({
        targets
      });
      await ((options == null ? void 0 : options.copyEnd) && options.copyEnd());
    }
  };
}

function linkToPackages(options) {
  var _a;
  const {targets, outDir, moduleDir} = options;
  return {
    name: "link-packages",
    [(_a = options.hook) != null ? _a : "buildEnd"]: async () => {
      const inputDir = outDir != null ? outDir : "./dist";
      await Promise.all(targets.map(async (target) => {
        const dest = resolve(`./packages/${target.package}/node_modules/${moduleDir}`);
        const isDirExist = await exist(dirname(dest));
        if (isDirExist) {
          await symlinkDir(inputDir, dest);
        }
      }));
    }
  };
}

function transformCode$1(code) {
  const magicString = new MagicString(code);
  return {
    code: magicString.toString(),
    map: magicString.generateMap({
      hires: true
    })
  };
}
function createUpdateImportDeclaration(node, specifiers, key) {
  return updateImportDeclaration(node, node.decorators, node.modifiers, node.importClause, key ? createStringLiteral(specifiers[key]) : node.moduleSpecifier);
}
function transformModuleSpecifier(specifiers) {
  return (context) => {
    const visitor = (node) => {
      if (isImportDeclaration(node) && specifiers) {
        const keys = Object.keys(specifiers);
        const text = getText(node.moduleSpecifier).replace(/'|"/g, "");
        const key = keys.find((key2) => key2.includes(text));
        return createUpdateImportDeclaration(node, specifiers, key);
      }
      return visitEachChild(node, (child) => visitor(child), context);
    };
    return visitor;
  };
}
function getText(identifier) {
  return identifier.hasOwnProperty("escapedText") ? identifier.escapedText.toString() : identifier.text;
}
function transform(file, content, specifiers) {
  const magicString = new MagicString(content);
  const sourceFile = createSourceFile(file, magicString.toString(), ScriptTarget.ESNext, false);
  const result = transform$1(sourceFile, [transformModuleSpecifier(specifiers)]);
  const transformed = result.transformed[0];
  return {
    code: createPrinter().printFile(transformed),
    map: magicString.generateMap({
      hires: true
    })
  };
}
function transformImport(specifiers) {
  return {
    name: "transformImport",
    transform(code, id) {
      return !id.includes(join(resolve(), "node_modules")) ? transform(id, code, specifiers) : transformCode$1(code);
    }
  };
}

const contentHash = (str) => createHash("md5").update(str, "utf8").digest("hex");
const getFileStat = (file) => stats(file).then((stat) => stat);
const getContentHash = async (src) => contentHash(await readFile(src, "utf8"));
const WATCH_EVENT = Object.freeze({
  DELETE: "delete",
  CHANGE: "change",
  CREATE: "create",
  RENAME: "rename",
  READY: "ready"
});
const log = (msg) => console.log(msg);
class Watcher extends EventEmitter {
  constructor(options = {}) {
    super();
    this.watchers = new Map();
    this.store = new Map();
    const keys = Object.keys(options);
    keys.forEach((key) => {
      const event = key.toLowerCase().replace("on", "");
      this.on(event, options[key]);
    });
  }
  get watchFiles() {
    return Array.from(this.watchers.keys());
  }
  async watch(src) {
    let fsWait = false;
    const stats2 = await getFileStat(src);
    if (stats2.isDirectory()) {
      this.store.set(src, stats2);
      const files = await readdir(src);
      await Promise.all(files.map(async (file) => {
        await this.watch(join(src, file));
      }));
    }
    if (stats2.isFile()) {
      this.store.set(src, await getContentHash(src));
    }
    const unwatch = (event, filename) => {
      const file = join(src, filename);
      if (event.includes(WATCH_EVENT.RENAME) && this.store.has(file) && !existsSync(file)) {
        this.unwatch(file);
      }
    };
    const isDirectory = async (src2, fsStat) => {
      if (fsStat.isDirectory()) {
        if (!this.store.has(src2)) {
          this.emit(WATCH_EVENT.CREATE, src2, fsStat);
        }
        const files = await readdir(src2);
        await Promise.all(files.map(async (file) => {
          const dirFile = join(src2, file);
          if (!this.store.has(dirFile)) {
            await this.watch(dirFile);
            this.emit(WATCH_EVENT.CREATE, file, await getFileStat(dirFile));
          }
        }));
      }
    };
    const isFile = async (src2, fsStat) => {
      if (fsStat.isFile()) {
        const currentContent = await getContentHash(src2);
        if (this.store.get(src2) !== currentContent) {
          this.store.set(src2, currentContent);
          this.emit(WATCH_EVENT.CHANGE, src2, fsStat);
        }
      }
    };
    const watchCallback = async (event, filename) => {
      unwatch(event, filename);
      if (existsSync(src)) {
        if (fsWait)
          return;
        fsWait = setTimeout(() => fsWait = false, 100);
        const fsStat = await getFileStat(src);
        await isDirectory(src, fsStat);
        await isFile(src, fsStat);
      }
    };
    this.watchers.set(src, watch$2(src, watchCallback));
  }
  async unwatch(src) {
    if (this.watchers.has(src)) {
      const keys = Array.from(this.watchers.keys()).filter((key) => key.includes(src));
      await Promise.all(keys.map((key) => {
        const watcher2 = this.watchers.get(src);
        watcher2.close();
        this.watchers.delete(src);
        this.emit(WATCH_EVENT.DELETE, src);
      }));
    }
  }
}
const watcher = async (src, options = {
  onReady: (files) => log(`> Initial scan complete. Ready for changes. Total files: ${files.length}`)
}) => {
  const watcher2 = new Watcher(options);
  await watcher2.watch(src);
  watcher2.emit("ready", watcher2.watchFiles);
};

export { DEFAULT_DEST, DEFAULT_OUT_DIR, DEFAULT_SOURCE, DEFAULT_VALUES, Watcher, baseDir, buildConfig, bundle, bundlerOptions, clean, commonjs, copy, copyAssets, copyFile, copyFiles, copyPackageFile, copyReadMeFile, createOptions, createOutfile, entryFile, esBuildPlugin, esbuild, esbuildDts, exec, exist, findTargetBuild, fstat, getAriaConfig, getCliOptions, getEntryFile, getExternalDeps, getInputEntryFile, getPackage, getPackageName, getPackageNameSync, getPkgDependencies, globFiles, handler, isGlob, linkToPackages, lstat, mergeGlobals, mkdir, mkdirp, nodeMajorVersion, onwarn, parseConfig, parsePlugins, pathResolver, readFile, readdir, readlink, rename, replaceContent, replacePlugin, resolvePathPlugin, rollup, run, stats, swcPlugin, symlink, symlinkDir, symlinkFile, terser, transform, transformCode, transformImport, unlink, unlinkDir, unlinkFile, updateExternalWithResolve, watch, watcher, writeFile };
