"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebpackInnerModuleIterator = void 0;
var WebpackInnerModuleIterator = /** @class */ (function () {
    function WebpackInnerModuleIterator(requireResolve) {
        this.requireResolve = requireResolve;
    }
    WebpackInnerModuleIterator.prototype.iterateModules = function (chunkModule, callback) {
        var internalCallback = this.internalCallback.bind(this, callback);
        internalCallback(chunkModule.resource ? chunkModule : chunkModule.rootModule);
        if (Array.isArray(chunkModule.fileDependencies)) {
            var fileDependencies = chunkModule.fileDependencies;
            fileDependencies.forEach(function (fileDependency) {
                return internalCallback({ resource: fileDependency });
            });
        }
        if (Array.isArray(chunkModule.dependencies)) {
            chunkModule.dependencies.forEach(function (module) {
                return internalCallback(module.originModule);
            });
        }
    };
    WebpackInnerModuleIterator.prototype.internalCallback = function (callback, module) {
        if (!module)
            return;
        var actualFileName = this.getActualFilename(module.resource);
        if (actualFileName) {
            callback(__assign(__assign({}, module), { resource: actualFileName }));
        }
    };
    WebpackInnerModuleIterator.prototype.getActualFilename = function (filename) {
        if (!filename ||
            filename.indexOf('delegated ') === 0 ||
            filename.indexOf('external ') === 0 ||
            filename.indexOf('container entry ') === 0 ||
            filename.indexOf('ignored|') === 0 ||
            filename.indexOf('remote ') === 0 ||
            filename.indexOf('data:') === 0) {
            return null;
        }
        if (filename.indexOf('webpack/runtime') === 0) {
            return this.requireResolve('webpack');
        }
        if (filename.indexOf('!') > -1) {
            // file was procesed by loader, last item after ! is the actual file
            var tokens = filename.split('!');
            return tokens[tokens.length - 1];
        }
        if (filename.indexOf('provide module') === 0) {
            return filename.split('=')[1].trim();
        }
        if (filename.indexOf('consume-shared-module') === 0) {
            var tokens = filename.split('|');
            // 3rd to last item is the filename, see identifier() function in node_modules/webpack/lib/sharing/ConsumeSharedModule.js
            var actualFilename = tokens[tokens.length - 3];
            if (actualFilename === 'undefined') {
                return null;
            }
            return actualFilename;
        }
        return filename;
    };
    return WebpackInnerModuleIterator;
}());
exports.WebpackInnerModuleIterator = WebpackInnerModuleIterator;
