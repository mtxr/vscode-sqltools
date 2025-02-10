"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var matrix_util_1 = require("@antv/matrix-util");
var util_1 = require("@antv/util");
var group_component_1 = require("../abstract/group-component");
var matrix_1 = require("../util/matrix");
var state_1 = require("../util/state");
var theme_1 = require("../util/theme");
var AxisBase = /** @class */ (function (_super) {
    tslib_1.__extends(AxisBase, _super);
    function AxisBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AxisBase.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'axis', ticks: [], line: {}, tickLine: {}, subTickLine: null, title: null, 
            /**
             * 文本标签的配置项
             */
            label: {}, 
            /**
             * 垂直于坐标轴方向的因子，决定文本、title、tickLine 在坐标轴的哪一侧
             */
            verticalFactor: 1, 
            // 垂直方向限制的长度，对文本自适应有很大影响
            verticalLimitLength: null, overlapOrder: ['autoRotate', 'autoEllipsis', 'autoHide'], tickStates: {}, optimize: {}, defaultCfg: {
                line: {
                    // @type {Attrs} 坐标轴线的图形属性,如果设置成null，则不显示轴线
                    style: {
                        lineWidth: 1,
                        stroke: theme_1.default.lineColor,
                    },
                },
                tickLine: {
                    // @type {Attrs} 标注坐标线的图形属性
                    style: {
                        lineWidth: 1,
                        stroke: theme_1.default.lineColor,
                    },
                    alignTick: true,
                    length: 5,
                    displayWithLabel: true,
                },
                subTickLine: {
                    // @type {Attrs} 标注坐标线的图形属性
                    style: {
                        lineWidth: 1,
                        stroke: theme_1.default.lineColor,
                    },
                    count: 4,
                    length: 2,
                },
                label: {
                    autoRotate: true,
                    autoHide: false,
                    autoEllipsis: false,
                    style: {
                        fontSize: 12,
                        fill: theme_1.default.textColor,
                        fontFamily: theme_1.default.fontFamily,
                        fontWeight: 'normal',
                    },
                    offset: 10,
                    offsetX: 0,
                    offsetY: 0,
                },
                title: {
                    autoRotate: true,
                    spacing: 5,
                    position: 'center',
                    style: {
                        fontSize: 12,
                        fill: theme_1.default.textColor,
                        textBaseline: 'middle',
                        fontFamily: theme_1.default.fontFamily,
                        textAlign: 'center',
                    },
                    iconStyle: {
                        fill: theme_1.default.descriptionIconFill,
                        stroke: theme_1.default.descriptionIconStroke,
                    },
                    description: ''
                },
                tickStates: {
                    active: {
                        labelStyle: {
                            fontWeight: 500,
                        },
                        tickLineStyle: {
                            lineWidth: 2,
                        },
                    },
                    inactive: {
                        labelStyle: {
                            fill: theme_1.default.uncheckedColor,
                        },
                    },
                },
                // 针对大数据量进行优化配置
                optimize: {
                    enable: true,
                    threshold: 400,
                },
            }, theme: {} });
    };
    /**
     * 绘制组件
     */
    AxisBase.prototype.renderInner = function (group) {
        if (this.get('line')) {
            this.drawLine(group);
        }
        // drawTicks 包括 drawLabels 和 drawTickLines
        this.drawTicks(group);
        if (this.get('title')) {
            this.drawTitle(group);
        }
    };
    // 实现 IList 接口
    AxisBase.prototype.isList = function () {
        return true;
    };
    /**
     * 获取图例项
     * @return {ListItem[]} 列表项集合
     */
    AxisBase.prototype.getItems = function () {
        return this.get('ticks');
    };
    /**
     * 设置列表项
     * @param {ListItem[]} items 列表项集合
     */
    AxisBase.prototype.setItems = function (items) {
        this.update({
            ticks: items,
        });
    };
    /**
     * 更新列表项
     * @param {ListItem} item 列表项
     * @param {object}   cfg  列表项
     */
    AxisBase.prototype.updateItem = function (item, cfg) {
        util_1.mix(item, cfg);
        this.clear(); // 由于单个图例项变化，会引起全局变化，所以全部更新
        this.render();
    };
    /**
     * 清空列表
     */
    AxisBase.prototype.clearItems = function () {
        var itemGroup = this.getElementByLocalId('label-group');
        itemGroup && itemGroup.clear();
    };
    /**
     * 设置列表项的状态
     * @param {ListItem} item  列表项
     * @param {string}   state 状态名
     * @param {boolean}  value 状态值, true, false
     */
    AxisBase.prototype.setItemState = function (item, state, value) {
        item[state] = value;
        this.updateTickStates(item); // 应用状态样式
    };
    /**
     * 是否存在指定的状态
     * @param {ListItem} item  列表项
     * @param {boolean} state 状态名
     */
    AxisBase.prototype.hasState = function (item, state) {
        return !!item[state];
    };
    AxisBase.prototype.getItemStates = function (item) {
        var tickStates = this.get('tickStates');
        var rst = [];
        util_1.each(tickStates, function (v, k) {
            if (item[k]) {
                // item.selected
                rst.push(k);
            }
        });
        return rst;
    };
    /**
     * 清楚所有列表项的状态
     * @param {string} state 状态值
     */
    AxisBase.prototype.clearItemsState = function (state) {
        var _this = this;
        var items = this.getItemsByState(state);
        util_1.each(items, function (item) {
            _this.setItemState(item, state, false);
        });
    };
    /**
     * 根据状态获取图例项
     * @param  {string}     state [description]
     * @return {ListItem[]}       [description]
     */
    AxisBase.prototype.getItemsByState = function (state) {
        var _this = this;
        var items = this.getItems();
        return util_1.filter(items, function (item) {
            return _this.hasState(item, state);
        });
    };
    AxisBase.prototype.getSidePoint = function (point, offset) {
        var self = this;
        var vector = self.getSideVector(offset, point);
        return {
            x: point.x + vector[0],
            y: point.y + vector[1],
        };
    };
    AxisBase.prototype.getTextAnchor = function (vector) {
        var align;
        if (util_1.isNumberEqual(vector[0], 0)) {
            align = 'center';
        }
        else if (vector[0] > 0) {
            align = 'start';
        }
        else if (vector[0] < 0) {
            align = 'end';
        }
        return align;
    };
    AxisBase.prototype.getTextBaseline = function (vector) {
        var base;
        if (util_1.isNumberEqual(vector[1], 0)) {
            base = 'middle';
        }
        else if (vector[1] > 0) {
            base = 'top';
        }
        else if (vector[1] < 0) {
            base = 'bottom';
        }
        return base;
    };
    AxisBase.prototype.processOverlap = function (labelGroup) { };
    // 绘制坐标轴线
    AxisBase.prototype.drawLine = function (group) {
        var path = this.getLinePath();
        var line = this.get('line'); // line 的判空在调用 drawLine 之前，不在这里判定
        this.addShape(group, {
            type: 'path',
            id: this.getElementId('line'),
            name: 'axis-line',
            attrs: util_1.mix({
                path: path,
            }, line.style),
        });
    };
    AxisBase.prototype.getTickLineItems = function (ticks) {
        var _this = this;
        var tickLineItems = [];
        var tickLine = this.get('tickLine');
        var alignTick = tickLine.alignTick;
        var tickLineLength = tickLine.length;
        var tickSegment = 1;
        var tickCount = ticks.length;
        if (tickCount >= 2) {
            tickSegment = ticks[1].value - ticks[0].value;
        }
        util_1.each(ticks, function (tick) {
            var point = tick.point;
            if (!alignTick) {
                // tickLine 不同 tick 对齐时需要调整 point
                point = _this.getTickPoint(tick.value - tickSegment / 2);
            }
            var endPoint = _this.getSidePoint(point, tickLineLength);
            tickLineItems.push({
                startPoint: point,
                tickValue: tick.value,
                endPoint: endPoint,
                tickId: tick.id,
                id: "tickline-" + tick.id,
            });
        });
        // 如果 tickLine 不居中对齐，则需要在最后面补充一个 tickLine
        // if (!alignTick && tickCount > 0) {
        //   const tick = ticks[tickCount - 1];
        //   const point = this.getTickPoint(tick.value + tickSegment / 2);
        // }
        return tickLineItems;
    };
    AxisBase.prototype.getSubTickLineItems = function (tickLineItems) {
        var subTickLineItems = [];
        var subTickLine = this.get('subTickLine');
        var subCount = subTickLine.count;
        var tickLineCount = tickLineItems.length;
        // 刻度线的数量大于 2 时，才绘制子刻度
        if (tickLineCount >= 2) {
            for (var i = 0; i < tickLineCount - 1; i++) {
                var pre = tickLineItems[i];
                var next = tickLineItems[i + 1];
                for (var j = 0; j < subCount; j++) {
                    var percent = (j + 1) / (subCount + 1);
                    var tickValue = (1 - percent) * pre.tickValue + percent * next.tickValue;
                    var point = this.getTickPoint(tickValue);
                    var endPoint = this.getSidePoint(point, subTickLine.length);
                    subTickLineItems.push({
                        startPoint: point,
                        endPoint: endPoint,
                        tickValue: tickValue,
                        id: "sub-" + pre.id + "-" + j,
                    });
                }
            }
        }
        return subTickLineItems;
    };
    AxisBase.prototype.getTickLineAttrs = function (tickItem, type, index, tickItems) {
        var style = this.get(type).style;
        // 保持和 grid 相同的数据结构
        var item = {
            points: [tickItem.startPoint, tickItem.endPoint],
        };
        var defaultTickLineStyle = util_1.get(this.get('theme'), ['tickLine', 'style'], {});
        style = util_1.isFunction(style) ? util_1.mix({}, defaultTickLineStyle, style(item, index, tickItems)) : style;
        var startPoint = tickItem.startPoint, endPoint = tickItem.endPoint;
        return tslib_1.__assign({ x1: startPoint.x, y1: startPoint.y, x2: endPoint.x, y2: endPoint.y }, style);
    };
    // 绘制坐标轴刻度线
    AxisBase.prototype.drawTick = function (tickItem, tickLineGroup, type, index, tickItems) {
        this.addShape(tickLineGroup, {
            type: 'line',
            id: this.getElementId(tickItem.id),
            name: "axis-" + type,
            attrs: this.getTickLineAttrs(tickItem, type, index, tickItems),
        });
    };
    // 绘制坐标轴刻度线，包括子刻度线
    AxisBase.prototype.drawTickLines = function (group) {
        var _this = this;
        var ticks = this.get('ticks');
        var subTickLine = this.get('subTickLine');
        var tickLineItems = this.getTickLineItems(ticks);
        var tickLineGroup = this.addGroup(group, {
            name: 'axis-tickline-group',
            id: this.getElementId('tickline-group'),
        });
        var tickCfg = this.get('tickLine');
        util_1.each(tickLineItems, function (item, index) {
            if (tickCfg.displayWithLabel) {
                // 如果跟随 label 显示，则检测是否存在对应的 label
                var labelId = _this.getElementId("label-" + item.tickId);
                if (group.findById(labelId)) {
                    _this.drawTick(item, tickLineGroup, 'tickLine', index, tickLineItems);
                }
            }
            else {
                _this.drawTick(item, tickLineGroup, 'tickLine', index, tickLineItems);
            }
        });
        if (subTickLine) {
            var subTickLineItems_1 = this.getSubTickLineItems(tickLineItems);
            util_1.each(subTickLineItems_1, function (item, index) {
                _this.drawTick(item, tickLineGroup, 'subTickLine', index, subTickLineItems_1);
            });
        }
    };
    // 预处理 ticks 确定位置和补充 id
    AxisBase.prototype.processTicks = function () {
        var _this = this;
        var ticks = this.get('ticks');
        util_1.each(ticks, function (tick) {
            tick.point = _this.getTickPoint(tick.value);
            // 补充 tick 的 id，为动画和更新做准备
            if (util_1.isNil(tick.id)) {
                // 默认使用 tick.name 作为id
                tick.id = tick.name;
            }
        });
    };
    // 绘制 ticks 包括文本和 tickLine
    AxisBase.prototype.drawTicks = function (group) {
        var _this = this;
        this.optimizeTicks();
        this.processTicks();
        if (this.get('label')) {
            this.drawLabels(group);
        }
        if (this.get('tickLine')) {
            this.drawTickLines(group);
        }
        var ticks = this.get('ticks');
        util_1.each(ticks, function (tick) {
            _this.applyTickStates(tick, group);
        });
    };
    /**
     * 根据 optimize 配置对 ticks 进行抽样，对抽样过后的 ticks 才进行真实的渲染
     */
    AxisBase.prototype.optimizeTicks = function () {
        var optimize = this.get('optimize');
        var ticks = this.get('ticks');
        if (optimize && optimize.enable && optimize.threshold > 0) {
            var len = util_1.size(ticks);
            if (len > optimize.threshold) {
                var page_1 = Math.ceil(len / optimize.threshold);
                var optimizedTicks = ticks.filter(function (tick, idx) { return idx % page_1 === 0; });
                this.set('ticks', optimizedTicks);
                this.set('originalTicks', ticks);
            }
        }
    };
    // 获取 label 的配置项
    AxisBase.prototype.getLabelAttrs = function (tick, index, ticks) {
        var labelCfg = this.get('label');
        var offset = labelCfg.offset, offsetX = labelCfg.offsetX, offsetY = labelCfg.offsetY, rotate = labelCfg.rotate, formatter = labelCfg.formatter;
        var point = this.getSidePoint(tick.point, offset);
        var vector = this.getSideVector(offset, point);
        var text = formatter ? formatter(tick.name, tick, index) : tick.name;
        var style = labelCfg.style;
        style = util_1.isFunction(style) ? util_1.get(this.get('theme'), ['label', 'style'], {}) : style;
        var attrs = util_1.mix({
            x: point.x + offsetX,
            y: point.y + offsetY,
            text: text,
            textAlign: this.getTextAnchor(vector),
            textBaseline: this.getTextBaseline(vector),
        }, style);
        if (rotate) {
            attrs.matrix = matrix_1.getMatrixByAngle(point, rotate);
        }
        return attrs;
    };
    // 绘制文本
    AxisBase.prototype.drawLabels = function (group) {
        var _this = this;
        var ticks = this.get('ticks');
        var labelGroup = this.addGroup(group, {
            name: 'axis-label-group',
            id: this.getElementId('label-group'),
        });
        util_1.each(ticks, function (tick, index) {
            _this.addShape(labelGroup, {
                type: 'text',
                name: 'axis-label',
                id: _this.getElementId("label-" + tick.id),
                attrs: _this.getLabelAttrs(tick, index, ticks),
                delegateObject: {
                    tick: tick,
                    item: tick,
                    index: index,
                },
            });
        });
        this.processOverlap(labelGroup);
        // 处理完后再进行 style 回调处理
        var labels = labelGroup.getChildren();
        var defaultLabelStyle = util_1.get(this.get('theme'), ['label', 'style'], {});
        var _a = this.get('label'), style = _a.style, formatter = _a.formatter;
        if (util_1.isFunction(style)) {
            var afterProcessTicks_1 = labels.map(function (label) { return util_1.get(label.get('delegateObject'), 'tick'); });
            util_1.each(labels, function (label, index) {
                var tick = label.get('delegateObject').tick;
                var text = formatter ? formatter(tick.name, tick, index) : tick.name;
                var newStyle = util_1.mix({}, defaultLabelStyle, style(text, index, afterProcessTicks_1));
                label.attr(newStyle);
            });
        }
    };
    // 标题的属性
    AxisBase.prototype.getTitleAttrs = function () {
        var titleCfg = this.get('title');
        var style = titleCfg.style, position = titleCfg.position, offset = titleCfg.offset, _a = titleCfg.spacing, spacing = _a === void 0 ? 0 : _a, autoRotate = titleCfg.autoRotate;
        var titleHeight = style.fontSize;
        var percent = 0.5;
        if (position === 'start') {
            percent = 0;
        }
        else if (position === 'end') {
            percent = 1;
        }
        var point = this.getTickPoint(percent); // 标题对应的坐标轴上的点
        // 如果没有指定 titleOffset 也没有渲染 label，这里需要自动计算 offset
        var titlePoint = this.getSidePoint(point, offset || spacing + titleHeight / 2); // 标题的点
        var attrs = util_1.mix({
            x: titlePoint.x,
            y: titlePoint.y,
            text: titleCfg.text,
        }, style);
        var rotate = titleCfg.rotate; // rotate 是角度值
        var angle = rotate;
        if (util_1.isNil(rotate) && autoRotate) {
            // 用户没有设定旋转角度，同时设置自动旋转
            var vector = this.getAxisVector(point);
            var v1 = [1, 0]; // 水平方向的向量
            angle = matrix_util_1.ext.angleTo(vector, v1, true);
        }
        if (angle) {
            var matrix = matrix_1.getMatrixByAngle(titlePoint, angle);
            attrs.matrix = matrix;
        }
        return attrs;
    };
    // 绘制标题
    AxisBase.prototype.drawTitle = function (group) {
        var _a;
        var titleAttrs = this.getTitleAttrs();
        var titleShape = this.addShape(group, {
            type: 'text',
            id: this.getElementId('title'),
            name: 'axis-title',
            attrs: titleAttrs
        });
        // description字段存在时，显示icon
        if ((_a = this.get('title')) === null || _a === void 0 ? void 0 : _a.description) {
            this.drawDescriptionIcon(group, titleShape, titleAttrs.matrix);
        }
    };
    AxisBase.prototype.drawDescriptionIcon = function (group, titleShape, matrix) {
        var descriptionShape = this.addGroup(group, {
            name: 'axis-description',
            id: this.getElementById('description')
        });
        var _a = titleShape.getBBox(), maxX = _a.maxX, maxY = _a.maxY, height = _a.height;
        var iconStyle = this.get('title').iconStyle;
        var spacing = 4; // 设置icon与文本之间距离
        var r = height / 2;
        var lineWidth = r / 6;
        var startX = maxX + spacing;
        var startY = maxY - height / 2;
        // 绘制 information icon 路径
        // 外圆环path
        var _b = [startX + r, startY - r], x0 = _b[0], y0 = _b[1];
        var _c = [x0 + r, y0 + r], x1 = _c[0], y1 = _c[1];
        var _d = [x0, y1 + r], x2 = _d[0], y2 = _d[1];
        var _e = [startX, y0 + r], x3 = _e[0], y3 = _e[1];
        // i path
        var _f = [startX + r, startY - height / 4], x4 = _f[0], y4 = _f[1];
        var _g = [x4, y4 + lineWidth], x5 = _g[0], y5 = _g[1];
        var _h = [x5, y5 + lineWidth], x6 = _h[0], y6 = _h[1];
        var _j = [x6, y6 + r * 3 / 4], x7 = _j[0], y7 = _j[1];
        this.addShape(descriptionShape, {
            type: 'path',
            id: this.getElementId('title-description-icon'),
            name: 'axis-title-description-icon',
            attrs: tslib_1.__assign({ path: [
                    ['M', x0, y0],
                    ['A', r, r, 0, 0, 1, x1, y1],
                    ['A', r, r, 0, 0, 1, x2, y2],
                    ['A', r, r, 0, 0, 1, x3, y3],
                    ['A', r, r, 0, 0, 1, x0, y0],
                    ['M', x4, y4],
                    ['L', x5, y5],
                    ['M', x6, y6],
                    ['L', x7, y7]
                ], lineWidth: lineWidth,
                matrix: matrix }, iconStyle),
        });
        // 点击热区，设置透明矩形
        this.addShape(descriptionShape, {
            type: 'rect',
            id: this.getElementId('title-description-rect'),
            name: 'axis-title-description-rect',
            attrs: {
                x: startX,
                y: startY - height / 2,
                width: height,
                height: height,
                stroke: '#000',
                fill: '#000',
                opacity: 0,
                matrix: matrix,
                cursor: 'pointer'
            }
        });
    };
    AxisBase.prototype.applyTickStates = function (tick, group) {
        var states = this.getItemStates(tick);
        if (states.length) {
            var tickStates = this.get('tickStates');
            // 分别更新 label 和 tickLine
            var labelId = this.getElementId("label-" + tick.id);
            var labelShape = group.findById(labelId);
            if (labelShape) {
                var labelStateStyle = state_1.getStatesStyle(tick, 'label', tickStates);
                labelStateStyle && labelShape.attr(labelStateStyle);
            }
            var tickLineId = this.getElementId("tickline-" + tick.id);
            var tickLineShape = group.findById(tickLineId);
            if (tickLineShape) {
                var tickLineStateStyle = state_1.getStatesStyle(tick, 'tickLine', tickStates);
                tickLineStateStyle && tickLineShape.attr(tickLineStateStyle);
            }
        }
    };
    AxisBase.prototype.updateTickStates = function (tick) {
        var states = this.getItemStates(tick);
        var tickStates = this.get('tickStates');
        var labelCfg = this.get('label');
        var labelShape = this.getElementByLocalId("label-" + tick.id);
        var tickLineCfg = this.get('tickLine');
        var tickLineShape = this.getElementByLocalId("tickline-" + tick.id);
        if (states.length) {
            if (labelShape) {
                var labelStateStyle = state_1.getStatesStyle(tick, 'label', tickStates);
                labelStateStyle && labelShape.attr(labelStateStyle);
            }
            if (tickLineShape) {
                var tickLineStateStyle = state_1.getStatesStyle(tick, 'tickLine', tickStates);
                tickLineStateStyle && tickLineShape.attr(tickLineStateStyle);
            }
        }
        else {
            if (labelShape) {
                labelShape.attr(labelCfg.style);
            }
            if (tickLineShape) {
                tickLineShape.attr(tickLineCfg.style);
            }
        }
    };
    return AxisBase;
}(group_component_1.default));
exports.default = AxisBase;
//# sourceMappingURL=base.js.map