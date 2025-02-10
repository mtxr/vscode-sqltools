"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geometry = exports.getMappingFunction = exports.getMappingField = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var utils_1 = require("../../utils");
/**
 * 获得映射的字段列表
 * @param options
 * @param field
 */
function getMappingField(o, field) {
    var type = o.type, xField = o.xField, yField = o.yField, colorField = o.colorField, shapeField = o.shapeField, sizeField = o.sizeField, styleField = o.styleField;
    var rawFields = o.rawFields;
    var fields = [];
    rawFields = ((0, util_1.isFunction)(rawFields) ? rawFields(type, field) : rawFields) || [];
    // 因为 color 会影响到数据分组，以及最后的图形映射。所以导致 bar 图中的 widthRatio 设置不生效
    // 所以对于 color 字段，仅仅保留 colorField 好了！ + rawFields
    // shape, size 同理
    if (field === 'color') {
        fields = tslib_1.__spreadArray([colorField || xField], rawFields, true);
    }
    else if (field === 'shape') {
        fields = tslib_1.__spreadArray([shapeField || xField], rawFields, true);
    }
    else if (field === 'size') {
        fields = tslib_1.__spreadArray([sizeField || xField], rawFields, true);
    }
    else {
        fields = tslib_1.__spreadArray([xField, yField, colorField, shapeField, sizeField, styleField], rawFields, true);
        // 一定能找到的！
        var idx = ['x', 'y', 'color', 'shape', 'size', 'style'].indexOf(field);
        var f = fields[idx];
        // 删除当前字段
        fields.splice(idx, 1);
        // 插入到第一个
        fields.unshift(f);
    }
    var mappingFields = (0, util_1.uniq)(fields.filter(function (f) { return !!f; }));
    /**
     * 修复 line geometry 无拆分时 color 回调错误
     * eg:
     *   geometry.color(xField, ()=> '#f24')
     */
    var tileMappingField = type === 'line' && [xField, yField].includes(mappingFields.join('*')) ? '' : mappingFields.join('*');
    return {
        mappingFields: mappingFields,
        tileMappingField: tileMappingField,
    };
}
exports.getMappingField = getMappingField;
/**
 * 获得映射函数
 * @param mappingFields
 * @param func
 */
function getMappingFunction(mappingFields, func) {
    if (!func)
        return undefined;
    // 返回函数
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var params = {};
        mappingFields.forEach(function (f, idx) {
            params[f] = args[idx];
        });
        // 删除 undefined
        delete params['undefined'];
        return func(params);
    };
}
exports.getMappingFunction = getMappingFunction;
/**
 * 通用 geometry 的配置处理的 adaptor
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var type = options.type, args = options.args, mapping = options.mapping, xField = options.xField, yField = options.yField, colorField = options.colorField, shapeField = options.shapeField, sizeField = options.sizeField, tooltipFields = options.tooltipFields, label = options.label, state = options.state, customInfo = options.customInfo;
    // 如果没有 mapping 信息，那么直接返回
    if (!mapping) {
        return params;
    }
    var color = mapping.color, shape = mapping.shape, size = mapping.size, style = mapping.style, tooltip = mapping.tooltip;
    // 创建 geometry
    var geometry = chart[type](args).position("".concat(xField, "*").concat(yField));
    /**
     * color 的几种情况
     * g.color('red');
     * g.color('color', ['red', 'blue']);
     * g.color('x', (x, y) => 'red');
     * g.color('color', (color, x, y) => 'red');
     */
    if ((0, util_1.isString)(color)) {
        colorField ? geometry.color(colorField, color) : geometry.color(color);
    }
    else if ((0, util_1.isFunction)(color)) {
        var _a = getMappingField(options, 'color'), mappingFields = _a.mappingFields, tileMappingField = _a.tileMappingField;
        geometry.color(tileMappingField, getMappingFunction(mappingFields, color));
    }
    else {
        colorField && geometry.color(colorField, color);
    }
    /**
     * shape 的几种情况
     * g.shape('rect');
     * g.shape('shape', ['rect', 'circle']);
     * g.shape('x*y', (x, y) => 'rect');
     * g.shape('shape*x*y', (shape, x, y) => 'rect');
     */
    if ((0, util_1.isString)(shape)) {
        shapeField ? geometry.shape(shapeField, [shape]) : geometry.shape(shape); // [shape] 需要在 G2 做掉
    }
    else if ((0, util_1.isFunction)(shape)) {
        var _b = getMappingField(options, 'shape'), mappingFields = _b.mappingFields, tileMappingField = _b.tileMappingField;
        geometry.shape(tileMappingField, getMappingFunction(mappingFields, shape));
    }
    else {
        shapeField && geometry.shape(shapeField, shape);
    }
    /**
     * size 的几种情况
     * g.size(10);
     * g.size('size', [10, 20]);
     * g.size('x*y', (x, y) => 10);
     * g.color('size*x*y', (size, x, y) => 1-);
     */
    if ((0, util_1.isNumber)(size)) {
        sizeField ? geometry.size(sizeField, size) : geometry.size(size);
    }
    else if ((0, util_1.isFunction)(size)) {
        var _c = getMappingField(options, 'size'), mappingFields = _c.mappingFields, tileMappingField = _c.tileMappingField;
        geometry.size(tileMappingField, getMappingFunction(mappingFields, size));
    }
    else {
        sizeField && geometry.size(sizeField, size);
    }
    /**
     * style 的几种情况
     * g.style({ fill: 'red' });
     * g.style('x*y*color', (x, y, color) => ({ fill: 'red' }));
     */
    if ((0, util_1.isFunction)(style)) {
        var _d = getMappingField(options, 'style'), mappingFields = _d.mappingFields, tileMappingField = _d.tileMappingField;
        geometry.style(tileMappingField, getMappingFunction(mappingFields, style));
    }
    else if ((0, util_1.isObject)(style)) {
        geometry.style(style);
    }
    /**
     * tooltip 的 API
     * g.tooltip('x*y*color', (x, y, color) => ({ name, value }));
     * g.tooltip(false);
     */
    if (tooltipFields === false) {
        geometry.tooltip(false);
    }
    else if (!(0, util_1.isEmpty)(tooltipFields)) {
        geometry.tooltip(tooltipFields.join('*'), getMappingFunction(tooltipFields, tooltip));
    }
    /**
     * label 的映射
     */
    if (label === false) {
        geometry.label(false);
    }
    else if (label) {
        var callback = label.callback, fields = label.fields, cfg = tslib_1.__rest(label, ["callback", "fields"]);
        geometry.label({
            fields: fields || [yField],
            callback: callback,
            cfg: (0, utils_1.transformLabel)(cfg),
        });
    }
    /**
     * state 状态样式
     */
    if (state) {
        geometry.state(state);
    }
    /**
     * 自定义信息
     */
    if (customInfo) {
        geometry.customInfo(customInfo);
    }
    // 防止因为 x y 字段做了通道映射，导致生成图例
    [xField, yField]
        .filter(function (f) { return f !== colorField; })
        .forEach(function (f) {
        chart.legend(f, false);
    });
    return tslib_1.__assign(tslib_1.__assign({}, params), { 
        // geometry adaptor 额外需要做的事情，就是将创建好的 geometry 返回到下一层 adaptor，防止通过 type 查询的时候容易误判
        ext: { geometry: geometry } });
}
exports.geometry = geometry;
//# sourceMappingURL=base.js.map