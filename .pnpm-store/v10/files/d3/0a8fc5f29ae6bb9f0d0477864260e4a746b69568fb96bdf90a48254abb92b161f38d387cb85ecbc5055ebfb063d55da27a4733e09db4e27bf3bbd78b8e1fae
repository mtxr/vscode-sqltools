import { normalize, sep, basename, resolve, join, relative, dirname } from 'path';
import { promises, existsSync, mkdirSync } from 'fs';

const minimatch = require("minimatch");
function createOptions(file, relative2) {
  const options = {
    dir: file.replace(/(\*.*)|(\*.[a-z]{2})/g, ""),
    isRecursive: normalize(file).includes(sep + "**"),
    pattern: basename(file),
    relative: relative2
  };
  return options;
}
async function walk(options) {
  const rootDir = resolve(), {dir, isRecursive, pattern} = options;
  const folders = await promises.readdir(dir, {
    withFileTypes: true
  });
  const files = await Promise.all(folders.map((folder) => {
    const res = join(options.dir, folder.name);
    if (folder.isDirectory() && isRecursive) {
      return walk({
        ...options,
        dir: res
      });
    }
    if (folder.isFile() && minimatch(basename(res), pattern)) {
      return options.relative ? `.${sep}${relative(rootDir, res)}` : join(rootDir, res);
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
  const dirPath = resolve(directory).replace(/\/$/, "").split(sep);
  for (let i = 1; i <= dirPath.length; i++) {
    const segment = dirPath.slice(0, i).join(sep);
    if (!existsSync(segment) && segment.length > 0) {
      mkdirSync(segment);
    }
  }
}

async function clean(dir) {
  if (existsSync(dir)) {
    const files = await promises.readdir(dir);
    await Promise.all(files.map(async (file) => {
      const p = join(dir, file);
      const stat = await promises.lstat(p);
      if (stat.isDirectory()) {
        await clean(p);
      } else {
        await promises.unlink(p);
      }
    }));
    await promises.rmdir(dir);
  }
}

async function copyFiles(src, destRootDir) {
  const files = await globFiles(src);
  await Promise.all(files.map(async (file) => {
    const srcRootDir = file.replace(resolve() + sep, "").split(sep)[0];
    const destPath = file.replace(srcRootDir, destRootDir);
    await promises.mkdir(dirname(destPath), {
      recursive: true
    });
    await promises.copyFile(file, destPath);
  }));
}

async function symlink(src, dest, type) {
  const source = resolve(src), destination = resolve(dest);
  await unlink(destination);
  await promises.symlink(source, destination, process.platform.includes("win32") && type.includes("dir") ? "junction" : type);
}
async function unlink(dest) {
  const destination = resolve(dest);
  if (existsSync(destination)) {
    const stat = await promises.lstat(destination);
    if (stat.isDirectory()) {
      await clean(destination);
    }
    if (stat.isFile() || stat.isSymbolicLink()) {
      await promises.unlink(dest);
    }
  }
}
const symlinkDir = (src, dest) => symlink(src, dest, "dir");
const symlinkFile = (src, dest) => symlink(src, dest, "file");
const unlinkFile = (dest) => unlink(dest);
const unlinkDir = (dest) => unlink(dest);

export { clean, copyFiles, globFiles, mkdirp, symlinkDir, symlinkFile, unlinkDir, unlinkFile };
