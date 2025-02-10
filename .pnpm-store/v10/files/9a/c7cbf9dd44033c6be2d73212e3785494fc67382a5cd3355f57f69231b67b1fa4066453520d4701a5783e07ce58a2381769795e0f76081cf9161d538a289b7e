var __defineProperty = Object.defineProperty;
var __hasOwnProperty = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => {
  return __defineProperty(target, "__esModule", {value: true});
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defineProperty(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2) => {
  __markAsModule(target);
  if (typeof module2 === "object" || typeof module2 === "function") {
    for (let key in module2)
      if (__hasOwnProperty.call(module2, key) && !__hasOwnProperty.call(target, key) && key !== "default")
        __defineProperty(target, key, {get: () => module2[key], enumerable: true});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defineProperty({}, "default", {value: module2, enumerable: true}), module2);
};

// lib/api-common.ts
function validateTarget(target) {
  target += "";
  if (target.indexOf(",") >= 0)
    throw new Error(`Invalid target: ${target}`);
  return target;
}
function pushCommonFlags(flags, options, isTTY2, logLevelDefault) {
  if (options.target) {
    if (options.target instanceof Array)
      flags.push(`--target=${Array.from(options.target).map(validateTarget).join(",")}`);
    else
      flags.push(`--target=${validateTarget(options.target)}`);
  }
  if (options.strict === true)
    flags.push(`--strict`);
  else if (options.strict)
    for (let key of options.strict)
      flags.push(`--strict:${key}`);
  if (options.minify)
    flags.push("--minify");
  if (options.minifySyntax)
    flags.push("--minify-syntax");
  if (options.minifyWhitespace)
    flags.push("--minify-whitespace");
  if (options.minifyIdentifiers)
    flags.push("--minify-identifiers");
  if (options.jsxFactory)
    flags.push(`--jsx-factory=${options.jsxFactory}`);
  if (options.jsxFragment)
    flags.push(`--jsx-fragment=${options.jsxFragment}`);
  if (options.define)
    for (let key in options.define)
      flags.push(`--define:${key}=${options.define[key]}`);
  if (options.pure)
    for (let fn of options.pure)
      flags.push(`--pure:${fn}`);
  if (options.color)
    flags.push(`--color=${options.color}`);
  else if (isTTY2)
    flags.push(`--color=true`);
  flags.push(`--log-level=${options.logLevel || logLevelDefault}`);
  flags.push(`--error-limit=${options.errorLimit || 0}`);
}
function flagsForBuildOptions(options, isTTY2) {
  let flags = [];
  pushCommonFlags(flags, options, isTTY2, "info");
  if (options.sourcemap)
    flags.push(`--sourcemap${options.sourcemap === true ? "" : `=${options.sourcemap}`}`);
  if (options.globalName)
    flags.push(`--global-name=${options.globalName}`);
  if (options.bundle)
    flags.push("--bundle");
  if (options.splitting)
    flags.push("--splitting");
  if (options.metafile)
    flags.push(`--metafile=${options.metafile}`);
  if (options.outfile)
    flags.push(`--outfile=${options.outfile}`);
  if (options.outdir)
    flags.push(`--outdir=${options.outdir}`);
  if (options.platform)
    flags.push(`--platform=${options.platform}`);
  if (options.format)
    flags.push(`--format=${options.format}`);
  if (options.resolveExtensions)
    flags.push(`--resolve-extensions=${options.resolveExtensions.join(",")}`);
  if (options.external)
    for (let name of options.external)
      flags.push(`--external:${name}`);
  if (options.loader)
    for (let ext in options.loader)
      flags.push(`--loader:${ext}=${options.loader[ext]}`);
  if (options.write === false)
    flags.push(`--write=false`);
  for (let entryPoint of options.entryPoints) {
    if (entryPoint.startsWith("-"))
      throw new Error(`Invalid entry point: ${entryPoint}`);
    flags.push(entryPoint);
  }
  return flags;
}
function flagsForTransformOptions(options, isTTY2) {
  let flags = [];
  pushCommonFlags(flags, options, isTTY2, "silent");
  if (options.sourcemap)
    flags.push(`--sourcemap=${options.sourcemap === true ? "external" : options.sourcemap}`);
  if (options.sourcefile)
    flags.push(`--sourcefile=${options.sourcefile}`);
  if (options.loader)
    flags.push(`--loader=${options.loader}`);
  return flags;
}
function textCodec() {
  if (typeof TextEncoder !== "undefined" && typeof TextDecoder !== "undefined") {
    let encoder = new TextEncoder();
    let decoder = new TextDecoder();
    return {
      encode: (text) => encoder.encode(text),
      decode: (bytes) => decoder.decode(bytes)
    };
  }
  if (typeof Buffer !== "undefined") {
    return {
      encode: (text) => Buffer.from(text),
      decode: (bytes) => Buffer.from(bytes).toString()
    };
  }
  throw new Error("No UTF-8 codec found");
}
function createChannel(options) {
  let requests = new Map();
  let codec = textCodec();
  let isClosed = false;
  let nextID = 0;
  let stdout = new Uint8Array(4096);
  let stdoutUsed = 0;
  let readFromStdout = (chunk) => {
    let limit = stdoutUsed + chunk.length;
    if (limit > stdout.length) {
      let swap = new Uint8Array(limit * 2);
      swap.set(stdout);
      stdout = swap;
    }
    stdout.set(chunk, stdoutUsed);
    stdoutUsed += chunk.length;
    let offset = 0;
    while (offset + 4 <= stdoutUsed) {
      let length = readUInt32LE(stdout, offset);
      if (offset + 4 + length > stdoutUsed) {
        break;
      }
      offset += 4;
      handleResponse(stdout.slice(offset, offset + length));
      offset += length;
    }
    if (offset > 0) {
      stdout.set(stdout.slice(offset));
      stdoutUsed -= offset;
    }
  };
  let afterClose = () => {
    isClosed = true;
    for (let callback of requests.values()) {
      callback("The service was stopped", {});
    }
    requests.clear();
  };
  let sendRequest = (request, callback) => {
    if (isClosed)
      return callback("The service is no longer running", {});
    let id = (nextID++).toString();
    requests.set(id, callback);
    let argBuffers = [codec.encode(id)];
    let length = 4 + 4 + 4 + argBuffers[0].length;
    for (let arg of request) {
      let argBuffer = codec.encode(arg);
      argBuffers.push(argBuffer);
      length += 4 + argBuffer.length;
    }
    let bytes = new Uint8Array(length);
    let offset = 0;
    let writeUint32 = (value) => {
      writeUInt32LE(bytes, value, offset);
      offset += 4;
    };
    writeUint32(length - 4);
    writeUint32(argBuffers.length);
    for (let argBuffer of argBuffers) {
      writeUint32(argBuffer.length);
      bytes.set(argBuffer, offset);
      offset += argBuffer.length;
    }
    options.writeToStdin(bytes);
  };
  let handleResponse = (bytes) => {
    let offset = 0;
    let eat = (n) => {
      offset += n;
      if (offset > bytes.length)
        throw new Error("Invalid message");
      return offset - n;
    };
    let count = readUInt32LE(bytes, eat(4));
    let response = {};
    let id;
    for (let i = 0; i < count; i++) {
      let keyLength = readUInt32LE(bytes, eat(4));
      let key = codec.decode(bytes.slice(offset, eat(keyLength) + keyLength));
      let valueLength = readUInt32LE(bytes, eat(4));
      let value = bytes.slice(offset, eat(valueLength) + valueLength);
      if (key === "id")
        id = codec.decode(value);
      else
        response[key] = value;
    }
    if (!id)
      throw new Error("Invalid message");
    let callback = requests.get(id);
    requests.delete(id);
    if (response.error)
      callback(codec.decode(response.error), {});
    else
      callback(null, response);
  };
  return {
    readFromStdout,
    afterClose,
    service: {
      build(options2, isTTY2, callback) {
        let flags = flagsForBuildOptions(options2, isTTY2);
        sendRequest(["build"].concat(flags), (error, response) => {
          if (error)
            return callback(new Error(error), null);
          let errors = jsonToMessages(codec.decode(response.errors));
          let warnings = jsonToMessages(codec.decode(response.warnings));
          if (errors.length > 0)
            return callback(failureErrorWithLog("Build failed", errors, warnings), null);
          let result = {warnings};
          if (options2.write === false)
            result.outputFiles = decodeOutputFiles(codec, response.outputFiles);
          callback(null, result);
        });
      },
      transform(input, options2, isTTY2, callback) {
        let flags = flagsForTransformOptions(options2, isTTY2);
        sendRequest(["transform", input].concat(flags), (error, response) => {
          if (error)
            return callback(new Error(error), null);
          let errors = jsonToMessages(codec.decode(response.errors));
          let warnings = jsonToMessages(codec.decode(response.warnings));
          if (errors.length > 0)
            return callback(failureErrorWithLog("Transform failed", errors, warnings), null);
          callback(null, {warnings, js: codec.decode(response.js), jsSourceMap: codec.decode(response.jsSourceMap)});
        });
      }
    }
  };
}
function readUInt32LE(buffer, offset) {
  return buffer[offset++] | buffer[offset++] << 8 | buffer[offset++] << 16 | buffer[offset++] << 24;
}
function writeUInt32LE(buffer, value, offset) {
  buffer[offset++] = value;
  buffer[offset++] = value >> 8;
  buffer[offset++] = value >> 16;
  buffer[offset++] = value >> 24;
}
function jsonToMessages(json) {
  let parts = JSON.parse(json);
  let messages = [];
  for (let i = 0; i < parts.length; i += 6) {
    messages.push({
      text: parts[i],
      location: parts[i + 1] < 0 ? null : {
        length: parts[i + 1],
        file: parts[i + 2],
        line: parts[i + 3],
        column: parts[i + 4],
        lineText: parts[i + 5]
      }
    });
  }
  return messages;
}
function failureErrorWithLog(text, errors, warnings) {
  let limit = 5;
  let summary = errors.length < 1 ? "" : ` with ${errors.length} error${errors.length < 2 ? "" : "s"}:` + errors.slice(0, limit + 1).map((e, i) => {
    if (i === limit)
      return "\n...";
    if (!e.location)
      return `
error: ${e.text}`;
    let {file, line, column} = e.location;
    return `
${file}:${line}:${column}: error: ${e.text}`;
  }).join("");
  let error = new Error(`${text}${summary}`);
  error.errors = errors;
  error.warnings = warnings;
  return error;
}
function decodeOutputFiles(codec, bytes) {
  let outputFiles = [];
  let offset = 0;
  let count = readUInt32LE(bytes, offset);
  offset += 4;
  for (let i = 0; i < count; i++) {
    let pathLength = readUInt32LE(bytes, offset);
    let path2 = codec.decode(bytes.slice(offset + 4, offset + 4 + pathLength));
    offset += 4 + pathLength;
    let contentsLength = readUInt32LE(bytes, offset);
    let contents = new Uint8Array(bytes.slice(offset + 4, offset + 4 + contentsLength));
    offset += 4 + contentsLength;
    outputFiles.push({path: path2, contents});
  }
  return outputFiles;
}

// lib/api-node.ts
__export(exports, {
  build: () => build,
  buildSync: () => buildSync,
  startService: () => startService,
  transform: () => transform,
  transformSync: () => transformSync
});
const child_process = __toModule(require("child_process"));
const path = __toModule(require("path"));
const tty = __toModule(require("tty"));
let esbuildCommandAndArgs = () => {
  if (false) {
    return ["node", [path.join(__dirname, "..", "bin", "esbuild")]];
  }
  if (process.platform === "win32") {
    return [path.join(__dirname, "..", "esbuild.exe"), []];
  }
  return [path.join(__dirname, "..", "bin", "esbuild"), []];
};
let isTTY = () => tty.isatty(2);
let build = (options) => {
  return startService().then((service) => {
    let promise = service.build(options);
    promise.then(service.stop, service.stop);
    return promise;
  });
};
let transform = (input, options) => {
  return startService().then((service) => {
    let promise = service.transform(input, options);
    promise.then(service.stop, service.stop);
    return promise;
  });
};
let buildSync = (options) => {
  let result;
  runServiceSync((service) => service.build(options, isTTY(), (err, res) => {
    if (err)
      throw err;
    result = res;
  }));
  return result;
};
let transformSync = (input, options) => {
  let result;
  runServiceSync((service) => service.transform(input, options, isTTY(), (err, res) => {
    if (err)
      throw err;
    result = res;
  }));
  return result;
};
let startService = () => {
  let [command, args] = esbuildCommandAndArgs();
  let child = child_process.spawn(command, args.concat("--service"), {
    cwd: process.cwd(),
    windowsHide: true,
    stdio: ["pipe", "pipe", "inherit"]
  });
  let {readFromStdout, afterClose, service} = createChannel({
    writeToStdin(bytes) {
      child.stdin.write(bytes);
    }
  });
  child.stdout.on("data", readFromStdout);
  child.stdout.on("end", afterClose);
  return Promise.resolve({
    build: (options) => new Promise((resolve, reject) => service.build(options, isTTY(), (err, res) => err ? reject(err) : resolve(res))),
    transform: (input, options) => new Promise((resolve, reject) => service.transform(input, options, isTTY(), (err, res) => err ? reject(err) : resolve(res))),
    stop() {
      child.kill();
    }
  });
};
let runServiceSync = (callback) => {
  let [command, args] = esbuildCommandAndArgs();
  let stdin = new Uint8Array();
  let {readFromStdout, afterClose, service} = createChannel({
    writeToStdin(bytes) {
      if (stdin.length !== 0)
        throw new Error("Must run at most one command");
      stdin = bytes;
    }
  });
  callback(service);
  let stdout = child_process.execFileSync(command, args.concat("--service"), {
    cwd: process.cwd(),
    windowsHide: true,
    input: stdin,
    maxBuffer: +process.env.ESBUILD_MAX_BUFFER || 16 * 1024 * 1024
  });
  readFromStdout(stdout);
  afterClose();
};
