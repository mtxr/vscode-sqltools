import { lowerCase } from '@antv/util';
export { Facet } from './facet';
/**
 * 所有的 Facet 类
 */
var Facets = {};
/**
 * 根据 type 获取 facet 类
 * @param type 分面类型
 */
export var getFacet = function (type) {
    return Facets[lowerCase(type)];
};
/**
 * 注册一个 Facet 类
 * @param type 分面类型
 * @param ctor 分面类
 */
export var registerFacet = function (type, ctor) {
    Facets[lowerCase(type)] = ctor;
};
//# sourceMappingURL=index.js.map