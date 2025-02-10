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
exports.WebpackChunkModuleIterator = void 0;
var WebpackStatsIterator_1 = require("./WebpackStatsIterator");
var WebpackChunkModuleIterator = /** @class */ (function () {
    function WebpackChunkModuleIterator() {
        this.statsIterator = new WebpackStatsIterator_1.WebpackStatsIterator();
    }
    WebpackChunkModuleIterator.prototype.iterateModules = function (compilation, chunk, stats, callback) {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
        if (typeof compilation.chunkGraph !== 'undefined' &&
            typeof stats !== 'undefined') {
            try {
                // webpack v5
                for (var _e = __values(compilation.chunkGraph.getChunkModulesIterable(chunk)), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var module_1 = _f.value;
                    callback(module_1);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var statsModules = this.statsIterator.collectModules(stats, chunk.name);
            try {
                for (var statsModules_1 = __values(statsModules), statsModules_1_1 = statsModules_1.next(); !statsModules_1_1.done; statsModules_1_1 = statsModules_1.next()) {
                    var module_2 = statsModules_1_1.value;
                    callback(module_2);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (statsModules_1_1 && !statsModules_1_1.done && (_b = statsModules_1.return)) _b.call(statsModules_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        else if (typeof chunk.modulesIterable !== 'undefined') {
            try {
                for (var _g = __values(chunk.modulesIterable), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var module_3 = _h.value;
                    callback(module_3);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_c = _g.return)) _c.call(_g);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        else if (typeof chunk.forEachModule === 'function') {
            chunk.forEachModule(callback);
        }
        else if (Array.isArray(chunk.modules)) {
            chunk.modules.forEach(callback);
        }
        if (typeof compilation.chunkGraph !== 'undefined') {
            try {
                for (var _j = __values(compilation.chunkGraph.getChunkEntryModulesIterable(chunk)), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var module_4 = _k.value;
                    callback(module_4);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_d = _j.return)) _d.call(_j);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        else if (chunk.entryModule) {
            callback(chunk.entryModule);
        }
    };
    return WebpackChunkModuleIterator;
}());
exports.WebpackChunkModuleIterator = WebpackChunkModuleIterator;
