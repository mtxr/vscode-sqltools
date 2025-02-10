"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slider = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var group_component_1 = require("../abstract/group-component");
var trend_1 = require("../trend/trend");
var handler_1 = require("./handler");
var constant_1 = require("./constant");
var Slider = /** @class */ (function (_super) {
    tslib_1.__extends(Slider, _super);
    function Slider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onMouseDown = function (target) { return function (e) {
            _this.currentTarget = target;
            // 取出原生事件
            var event = e.originalEvent;
            // 2. 存储当前点击位置
            event.stopPropagation();
            event.preventDefault();
            // 兼容移动端获取数据
            _this.prevX = util_1.get(event, 'touches.0.pageX', event.pageX);
            _this.prevY = util_1.get(event, 'touches.0.pageY', event.pageY);
            // 3. 开始滑动的时候，绑定 move 和 up 事件
            var containerDOM = _this.getContainerDOM();
            containerDOM.addEventListener('mousemove', _this.onMouseMove);
            containerDOM.addEventListener('mouseup', _this.onMouseUp);
            containerDOM.addEventListener('mouseleave', _this.onMouseUp);
            // 移动端事件
            containerDOM.addEventListener('touchmove', _this.onMouseMove);
            containerDOM.addEventListener('touchend', _this.onMouseUp);
            containerDOM.addEventListener('touchcancel', _this.onMouseUp);
        }; };
        _this.onMouseMove = function (event) {
            var width = _this.cfg.width;
            var originValue = [_this.get('start'), _this.get('end')];
            // 滑动过程中，计算偏移，更新滑块，然后 emit 数据出去
            event.stopPropagation();
            event.preventDefault();
            var x = util_1.get(event, 'touches.0.pageX', event.pageX);
            var y = util_1.get(event, 'touches.0.pageY', event.pageY);
            // 横向的 slider 只处理 x
            var offsetX = x - _this.prevX;
            var offsetXRange = _this.adjustOffsetRange(offsetX / width);
            // 更新 start end range 范围
            _this.updateStartEnd(offsetXRange);
            // 更新 ui
            _this.updateUI(_this.getElementByLocalId('foreground'), _this.getElementByLocalId('minText'), _this.getElementByLocalId('maxText'));
            _this.prevX = x;
            _this.prevY = y;
            _this.draw();
            // 因为存储的 start、end 可能不一定是按大小存储的，所以排序一下，对外是 end >= start
            _this.emit(constant_1.SLIDER_CHANGE, [_this.get('start'), _this.get('end')].sort());
            _this.delegateEmit('valuechanged', {
                originValue: originValue,
                value: [_this.get('start'), _this.get('end')],
            });
        };
        _this.onMouseUp = function () {
            // 结束之后，取消绑定的事件
            if (_this.currentTarget) {
                _this.currentTarget = undefined;
            }
            var containerDOM = _this.getContainerDOM();
            if (containerDOM) {
                containerDOM.removeEventListener('mousemove', _this.onMouseMove);
                containerDOM.removeEventListener('mouseup', _this.onMouseUp);
                // 防止滑动到 canvas 外部之后，状态丢失
                containerDOM.removeEventListener('mouseleave', _this.onMouseUp);
                // 移动端事件
                containerDOM.removeEventListener('touchmove', _this.onMouseMove);
                containerDOM.removeEventListener('touchend', _this.onMouseUp);
                containerDOM.removeEventListener('touchcancel', _this.onMouseUp);
            }
        };
        return _this;
    }
    Slider.prototype.setRange = function (min, max) {
        this.set('minLimit', min);
        this.set('maxLimit', max);
        var oldStart = this.get('start');
        var oldEnd = this.get('end');
        var newStart = util_1.clamp(oldStart, min, max);
        var newEnd = util_1.clamp(oldEnd, min, max);
        if (!this.get('isInit') && (oldStart !== newStart || oldEnd !== newEnd)) {
            this.setValue([newStart, newEnd]);
        }
    };
    Slider.prototype.getRange = function () {
        return {
            min: this.get('minLimit') || 0,
            max: this.get('maxLimit') || 1,
        };
    };
    Slider.prototype.setValue = function (value) {
        var range = this.getRange();
        if (util_1.isArray(value) && value.length === 2) {
            var originValue = [this.get('start'), this.get('end')];
            this.update({
                start: util_1.clamp(value[0], range.min, range.max),
                end: util_1.clamp(value[1], range.min, range.max),
            });
            if (!this.get('updateAutoRender')) {
                this.render();
            }
            this.delegateEmit('valuechanged', {
                originValue: originValue,
                value: value,
            });
        }
    };
    Slider.prototype.getValue = function () {
        return [this.get('start'), this.get('end')];
    };
    Slider.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'slider', x: 0, y: 0, width: 100, height: 16, backgroundStyle: {}, foregroundStyle: {}, handlerStyle: {}, textStyle: {}, defaultCfg: {
                backgroundStyle: constant_1.BACKGROUND_STYLE,
                foregroundStyle: constant_1.FOREGROUND_STYLE,
                handlerStyle: constant_1.HANDLER_STYLE,
                textStyle: constant_1.TEXT_STYLE,
            } });
    };
    Slider.prototype.update = function (cfg) {
        var start = cfg.start, end = cfg.end;
        var validCfg = tslib_1.__assign({}, cfg);
        if (!util_1.isNil(start)) {
            validCfg.start = util_1.clamp(start, 0, 1);
        }
        if (!util_1.isNil(end)) {
            validCfg.end = util_1.clamp(end, 0, 1);
        }
        _super.prototype.update.call(this, validCfg);
        this.minHandler = this.getChildComponentById(this.getElementId('minHandler'));
        this.maxHandler = this.getChildComponentById(this.getElementId('maxHandler'));
        this.trend = this.getChildComponentById(this.getElementId('trend'));
    };
    Slider.prototype.init = function () {
        this.set('start', util_1.clamp(this.get('start'), 0, 1));
        this.set('end', util_1.clamp(this.get('end'), 0, 1));
        _super.prototype.init.call(this);
    };
    Slider.prototype.render = function () {
        _super.prototype.render.call(this);
        this.updateUI(this.getElementByLocalId('foreground'), this.getElementByLocalId('minText'), this.getElementByLocalId('maxText'));
    };
    Slider.prototype.renderInner = function (group) {
        var _a = this.cfg, start = _a.start, end = _a.end, width = _a.width, height = _a.height, _b = _a.trendCfg, trendCfg = _b === void 0 ? {} : _b, minText = _a.minText, maxText = _a.maxText, _c = _a.backgroundStyle, backgroundStyle = _c === void 0 ? {} : _c, _d = _a.foregroundStyle, foregroundStyle = _d === void 0 ? {} : _d, _e = _a.textStyle, textStyle = _e === void 0 ? {} : _e;
        var handlerStyle = util_1.deepMix({}, handler_1.DEFAULT_HANDLER_STYLE, this.cfg.handlerStyle);
        var min = start * width;
        var max = end * width;
        // 趋势图数据
        if (util_1.size(util_1.get(trendCfg, 'data'))) {
            this.trend = this.addComponent(group, tslib_1.__assign({ component: trend_1.Trend, id: this.getElementId('trend'), x: 0, y: 0, width: width,
                height: height }, trendCfg));
        }
        // 1. 背景
        this.addShape(group, {
            id: this.getElementId('background'),
            type: 'rect',
            attrs: tslib_1.__assign({ x: 0, y: 0, width: width,
                height: height }, backgroundStyle),
        });
        // 2. 左右文字
        var minTextShape = this.addShape(group, {
            id: this.getElementId('minText'),
            type: 'text',
            attrs: tslib_1.__assign({ 
                // x: 0,
                y: height / 2, textAlign: 'right', text: minText, silent: false }, textStyle),
        });
        var maxTextShape = this.addShape(group, {
            id: this.getElementId('maxText'),
            type: 'text',
            attrs: tslib_1.__assign({ 
                // x: 0,
                y: height / 2, textAlign: 'left', text: maxText, silent: false }, textStyle),
        });
        // 3. 前景 选中背景框
        var foregroundShape = this.addShape(group, {
            id: this.getElementId('foreground'),
            name: 'foreground',
            type: 'rect',
            attrs: tslib_1.__assign({ 
                // x: 0,
                y: 0, 
                // width: 0,
                height: height }, foregroundStyle),
        });
        // 滑块相关的大小信息
        var handlerWidth = util_1.get(handlerStyle, 'width', constant_1.DEFAULT_HANDLER_WIDTH);
        var handlerHeight = util_1.get(handlerStyle, 'height', 24);
        // 4. 左右滑块
        this.minHandler = this.addComponent(group, {
            component: handler_1.Handler,
            id: this.getElementId('minHandler'),
            name: 'handler-min',
            x: 0,
            y: (height - handlerHeight) / 2,
            width: handlerWidth,
            height: handlerHeight,
            cursor: 'ew-resize',
            style: handlerStyle,
        });
        this.maxHandler = this.addComponent(group, {
            component: handler_1.Handler,
            id: this.getElementId('maxHandler'),
            name: 'handler-max',
            x: 0,
            y: (height - handlerHeight) / 2,
            width: handlerWidth,
            height: handlerHeight,
            cursor: 'ew-resize',
            style: handlerStyle,
        });
    };
    Slider.prototype.applyOffset = function () {
        this.moveElementTo(this.get('group'), {
            x: this.get('x'),
            y: this.get('y'),
        });
    };
    Slider.prototype.initEvent = function () {
        this.bindEvents();
    };
    Slider.prototype.updateUI = function (foregroundShape, minTextShape, maxTextShape) {
        var _a = this.cfg, start = _a.start, end = _a.end, width = _a.width, minText = _a.minText, maxText = _a.maxText, handlerStyle = _a.handlerStyle, height = _a.height;
        var min = start * width;
        var max = end * width;
        if (this.trend) {
            this.trend.update({
                width: width,
                height: height,
            });
            if (!this.get('updateAutoRender')) {
                this.trend.render();
            }
        }
        // 1. foreground
        foregroundShape.attr('x', min);
        foregroundShape.attr('width', max - min);
        // 滑块相关的大小信息
        var handlerWidth = util_1.get(handlerStyle, 'width', constant_1.DEFAULT_HANDLER_WIDTH);
        // 设置文本
        minTextShape.attr('text', minText);
        maxTextShape.attr('text', maxText);
        var _b = this._dodgeText([min, max], minTextShape, maxTextShape), minAttrs = _b[0], maxAttrs = _b[1];
        // 2. 左侧滑块和文字位置
        if (this.minHandler) {
            this.minHandler.update({
                x: min - handlerWidth / 2,
            });
            if (!this.get('updateAutoRender')) {
                this.minHandler.render();
            }
        }
        util_1.each(minAttrs, function (v, k) { return minTextShape.attr(k, v); });
        // 3. 右侧滑块和文字位置
        if (this.maxHandler) {
            this.maxHandler.update({
                x: max - handlerWidth / 2,
            });
            if (!this.get('updateAutoRender')) {
                this.maxHandler.render();
            }
        }
        util_1.each(maxAttrs, function (v, k) { return maxTextShape.attr(k, v); });
    };
    Slider.prototype.bindEvents = function () {
        var group = this.get('group');
        group.on('handler-min:mousedown', this.onMouseDown('minHandler'));
        group.on('handler-min:touchstart', this.onMouseDown('minHandler'));
        // 2. 右滑块的滑动
        group.on('handler-max:mousedown', this.onMouseDown('maxHandler'));
        group.on('handler-max:touchstart', this.onMouseDown('maxHandler'));
        // 3. 前景选中区域
        var foreground = group.findById(this.getElementId('foreground'));
        foreground.on('mousedown', this.onMouseDown('foreground'));
        foreground.on('touchstart', this.onMouseDown('foreground'));
    };
    /**
     * 调整 offsetRange，因为一些范围的限制
     * @param offsetRange
     */
    Slider.prototype.adjustOffsetRange = function (offsetRange) {
        var _a = this.cfg, start = _a.start, end = _a.end;
        // 针对不同的滑动组件，处理的方式不同
        switch (this.currentTarget) {
            case 'minHandler': {
                var min = 0 - start;
                var max = 1 - start;
                return Math.min(max, Math.max(min, offsetRange));
            }
            case 'maxHandler': {
                var min = 0 - end;
                var max = 1 - end;
                return Math.min(max, Math.max(min, offsetRange));
            }
            case 'foreground': {
                var min = 0 - start;
                var max = 1 - end;
                return Math.min(max, Math.max(min, offsetRange));
            }
        }
    };
    Slider.prototype.updateStartEnd = function (offsetRange) {
        var _a = this.cfg, start = _a.start, end = _a.end;
        // 操作不同的组件，反馈不一样
        switch (this.currentTarget) {
            case 'minHandler':
                start += offsetRange;
                break;
            case 'maxHandler':
                end += offsetRange;
                break;
            case 'foreground':
                start += offsetRange;
                end += offsetRange;
                break;
        }
        this.set('start', start);
        this.set('end', end);
    };
    /**
     * 调整 text 的位置，自动躲避
     * 根据位置，调整返回新的位置
     * @param range
     */
    Slider.prototype._dodgeText = function (range, minTextShape, maxTextShape) {
        var _a, _b;
        var _c = this.cfg, handlerStyle = _c.handlerStyle, width = _c.width;
        var PADDING = 2;
        var handlerWidth = util_1.get(handlerStyle, 'width', constant_1.DEFAULT_HANDLER_WIDTH);
        var min = range[0], max = range[1];
        var sorted = false;
        // 如果交换了位置，则对应的 min max 也交互
        if (min > max) {
            _a = [max, min], min = _a[0], max = _a[1];
            _b = [maxTextShape, minTextShape], minTextShape = _b[0], maxTextShape = _b[1];
            sorted = true;
        }
        // 避让规则，优先显示在两侧，只有显示不下的时候，才显示在中间
        var minBBox = minTextShape.getBBox();
        var maxBBox = maxTextShape.getBBox();
        var minAttrs = minBBox.width > min - PADDING
            ? { x: min + handlerWidth / 2 + PADDING, textAlign: 'left' }
            : { x: min - handlerWidth / 2 - PADDING, textAlign: 'right' };
        var maxAttrs = maxBBox.width > width - max - PADDING
            ? { x: max - handlerWidth / 2 - PADDING, textAlign: 'right' }
            : { x: max + handlerWidth / 2 + PADDING, textAlign: 'left' };
        return !sorted ? [minAttrs, maxAttrs] : [maxAttrs, minAttrs];
    };
    Slider.prototype.draw = function () {
        var container = this.get('container');
        var canvas = container && container.get('canvas');
        if (canvas) {
            canvas.draw();
        }
    };
    Slider.prototype.getContainerDOM = function () {
        var container = this.get('container');
        var canvas = container && container.get('canvas');
        return canvas && canvas.get('container');
    };
    return Slider;
}(group_component_1.default));
exports.Slider = Slider;
exports.default = Slider;
//# sourceMappingURL=slider.js.map