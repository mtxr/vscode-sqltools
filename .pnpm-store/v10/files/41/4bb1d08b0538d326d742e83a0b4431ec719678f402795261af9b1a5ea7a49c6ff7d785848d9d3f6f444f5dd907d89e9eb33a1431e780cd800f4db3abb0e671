"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../../constant");
var animate_1 = require("../../animate");
var graphics_1 = require("../../util/graphics");
var labels_1 = tslib_1.__importDefault(require("../../component/labels"));
function avg(arr) {
    var sum = 0;
    (0, util_1.each)(arr, function (value) {
        sum += value;
    });
    return sum / arr.length;
}
/**
 * Geometry Label 基类，用于生成 Geometry 下所有 label 的配置项信息
 */
var GeometryLabel = /** @class */ (function () {
    function GeometryLabel(geometry) {
        this.geometry = geometry;
    }
    GeometryLabel.prototype.getLabelItems = function (mapppingArray) {
        var _this = this;
        var items = [];
        var labelCfgs = this.getLabelCfgs(mapppingArray);
        // 获取 label 相关的 x，y 的值，获取具体的 x, y，防止存在数组
        (0, util_1.each)(mapppingArray, function (mappingData, index) {
            var labelCfg = labelCfgs[index];
            if (!labelCfg || (0, util_1.isNil)(mappingData.x) || (0, util_1.isNil)(mappingData.y)) {
                items.push(null);
                return;
            }
            var labelContent = !(0, util_1.isArray)(labelCfg.content) ? [labelCfg.content] : labelCfg.content;
            labelCfg.content = labelContent;
            var total = labelContent.length;
            (0, util_1.each)(labelContent, function (content, subIndex) {
                if ((0, util_1.isNil)(content) || content === '') {
                    items.push(null);
                    return;
                }
                var item = tslib_1.__assign(tslib_1.__assign({}, labelCfg), _this.getLabelPoint(labelCfg, mappingData, subIndex));
                if (!item.textAlign) {
                    item.textAlign = _this.getLabelAlign(item, subIndex, total);
                }
                if (item.offset <= 0) {
                    item.labelLine = null;
                }
                items.push(item);
            });
        });
        return items;
    };
    GeometryLabel.prototype.render = function (mappingArray, isUpdate) {
        if (isUpdate === void 0) { isUpdate = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var labelItems, labelsRenderer, shapes;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        labelItems = this.getLabelItems(mappingArray);
                        labelsRenderer = this.getLabelsRenderer();
                        shapes = this.getGeometryShapes();
                        // 渲染文本
                        return [4 /*yield*/, labelsRenderer.render(labelItems, shapes, isUpdate)];
                    case 1:
                        // 渲染文本
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GeometryLabel.prototype.clear = function () {
        var labelsRenderer = this.labelsRenderer;
        if (labelsRenderer) {
            labelsRenderer.clear();
        }
    };
    GeometryLabel.prototype.destroy = function () {
        var labelsRenderer = this.labelsRenderer;
        if (labelsRenderer) {
            labelsRenderer.destroy();
        }
        this.labelsRenderer = null;
    };
    // geometry 更新之后，对应的 Coordinate 也会更新，为了获取到最新鲜的 Coordinate，故使用方法获取
    GeometryLabel.prototype.getCoordinate = function () {
        return this.geometry.coordinate;
    };
    /**
     * 获取 label 的默认配置
     */
    GeometryLabel.prototype.getDefaultLabelCfg = function (offset, position) {
        var geometry = this.geometry;
        var type = geometry.type, theme = geometry.theme;
        if (type === 'polygon' ||
            (type === 'interval' && position === 'middle') ||
            (offset < 0 && !['line', 'point', 'path'].includes(type))) {
            // polygon 或者 (interval 且 middle) 或者 offset 小于 0 时，文本展示在图形内部，将其颜色设置为 白色
            return (0, util_1.get)(theme, 'innerLabels', {});
        }
        return (0, util_1.get)(theme, 'labels', {});
    };
    /**
     * 获取当前 label 的最终配置
     * @param labelCfg
     */
    GeometryLabel.prototype.getThemedLabelCfg = function (labelCfg) {
        var geometry = this.geometry;
        var defaultLabelCfg = this.getDefaultLabelCfg();
        var type = geometry.type, theme = geometry.theme;
        var themedLabelCfg;
        if (type === 'polygon' || (labelCfg.offset < 0 && !['line', 'point', 'path'].includes(type))) {
            // polygon 或者 offset 小于 0 时，文本展示在图形内部，将其颜色设置为 白色
            themedLabelCfg = (0, util_1.deepMix)({}, defaultLabelCfg, theme.innerLabels, labelCfg);
        }
        else {
            themedLabelCfg = (0, util_1.deepMix)({}, defaultLabelCfg, theme.labels, labelCfg);
        }
        return themedLabelCfg;
    };
    /**
     * 设置 label 位置
     * @param labelPointCfg
     * @param mappingData
     * @param index
     * @param position
     */
    GeometryLabel.prototype.setLabelPosition = function (labelPointCfg, mappingData, index, position) { };
    /**
     * @desc 获取 label offset
     */
    GeometryLabel.prototype.getLabelOffset = function (offset) {
        var coordinate = this.getCoordinate();
        var vector = this.getOffsetVector(offset);
        return coordinate.isTransposed ? vector[0] : vector[1];
    };
    /**
     * 获取每个 label 的偏移量 (矢量)
     * @param labelCfg
     * @param index
     * @param total
     * @return {Point} offsetPoint
     */
    GeometryLabel.prototype.getLabelOffsetPoint = function (labelCfg, index, total) {
        var offset = labelCfg.offset;
        var coordinate = this.getCoordinate();
        var transposed = coordinate.isTransposed;
        var dim = transposed ? 'x' : 'y';
        var factor = transposed ? 1 : -1; // y 方向上越大，像素的坐标越小，所以transposed时将系数变成
        var offsetPoint = {
            x: 0,
            y: 0,
        };
        if (index > 0 || total === 1) {
            // 判断是否小于0
            offsetPoint[dim] = offset * factor;
        }
        else {
            offsetPoint[dim] = offset * factor * -1;
        }
        return offsetPoint;
    };
    /**
     * 获取每个 label 的位置
     * @param labelCfg
     * @param mappingData
     * @param index
     * @returns label point
     */
    GeometryLabel.prototype.getLabelPoint = function (labelCfg, mappingData, index) {
        var coordinate = this.getCoordinate();
        var total = labelCfg.content.length;
        function getDimValue(value, idx, isAvg) {
            if (isAvg === void 0) { isAvg = false; }
            var v = value;
            if ((0, util_1.isArray)(v)) {
                if (labelCfg.content.length === 1) {
                    if (isAvg) {
                        v = avg(v);
                    }
                    else {
                        // 如果仅一个 label，多个 y, 取最后一个 y
                        if (v.length <= 2) {
                            v = v[value.length - 1];
                        }
                        else {
                            v = avg(v);
                        }
                    }
                }
                else {
                    v = v[idx];
                }
            }
            return v;
        }
        var label = {
            content: labelCfg.content[index],
            x: 0,
            y: 0,
            start: { x: 0, y: 0 },
            color: '#fff',
        };
        var shape = (0, util_1.isArray)(mappingData.shape) ? mappingData.shape[0] : mappingData.shape;
        var isFunnel = shape === 'funnel' || shape === 'pyramid';
        // 多边形场景，多用于地图
        if (this.geometry.type === 'polygon') {
            var centroid = (0, graphics_1.getPolygonCentroid)(mappingData.x, mappingData.y);
            label.x = centroid[0];
            label.y = centroid[1];
        }
        else if (this.geometry.type === 'interval' && !isFunnel) {
            // 对直方图的label X 方向的位置居中
            label.x = getDimValue(mappingData.x, index, true);
            label.y = getDimValue(mappingData.y, index);
        }
        else {
            label.x = getDimValue(mappingData.x, index);
            label.y = getDimValue(mappingData.y, index);
        }
        // 处理漏斗图文本位置
        if (isFunnel) {
            var nextPoints = (0, util_1.get)(mappingData, 'nextPoints');
            var points = (0, util_1.get)(mappingData, 'points');
            if (nextPoints) {
                // 非漏斗图底部
                var point1 = coordinate.convert(points[1]);
                var point2 = coordinate.convert(nextPoints[1]);
                label.x = (point1.x + point2.x) / 2;
                label.y = (point1.y + point2.y) / 2;
            }
            else if (shape === 'pyramid') {
                var point1 = coordinate.convert(points[1]);
                var point2 = coordinate.convert(points[2]);
                label.x = (point1.x + point2.x) / 2;
                label.y = (point1.y + point2.y) / 2;
            }
        }
        if (labelCfg.position) {
            // 如果 label 支持 position 属性
            this.setLabelPosition(label, mappingData, index, labelCfg.position);
        }
        var offsetPoint = this.getLabelOffsetPoint(labelCfg, index, total);
        label.start = { x: label.x, y: label.y };
        label.x += offsetPoint.x;
        label.y += offsetPoint.y;
        label.color = mappingData.color;
        return label;
    };
    /**
     * 获取文本的对齐方式
     * @param item
     * @param index
     * @param total
     * @returns
     */
    GeometryLabel.prototype.getLabelAlign = function (item, index, total) {
        var align = 'center';
        var coordinate = this.getCoordinate();
        if (coordinate.isTransposed) {
            var offset = item.offset;
            if (offset < 0) {
                align = 'right';
            }
            else if (offset === 0) {
                align = 'center';
            }
            else {
                align = 'left';
            }
            if (total > 1 && index === 0) {
                if (align === 'right') {
                    align = 'left';
                }
                else if (align === 'left') {
                    align = 'right';
                }
            }
        }
        return align;
    };
    /**
     * 获取每一个 label 的唯一 id
     * @param mappingData label 对应的图形的绘制数据
     */
    GeometryLabel.prototype.getLabelId = function (mappingData) {
        var geometry = this.geometry;
        var type = geometry.type;
        var xScale = geometry.getXScale();
        var yScale = geometry.getYScale();
        var origin = mappingData[constant_1.FIELD_ORIGIN]; // 原始数据
        var labelId = geometry.getElementId(mappingData);
        if (type === 'line' || type === 'area') {
            // 折线图以及区域图，一条线会对应一组数据，即多个 labels，为了区分这些 labels，需要在 line id 的前提下加上 x 字段值
            labelId += " ".concat(origin[xScale.field]);
        }
        else if (type === 'path') {
            // path 路径图，无序，有可能存在相同 x 不同 y 的情况，需要通过 x y 来确定唯一 id
            labelId += " ".concat(origin[xScale.field], "-").concat(origin[yScale.field]);
        }
        return labelId;
    };
    // 获取 labels 组件
    GeometryLabel.prototype.getLabelsRenderer = function () {
        var _a = this.geometry, labelsContainer = _a.labelsContainer, labelOption = _a.labelOption, canvasRegion = _a.canvasRegion, animateOption = _a.animateOption;
        var coordinate = this.geometry.coordinate;
        var labelsRenderer = this.labelsRenderer;
        if (!labelsRenderer) {
            labelsRenderer = new labels_1.default({
                container: labelsContainer,
                layout: (0, util_1.get)(labelOption, ['cfg', 'layout'], {
                    type: this.defaultLayout,
                }),
            });
            this.labelsRenderer = labelsRenderer;
        }
        labelsRenderer.region = canvasRegion;
        // 设置动画配置，如果 geometry 的动画关闭了，那么 label 的动画也会关闭
        labelsRenderer.animate = animateOption ? (0, animate_1.getDefaultAnimateCfg)('label', coordinate) : false;
        return labelsRenderer;
    };
    GeometryLabel.prototype.getLabelCfgs = function (mapppingArray) {
        var _this = this;
        var geometry = this.geometry;
        var labelOption = geometry.labelOption, scales = geometry.scales, coordinate = geometry.coordinate;
        var _a = labelOption, fields = _a.fields, callback = _a.callback, cfg = _a.cfg;
        var labelScales = fields.map(function (field) {
            return scales[field];
        });
        var labelCfgs = [];
        (0, util_1.each)(mapppingArray, function (mappingData, index) {
            var origin = mappingData[constant_1.FIELD_ORIGIN]; // 原始数据
            var originText = _this.getLabelText(origin, labelScales);
            var callbackCfg;
            if (callback) {
                // 当同时配置了 callback 和 cfg 时，以 callback 为准
                var originValues = fields.map(function (field) { return origin[field]; });
                callbackCfg = callback.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(originValues), false));
                if ((0, util_1.isNil)(callbackCfg)) {
                    labelCfgs.push(null);
                    return;
                }
            }
            var labelCfg = tslib_1.__assign(tslib_1.__assign({ id: _this.getLabelId(mappingData), elementId: _this.geometry.getElementId(mappingData), data: origin, // 存储原始数据
                mappingData: mappingData, // 存储映射后的数据,
                coordinate: coordinate }, cfg), callbackCfg);
            if ((0, util_1.isFunction)(labelCfg.position)) {
                labelCfg.position = labelCfg.position(origin, mappingData, index);
            }
            var offset = _this.getLabelOffset(labelCfg.offset || 0);
            // defaultCfg 需要判断 innerLabels & labels
            var defaultLabelCfg = _this.getDefaultLabelCfg(offset, labelCfg.position);
            // labelCfg priority: defaultCfg < cfg < callbackCfg
            labelCfg = (0, util_1.deepMix)({}, defaultLabelCfg, labelCfg);
            // 获取最终的 offset
            labelCfg.offset = _this.getLabelOffset(labelCfg.offset || 0);
            var content = labelCfg.content;
            if ((0, util_1.isFunction)(content)) {
                labelCfg.content = content(origin, mappingData, index);
            }
            else if ((0, util_1.isUndefined)(content)) {
                // 用户未配置 content，则默认为映射的第一个字段的值
                labelCfg.content = originText[0];
            }
            labelCfgs.push(labelCfg);
        });
        return labelCfgs;
    };
    GeometryLabel.prototype.getLabelText = function (origin, scales) {
        var labelTexts = [];
        (0, util_1.each)(scales, function (scale) {
            var value = origin[scale.field];
            if ((0, util_1.isArray)(value)) {
                value = value.map(function (subVal) {
                    return scale.getText(subVal);
                });
            }
            else {
                value = scale.getText(value);
            }
            if ((0, util_1.isNil)(value) || value === '') {
                labelTexts.push(null);
            }
            else {
                labelTexts.push(value);
            }
        });
        return labelTexts;
    };
    GeometryLabel.prototype.getOffsetVector = function (offset) {
        if (offset === void 0) { offset = 0; }
        var coordinate = this.getCoordinate();
        var actualOffset = 0;
        if ((0, util_1.isNumber)(offset)) {
            actualOffset = offset;
        }
        // 如果 x,y 翻转，则偏移 x，否则偏移 y
        return coordinate.isTransposed ? coordinate.applyMatrix(actualOffset, 0) : coordinate.applyMatrix(0, actualOffset);
    };
    GeometryLabel.prototype.getGeometryShapes = function () {
        var geometry = this.geometry;
        var shapes = {};
        (0, util_1.each)(geometry.elementsMap, function (element, id) {
            shapes[id] = element.shape;
        });
        // 因为有可能 shape 还在进行动画，导致 shape.getBBox() 获取到的值不是最终态，所以需要从 offscreenGroup 获取
        (0, util_1.each)(geometry.getOffscreenGroup().getChildren(), function (child) {
            var id = geometry.getElementId(child.get('origin').mappingData);
            shapes[id] = child;
        });
        return shapes;
    };
    return GeometryLabel;
}());
exports.default = GeometryLabel;
//# sourceMappingURL=base.js.map