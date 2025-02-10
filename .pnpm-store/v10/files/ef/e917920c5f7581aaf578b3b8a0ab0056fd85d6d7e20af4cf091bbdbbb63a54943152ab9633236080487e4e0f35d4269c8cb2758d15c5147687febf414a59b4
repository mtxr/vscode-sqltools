import Attribute from './attributes/base';
// 所有的 attribute map
var ATTRIBUTE_MAP = {};
/**
 * 通过类型获得 Attribute 类
 * @param type
 */
var getAttribute = function (type) {
    return ATTRIBUTE_MAP[type.toLowerCase()];
};
var registerAttribute = function (type, ctor) {
    // 注册的时候，需要校验 type 重名，不区分大小写
    if (getAttribute(type)) {
        throw new Error("Attribute type '".concat(type, "' existed."));
    }
    // 存储到 map 中
    ATTRIBUTE_MAP[type.toLowerCase()] = ctor;
};
export { getAttribute, registerAttribute, Attribute };
export * from './interface';
//# sourceMappingURL=factory.js.map