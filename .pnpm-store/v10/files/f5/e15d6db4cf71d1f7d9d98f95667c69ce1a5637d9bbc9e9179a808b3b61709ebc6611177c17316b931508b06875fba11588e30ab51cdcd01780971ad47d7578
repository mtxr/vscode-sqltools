"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GraphEvent = /** @class */ (function () {
    function GraphEvent(type, event) {
        /**
         * 是否允许冒泡
         * @type {boolean}
         */
        this.bubbles = true;
        /**
         * 触发对象
         * @type {object}
         */
        this.target = null;
        /**
         * 监听对象
         * @type {object}
         */
        this.currentTarget = null;
        /**
         * 委托对象
         * @type {object}
         */
        this.delegateTarget = null;
        /**
         * 委托事件监听对象的代理对象，即 ev.delegateObject = ev.currentTarget.get('delegateObject')
         * @type {object}
         */
        this.delegateObject = null;
        /**
         * 是否阻止了原生事件
         * @type {boolean}
         */
        this.defaultPrevented = false;
        /**
         * 是否阻止传播（向上冒泡）
         * @type {boolean}
         */
        this.propagationStopped = false;
        /**
         * 触发事件的图形
         * @type {IShape}
         */
        this.shape = null;
        /**
         * 开始触发事件的图形
         * @type {IShape}
         */
        this.fromShape = null;
        /**
         * 事件结束时的触发图形
         * @type {IShape}
         */
        this.toShape = null;
        // 触发事件的路径
        this.propagationPath = [];
        this.type = type;
        this.name = type;
        this.originalEvent = event;
        this.timeStamp = event.timeStamp;
    }
    /**
     * 阻止浏览器默认的行为
     */
    GraphEvent.prototype.preventDefault = function () {
        this.defaultPrevented = true;
        if (this.originalEvent.preventDefault) {
            this.originalEvent.preventDefault();
        }
    };
    /**
     * 阻止冒泡
     */
    GraphEvent.prototype.stopPropagation = function () {
        this.propagationStopped = true;
    };
    GraphEvent.prototype.toString = function () {
        var type = this.type;
        return "[Event (type=" + type + ")]";
    };
    GraphEvent.prototype.save = function () { };
    GraphEvent.prototype.restore = function () { };
    return GraphEvent;
}());
exports.default = GraphEvent;
//# sourceMappingURL=graph-event.js.map