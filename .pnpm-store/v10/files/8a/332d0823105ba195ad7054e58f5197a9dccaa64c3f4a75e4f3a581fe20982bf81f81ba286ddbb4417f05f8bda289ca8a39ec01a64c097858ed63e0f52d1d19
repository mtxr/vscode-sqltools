"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var detect_browser_1 = require("detect-browser");
var container_1 = require("./container");
var util_1 = require("../util/util");
var timeline_1 = require("../animate/timeline");
var event_contoller_1 = require("../event/event-contoller");
var PX_SUFFIX = 'px';
var browser = detect_browser_1.detect();
var isFirefox = browser && browser.name === 'firefox';
var Canvas = /** @class */ (function (_super) {
    tslib_1.__extends(Canvas, _super);
    function Canvas(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.initContainer();
        _this.initDom();
        _this.initEvents();
        _this.initTimeline();
        return _this;
    }
    Canvas.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        // set default cursor style for canvas
        cfg['cursor'] = 'default';
        // CSS transform 目前尚未经过长时间验证，为了避免影响上层业务，默认关闭，上层按需开启
        cfg['supportCSSTransform'] = false;
        return cfg;
    };
    /**
     * @protected
     * 初始化容器
     */
    Canvas.prototype.initContainer = function () {
        var container = this.get('container');
        if (util_1.isString(container)) {
            container = document.getElementById(container);
            this.set('container', container);
        }
    };
    /**
     * @protected
     * 初始化 DOM
     */
    Canvas.prototype.initDom = function () {
        var el = this.createDom();
        this.set('el', el);
        // 附加到容器
        var container = this.get('container');
        container.appendChild(el);
        // 设置初始宽度
        this.setDOMSize(this.get('width'), this.get('height'));
    };
    /**
     * @protected
     * 初始化绑定的事件
     */
    Canvas.prototype.initEvents = function () {
        var eventController = new event_contoller_1.default({
            canvas: this,
        });
        eventController.init();
        this.set('eventController', eventController);
    };
    /**
     * @protected
     * 初始化时间轴
     */
    Canvas.prototype.initTimeline = function () {
        var timeline = new timeline_1.default(this);
        this.set('timeline', timeline);
    };
    /**
     * @protected
     * 修改画布对应的 DOM 的大小
     * @param {number} width  宽度
     * @param {number} height 高度
     */
    Canvas.prototype.setDOMSize = function (width, height) {
        var el = this.get('el');
        if (util_1.isBrowser) {
            el.style.width = width + PX_SUFFIX;
            el.style.height = height + PX_SUFFIX;
        }
    };
    // 实现接口
    Canvas.prototype.changeSize = function (width, height) {
        this.setDOMSize(width, height);
        this.set('width', width);
        this.set('height', height);
        this.onCanvasChange('changeSize');
    };
    /**
     * 获取当前的渲染引擎
     * @return {Renderer} 返回当前的渲染引擎
     */
    Canvas.prototype.getRenderer = function () {
        return this.get('renderer');
    };
    /**
     * 获取画布的 cursor 样式
     * @return {Cursor}
     */
    Canvas.prototype.getCursor = function () {
        return this.get('cursor');
    };
    /**
     * 设置画布的 cursor 样式
     * @param {Cursor} cursor  cursor 样式
     */
    Canvas.prototype.setCursor = function (cursor) {
        this.set('cursor', cursor);
        var el = this.get('el');
        if (util_1.isBrowser && el) {
            // 直接设置样式，不等待鼠标移动时再设置
            el.style.cursor = cursor;
        }
    };
    // 实现接口
    Canvas.prototype.getPointByEvent = function (ev) {
        var supportCSSTransform = this.get('supportCSSTransform');
        if (supportCSSTransform) {
            // For Firefox <= 38
            if (isFirefox && !util_1.isNil(ev.layerX) && ev.layerX !== ev.offsetX) {
                return {
                    x: ev.layerX,
                    y: ev.layerY,
                };
            }
            if (!util_1.isNil(ev.offsetX)) {
                // For IE6+, Firefox >= 39, Chrome, Safari, Opera
                return {
                    x: ev.offsetX,
                    y: ev.offsetY,
                };
            }
        }
        // should calculate by self for other cases, like Safari in ios
        // TODO: support CSS transform
        var _a = this.getClientByEvent(ev), clientX = _a.x, clientY = _a.y;
        return this.getPointByClient(clientX, clientY);
    };
    // 获取 touch 事件的 clientX 和 clientY 需要单独处理
    Canvas.prototype.getClientByEvent = function (ev) {
        var clientInfo = ev;
        if (ev.touches) {
            if (ev.type === 'touchend') {
                clientInfo = ev.changedTouches[0];
            }
            else {
                clientInfo = ev.touches[0];
            }
        }
        return {
            x: clientInfo.clientX,
            y: clientInfo.clientY,
        };
    };
    // 实现接口
    Canvas.prototype.getPointByClient = function (clientX, clientY) {
        var el = this.get('el');
        var bbox = el.getBoundingClientRect();
        return {
            x: clientX - bbox.left,
            y: clientY - bbox.top,
        };
    };
    // 实现接口
    Canvas.prototype.getClientByPoint = function (x, y) {
        var el = this.get('el');
        var bbox = el.getBoundingClientRect();
        return {
            x: x + bbox.left,
            y: y + bbox.top,
        };
    };
    // 实现接口
    Canvas.prototype.draw = function () { };
    /**
     * @protected
     * 销毁 DOM 容器
     */
    Canvas.prototype.removeDom = function () {
        var el = this.get('el');
        el.parentNode.removeChild(el);
    };
    /**
     * @protected
     * 清理所有的事件
     */
    Canvas.prototype.clearEvents = function () {
        var eventController = this.get('eventController');
        eventController.destroy();
    };
    Canvas.prototype.isCanvas = function () {
        return true;
    };
    Canvas.prototype.getParent = function () {
        return null;
    };
    Canvas.prototype.destroy = function () {
        var timeline = this.get('timeline');
        if (this.get('destroyed')) {
            return;
        }
        this.clear();
        // 同初始化时相反顺序调用
        if (timeline) {
            // 画布销毁时自动停止动画
            timeline.stop();
        }
        this.clearEvents();
        this.removeDom();
        _super.prototype.destroy.call(this);
    };
    return Canvas;
}(container_1.default));
exports.default = Canvas;
//# sourceMappingURL=canvas.js.map