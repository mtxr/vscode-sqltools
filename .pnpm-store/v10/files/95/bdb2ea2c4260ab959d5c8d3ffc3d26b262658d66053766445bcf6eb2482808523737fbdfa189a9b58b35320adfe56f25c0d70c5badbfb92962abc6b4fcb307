"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaxScale = exports.getDefaultCategoryScaleRange = exports.getName = exports.syncScale = exports.createScaleByField = exports.inferScaleType = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var dependents_1 = require("../dependents");
var coordinate_1 = require("./coordinate");
var dateRegex = /^(?:(?!0000)[0-9]{4}([-/.]+)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]+)0?2\2(?:29))(\s+([01]|([01][0-9]|2[0-3])):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9]))?$/;
/**
 * 获取字段对应数据的类型
 * @param field 数据字段名
 * @param data 数据源
 * @returns default type 返回对应的数据类型
 */
function getDefaultType(value) {
    var type = 'linear';
    if (dateRegex.test(value)) {
        type = 'timeCat';
    }
    else if ((0, util_1.isString)(value)) {
        type = 'cat';
    }
    return type;
}
/**
 * using the scale type if user specified, otherwise infer the type
 */
function inferScaleType(scale, scaleDef, attrType, geometryType) {
    if (scaleDef === void 0) { scaleDef = {}; }
    if (scaleDef.type)
        return scaleDef.type;
    // identity scale 直接返回
    // geometry 类型有: edge,heatmap,interval,line,path,point,polygon,schema,voilin等；理论上，interval 下，可以用 linear scale 作为分组字段
    if (scale.type !== 'identity' && constant_1.GROUP_ATTRS.includes(attrType) && ['interval'].includes(geometryType)) {
        return 'cat';
    }
    return scale.isCategory ? 'cat' : scale.type;
}
exports.inferScaleType = inferScaleType;
/**
 * @ignore
 * 为指定的 `field` 字段数据创建 scale
 * @param field 字段名
 * @param [data] 数据集，可为空
 * @param [scaleDef] 列定义，可为空
 * @returns scale 返回创建的 Scale 实例
 */
function createScaleByField(field, data, scaleDef) {
    var validData = data || [];
    if ((0, util_1.isNumber)(field) || ((0, util_1.isNil)((0, util_1.firstValue)(validData, field)) && (0, util_1.isEmpty)(scaleDef))) {
        var Identity = (0, dependents_1.getScale)('identity');
        return new Identity({
            field: field.toString(),
            values: [field],
        });
    }
    var values = (0, util_1.valuesOfKey)(validData, field);
    // 如果已经定义过这个度量 (fix-later 单纯从数据中，推断 scale type 是不精确的)
    var type = (0, util_1.get)(scaleDef, 'type', getDefaultType(values[0]));
    var ScaleCtor = (0, dependents_1.getScale)(type);
    return new ScaleCtor(tslib_1.__assign({ field: field, values: values }, scaleDef));
}
exports.createScaleByField = createScaleByField;
/**
 * @ignore
 * 同步 scale
 * @todo 是否可以通过 scale.update() 方法进行更新
 * @param scale 需要同步的 scale 实例
 * @param newScale 同步源 Scale
 */
function syncScale(scale, newScale) {
    if (scale.type !== 'identity' && newScale.type !== 'identity') {
        var obj = {};
        for (var k in newScale) {
            if (Object.prototype.hasOwnProperty.call(newScale, k)) {
                obj[k] = newScale[k];
            }
        }
        scale.change(obj);
    }
}
exports.syncScale = syncScale;
/**
 * @ignore
 * get the scale name, if alias exist, return alias, or else field
 * @param scale
 * @returns the name of field
 */
function getName(scale) {
    return scale.alias || scale.field;
}
exports.getName = getName;
/**
 * 根据 scale values 和 coordinate 获取分类默认 range
 * @param scale 需要获取的 scale 实例
 * @param coordinate coordinate 实例
 * @param theme theme
 */
function getDefaultCategoryScaleRange(scale, coordinate, theme) {
    var values = scale.values;
    var count = values.length;
    var range;
    if (count === 1) {
        range = [0.5, 1]; // 只有一个分类时,防止计算出现 [0.5,0.5] 的状态
    }
    else {
        var widthRatio = 1;
        var offset = 0;
        if ((0, coordinate_1.isFullCircle)(coordinate)) {
            if (!coordinate.isTransposed) {
                range = [0, 1 - 1 / count];
            }
            else {
                widthRatio = (0, util_1.get)(theme, 'widthRatio.multiplePie', 1 / 1.3);
                offset = (1 / count) * widthRatio;
                range = [offset / 2, 1 - offset / 2];
            }
        }
        else {
            offset = 1 / count / 2; // 两边留下分类空间的一半
            range = [offset, 1 - offset]; // 坐标轴最前面和最后面留下空白防止绘制柱状图时
        }
    }
    return range;
}
exports.getDefaultCategoryScaleRange = getDefaultCategoryScaleRange;
/**
 * @function y轴scale的max
 * @param {yScale}
 */
function getMaxScale(scale) {
    // 过滤values[]中 NaN/undefined/null 等
    var values = scale.values.filter(function (item) { return !(0, util_1.isNil)(item) && !isNaN(item); });
    return Math.max.apply(Math, tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(values), false), [(0, util_1.isNil)(scale.max) ? -Infinity : scale.max], false));
}
exports.getMaxScale = getMaxScale;
//# sourceMappingURL=scale.js.map