"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findItemsFromViewRecurisive = exports.findItemsFromView = exports.getTooltipItems = exports.findDataByPoint = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var scale_1 = require("./scale");
function snapEqual(v1, v2, scale) {
    var value1 = scale.translate(v1);
    var value2 = scale.translate(v2);
    return (0, util_1.isNumberEqual)(value1, value2);
}
function getXValueByPoint(point, geometry) {
    var coordinate = geometry.coordinate;
    var xScale = geometry.getXScale();
    var range = xScale.range;
    var rangeMax = range[range.length - 1];
    var rangeMin = range[0];
    var invertPoint = coordinate.invert(point);
    var xValue = invertPoint.x;
    if (coordinate.isPolar && xValue > (1 + rangeMax) / 2) {
        xValue = rangeMin; // 极坐标下，scale 的 range 被做过特殊处理
    }
    return xScale.translate(xScale.invert(xValue));
}
function filterYValue(data, point, geometry) {
    var coordinate = geometry.coordinate;
    var yScale = geometry.getYScale();
    var yField = yScale.field;
    var invertPoint = coordinate.invert(point);
    var yValue = yScale.invert(invertPoint.y);
    var result = (0, util_1.find)(data, function (obj) {
        var originData = obj[constant_1.FIELD_ORIGIN];
        return originData[yField][0] <= yValue && originData[yField][1] >= yValue;
    });
    return result || data[data.length - 1];
}
var getXDistance = (0, util_1.memoize)(function (scale) {
    if (scale.isCategory) {
        return 1;
    }
    var scaleValues = scale.values; // values 是无序的
    var length = scaleValues.length;
    var min = scale.translate(scaleValues[0]);
    var max = min;
    for (var index = 0; index < length; index++) {
        var value = scaleValues[index];
        // 时间类型需要 translate
        var numericValue = scale.translate(value);
        if (numericValue < min) {
            min = numericValue;
        }
        if (numericValue > max) {
            max = numericValue;
        }
    }
    return (max - min) / (length - 1);
});
/**
 * 获得 tooltip 的 title
 * @param originData
 * @param geometry
 * @param title
 */
function getTooltipTitle(originData, geometry, title) {
    var positionAttr = geometry.getAttribute('position');
    var fields = positionAttr.getFields();
    var scales = geometry.scales;
    var titleField = (0, util_1.isFunction)(title) || !title ? fields[0] : title;
    var titleScale = scales[titleField];
    // 如果创建了该字段对应的 scale，则通过 scale.getText() 方式取值，因为用户可能对数据进行了格式化
    // 如果没有对应的 scale，则从原始数据中取值，如果原始数据中仍不存在，则直接放回 title 值
    var tooltipTitle = titleScale ? titleScale.getText(originData[titleField]) : originData[titleField] || titleField;
    return (0, util_1.isFunction)(title) ? title(tooltipTitle, originData) : tooltipTitle;
}
function getAttributesForLegend(geometry) {
    var attributes = (0, util_1.values)(geometry.attributes);
    return (0, util_1.filter)(attributes, function (attribute) { return (0, util_1.contains)(constant_1.GROUP_ATTRS, attribute.type); });
}
function getTooltipValueScale(geometry) {
    var e_1, _a;
    var attributes = getAttributesForLegend(geometry);
    var scale;
    try {
        for (var attributes_1 = tslib_1.__values(attributes), attributes_1_1 = attributes_1.next(); !attributes_1_1.done; attributes_1_1 = attributes_1.next()) {
            var attribute = attributes_1_1.value;
            var tmpScale = attribute.getScale(attribute.type);
            if (tmpScale && tmpScale.isLinear) {
                var tmpScaleDef = (0, util_1.get)(geometry.scaleDefs, tmpScale.field);
                var inferedScaleType = (0, scale_1.inferScaleType)(tmpScale, tmpScaleDef, attribute.type, geometry.type);
                if (inferedScaleType !== 'cat') {
                    // 如果指定字段是非 position 的，同时是连续的
                    scale = tmpScale;
                    break;
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (attributes_1_1 && !attributes_1_1.done && (_a = attributes_1.return)) _a.call(attributes_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var xScale = geometry.getXScale();
    var yScale = geometry.getYScale();
    return scale || yScale || xScale;
}
function getTooltipValue(originData, valueScale) {
    var field = valueScale.field;
    var value = originData[field];
    if ((0, util_1.isArray)(value)) {
        var texts = value.map(function (eachValue) {
            return valueScale.getText(eachValue);
        });
        return texts.join('-');
    }
    return valueScale.getText(value);
}
// 根据原始数据获取 tooltip item 中 name 值
function getTooltipName(originData, geometry) {
    var nameScale;
    var groupScales = geometry.getGroupScales();
    if (groupScales.length) {
        // 如果存在分组类型，取第一个分组类型
        nameScale = groupScales[0];
    }
    if (nameScale) {
        var field = nameScale.field;
        return nameScale.getText(originData[field]);
    }
    var valueScale = getTooltipValueScale(geometry);
    return (0, scale_1.getName)(valueScale);
}
/**
 * @ignore
 * Finds data from geometry by point
 * @param point canvas point
 * @param data an item of geometry.dataArray
 * @param geometry
 * @returns
 */
function findDataByPoint(point, data, geometry) {
    if (data.length === 0) {
        return null;
    }
    var geometryType = geometry.type;
    var xScale = geometry.getXScale();
    var yScale = geometry.getYScale();
    var xField = xScale.field;
    var yField = yScale.field;
    var rst = null;
    // 热力图采用最小逼近策略查找 point 击中的数据
    if (geometryType === 'heatmap' || geometryType === 'point') {
        // 将 point 画布坐标转换为原始数据值
        var coordinate = geometry.coordinate;
        var invertPoint = coordinate.invert(point); // 转换成归一化的数据
        var x = xScale.invert(invertPoint.x); // 转换为原始值
        var y = yScale.invert(invertPoint.y); // 转换为原始值
        var min = Infinity;
        for (var index = 0; index < data.length; index++) {
            var obj = data[index];
            var originData = obj[constant_1.FIELD_ORIGIN];
            var range = Math.pow((originData[xField] - x), 2) + Math.pow((originData[yField] - y), 2);
            if (range < min) {
                min = range;
                rst = obj;
            }
        }
        return rst;
    }
    // 其他 Geometry 类型按照 x 字段数据进行查找
    var first = data[0];
    var last = data[data.length - 1];
    var xValue = getXValueByPoint(point, geometry);
    var firstXValue = first[constant_1.FIELD_ORIGIN][xField];
    var firstYValue = first[constant_1.FIELD_ORIGIN][yField];
    var lastXValue = last[constant_1.FIELD_ORIGIN][xField];
    var isYArray = yScale.isLinear && (0, util_1.isArray)(firstYValue); // 考虑 x 维度相同，y 是数组区间的情况
    // 如果 x 的值是数组
    if ((0, util_1.isArray)(firstXValue)) {
        for (var index = 0; index < data.length; index++) {
            var record = data[index];
            var originData = record[constant_1.FIELD_ORIGIN];
            // xValue 在 originData[xField] 的数值区间内
            if (xScale.translate(originData[xField][0]) <= xValue && xScale.translate(originData[xField][1]) >= xValue) {
                if (isYArray) {
                    // 层叠直方图场景，x 和 y 都是数组区间
                    if (!(0, util_1.isArray)(rst)) {
                        rst = [];
                    }
                    rst.push(record);
                }
                else {
                    rst = record;
                    break;
                }
            }
        }
        if ((0, util_1.isArray)(rst)) {
            rst = filterYValue(rst, point, geometry);
        }
    }
    else {
        var next = void 0;
        if (!xScale.isLinear && xScale.type !== 'timeCat') {
            // x 轴对应的数据为非线性以及非时间类型的数据采用遍历查找
            for (var index = 0; index < data.length; index++) {
                var record = data[index];
                var originData = record[constant_1.FIELD_ORIGIN];
                if (snapEqual(originData[xField], xValue, xScale)) {
                    if (isYArray) {
                        if (!(0, util_1.isArray)(rst)) {
                            rst = [];
                        }
                        rst.push(record);
                    }
                    else {
                        rst = record;
                        break;
                    }
                }
                else if (xScale.translate(originData[xField]) <= xValue) {
                    last = record;
                    next = data[index + 1];
                }
            }
            if ((0, util_1.isArray)(rst)) {
                rst = filterYValue(rst, point, geometry);
            }
        }
        else {
            // x 轴对应的数据为线性以及时间类型，进行二分查找，性能更好
            if ((xValue > xScale.translate(lastXValue) || xValue < xScale.translate(firstXValue)) &&
                (xValue > xScale.max || xValue < xScale.min)) {
                // 不在数据范围内
                return null;
            }
            var firstIdx = 0;
            var lastIdx = data.length - 1;
            var middleIdx = void 0;
            while (firstIdx <= lastIdx) {
                middleIdx = Math.floor((firstIdx + lastIdx) / 2);
                var item = data[middleIdx][constant_1.FIELD_ORIGIN][xField];
                if (snapEqual(item, xValue, xScale)) {
                    return data[middleIdx];
                }
                if (xScale.translate(item) <= xScale.translate(xValue)) {
                    firstIdx = middleIdx + 1;
                    last = data[middleIdx];
                    next = data[middleIdx + 1];
                }
                else {
                    if (lastIdx === 0) {
                        last = data[0];
                    }
                    lastIdx = middleIdx - 1;
                }
            }
        }
        if (last && next) {
            // 计算最逼近的
            if (Math.abs(xScale.translate(last[constant_1.FIELD_ORIGIN][xField]) - xValue) >
                Math.abs(xScale.translate(next[constant_1.FIELD_ORIGIN][xField]) - xValue)) {
                last = next;
            }
        }
    }
    var distance = getXDistance(geometry.getXScale()); // 每个分类间的平均间距
    if (!rst && Math.abs(xScale.translate(last[constant_1.FIELD_ORIGIN][xField]) - xValue) <= distance / 2) {
        rst = last;
    }
    return rst;
}
exports.findDataByPoint = findDataByPoint;
/**
 * @ignore
 * Gets tooltip items
 * @param data
 * @param geometry
 * @param [title]
 * @returns
 */
function getTooltipItems(data, geometry, title, showNil) {
    var e_2, _a;
    if (title === void 0) { title = ''; }
    if (showNil === void 0) { showNil = false; }
    var originData = data[constant_1.FIELD_ORIGIN];
    var tooltipTitle = getTooltipTitle(originData, geometry, title);
    var tooltipOption = geometry.tooltipOption;
    var defaultColor = geometry.theme.defaultColor;
    var items = [];
    var name;
    var value;
    function addItem(itemName, itemValue) {
        if (showNil || (!(0, util_1.isNil)(itemValue) && itemValue !== '')) {
            // 值为 null的时候，忽视
            var item = {
                title: tooltipTitle,
                data: originData,
                mappingData: data,
                name: itemName,
                value: itemValue,
                color: data.color || defaultColor,
                marker: true,
            };
            items.push(item);
        }
    }
    if ((0, util_1.isObject)(tooltipOption)) {
        var fields = tooltipOption.fields, callback = tooltipOption.callback;
        if (callback) {
            // 用户定义了回调函数
            var callbackParams = fields.map(function (field) {
                return data[constant_1.FIELD_ORIGIN][field];
            });
            var cfg = callback.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(callbackParams), false));
            var itemCfg = tslib_1.__assign({ data: data[constant_1.FIELD_ORIGIN], mappingData: data, title: tooltipTitle, color: data.color || defaultColor, marker: true }, cfg);
            items.push(itemCfg);
        }
        else {
            var scales = geometry.scales;
            try {
                for (var fields_1 = tslib_1.__values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                    var field = fields_1_1.value;
                    if (!(0, util_1.isNil)(originData[field])) {
                        // 字段数据为null, undefined 时不显示
                        var scale = scales[field];
                        name = (0, scale_1.getName)(scale);
                        value = scale.getText(originData[field]);
                        addItem(name, value);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (fields_1_1 && !fields_1_1.done && (_a = fields_1.return)) _a.call(fields_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    else {
        var valueScale = getTooltipValueScale(geometry);
        // 字段数据为null ,undefined时不显示
        value = getTooltipValue(originData, valueScale);
        name = getTooltipName(originData, geometry);
        addItem(name, value);
    }
    return items;
}
exports.getTooltipItems = getTooltipItems;
function getTooltipItemsByFindData(geometry, point, title, tooltipCfg) {
    var e_3, _a;
    var showNil = tooltipCfg.showNil;
    var result = [];
    var dataArray = geometry.dataArray;
    if (!(0, util_1.isEmpty)(dataArray)) {
        geometry.sort(dataArray); // 先进行排序，便于 tooltip 查找
        try {
            for (var dataArray_1 = tslib_1.__values(dataArray), dataArray_1_1 = dataArray_1.next(); !dataArray_1_1.done; dataArray_1_1 = dataArray_1.next()) {
                var data = dataArray_1_1.value;
                var record = findDataByPoint(point, data, geometry);
                if (record) {
                    var elementId = geometry.getElementId(record);
                    var element = geometry.elementsMap[elementId];
                    if (geometry.type === 'heatmap' || element.visible) {
                        // Heatmap 没有 Element
                        // 如果图形元素隐藏了，怎不再 tooltip 上展示相关数据
                        var items = getTooltipItems(record, geometry, title, showNil);
                        if (items.length) {
                            result.push(items);
                        }
                    }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (dataArray_1_1 && !dataArray_1_1.done && (_a = dataArray_1.return)) _a.call(dataArray_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
    return result;
}
function getTooltipItemsByHitShape(geometry, point, title, tooltipCfg) {
    var showNil = tooltipCfg.showNil;
    var result = [];
    var container = geometry.container;
    var shape = container.getShape(point.x, point.y);
    if (shape && shape.get('visible') && shape.get('origin')) {
        var mappingData = shape.get('origin').mappingData;
        var items = getTooltipItems(mappingData, geometry, title, showNil);
        if (items.length) {
            result.push(items);
        }
    }
    return result;
}
/**
 * 不进行递归查找
 */
function findItemsFromView(view, point, tooltipCfg) {
    var e_4, _a;
    var result = [];
    // 先从 view 本身查找
    var geometries = view.geometries;
    var shared = tooltipCfg.shared, title = tooltipCfg.title, reversed = tooltipCfg.reversed;
    try {
        for (var geometries_1 = tslib_1.__values(geometries), geometries_1_1 = geometries_1.next(); !geometries_1_1.done; geometries_1_1 = geometries_1.next()) {
            var geometry = geometries_1_1.value;
            if (geometry.visible && geometry.tooltipOption !== false) {
                // geometry 可见同时未关闭 tooltip
                var geometryType = geometry.type;
                var tooltipItems = void 0;
                if (['point', 'edge', 'polygon'].includes(geometryType)) {
                    // 始终通过图形拾取
                    tooltipItems = getTooltipItemsByHitShape(geometry, point, title, tooltipCfg);
                }
                else if (['area', 'line', 'path', 'heatmap'].includes(geometryType)) {
                    // 如果是 'area', 'line', 'path'，始终通过数据查找方法查找 tooltip
                    tooltipItems = getTooltipItemsByFindData(geometry, point, title, tooltipCfg);
                }
                else {
                    if (shared !== false) {
                        tooltipItems = getTooltipItemsByFindData(geometry, point, title, tooltipCfg);
                    }
                    else {
                        tooltipItems = getTooltipItemsByHitShape(geometry, point, title, tooltipCfg);
                    }
                }
                if (tooltipItems.length) {
                    if (reversed) {
                        tooltipItems.reverse();
                    }
                    // geometry 有可能会有多个 item，因为用户可以设置 geometry.tooltip('x*y*z')
                    result.push(tooltipItems);
                }
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (geometries_1_1 && !geometries_1_1.done && (_a = geometries_1.return)) _a.call(geometries_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return result;
}
exports.findItemsFromView = findItemsFromView;
function findItemsFromViewRecurisive(view, point, tooltipCfg) {
    var e_5, _a;
    var result = findItemsFromView(view, point, tooltipCfg);
    try {
        // 递归查找，并合并结果
        for (var _b = tslib_1.__values(view.views), _c = _b.next(); !_c.done; _c = _b.next()) {
            var childView = _c.value;
            result = result.concat(findItemsFromView(childView, point, tooltipCfg));
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return result;
}
exports.findItemsFromViewRecurisive = findItemsFromViewRecurisive;
//# sourceMappingURL=tooltip.js.map