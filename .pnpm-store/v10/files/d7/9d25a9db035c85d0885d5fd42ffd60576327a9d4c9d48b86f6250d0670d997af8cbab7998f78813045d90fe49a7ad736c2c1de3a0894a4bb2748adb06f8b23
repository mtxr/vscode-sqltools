import { __assign, __extends } from "tslib";
import { addEventListener } from '@antv/dom-util';
import { clamp, deepMix, get, noop } from '@antv/util';
import GroupComponent from '../abstract/group-component';
var DEFAULT_STYLE = {
    trackColor: 'rgba(0,0,0,0)',
    thumbColor: 'rgba(0,0,0,0.15)',
    size: 8,
    lineCap: 'round',
};
export var DEFAULT_THEME = {
    // 默认样式
    default: DEFAULT_STYLE,
    // 鼠标 hover 的样式
    hover: {
        thumbColor: 'rgba(0,0,0,0.2)',
    },
};
var Scrollbar = /** @class */ (function (_super) {
    __extends(Scrollbar, _super);
    function Scrollbar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.clearEvents = noop;
        _this.onStartEvent = function (isMobile) { return function (e) {
            _this.isMobile = isMobile;
            e.originalEvent.preventDefault();
            var clientX = isMobile ? get(e.originalEvent, 'touches.0.clientX') : e.clientX;
            var clientY = isMobile ? get(e.originalEvent, 'touches.0.clientY') : e.clientY;
            // 将开始的点记录下来
            _this.startPos = _this.cfg.isHorizontal ? clientX : clientY;
            _this.bindLaterEvent();
        }; };
        _this.bindLaterEvent = function () {
            var containerDOM = _this.getContainerDOM();
            var events = [];
            if (_this.isMobile) {
                events = [
                    addEventListener(containerDOM, 'touchmove', _this.onMouseMove),
                    addEventListener(containerDOM, 'touchend', _this.onMouseUp),
                    addEventListener(containerDOM, 'touchcancel', _this.onMouseUp),
                ];
            }
            else {
                events = [
                    addEventListener(containerDOM, 'mousemove', _this.onMouseMove),
                    addEventListener(containerDOM, 'mouseup', _this.onMouseUp),
                    // 为了保证划出 canvas containerDom 时还没触发 mouseup
                    addEventListener(containerDOM, 'mouseleave', _this.onMouseUp),
                ];
            }
            _this.clearEvents = function () {
                events.forEach(function (e) {
                    e.remove();
                });
            };
        };
        // 拖拽滑块的事件回调
        // 这里是 dom 原生事件，绑定在 dom 元素上的
        _this.onMouseMove = function (e) {
            var _a = _this.cfg, isHorizontal = _a.isHorizontal, thumbOffset = _a.thumbOffset;
            e.preventDefault();
            var clientX = _this.isMobile ? get(e, 'touches.0.clientX') : e.clientX;
            var clientY = _this.isMobile ? get(e, 'touches.0.clientY') : e.clientY;
            // 鼠标松开的位置
            var endPos = isHorizontal ? clientX : clientY;
            // 滑块需要移动的距离, 由于这里是对滑块监听，所以移动的距离就是 diffDis, 如果监听对象是 container dom，则需要算比例
            var diff = endPos - _this.startPos;
            // 更新 _startPos
            _this.startPos = endPos;
            _this.updateThumbOffset(thumbOffset + diff);
        };
        _this.onMouseUp = function (e) {
            e.preventDefault();
            _this.clearEvents();
        };
        // 点击滑道的事件回调,移动滑块位置
        _this.onTrackClick = function (e) {
            var _a = _this.cfg, isHorizontal = _a.isHorizontal, x = _a.x, y = _a.y, thumbLen = _a.thumbLen;
            var containerDOM = _this.getContainerDOM();
            var rect = containerDOM.getBoundingClientRect();
            var clientX = e.clientX, clientY = e.clientY;
            var offset = isHorizontal ? clientX - rect.left - x - thumbLen / 2 : clientY - rect.top - y - thumbLen / 2;
            var newOffset = _this.validateRange(offset);
            _this.updateThumbOffset(newOffset);
        };
        _this.onThumbMouseOver = function () {
            var thumbColor = _this.cfg.theme.hover.thumbColor;
            _this.getElementByLocalId('thumb').attr('stroke', thumbColor);
            _this.draw();
        };
        _this.onThumbMouseOut = function () {
            var thumbColor = _this.cfg.theme.default.thumbColor;
            _this.getElementByLocalId('thumb').attr('stroke', thumbColor);
            _this.draw();
        };
        return _this;
    }
    Scrollbar.prototype.setRange = function (min, max) {
        this.set('minLimit', min);
        this.set('maxLimit', max);
        var curValue = this.getValue();
        var newValue = clamp(curValue, min, max);
        if (curValue !== newValue && !this.get('isInit')) {
            this.setValue(newValue);
        }
    };
    Scrollbar.prototype.getRange = function () {
        var min = this.get('minLimit') || 0;
        var max = this.get('maxLimit') || 1;
        return { min: min, max: max };
    };
    Scrollbar.prototype.setValue = function (value) {
        var range = this.getRange();
        var originalValue = this.getValue();
        this.update({
            thumbOffset: (this.get('trackLen') - this.get('thumbLen')) * clamp(value, range.min, range.max),
        });
        this.delegateEmit('valuechange', {
            originalValue: originalValue,
            value: this.getValue(),
        });
    };
    Scrollbar.prototype.getValue = function () {
        return clamp(this.get('thumbOffset') / (this.get('trackLen') - this.get('thumbLen')), 0, 1);
    };
    Scrollbar.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { name: 'scrollbar', isHorizontal: true, minThumbLen: 20, thumbOffset: 0, theme: DEFAULT_THEME });
    };
    Scrollbar.prototype.renderInner = function (group) {
        this.renderTrackShape(group);
        this.renderThumbShape(group);
    };
    Scrollbar.prototype.applyOffset = function () {
        this.moveElementTo(this.get('group'), {
            x: this.get('x'),
            y: this.get('y'),
        });
    };
    Scrollbar.prototype.initEvent = function () {
        this.bindEvents();
    };
    // 创建滑道的 shape
    Scrollbar.prototype.renderTrackShape = function (group) {
        var _a = this.cfg, trackLen = _a.trackLen, _b = _a.theme, theme = _b === void 0 ? { default: {} } : _b;
        var _c = deepMix({}, DEFAULT_THEME, theme).default, lineCap = _c.lineCap, trackColor = _c.trackColor, themeSize = _c.size;
        var size = get(this.cfg, 'size', themeSize);
        var attrs = this.get('isHorizontal')
            ? {
                x1: 0 + size / 2,
                y1: size / 2,
                x2: trackLen - size / 2,
                y2: size / 2,
                lineWidth: size,
                stroke: trackColor,
                lineCap: lineCap,
            }
            : {
                x1: size / 2,
                y1: 0 + size / 2,
                x2: size / 2,
                y2: trackLen - size / 2,
                lineWidth: size,
                stroke: trackColor,
                lineCap: lineCap,
            };
        return this.addShape(group, {
            id: this.getElementId('track'),
            name: 'track',
            type: 'line',
            attrs: attrs,
        });
    };
    // 创建滑块的 shape
    Scrollbar.prototype.renderThumbShape = function (group) {
        var _a = this.cfg, thumbOffset = _a.thumbOffset, thumbLen = _a.thumbLen, theme = _a.theme;
        var _b = deepMix({}, DEFAULT_THEME, theme).default, themeSize = _b.size, lineCap = _b.lineCap, thumbColor = _b.thumbColor;
        var size = get(this.cfg, 'size', themeSize);
        var attrs = this.get('isHorizontal')
            ? {
                x1: thumbOffset + size / 2,
                y1: size / 2,
                x2: thumbOffset + thumbLen - size / 2,
                y2: size / 2,
                lineWidth: size,
                stroke: thumbColor,
                lineCap: lineCap,
                cursor: 'default',
            }
            : {
                x1: size / 2,
                y1: thumbOffset + size / 2,
                x2: size / 2,
                y2: thumbOffset + thumbLen - size / 2,
                lineWidth: size,
                stroke: thumbColor,
                lineCap: lineCap,
                cursor: 'default',
            };
        return this.addShape(group, {
            id: this.getElementId('thumb'),
            name: 'thumb',
            type: 'line',
            attrs: attrs,
        });
    };
    Scrollbar.prototype.bindEvents = function () {
        var group = this.get('group');
        group.on('mousedown', this.onStartEvent(false));
        group.on('mouseup', this.onMouseUp);
        group.on('touchstart', this.onStartEvent(true));
        group.on('touchend', this.onMouseUp);
        var trackShape = group.findById(this.getElementId('track'));
        trackShape.on('click', this.onTrackClick);
        var thumbShape = group.findById(this.getElementId('thumb'));
        thumbShape.on('mouseover', this.onThumbMouseOver);
        thumbShape.on('mouseout', this.onThumbMouseOut);
    };
    Scrollbar.prototype.getContainerDOM = function () {
        var container = this.get('container');
        var canvas = container && container.get('canvas');
        return canvas && canvas.get('container');
    };
    Scrollbar.prototype.validateRange = function (offset) {
        var _a = this.cfg, thumbLen = _a.thumbLen, trackLen = _a.trackLen;
        var newOffset = offset;
        if (offset + thumbLen > trackLen) {
            newOffset = trackLen - thumbLen;
        }
        else if (offset + thumbLen < thumbLen) {
            newOffset = 0;
        }
        return newOffset;
    };
    Scrollbar.prototype.draw = function () {
        var container = this.get('container');
        var canvas = container && container.get('canvas');
        if (canvas) {
            canvas.draw();
        }
    };
    Scrollbar.prototype.updateThumbOffset = function (offset) {
        var _a = this.cfg, thumbOffset = _a.thumbOffset, isHorizontal = _a.isHorizontal, thumbLen = _a.thumbLen, size = _a.size;
        var newOffset = this.validateRange(offset);
        if (newOffset === thumbOffset) {
            // 如果更新后的 offset 与原值相同，则不改变
            return;
        }
        var thumbShape = this.getElementByLocalId('thumb');
        if (isHorizontal) {
            thumbShape.attr({
                x1: newOffset + size / 2,
                x2: newOffset + thumbLen - size / 2,
            });
        }
        else {
            thumbShape.attr({
                y1: newOffset + size / 2,
                y2: newOffset + thumbLen - size / 2,
            });
        }
        this.emitOffsetChange(newOffset);
    };
    Scrollbar.prototype.emitOffsetChange = function (offset) {
        var _a = this.cfg, originalValue = _a.thumbOffset, trackLen = _a.trackLen, thumbLen = _a.thumbLen;
        this.cfg.thumbOffset = offset;
        // 发送事件
        this.emit('scrollchange', {
            thumbOffset: offset,
            ratio: clamp(offset / (trackLen - thumbLen), 0, 1),
        });
        this.delegateEmit('valuechange', {
            originalValue: originalValue,
            value: offset,
        });
    };
    return Scrollbar;
}(GroupComponent));
export { Scrollbar };
//# sourceMappingURL=scrollbar.js.map