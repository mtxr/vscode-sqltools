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
exports.WebpackStatsIterator = void 0;
var WebpackStatsIterator = /** @class */ (function () {
    function WebpackStatsIterator() {
    }
    WebpackStatsIterator.prototype.collectModules = function (stats, chunkName) {
        var e_1, _a;
        var chunkModules = [];
        try {
            for (var _b = __values(stats.chunks), _c = _b.next(); !_c.done; _c = _b.next()) {
                var chunk = _c.value;
                if (chunk.names[0] === chunkName) {
                    this.traverseModules(chunk.modules, chunkModules);
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
        return chunkModules;
    };
    WebpackStatsIterator.prototype.traverseModules = function (modules, chunkModules) {
        var e_2, _a;
        if (!modules) {
            return;
        }
        try {
            for (var modules_1 = __values(modules), modules_1_1 = modules_1.next(); !modules_1_1.done; modules_1_1 = modules_1.next()) {
                var webpackModule = modules_1_1.value;
                chunkModules.push({ resource: webpackModule.identifier });
                this.traverseModules(webpackModule.modules, chunkModules);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (modules_1_1 && !modules_1_1.done && (_a = modules_1.return)) _a.call(modules_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    return WebpackStatsIterator;
}());
exports.WebpackStatsIterator = WebpackStatsIterator;
