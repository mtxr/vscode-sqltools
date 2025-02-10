"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var animate_1 = require("../animate");
var label_1 = require("../geometry/label");
var util_2 = require("../geometry/label/util");
var graphics_1 = require("../util/graphics");
var transform_1 = require("../util/transform");
var constant_1 = require("../constant");
var update_label_1 = require("./update-label");
/**
 * Geometry labels 渲染组件
 */
var Labels = /** @class */ (function () {
    function Labels(cfg) {
        /** 存储当前 shape 的映射表，键值为 shape id */
        this.shapesMap = {};
        var layout = cfg.layout, container = cfg.container;
        this.layout = layout;
        this.container = container;
    }
    /**
     * 渲染文本
     */
    Labels.prototype.render = function (items, shapes, isUpdate) {
        if (isUpdate === void 0) { isUpdate = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var shapesMap, offscreenGroup, items_1, items_1_1, item, lastShapesMap;
            var e_1, _a;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        shapesMap = {};
                        offscreenGroup = this.createOffscreenGroup();
                        if (!items.length) return [3 /*break*/, 2];
                        try {
                            // 如果 items 空的话就不进行绘制调整操作
                            // step 1: 在虚拟 group 中创建 shapes
                            for (items_1 = tslib_1.__values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                                item = items_1_1.value;
                                if (item) {
                                    shapesMap[item.id] = this.renderLabel(item, offscreenGroup);
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        // [todo] Move layout into Worker.
                        // step 2: 根据布局，调整 labels
                        return [4 /*yield*/, this.doLayout(items, shapes, shapesMap)];
                    case 1:
                        // [todo] Move layout into Worker.
                        // step 2: 根据布局，调整 labels
                        _b.sent();
                        // step 3.1: 绘制 labelLine
                        this.renderLabelLine(items, shapesMap);
                        // step 3.2: 绘制 labelBackground
                        this.renderLabelBackground(items, shapesMap);
                        // step 4: 根据用户设置的偏移量调整 label
                        this.adjustLabel(items, shapesMap);
                        _b.label = 2;
                    case 2:
                        lastShapesMap = this.shapesMap;
                        (0, util_1.each)(shapesMap, function (shape, id) {
                            if (shape.destroyed) {
                                // label 在布局调整环节被删除了（doLayout）
                                delete shapesMap[id];
                            }
                            else {
                                if (lastShapesMap[id]) {
                                    // 图形发生更新
                                    var data = shape.get('data');
                                    var origin_1 = shape.get('origin');
                                    var coordinate = shape.get('coordinate');
                                    var currentAnimateCfg = shape.get('animateCfg');
                                    var currentShape = lastShapesMap[id]; // 已经在渲染树上的 shape
                                    (0, update_label_1.updateLabel)(currentShape, shapesMap[id], {
                                        data: data,
                                        origin: origin_1,
                                        animateCfg: currentAnimateCfg,
                                        coordinate: coordinate,
                                    });
                                    shapesMap[id] = currentShape; // 保存引用
                                }
                                else {
                                    // 新生成的 shape
                                    // If container has been destroyed, no need to render labels.
                                    if (_this.container.destroyed)
                                        return;
                                    _this.container.add(shape);
                                    var animateCfg = (0, util_1.get)(shape.get('animateCfg'), isUpdate ? 'enter' : 'appear');
                                    if (animateCfg) {
                                        (0, animate_1.doAnimate)(shape, animateCfg, {
                                            toAttrs: tslib_1.__assign({}, shape.attr()),
                                            coordinate: shape.get('coordinate'),
                                        });
                                    }
                                }
                                delete lastShapesMap[id];
                            }
                        });
                        // 移除
                        (0, util_1.each)(lastShapesMap, function (deleteShape) {
                            var animateCfg = (0, util_1.get)(deleteShape.get('animateCfg'), 'leave');
                            if (animateCfg) {
                                (0, animate_1.doAnimate)(deleteShape, animateCfg, {
                                    toAttrs: null,
                                    coordinate: deleteShape.get('coordinate'),
                                });
                            }
                            else {
                                deleteShape.remove(true); // 移除
                            }
                        });
                        this.shapesMap = shapesMap;
                        offscreenGroup.destroy();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** 清除当前 labels */
    Labels.prototype.clear = function () {
        this.container.clear();
        this.shapesMap = {};
    };
    /** 销毁 */
    Labels.prototype.destroy = function () {
        this.container.destroy();
        this.shapesMap = null;
    };
    Labels.prototype.renderLabel = function (cfg, container) {
        var id = cfg.id, elementId = cfg.elementId, data = cfg.data, mappingData = cfg.mappingData, coordinate = cfg.coordinate, animate = cfg.animate, content = cfg.content, capture = cfg.capture;
        var shapeAppendCfg = {
            id: id,
            elementId: elementId,
            capture: capture,
            data: data,
            origin: tslib_1.__assign(tslib_1.__assign({}, mappingData), { data: mappingData[constant_1.FIELD_ORIGIN] }),
            coordinate: coordinate,
        };
        var labelGroup = container.addGroup(tslib_1.__assign({ name: 'label', 
            // 如果 this.animate === false 或者 cfg.animate === false/null 则不进行动画，否则进行动画配置的合并
            animateCfg: this.animate === false || animate === null || animate === false ? false : (0, util_1.deepMix)({}, this.animate, animate) }, shapeAppendCfg));
        var labelShape;
        if ((content.isGroup && content.isGroup()) || (content.isShape && content.isShape())) {
            // 如果 content 是 Group 或者 Shape，根据 textAlign 调整位置后，直接将其加入 labelGroup
            var _a = content.getCanvasBBox(), width = _a.width, height = _a.height;
            var textAlign = (0, util_1.get)(cfg, 'textAlign', 'left');
            var x = cfg.x;
            var y = cfg.y - height / 2;
            if (textAlign === 'center') {
                x = x - width / 2;
            }
            else if (textAlign === 'right' || textAlign === 'end') {
                x = x - width;
            }
            (0, transform_1.translate)(content, x, y); // 将 label 平移至 x, y 指定的位置
            labelShape = content;
            labelGroup.add(content);
        }
        else {
            var fill = (0, util_1.get)(cfg, ['style', 'fill']);
            labelShape = labelGroup.addShape('text', tslib_1.__assign({ attrs: tslib_1.__assign(tslib_1.__assign({ x: cfg.x, y: cfg.y, textAlign: cfg.textAlign, textBaseline: (0, util_1.get)(cfg, 'textBaseline', 'middle'), text: cfg.content }, cfg.style), { fill: (0, util_1.isNull)(fill) ? cfg.color : fill }) }, shapeAppendCfg));
        }
        if (cfg.rotate) {
            (0, transform_1.rotate)(labelShape, cfg.rotate);
        }
        return labelGroup;
    };
    // 根据type对label布局
    Labels.prototype.doLayout = function (items, shapes, shapesMap) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var layouts;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.layout) return [3 /*break*/, 2];
                        layouts = (0, util_1.isArray)(this.layout) ? this.layout : [this.layout];
                        return [4 /*yield*/, Promise.all(layouts.map(function (layout) {
                                var layoutFn = (0, label_1.getGeometryLabelLayout)((0, util_1.get)(layout, 'type', ''));
                                if (!layoutFn)
                                    return;
                                var labelShapes = [];
                                var geometryShapes = [];
                                (0, util_1.each)(shapesMap, function (labelShape, id) {
                                    labelShapes.push(labelShape);
                                    geometryShapes.push(shapes[labelShape.get('elementId')]);
                                });
                                // [todo] Refactor more layout into Worker.
                                return layoutFn(items, labelShapes, geometryShapes, _this.region, layout.cfg);
                            }))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Labels.prototype.renderLabelLine = function (labelItems, shapesMap) {
        (0, util_1.each)(labelItems, function (labelItem) {
            var coordinate = (0, util_1.get)(labelItem, 'coordinate');
            if (!labelItem || !coordinate) {
                return;
            }
            var center = coordinate.getCenter();
            var radius = coordinate.getRadius();
            if (!labelItem.labelLine) {
                // labelLine: null | false，关闭 label 对应的 labelLine
                return;
            }
            var labelLineCfg = (0, util_1.get)(labelItem, 'labelLine', {});
            var id = labelItem.id;
            var path = labelLineCfg.path;
            if (!path) {
                var start = (0, graphics_1.polarToCartesian)(center.x, center.y, radius, labelItem.angle);
                path = [
                    ['M', start.x, start.y],
                    ['L', labelItem.x, labelItem.y],
                ];
            }
            var labelGroup = shapesMap[id];
            if (!labelGroup.destroyed) {
                labelGroup.addShape('path', {
                    capture: false,
                    attrs: tslib_1.__assign({ path: path, stroke: labelItem.color ? labelItem.color : (0, util_1.get)(labelItem, ['style', 'fill'], '#000'), fill: null }, labelLineCfg.style),
                    id: id,
                    origin: labelItem.mappingData,
                    data: labelItem.data,
                    coordinate: labelItem.coordinate,
                });
            }
        });
    };
    /**
     * 绘制标签背景
     * @param labelItems
     */
    Labels.prototype.renderLabelBackground = function (labelItems, shapesMap) {
        (0, util_1.each)(labelItems, function (labelItem) {
            var coordinate = (0, util_1.get)(labelItem, 'coordinate');
            var background = (0, util_1.get)(labelItem, 'background');
            if (!background || !coordinate) {
                return;
            }
            var id = labelItem.id;
            var labelGroup = shapesMap[id];
            if (!labelGroup.destroyed) {
                var labelContentShape = labelGroup.getChildren()[0];
                if (labelContentShape) {
                    var _a = (0, util_2.getLabelBackgroundInfo)(labelGroup, labelItem, background.padding), rotation = _a.rotation, box = tslib_1.__rest(_a, ["rotation"]);
                    var backgroundShape = labelGroup.addShape('rect', {
                        attrs: tslib_1.__assign(tslib_1.__assign({}, box), (background.style || {})),
                        id: id,
                        origin: labelItem.mappingData,
                        data: labelItem.data,
                        coordinate: labelItem.coordinate,
                    });
                    backgroundShape.setZIndex(-1);
                    if (rotation) {
                        var matrix = labelContentShape.getMatrix();
                        backgroundShape.setMatrix(matrix);
                    }
                }
            }
        });
    };
    Labels.prototype.createOffscreenGroup = function () {
        var container = this.container;
        var GroupClass = container.getGroupBase(); // 获取分组的构造函数
        var newGroup = new GroupClass({});
        return newGroup;
    };
    Labels.prototype.adjustLabel = function (items, shapesMap) {
        (0, util_1.each)(items, function (item) {
            if (item) {
                var id = item.id;
                var labelGroup = shapesMap[id];
                if (!labelGroup.destroyed) {
                    // fix: 如果说开发者的 label content 是一个 group，此处的偏移无法对 整个 content group 生效；场景类似 饼图 spider label 是一个含 2 个 textShape 的 gorup
                    var labelShapes = labelGroup.findAll(function (ele) { return ele.get('type') !== 'path'; });
                    (0, util_1.each)(labelShapes, function (labelShape) {
                        if (labelShape) {
                            if (item.offsetX) {
                                labelShape.attr('x', labelShape.attr('x') + item.offsetX);
                            }
                            if (item.offsetY) {
                                labelShape.attr('y', labelShape.attr('y') + item.offsetY);
                            }
                        }
                    });
                }
            }
        });
    };
    return Labels;
}());
exports.default = Labels;
//# sourceMappingURL=labels.js.map