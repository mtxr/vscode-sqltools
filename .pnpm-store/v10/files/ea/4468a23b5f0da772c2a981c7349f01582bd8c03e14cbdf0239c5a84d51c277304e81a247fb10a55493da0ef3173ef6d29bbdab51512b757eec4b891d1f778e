import { __assign, __extends, __spreadArrays } from "tslib";
import { clone, isFunction, mix, upperFirst } from '@antv/util';
import Theme from '../util/theme';
import { getValueByPercent } from '../util/util';
import LegendBase from './base';
var HANDLER_HEIGHT_RATIO = 1.4;
var HANDLER_TRIANGLE_RATIO = 0.4;
var ContinueLegend = /** @class */ (function (_super) {
    __extends(ContinueLegend, _super);
    function ContinueLegend() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContinueLegend.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { type: 'continue', min: 0, max: 100, value: null, colors: [], track: {}, rail: {}, label: {}, handler: {}, slidable: true, tip: null, step: null, maxWidth: null, maxHeight: null, defaultCfg: {
                label: {
                    align: 'rail',
                    spacing: 5,
                    formatter: null,
                    style: {
                        fontSize: 12,
                        fill: Theme.textColor,
                        textBaseline: 'middle',
                        fontFamily: Theme.fontFamily,
                    },
                },
                handler: {
                    size: 10,
                    style: {
                        fill: '#fff',
                        stroke: '#333',
                    },
                },
                track: {},
                rail: {
                    type: 'color',
                    size: 20,
                    defaultLength: 100,
                    style: {
                        fill: '#DCDEE2',
                    },
                },
                title: {
                    spacing: 5,
                    style: {
                        fill: Theme.textColor,
                        fontSize: 12,
                        textAlign: 'start',
                        textBaseline: 'top',
                    },
                },
            } });
    };
    ContinueLegend.prototype.isSlider = function () {
        return true;
    };
    // 实现 IList 接口
    ContinueLegend.prototype.getValue = function () {
        return this.getCurrentValue();
    };
    ContinueLegend.prototype.getRange = function () {
        return {
            min: this.get('min'),
            max: this.get('max'),
        };
    };
    // 改变 range
    ContinueLegend.prototype.setRange = function (min, max) {
        this.update({
            min: min,
            max: max,
        });
    };
    ContinueLegend.prototype.setValue = function (value) {
        var originValue = this.getValue();
        this.set('value', value);
        var group = this.get('group');
        this.resetTrackClip();
        if (this.get('slidable')) {
            this.resetHandlers(group);
        }
        this.delegateEmit('valuechanged', {
            originValue: originValue,
            value: value,
        });
    };
    ContinueLegend.prototype.initEvent = function () {
        var group = this.get('group');
        this.bindSliderEvent(group);
        this.bindRailEvent(group);
        this.bindTrackEvent(group);
    };
    ContinueLegend.prototype.drawLegendContent = function (group) {
        this.drawRail(group);
        this.drawLabels(group);
        this.fixedElements(group); // 调整各个图形位置，适应宽高的限制
        this.resetTrack(group);
        this.resetTrackClip(group);
        if (this.get('slidable')) {
            this.resetHandlers(group);
        }
    };
    ContinueLegend.prototype.bindSliderEvent = function (group) {
        this.bindHandlersEvent(group);
    };
    ContinueLegend.prototype.bindHandlersEvent = function (group) {
        var _this = this;
        group.on('legend-handler-min:drag', function (ev) {
            var minValue = _this.getValueByCanvasPoint(ev.x, ev.y);
            var currentValue = _this.getCurrentValue();
            var maxValue = currentValue[1];
            if (maxValue < minValue) {
                // 如果小于最小值，则调整最小值
                maxValue = minValue;
            }
            _this.setValue([minValue, maxValue]);
        });
        group.on('legend-handler-max:drag', function (ev) {
            var maxValue = _this.getValueByCanvasPoint(ev.x, ev.y);
            var currentValue = _this.getCurrentValue();
            var minValue = currentValue[0];
            if (minValue > maxValue) {
                // 如果小于最小值，则调整最小值
                minValue = maxValue;
            }
            _this.setValue([minValue, maxValue]);
        });
    };
    ContinueLegend.prototype.bindRailEvent = function (group) { };
    ContinueLegend.prototype.bindTrackEvent = function (group) {
        var _this = this;
        var prePoint = null;
        group.on('legend-track:dragstart', function (ev) {
            prePoint = {
                x: ev.x,
                y: ev.y,
            };
        });
        group.on('legend-track:drag', function (ev) {
            if (!prePoint) {
                return;
            }
            var preValue = _this.getValueByCanvasPoint(prePoint.x, prePoint.y);
            var curValue = _this.getValueByCanvasPoint(ev.x, ev.y);
            var currentValue = _this.getCurrentValue();
            var curDiff = currentValue[1] - currentValue[0];
            var range = _this.getRange();
            var dValue = curValue - preValue;
            if (dValue < 0) {
                // 减小, 同时未出边界
                if (currentValue[0] + dValue > range.min) {
                    _this.setValue([currentValue[0] + dValue, currentValue[1] + dValue]);
                }
                else {
                    _this.setValue([range.min, range.min + curDiff]);
                }
                //  && ||
            }
            else if (dValue > 0) {
                if (dValue > 0 && currentValue[1] + dValue < range.max) {
                    _this.setValue([currentValue[0] + dValue, currentValue[1] + dValue]);
                }
                else {
                    _this.setValue([range.max - curDiff, range.max]);
                }
            }
            prePoint = {
                x: ev.x,
                y: ev.y,
            };
        });
        group.on('legend-track:dragend', function (ev) {
            prePoint = null;
        });
    };
    ContinueLegend.prototype.drawLabels = function (group) {
        this.drawLabel('min', group);
        this.drawLabel('max', group);
    };
    ContinueLegend.prototype.drawLabel = function (name, group) {
        var labelCfg = this.get('label');
        var style = labelCfg.style;
        var labelAlign = labelCfg.align;
        var labelFormatter = labelCfg.formatter;
        var value = this.get(name);
        var alignAttrs = this.getLabelAlignAttrs(name, labelAlign);
        var localId = "label-" + name;
        this.addShape(group, {
            type: 'text',
            id: this.getElementId(localId),
            name: "legend-label-" + name,
            attrs: __assign(__assign({ x: 0, y: 0, text: isFunction(labelFormatter) ? labelFormatter(value) : value }, style), alignAttrs),
        });
    };
    // 获取文本的对齐方式，为了自适应真实操碎了心
    ContinueLegend.prototype.getLabelAlignAttrs = function (name, align) {
        var isVertical = this.isVertical();
        var textAlign = 'center';
        var textBaseline = 'middle';
        if (isVertical) {
            // 垂直布局的所有的文本都左对齐
            textAlign = 'start';
            if (align !== 'rail') {
                if (name === 'min') {
                    textBaseline = 'top';
                }
                else {
                    textBaseline = 'bottom';
                }
            }
            else {
                textBaseline = 'top';
            }
        }
        else {
            if (align !== 'rail') {
                textBaseline = 'top';
                if (name === 'min') {
                    textAlign = 'start';
                }
                else {
                    textAlign = 'end';
                }
            }
            else {
                textAlign = 'start';
                textBaseline = 'middle';
            }
        }
        return {
            textAlign: textAlign,
            textBaseline: textBaseline,
        };
    };
    ContinueLegend.prototype.getRailPath = function (x, y, w, h) {
        var railCfg = this.get('rail');
        var size = railCfg.size, defaultLength = railCfg.defaultLength, type = railCfg.type;
        var isVertical = this.isVertical();
        var length = defaultLength;
        var width = w;
        var height = h;
        if (!width) {
            width = isVertical ? size : length;
        }
        if (!height) {
            height = isVertical ? length : size;
        }
        var path = [];
        if (type === 'color') {
            path.push(['M', x, y]);
            path.push(['L', x + width, y]);
            path.push(['L', x + width, y + height]);
            path.push(['L', x, y + height]);
            path.push(['Z']);
        }
        else {
            path.push(['M', x + width, y]);
            path.push(['L', x + width, y + height]);
            path.push(['L', x, y + height]);
            path.push(['Z']);
        }
        return path;
    };
    ContinueLegend.prototype.drawRail = function (group) {
        var railCfg = this.get('rail');
        var style = railCfg.style;
        this.addShape(group, {
            type: 'path',
            id: this.getElementId('rail'),
            name: 'legend-rail',
            attrs: __assign({ path: this.getRailPath(0, 0) }, style),
        });
    };
    // 将传入的颜色转换成渐变色
    ContinueLegend.prototype.getTrackColor = function (colors) {
        var count = colors.length;
        if (!count) {
            return null;
        }
        if (count === 1) {
            return colors[0];
        }
        var color; // 最终形态 l(0) 0:colors[0] 0.5:colors[1] 1:colors[2];
        if (this.isVertical()) {
            // 根据方向设置渐变方向
            color = 'l(90)';
        }
        else {
            color = 'l(0)';
        }
        for (var i = 0; i < count; i++) {
            var percent = i / (count - 1);
            color += " " + percent + ":" + colors[i];
        }
        return color;
    };
    ContinueLegend.prototype.getTrackPath = function (group) {
        var railShape = this.getRailShape(group);
        var path = railShape.attr('path');
        return clone(path);
    };
    ContinueLegend.prototype.getClipTrackAttrs = function (group) {
        var value = this.getCurrentValue();
        var min = value[0], max = value[1];
        var railBBox = this.getRailBBox(group);
        var startPoint = this.getPointByValue(min, group);
        var endPoint = this.getPointByValue(max, group);
        var isVertical = this.isVertical();
        var x;
        var y;
        var width;
        var height;
        if (isVertical) {
            x = railBBox.minX;
            y = startPoint.y;
            width = railBBox.width;
            height = endPoint.y - startPoint.y;
        }
        else {
            x = startPoint.x;
            y = railBBox.minY;
            width = endPoint.x - startPoint.x;
            height = railBBox.height;
        }
        return {
            x: x,
            y: y,
            width: width,
            height: height,
        };
    };
    // 获取 track 的属性，由 path 和 颜色构成
    ContinueLegend.prototype.getTrackAttrs = function (group) {
        var trackCfg = this.get('track');
        var colors = this.get('colors');
        var path = this.getTrackPath(group);
        return mix({
            path: path,
            fill: this.getTrackColor(colors),
        }, trackCfg.style);
    };
    ContinueLegend.prototype.resetTrackClip = function (group) {
        var container = group || this.get('group');
        var trackId = this.getElementId('track');
        var trackShape = container.findById(trackId);
        var clipShape = trackShape.getClip();
        var attrs = this.getClipTrackAttrs(group);
        if (!clipShape) {
            trackShape.setClip({
                type: 'rect',
                attrs: attrs,
            });
        }
        else {
            clipShape.attr(attrs);
        }
    };
    ContinueLegend.prototype.resetTrack = function (group) {
        var trackId = this.getElementId('track');
        var trackShape = group.findById(trackId);
        var trackAttrs = this.getTrackAttrs(group);
        if (trackShape) {
            trackShape.attr(trackAttrs);
        }
        else {
            this.addShape(group, {
                type: 'path',
                id: trackId,
                draggable: this.get('slidable'),
                name: 'legend-track',
                attrs: trackAttrs,
            });
        }
    };
    ContinueLegend.prototype.getPointByValue = function (value, group) {
        var _a = this.getRange(), min = _a.min, max = _a.max;
        var percent = (value - min) / (max - min);
        var bbox = this.getRailBBox(group);
        var isVertcal = this.isVertical();
        var point = { x: 0, y: 0 };
        if (isVertcal) {
            point.x = bbox.minX + bbox.width / 2;
            point.y = getValueByPercent(bbox.minY, bbox.maxY, percent);
        }
        else {
            point.x = getValueByPercent(bbox.minX, bbox.maxX, percent);
            point.y = bbox.minY + bbox.height / 2;
        }
        return point;
    };
    ContinueLegend.prototype.getRailShape = function (group) {
        var container = group || this.get('group');
        return container.findById(this.getElementId('rail'));
    };
    // 获取滑轨的宽高信息
    ContinueLegend.prototype.getRailBBox = function (group) {
        var railShape = this.getRailShape(group);
        var bbox = railShape.getBBox();
        return bbox;
    };
    ContinueLegend.prototype.getRailCanvasBBox = function () {
        var container = this.get('group');
        var railShape = container.findById(this.getElementId('rail'));
        var bbox = railShape.getCanvasBBox();
        return bbox;
    };
    // 是否垂直
    ContinueLegend.prototype.isVertical = function () {
        return this.get('layout') === 'vertical';
    };
    // 用于交互时
    ContinueLegend.prototype.getValueByCanvasPoint = function (x, y) {
        var _a = this.getRange(), min = _a.min, max = _a.max;
        var bbox = this.getRailCanvasBBox(); // 因为 x, y 是画布坐标
        var isVertcal = this.isVertical();
        var step = this.get('step');
        var percent;
        if (isVertcal) {
            // 垂直时计算 y
            percent = (y - bbox.minY) / bbox.height;
        }
        else {
            // 水平时计算 x
            percent = (x - bbox.minX) / bbox.width;
        }
        var value = getValueByPercent(min, max, percent);
        if (step) {
            var count = Math.round((value - min) / step);
            value = min + count * step; // 移动到最近的
        }
        if (value > max) {
            value = max;
        }
        if (value < min) {
            value = min;
        }
        return value;
    };
    // 当前选中的范围
    ContinueLegend.prototype.getCurrentValue = function () {
        var value = this.get('value');
        if (!value) {
            var values = this.get('values');
            if (!values) {
                return [this.get('min'), this.get('max')];
            }
            // 如果没有定义，取最大范围  最小值 为 values 中的最小值， 如果最小值 超过了 定义的最大值 则 做限制  最大值 反之
            return [Math.max(Math.min.apply(Math, __spreadArrays(values, [this.get('max')])), this.get('min')), Math.min(Math.max.apply(Math, __spreadArrays(values, [this.get('min')])), this.get('max'))];
        }
        return value;
    };
    // 重置滑块 handler
    ContinueLegend.prototype.resetHandlers = function (group) {
        var currentValue = this.getCurrentValue();
        var min = currentValue[0], max = currentValue[1];
        this.resetHandler(group, 'min', min);
        this.resetHandler(group, 'max', max);
    };
    // 获取滑块的 path
    ContinueLegend.prototype.getHandlerPath = function (handlerCfg, point) {
        var isVertical = this.isVertical();
        var path = [];
        var width = handlerCfg.size;
        var x = point.x, y = point.y;
        var height = width * HANDLER_HEIGHT_RATIO;
        var halfWidth = width / 2;
        var oneSixthWidth = width / 6;
        if (isVertical) {
            /**
             * 竖直情况下的滑块 handler，左侧顶点是 x,y
             *  /----|
             *    -- |
             *    -- |
             *  \----|
             */
            var triangleX = x + height * HANDLER_TRIANGLE_RATIO;
            path.push(['M', x, y]);
            path.push(['L', triangleX, y + halfWidth]);
            path.push(['L', x + height, y + halfWidth]);
            path.push(['L', x + height, y - halfWidth]);
            path.push(['L', triangleX, y - halfWidth]);
            path.push(['Z']);
            // 绘制两条横线
            path.push(['M', triangleX, y + oneSixthWidth]);
            path.push(['L', x + height - 2, y + oneSixthWidth]);
            path.push(['M', triangleX, y - oneSixthWidth]);
            path.push(['L', x + height - 2, y - oneSixthWidth]);
        }
        else {
            /**
             * 水平情况下的滑块，上面顶点处是 x,y
             *  /   \
             * | | | |
             * | | | |
             *  -----
             */
            var triangleY = y + height * HANDLER_TRIANGLE_RATIO;
            path.push(['M', x, y]);
            path.push(['L', x - halfWidth, triangleY]);
            path.push(['L', x - halfWidth, y + height]);
            path.push(['L', x + halfWidth, y + height]);
            path.push(['L', x + halfWidth, triangleY]);
            path.push(['Z']);
            // 绘制两条竖线
            path.push(['M', x - oneSixthWidth, triangleY]);
            path.push(['L', x - oneSixthWidth, y + height - 2]);
            path.push(['M', x + oneSixthWidth, triangleY]);
            path.push(['L', x + oneSixthWidth, y + height - 2]);
        }
        return path;
    };
    // 调整 handler 的位置，如果未存在则绘制
    ContinueLegend.prototype.resetHandler = function (group, name, value) {
        var point = this.getPointByValue(value, group);
        var handlerCfg = this.get('handler');
        var path = this.getHandlerPath(handlerCfg, point);
        var id = this.getElementId("handler-" + name);
        var handlerShape = group.findById(id);
        var isVertical = this.isVertical();
        if (handlerShape) {
            handlerShape.attr('path', path);
        }
        else {
            this.addShape(group, {
                type: 'path',
                name: "legend-handler-" + name,
                draggable: true,
                id: id,
                attrs: __assign(__assign({ path: path }, handlerCfg.style), { cursor: isVertical ? 'ns-resize' : 'ew-resize' }),
            });
        }
    };
    // 当设置了 maxWidth, maxHeight 时调整 rail 的宽度，
    // 文本的位置
    ContinueLegend.prototype.fixedElements = function (group) {
        var railShape = group.findById(this.getElementId('rail'));
        var minLabel = group.findById(this.getElementId('label-min'));
        var maxLabel = group.findById(this.getElementId('label-max'));
        var startPoint = this.getDrawPoint();
        if (this.isVertical()) {
            // 横向布局
            this.fixedVertail(minLabel, maxLabel, railShape, startPoint);
        }
        else {
            // 水平布局
            this.fixedHorizontal(minLabel, maxLabel, railShape, startPoint);
        }
    };
    ContinueLegend.prototype.fitRailLength = function (minLabelBBox, maxLabelBBox, railBBox, railShape) {
        var isVertical = this.isVertical();
        var lengthField = isVertical ? 'height' : 'width';
        var labelCfg = this.get('label');
        var labelAlign = labelCfg.align;
        var spacing = labelCfg.spacing;
        var maxLength = this.get("max" + upperFirst(lengthField)); // get('maxWidth')
        if (maxLength) {
            var elementsLength = labelAlign === 'rail'
                ? railBBox[lengthField] + minLabelBBox[lengthField] + maxLabelBBox[lengthField] + spacing * 2
                : railBBox[lengthField];
            var diff = elementsLength - maxLength;
            if (diff > 0) {
                // 大于限制的长度
                this.changeRailLength(railShape, lengthField, railBBox[lengthField] - diff);
            }
        }
    };
    ContinueLegend.prototype.changeRailLength = function (railShape, lengthField, length) {
        var bbox = railShape.getBBox();
        var path;
        if (lengthField === 'height') {
            path = this.getRailPath(bbox.x, bbox.y, bbox.width, length);
        }
        else {
            path = this.getRailPath(bbox.x, bbox.y, length, bbox.height);
        }
        railShape.attr('path', path);
    };
    ContinueLegend.prototype.changeRailPosition = function (railShape, x, y) {
        var bbox = railShape.getBBox();
        var path = this.getRailPath(x, y, bbox.width, bbox.height);
        railShape.attr('path', path);
    };
    ContinueLegend.prototype.fixedHorizontal = function (minLabel, maxLabel, railShape, startPoint) {
        var labelCfg = this.get('label');
        var labelAlign = labelCfg.align;
        var spacing = labelCfg.spacing;
        var railBBox = railShape.getBBox();
        var minLabelBBox = minLabel.getBBox();
        var maxLabelBBox = maxLabel.getBBox();
        var railHeight = railBBox.height; // 取 rail 的高度，作为高度
        this.fitRailLength(minLabelBBox, maxLabelBBox, railBBox, railShape);
        railBBox = railShape.getBBox();
        if (labelAlign === 'rail') {
            // 沿着 rail 方向
            minLabel.attr({
                x: startPoint.x,
                y: startPoint.y + railHeight / 2,
            });
            this.changeRailPosition(railShape, startPoint.x + minLabelBBox.width + spacing, startPoint.y);
            maxLabel.attr({
                x: startPoint.x + minLabelBBox.width + railBBox.width + spacing * 2,
                y: startPoint.y + railHeight / 2,
            });
        }
        else if (labelAlign === 'top') {
            minLabel.attr({
                x: startPoint.x,
                y: startPoint.y,
            });
            maxLabel.attr({
                x: startPoint.x + railBBox.width,
                y: startPoint.y,
            });
            this.changeRailPosition(railShape, startPoint.x, startPoint.y + minLabelBBox.height + spacing);
        }
        else {
            this.changeRailPosition(railShape, startPoint.x, startPoint.y);
            minLabel.attr({
                x: startPoint.x,
                y: startPoint.y + railBBox.height + spacing,
            });
            maxLabel.attr({
                x: startPoint.x + railBBox.width,
                y: startPoint.y + railBBox.height + spacing,
            });
        }
    };
    ContinueLegend.prototype.fixedVertail = function (minLabel, maxLabel, railShape, startPoint) {
        var labelCfg = this.get('label');
        var labelAlign = labelCfg.align;
        var spacing = labelCfg.spacing;
        var railBBox = railShape.getBBox();
        var minLabelBBox = minLabel.getBBox();
        var maxLabelBBox = maxLabel.getBBox();
        this.fitRailLength(minLabelBBox, maxLabelBBox, railBBox, railShape);
        railBBox = railShape.getBBox();
        if (labelAlign === 'rail') {
            // 沿着 rail 方向
            minLabel.attr({
                x: startPoint.x,
                y: startPoint.y,
            });
            this.changeRailPosition(railShape, startPoint.x, startPoint.y + minLabelBBox.height + spacing);
            maxLabel.attr({
                x: startPoint.x,
                y: startPoint.y + minLabelBBox.height + railBBox.height + spacing * 2,
            });
        }
        else if (labelAlign === 'right') {
            minLabel.attr({
                x: startPoint.x + railBBox.width + spacing,
                y: startPoint.y,
            });
            this.changeRailPosition(railShape, startPoint.x, startPoint.y);
            maxLabel.attr({
                x: startPoint.x + railBBox.width + spacing,
                y: startPoint.y + railBBox.height,
            });
        }
        else {
            // left
            var maxLabelWidth = Math.max(minLabelBBox.width, maxLabelBBox.width);
            minLabel.attr({
                x: startPoint.x,
                y: startPoint.y,
            });
            this.changeRailPosition(railShape, startPoint.x + maxLabelWidth + spacing, startPoint.y);
            maxLabel.attr({
                x: startPoint.x,
                y: startPoint.y + railBBox.height,
            });
        }
    };
    return ContinueLegend;
}(LegendBase));
export default ContinueLegend;
//# sourceMappingURL=continuous.js.map