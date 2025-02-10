// 所有的 Coordinate map
var COORDINATE_MAP = {};
/**
 * 通过类型获得 coordinate 类
 * @param type
 */
export var getCoordinate = function (type) {
    return COORDINATE_MAP[type.toLowerCase()];
};
/**
 * 注册 coordinate 类
 * @param type
 * @param ctor
 */
export var registerCoordinate = function (type, ctor) {
    // 存储到 map 中
    COORDINATE_MAP[type.toLowerCase()] = ctor;
};
export * from './interface';
//# sourceMappingURL=factory.js.map