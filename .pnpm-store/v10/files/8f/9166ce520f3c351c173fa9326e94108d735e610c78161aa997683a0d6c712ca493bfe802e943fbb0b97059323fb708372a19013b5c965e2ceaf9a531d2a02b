import { __extends } from "tslib";
import { Controller } from './base';
var PRESS_DELAY = 250;
// 计算滑动的方向
var calcDirection = function (start, end) {
    var xDistance = end.x - start.x;
    var yDistance = end.y - start.y;
    // x 的距离大于y 说明是横向，否则就是纵向
    if (Math.abs(xDistance) > Math.abs(yDistance)) {
        return xDistance > 0 ? 'right' : 'left';
    }
    return yDistance > 0 ? 'down' : 'up';
};
// 计算2点之间的距离
var calcDistance = function (point1, point2) {
    var xDistance = Math.abs(point2.x - point1.x);
    var yDistance = Math.abs(point2.y - point1.y);
    return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
};
var getCenter = function (point1, point2) {
    var x = (point1.x + point2.x) / 2;
    var y = (point1.y + point2.y) / 2;
    return { x: x, y: y };
};
var convertPoints = function (touches, canvas) {
    if (!touches) {
        return;
    }
    var points = [];
    var len = touches.length;
    for (var i = 0; i < len; i++) {
        var touch = touches[i];
        // x, y: 相对canvas原点的位置，clientX, clientY 相对于可视窗口的位置
        var clientX = touch.clientX, clientY = touch.clientY;
        var point = canvas.getPointByClient(clientX, clientY);
        points.push(point);
    }
    return points;
};
var GestureController = /** @class */ (function (_super) {
    __extends(GestureController, _super);
    function GestureController(view) {
        var _this = _super.call(this, view) || this;
        _this.processEvent = {};
        _this.touchStart = function (ev) {
            var points = convertPoints(ev.originalEvent.touches, _this.canvas);
            if (!points) {
                return;
            }
            ev.points = points;
            // 防止上次的内容没有清理掉，重新reset下
            _this.reset();
            // 记录touch start 的时间
            _this.startTime = Date.now();
            // 记录touch start 的点
            _this.startPoints = points;
            if (points.length > 1) {
                _this.startDistance = calcDistance(points[0], points[1]);
                _this.center = getCenter(points[0], points[1]);
            }
            else {
                // 如果touchstart后停顿250ms, 则也触发press事件
                _this.pressTimeout = setTimeout(function () {
                    // 这里固定触发press事件
                    var eventType = 'press';
                    ev.direction = 'none';
                    _this.emitStart(eventType, ev);
                    _this.emitEvent(eventType, ev);
                    _this.eventType = eventType;
                }, PRESS_DELAY);
            }
        };
        _this.touchMove = function (ev) {
            var points = convertPoints(ev.originalEvent.touches, _this.canvas);
            if (!points) {
                return;
            }
            _this.clearPressTimeout();
            ev.points = points;
            var startPoints = _this.startPoints;
            if (!startPoints) {
                return;
            }
            // 多指触控
            if (points.length > 1) {
                // touchstart的距离
                var startDistance = _this.startDistance;
                var currentDistance = calcDistance(points[0], points[1]);
                ev.zoom = currentDistance / startDistance;
                ev.center = _this.center;
                // 触发缩放事件
                _this.emitStart('pinch', ev);
                _this.emitEvent('pinch', ev);
            }
            else {
                var deltaX = points[0].x - startPoints[0].x;
                var deltaY = points[0].y - startPoints[0].y;
                var direction = _this.direction || calcDirection(startPoints[0], points[0]);
                _this.direction = direction;
                // 获取press或者pan的事件类型
                // press 按住滑动, pan表示平移
                // 如果start后立刻move，则触发pan, 如果有停顿，则触发press
                var eventType = _this.getEventType(points);
                ev.direction = direction;
                ev.deltaX = deltaX;
                ev.deltaY = deltaY;
                _this.emitStart(eventType, ev);
                _this.emitEvent(eventType, ev);
                // 记录最后2次move的时间和坐标，为了给swipe事件用
                var prevMoveTime = _this.lastMoveTime;
                var now = Date.now();
                // 最后2次的时间间隔一定要大于0，否则swipe没发计算
                if (now - prevMoveTime > 0) {
                    _this.prevMoveTime = prevMoveTime;
                    _this.prevMovePoints = _this.lastMovePoints;
                    _this.lastMoveTime = now;
                    _this.lastMovePoints = points;
                }
            }
        };
        _this.touchEnd = function (ev) {
            _this.emitEnd(ev);
            // swipe事件处理, 在touchend之后触发
            var lastMoveTime = _this.lastMoveTime;
            var now = Date.now();
            // 做这个判断是为了最后一次touchmove后到end前，还有一个停顿的过程
            // 100 是拍的一个值，理论这个值会很短，一般不卡顿的话在10ms以内
            if (now - lastMoveTime < 100) {
                var prevMoveTime = _this.prevMoveTime || _this.startTime;
                var intervalTime = lastMoveTime - prevMoveTime;
                // 时间间隔一定要大于0, 否则计算没意义
                if (intervalTime > 0) {
                    var prevMovePoints = _this.prevMovePoints || _this.startPoints;
                    var lastMovePoints = _this.lastMovePoints;
                    // move速率
                    var velocity = calcDistance(prevMovePoints[0], lastMovePoints[0]) / intervalTime;
                    // 0.3 是参考hammerjs的设置
                    if (velocity > 0.3) {
                        ev.velocity = velocity;
                        ev.direction = calcDirection(prevMovePoints[0], lastMovePoints[0]);
                        _this.emitEvent('swipe', ev);
                    }
                }
            }
            _this.reset();
            var touches = ev.touches;
            // 当多指只释放了1指时也会触发end, 这时重新触发一次start
            if (touches && touches.length > 0) {
                _this.touchStart(ev);
            }
        };
        _this.canvas = view.getCanvas();
        _this.delegateEvent();
        // 用来记录当前触发的事件
        _this.processEvent = {};
        return _this;
    }
    Object.defineProperty(GestureController.prototype, "name", {
        get: function () {
            return 'gesture';
        },
        enumerable: false,
        configurable: true
    });
    GestureController.prototype.init = function () { };
    GestureController.prototype.render = function () { };
    GestureController.prototype.layout = function () { };
    GestureController.prototype.update = function () { };
    GestureController.prototype.destroy = function () {
        this.reset();
        this.offEvent();
        this.processEvent = null;
    };
    GestureController.prototype.delegateEvent = function () {
        // 代理这几个事件
        this.canvas.on('touchstart', this.touchStart);
        this.canvas.on('touchmove', this.touchMove);
        this.canvas.on('touchend', this.touchEnd);
    };
    GestureController.prototype.offEvent = function () {
        this.canvas.off('touchstart', this.touchStart);
        this.canvas.off('touchmove', this.touchMove);
        this.canvas.off('touchend', this.touchEnd);
    };
    GestureController.prototype.emitEvent = function (type, ev) {
        var view = this.view;
        view.emit(type, ev);
    };
    // 触发start事件
    GestureController.prototype.emitStart = function (type, ev) {
        if (this.isProcess(type)) {
            return;
        }
        this.enable(type);
        this.emitEvent("".concat(type, "start"), ev);
    };
    // 触发end事件
    GestureController.prototype.emitEnd = function (ev) {
        var _this = this;
        var processEvent = this.processEvent;
        Object.keys(processEvent).forEach(function (type) {
            _this.emitEvent("".concat(type, "end"), ev);
            delete processEvent[type];
        });
    };
    GestureController.prototype.enable = function (eventType) {
        this.processEvent[eventType] = true;
    };
    // 是否进行中的事件
    GestureController.prototype.isProcess = function (eventType) {
        return this.processEvent[eventType];
    };
    GestureController.prototype.reset = function () {
        this.clearPressTimeout();
        this.startTime = 0;
        this.startPoints = null;
        this.startDistance = 0;
        this.direction = null;
        this.eventType = null;
        this.prevMoveTime = 0;
        this.prevMovePoints = null;
        this.lastMoveTime = 0;
        this.lastMovePoints = null;
    };
    GestureController.prototype.clearPressTimeout = function () {
        if (this.pressTimeout) {
            clearTimeout(this.pressTimeout);
            this.pressTimeout = 0;
        }
    };
    GestureController.prototype.getEventType = function (points) {
        var _a = this, eventType = _a.eventType, view = _a.view, startTime = _a.startTime, startPoints = _a.startPoints;
        if (eventType) {
            return eventType;
        }
        var type;
        var panEventListeners = view.getEvents().pan;
        // 如果 view 上没有 pan 事件的监听，默认都是 press
        if (!panEventListeners || !panEventListeners.length) {
            type = 'press';
        }
        else {
            // 如果有pan事件的处理，press则需要停顿250ms, 且移动距离小于10
            var now = Date.now();
            if (now - startTime > PRESS_DELAY && calcDistance(startPoints[0], points[0]) < 10) {
                type = 'press';
            }
            else {
                type = 'pan';
            }
        }
        this.eventType = type;
        return type;
    };
    return GestureController;
}(Controller));
export default GestureController;
//# sourceMappingURL=gesture.js.map