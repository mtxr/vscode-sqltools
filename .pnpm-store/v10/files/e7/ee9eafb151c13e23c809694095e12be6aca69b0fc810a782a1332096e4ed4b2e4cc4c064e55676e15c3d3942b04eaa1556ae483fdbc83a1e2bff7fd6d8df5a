"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginChunkReadHandler = void 0;
var WebpackChunkModuleIterator_1 = require("./WebpackChunkModuleIterator");
var WebpackInnerModuleIterator_1 = require("./WebpackInnerModuleIterator");
var PluginChunkReadHandler = /** @class */ (function () {
    function PluginChunkReadHandler(logger, fileHandler, licenseTypeIdentifier, licenseTextReader, licensePolicy, fileSystem) {
        this.logger = logger;
        this.fileHandler = fileHandler;
        this.licenseTypeIdentifier = licenseTypeIdentifier;
        this.licenseTextReader = licenseTextReader;
        this.licensePolicy = licensePolicy;
        this.fileSystem = fileSystem;
        this.moduleIterator = new WebpackChunkModuleIterator_1.WebpackChunkModuleIterator();
        this.innerModuleIterator = new WebpackInnerModuleIterator_1.WebpackInnerModuleIterator(require.resolve);
    }
    PluginChunkReadHandler.prototype.processChunk = function (compilation, chunk, moduleCache, stats) {
        var _this = this;
        this.moduleIterator.iterateModules(compilation, chunk, stats, function (chunkModule) {
            _this.innerModuleIterator.iterateModules(chunkModule, function (module) {
                var identifiedModule = _this.extractIdentifiedModule(module) ||
                    _this.fileHandler.getModule(module.resource);
                if (identifiedModule) {
                    _this.processModule(compilation, chunk, moduleCache, identifiedModule);
                }
            });
        });
    };
    PluginChunkReadHandler.prototype.extractIdentifiedModule = function (module) {
        var resolved = module.resourceResolveData;
        if (!resolved)
            return undefined;
        var directory = resolved.descriptionFileRoot, packageJson = resolved.descriptionFileData;
        if (
        // if missing data, fall back to fs module hunting
        directory &&
            packageJson &&
            packageJson.name &&
            // user checks to decide if we should include the module
            this.fileHandler.isInModuleDirectory(directory) &&
            !this.fileHandler.isBuildRoot(directory) &&
            !this.fileHandler.excludedPackageTest(packageJson.name)) {
            return {
                directory: directory,
                packageJson: packageJson,
                name: packageJson.name
            };
        }
        return undefined;
    };
    PluginChunkReadHandler.prototype.getPackageJson = function (directory) {
        var filename = "" + directory + this.fileSystem.pathSeparator + "package.json";
        return JSON.parse(this.fileSystem.readFileAsUtf8(filename));
    };
    PluginChunkReadHandler.prototype.processModule = function (compilation, chunk, moduleCache, module) {
        var _a;
        if (!moduleCache.alreadySeenForChunk(chunk.name, module.name)) {
            var alreadyIncludedModule = moduleCache.getModule(module.name);
            if (alreadyIncludedModule !== null) {
                moduleCache.registerModule(chunk.name, alreadyIncludedModule);
            }
            else {
                // module not yet in cache
                var packageJson = (_a = module.packageJson) !== null && _a !== void 0 ? _a : this.getPackageJson(module.directory);
                var licenseType = this.licenseTypeIdentifier.findLicenseIdentifier(compilation, module.name, packageJson);
                if (this.licensePolicy.isLicenseUnacceptableFor(licenseType)) {
                    this.logger.error(compilation, "unacceptable license found for " + module.name + ": " + licenseType);
                    this.licensePolicy.handleUnacceptableLicense(module.name, licenseType);
                }
                if (this.licensePolicy.isLicenseWrittenFor(licenseType)) {
                    var licenseText = this.licenseTextReader.readLicense(compilation, module, licenseType);
                    moduleCache.registerModule(chunk.name, {
                        licenseText: licenseText,
                        packageJson: packageJson,
                        name: module.name,
                        directory: module.directory,
                        licenseId: licenseType
                    });
                }
            }
            moduleCache.markSeenForChunk(chunk.name, module.name);
        }
    };
    return PluginChunkReadHandler;
}());
exports.PluginChunkReadHandler = PluginChunkReadHandler;
