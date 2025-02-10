import { isArray } from '@antv/util';
/**
 * @ignore
 * 拆分点数据
 * @example
 * // result: [{x: 20, y: 20}, {x: 20, y: 30}]
 * splitPoints({x: 20,y: [20, 30]});
 * @example
 * // result: [{x: 20, y: 20}, {x: 30, y: 30}]
 * splitPoints({x: [20, 30],y: [20, 30]});
 * @param obj
 */
export function splitPoints(obj) {
    // y 有可能是数组，对应原始数据中 y 为一个区间数据，如 [19, 30]，为了统一也将 x 转换为数组
    var x = obj.x;
    var y = isArray(obj.y) ? obj.y : [obj.y];
    return y.map(function (eachY, index) {
        return {
            x: isArray(x) ? x[index] : x,
            y: eachY,
        };
    });
}
//# sourceMappingURL=split-points.js.map