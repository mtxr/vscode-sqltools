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
exports.WebpackCompilerHandler = void 0;
var WebpackCompilerHandler = /** @class */ (function () {
    function WebpackCompilerHandler(chunkIncludeTester, chunkHandler, assetManager, moduleCache, addBanner, perChunkOutput, additionalChunkModules, additionalModules, skipChildCompilers) {
        this.chunkIncludeTester = chunkIncludeTester;
        this.chunkHandler = chunkHandler;
        this.assetManager = assetManager;
        this.moduleCache = moduleCache;
        this.addBanner = addBanner;
        this.perChunkOutput = perChunkOutput;
        this.additionalChunkModules = additionalChunkModules;
        this.additionalModules = additionalModules;
        this.skipChildCompilers = skipChildCompilers;
    }
    WebpackCompilerHandler.prototype.handleCompiler = function (compiler) {
        var _this = this;
        if (typeof compiler.hooks !== 'undefined') {
            var hookType = this.skipChildCompilers
                ? 'thisCompilation'
                : 'compilation';
            compiler.hooks[hookType].tap('LicenseWebpackPlugin', function (compilation) {
                if (typeof compilation.hooks.processAssets !== 'undefined') {
                    // webpack v5
                    compilation.hooks.processAssets.tap({
                        name: 'LicenseWebpackPlugin',
                        stage: WebpackCompilerHandler.PROCESS_ASSETS_STAGE_REPORT
                    }, function () {
                        // the chunk graph does not contain ES modules
                        // use stats instead to find the ES module imports
                        var stats = compilation.getStats().toJson({
                            all: false,
                            chunks: true,
                            chunkModules: true,
                            nestedModules: true,
                            dependentModules: true,
                            cachedModules: true
                        });
                        _this.iterateChunks(compilation, compilation.chunks, stats);
                    });
                }
                else {
                    // webpack v4
                    compilation.hooks.optimizeChunkAssets.tap('LicenseWebpackPlugin', function (chunks) {
                        _this.iterateChunks(compilation, chunks);
                    });
                }
                if (_this.addBanner) {
                    _this.iterateChunksForBanner(compilation);
                }
            });
            if (!this.perChunkOutput) {
                compiler.hooks[hookType].tap('LicenseWebpackPlugin', function (compilation) {
                    if (!compilation.compiler.isChild()) {
                        // Select only root compiler to avoid writing license file multiple times per compilation
                        if (typeof compilation.hooks.processAssets !== 'undefined') {
                            // webpack v5
                            compilation.hooks.processAssets.tap({
                                name: 'LicenseWebpackPlugin',
                                stage: WebpackCompilerHandler.PROCESS_ASSETS_STAGE_REPORT + 1
                            }, function () {
                                _this.assetManager.writeAllLicenses(_this.moduleCache.getAllModules(), compilation);
                            });
                        }
                        else {
                            // webpack v4
                            compilation.hooks.optimizeChunkAssets.tap('LicenseWebpackPlugin', function () {
                                _this.assetManager.writeAllLicenses(_this.moduleCache.getAllModules(), compilation);
                            });
                        }
                    }
                });
            }
        }
        else if (typeof compiler.plugin !== 'undefined') {
            compiler.plugin('compilation', function (compilation) {
                if (typeof compilation.plugin !== 'undefined') {
                    compilation.plugin('optimize-chunk-assets', function (chunks, callback) {
                        _this.iterateChunks(compilation, chunks);
                        callback();
                    });
                }
            });
        }
    };
    WebpackCompilerHandler.prototype.iterateChunksForBanner = function (compilation) {
        var _this = this;
        // for webpack v4 we write banners in iterateChunks.
        // because of plugin hook ordering issues, it is done separately here for webpack v5.
        // it is important to note that renderBanner will not receive any modules in the second
        // argument due to plugin hook ordering issues in webpack v5.
        // For the banner to work in webpack v5 production mode, TerserPlugin must be configured in a specific way.
        // Please check the documentation of License Webpack Plugin for more details.
        if (typeof compilation.hooks.processAssets !== 'undefined') {
            // webpack v5
            compilation.hooks.processAssets.tap({
                name: 'LicenseWebpackPlugin',
                stage: WebpackCompilerHandler.PROCESS_ASSETS_STAGE_ADDITIONS
            }, function () {
                var e_1, _a;
                try {
                    for (var _b = __values(compilation.chunks), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var chunk = _c.value;
                        if (_this.chunkIncludeTester.isIncluded(chunk.name)) {
                            _this.assetManager.writeChunkBanners(_this.moduleCache.getAllModulesForChunk(chunk.name), compilation, chunk);
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
            });
        }
    };
    WebpackCompilerHandler.prototype.iterateChunks = function (compilation, chunks, stats) {
        var e_2, _a;
        var _this = this;
        var _loop_1 = function (chunk) {
            if (this_1.chunkIncludeTester.isIncluded(chunk.name)) {
                this_1.chunkHandler.processChunk(compilation, chunk, this_1.moduleCache, stats);
                if (this_1.additionalChunkModules[chunk.name]) {
                    this_1.additionalChunkModules[chunk.name].forEach(function (module) {
                        return _this.chunkHandler.processModule(compilation, chunk, _this.moduleCache, module);
                    });
                }
                if (this_1.additionalModules.length > 0) {
                    this_1.additionalModules.forEach(function (module) {
                        return _this.chunkHandler.processModule(compilation, chunk, _this.moduleCache, module);
                    });
                }
                if (this_1.perChunkOutput) {
                    this_1.assetManager.writeChunkLicenses(this_1.moduleCache.getAllModulesForChunk(chunk.name), compilation, chunk);
                }
                if (this_1.addBanner &&
                    typeof compilation.hooks.processAssets === 'undefined') {
                    // webpack v4
                    this_1.assetManager.writeChunkBanners(this_1.moduleCache.getAllModulesForChunk(chunk.name), compilation, chunk);
                }
            }
        };
        var this_1 = this;
        try {
            for (var chunks_1 = __values(chunks), chunks_1_1 = chunks_1.next(); !chunks_1_1.done; chunks_1_1 = chunks_1.next()) {
                var chunk = chunks_1_1.value;
                _loop_1(chunk);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (chunks_1_1 && !chunks_1_1.done && (_a = chunks_1.return)) _a.call(chunks_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    // copied from webpack/lib/Compilation.js
    WebpackCompilerHandler.PROCESS_ASSETS_STAGE_ADDITIONS = -100;
    WebpackCompilerHandler.PROCESS_ASSETS_STAGE_REPORT = 5000;
    return WebpackCompilerHandler;
}());
exports.WebpackCompilerHandler = WebpackCompilerHandler;
