"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebpackFileSystem = void 0;
var path = __importStar(require("path"));
var WebpackFileSystem = /** @class */ (function () {
    function WebpackFileSystem(fs) {
        this.fs = fs;
        this.pathSeparator = path.sep;
    }
    WebpackFileSystem.prototype.isFileInDirectory = function (filename, directory) {
        var normalizedFile = this.resolvePath(filename);
        var normalizedDirectory = this.resolvePath(directory);
        return (!this.isDirectory(normalizedFile) &&
            normalizedFile.indexOf(normalizedDirectory) === 0);
    };
    WebpackFileSystem.prototype.pathExists = function (filename) {
        try {
            var stat = this.fs.statSync(filename, { throwIfNoEntry: false });
            return !!stat;
        }
        catch (e) {
            return false;
        }
    };
    WebpackFileSystem.prototype.readFileAsUtf8 = function (filename) {
        return this.fs.readFileSync(filename).toString('utf8');
    };
    WebpackFileSystem.prototype.join = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        return path.join.apply(path, __spread(paths));
    };
    WebpackFileSystem.prototype.resolvePath = function (pathInput) {
        return path.resolve(pathInput);
    };
    WebpackFileSystem.prototype.listPaths = function (dir) {
        return this.fs.readdirSync(dir);
    };
    WebpackFileSystem.prototype.isDirectory = function (dir) {
        var isDir = false;
        try {
            isDir = this.fs.statSync(dir, { throwIfNoEntry: false }).isDirectory();
        }
        catch (e) { }
        return isDir;
    };
    return WebpackFileSystem;
}());
exports.WebpackFileSystem = WebpackFileSystem;
