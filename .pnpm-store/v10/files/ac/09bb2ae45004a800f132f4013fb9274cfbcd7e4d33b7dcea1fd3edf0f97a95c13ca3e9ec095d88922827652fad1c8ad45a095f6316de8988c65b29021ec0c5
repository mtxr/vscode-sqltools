"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginFileHandler = void 0;
var PluginFileHandler = /** @class */ (function () {
    function PluginFileHandler(fileSystem, buildRoot, modulesDirectories, excludedPackageTest) {
        this.fileSystem = fileSystem;
        this.buildRoot = buildRoot;
        this.modulesDirectories = modulesDirectories;
        this.excludedPackageTest = excludedPackageTest;
        this.cache = {};
    }
    PluginFileHandler.prototype.getModule = function (filename) {
        return this.cache[filename] === undefined
            ? (this.cache[filename] = this.getModuleInternal(filename))
            : this.cache[filename];
    };
    PluginFileHandler.prototype.isInModuleDirectory = function (filename) {
        var e_1, _a;
        if (this.modulesDirectories === null)
            return true;
        if (filename === null || filename === undefined)
            return false;
        var foundInModuleDirectory = false;
        var resolvedPath = this.fileSystem.resolvePath(filename);
        try {
            for (var _b = __values(this.modulesDirectories), _c = _b.next(); !_c.done; _c = _b.next()) {
                var modulesDirectory = _c.value;
                if (resolvedPath.startsWith(this.fileSystem.resolvePath(modulesDirectory))) {
                    foundInModuleDirectory = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return foundInModuleDirectory;
    };
    PluginFileHandler.prototype.isBuildRoot = function (filename) {
        return this.buildRoot === filename;
    };
    PluginFileHandler.prototype.getModuleInternal = function (filename) {
        if (filename === null || filename === undefined)
            return null;
        if (!this.isInModuleDirectory(filename))
            return null;
        var module = this.findModuleDir(filename);
        if (module !== null && this.excludedPackageTest(module.name)) {
            return null;
        }
        return module;
    };
    PluginFileHandler.prototype.findModuleDir = function (filename) {
        var pathSeparator = this.fileSystem.pathSeparator;
        var dirOfModule = filename.substring(0, filename.lastIndexOf(pathSeparator));
        var oldDirOfModule = null;
        while (!this.dirContainsValidPackageJson(dirOfModule)) {
            // check parent directory
            oldDirOfModule = dirOfModule;
            dirOfModule = this.fileSystem.resolvePath("" + dirOfModule + pathSeparator + ".." + pathSeparator);
            // reached filesystem root
            if (oldDirOfModule === dirOfModule) {
                return null;
            }
        }
        if (this.isBuildRoot(dirOfModule)) {
            return null;
        }
        var packageJson = this.parsePackageJson(dirOfModule);
        return {
            packageJson: packageJson,
            name: packageJson.name,
            directory: dirOfModule
        };
    };
    PluginFileHandler.prototype.parsePackageJson = function (dirOfModule) {
        var packageJsonText = this.fileSystem.readFileAsUtf8(this.fileSystem.join(dirOfModule, PluginFileHandler.PACKAGE_JSON));
        var packageJson = JSON.parse(packageJsonText);
        return packageJson;
    };
    PluginFileHandler.prototype.dirContainsValidPackageJson = function (dirOfModule) {
        if (!this.fileSystem.pathExists(this.fileSystem.join(dirOfModule, PluginFileHandler.PACKAGE_JSON))) {
            return false;
        }
        var packageJson = this.parsePackageJson(dirOfModule);
        return !!packageJson.name;
    };
    PluginFileHandler.PACKAGE_JSON = 'package.json';
    return PluginFileHandler;
}());
exports.PluginFileHandler = PluginFileHandler;
