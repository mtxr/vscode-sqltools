'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var fs = require('fs');

const minimatch = require("minimatch");
function createOptions(file, relative2) {
  const options = {
    dir: file.replace(/(\*.*)|(\*.[a-z]{2})/g, ""),
    isRecursive: path.normalize(file).includes(path.sep + "**"),
    pattern: path.basename(file),
    relative: relative2
  };
  return options;
}
async function walk(options) {
  const rootDir = path.resolve(), {dir, isRecursive, pattern} = options;
  const folders = await fs.promises.readdir(dir, {
    withFileTypes: true
  });
  const files = await Promise.all(folders.map((folder) => {
    const res = path.join(options.dir, folder.name);
    if (folder.isDirectory() && isRecursive) {
      return walk({
        ...options,
        dir: res
      });
    }
    if (folder.isFile() && minimatch(path.basename(res), pattern)) {
      return options.relative ? `.${path.sep}${path.relative(rootDir, res)}` : path.join(rootDir, res);
    }
  }));
  return Array.prototype.concat(...files.filter((files2) => files2));
}
async function globFiles(src, relative2 = false) {
  const files = Array.isArray(src) ? src : [src];
  const result = await Promise.all(files.map((file) => {
    const options = createOptions(file, relative2);
    return walk(options);
  }));
  return result.flat().filter((value) => value);
}

function mkdirp(directory) {
  const dirPath = path.resolve(directory).replace(/\/$/, "").split(path.sep);
  for (let i = 1; i <= dirPath.length; i++) {
    const segment = dirPath.slice(0, i).join(path.sep);
    if (!fs.existsSync(segment) && segment.length > 0) {
      fs.mkdirSync(segment);
    }
  }
}

async function clean(dir) {
  if (fs.existsSync(dir)) {
    const files = await fs.promises.readdir(dir);
    await Promise.all(files.map(async (file) => {
      const p = path.join(dir, file);
      const stat = await fs.promises.lstat(p);
      if (stat.isDirectory()) {
        await clean(p);
      } else {
        await fs.promises.unlink(p);
      }
    }));
    await fs.promises.rmdir(dir);
  }
}

async function copyFiles(src, destRootDir) {
  const files = await globFiles(src);
  await Promise.all(files.map(async (file) => {
    const srcRootDir = file.replace(path.resolve() + path.sep, "").split(path.sep)[0];
    const destPath = file.replace(srcRootDir, destRootDir);
    await fs.promises.mkdir(path.dirname(destPath), {
      recursive: true
    });
    await fs.promises.copyFile(file, destPath);
  }));
}

async function symlink(src, dest, type) {
  const source = path.resolve(src), destination = path.resolve(dest);
  await unlink(destination);
  await fs.promises.symlink(source, destination, process.platform.includes("win32") && type.includes("dir") ? "junction" : type);
}
async function unlink(dest) {
  const destination = path.resolve(dest);
  if (fs.existsSync(destination)) {
    const stat = await fs.promises.lstat(destination);
    if (stat.isDirectory()) {
      await clean(destination);
    }
    if (stat.isFile() || stat.isSymbolicLink()) {
      await fs.promises.unlink(dest);
    }
  }
}
const symlinkDir = (src, dest) => symlink(src, dest, "dir");
const symlinkFile = (src, dest) => symlink(src, dest, "file");
const unlinkFile = (dest) => unlink(dest);
const unlinkDir = (dest) => unlink(dest);

exports.clean = clean;
exports.copyFiles = copyFiles;
exports.globFiles = globFiles;
exports.mkdirp = mkdirp;
exports.symlinkDir = symlinkDir;
exports.symlinkFile = symlinkFile;
exports.unlinkDir = unlinkDir;
exports.unlinkFile = unlinkFile;
