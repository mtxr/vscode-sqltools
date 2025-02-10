"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dependents_1 = require("../dependents");
/**
 * @todo Whether it can(or necessary to) keep consistent with the structure of G.Event or directly use the structure of G.Event
 * G2 事件的事件包装类，基于 G.Event
 */
var Event = /** @class */ (function () {
    function Event(view, gEvent, data) {
        this.view = view;
        this.gEvent = gEvent;
        this.data = data;
        this.type = gEvent.type;
    }
    /**
     * 非交互产生的事件
     * @param view
     * @param type
     * @param data
     */
    Event.fromData = function (view, type, data) {
        return new Event(view, new dependents_1.Event(type, {}), data);
    };
    Object.defineProperty(Event.prototype, "target", {
        // below props are proxy props of G.event convenient
        /** the real trigger shape of the event */
        get: function () {
            // @todo G 中事件定义为 object 不正确，这里先 ignore
            // @ts-ignore
            return this.gEvent.target;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Event.prototype, "event", {
        /** 获取对应的 dom 原生时间 */
        get: function () {
            return this.gEvent.originalEvent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Event.prototype, "x", {
        /** x 画布坐标 */
        get: function () {
            return this.gEvent.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Event.prototype, "y", {
        /** y 画布坐标 */
        get: function () {
            return this.gEvent.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Event.prototype, "clientX", {
        /** x 窗口坐标 */
        get: function () {
            return this.gEvent.clientX;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Event.prototype, "clientY", {
        /** y 窗口坐标 */
        get: function () {
            return this.gEvent.clientY;
        },
        enumerable: false,
        configurable: true
    });
    // end for proxy events
    /**
     * event string
     * @returns string
     */
    Event.prototype.toString = function () {
        return "[Event (type=".concat(this.type, ")]");
    };
    /**
     * clone a new event with same attributes
     * @returns [[Event]]
     */
    Event.prototype.clone = function () {
        return new Event(this.view, this.gEvent, this.data);
    };
    return Event;
}());
exports.default = Event;
//# sourceMappingURL=event.js.map