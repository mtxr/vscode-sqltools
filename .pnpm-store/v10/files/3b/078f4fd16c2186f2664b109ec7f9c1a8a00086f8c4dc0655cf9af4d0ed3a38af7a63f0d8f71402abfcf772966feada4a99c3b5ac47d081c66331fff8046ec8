"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFacet = exports.getFacet = exports.Facet = void 0;
var util_1 = require("@antv/util");
var facet_1 = require("./facet");
Object.defineProperty(exports, "Facet", { enumerable: true, get: function () { return facet_1.Facet; } });
/**
 * 所有的 Facet 类
 */
var Facets = {};
/**
 * 根据 type 获取 facet 类
 * @param type 分面类型
 */
var getFacet = function (type) {
    return Facets[(0, util_1.lowerCase)(type)];
};
exports.getFacet = getFacet;
/**
 * 注册一个 Facet 类
 * @param type 分面类型
 * @param ctor 分面类
 */
var registerFacet = function (type, ctor) {
    Facets[(0, util_1.lowerCase)(type)] = ctor;
};
exports.registerFacet = registerFacet;
//# sourceMappingURL=index.js.map