"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @fileoverview 事件处理器
 * @author dxq613@gmail.com
 */
var graph_event_1 = require("./graph-event");
var util_1 = require("../util/util");
var CLICK_OFFSET = 40;
var LEFT_BTN_CODE = 0;
var DELEGATION_SPLIT = ':';
var EVENTS = [
    'mousedown',
    'mouseup',
    'dblclick',
    'mouseout',
    'mouseover',
    'mousemove',
    'mouseleave',
    'mouseenter',
    'touchstart',
    'touchmove',
    'touchend',
    'dragenter',
    'dragover',
    'dragleave',
    'drop',
    'contextmenu',
    'mousewheel',
];
// 是否有委托事件监听
function hasDelegation(events, type) {
    for (var key in events) {
        if (events.hasOwnProperty(key) && key.indexOf(DELEGATION_SPLIT + type) >= 0) {
            return true;
        }
    }
    return false;
}
// 触发目标事件，目标只能是 shape 或 canvas
function emitTargetEvent(target, type, eventObj) {
    eventObj.name = type;
    eventObj.target = target;
    eventObj.currentTarget = target;
    eventObj.delegateTarget = target;
    target.emit(type, eventObj);
}
// 事件冒泡, enter 和 leave 需要对 fromShape 和 toShape 进行判同
function bubbleEvent(container, type, eventObj) {
    if (eventObj.bubbles) {
        var relativeShape = void 0;
        var isOverEvent = false;
        if (type === 'mouseenter') {
            relativeShape = eventObj.fromShape;
            isOverEvent = true;
        }
        else if (type === 'mouseleave') {
            isOverEvent = true;
            relativeShape = eventObj.toShape;
        }
        // canvas 上的 mouseenter， mouseleave 事件，仅当进入或者移出 canvas 时触发
        if (container.isCanvas() && isOverEvent) {
            return;
        }
        // 如果相关图形同当前图形在同一个容器内，不触发事件
        if (relativeShape && util_1.isParent(container, relativeShape)) {
            // 阻止继续向上冒泡
            eventObj.bubbles = false;
            return;
        }
        // 事件名称可能在委托过程中被修改，因此事件冒泡时需要重新设置事件名称
        eventObj.name = type;
        eventObj.currentTarget = container;
        eventObj.delegateTarget = container;
        container.emit(type, eventObj);
    }
}
var EventController = /** @class */ (function () {
    function EventController(cfg) {
        var _this = this;
        // 正在被拖拽的图形
        this.draggingShape = null;
        this.dragging = false;
        // 当前鼠标/touch所在位置的图形
        this.currentShape = null;
        this.mousedownShape = null;
        this.mousedownPoint = null;
        // 统一处理所有的回调
        this._eventCallback = function (ev) {
            var type = ev.type;
            _this._triggerEvent(type, ev);
        };
        // 在 document 处理拖拽到画布外的事件，处理从图形上移除画布未被捕捉的问题
        this._onDocumentMove = function (ev) {
            var canvas = _this.canvas;
            var el = canvas.get('el');
            if (el !== ev.target) {
                // 不在 canvas 上移动
                if (_this.dragging || _this.currentShape) {
                    var pointInfo = _this._getPointInfo(ev);
                    // 还在拖拽过程中
                    if (_this.dragging) {
                        _this._emitEvent('drag', ev, pointInfo, _this.draggingShape);
                    }
                    // 说明从某个图形直接移动到了画布外面，
                    // 修复了 mouseleave 的 bug 后不再出现这种情况
                    // if (this.currentShape) {
                    //   this._emitEvent('mouseleave', ev, pointInfo, this.currentShape, this.currentShape, null);
                    //   this.currentShape = null;
                    // }
                }
            }
        };
        // 在 document 上处理拖拽到外面，释放鼠标时触发 dragend
        this._onDocumentMouseUp = function (ev) {
            var canvas = _this.canvas;
            var el = canvas.get('el');
            if (el !== ev.target) {
                // 不在 canvas 上移动
                if (_this.dragging) {
                    var pointInfo = _this._getPointInfo(ev);
                    if (_this.draggingShape) {
                        // 如果存在拖拽的图形，则也触发 drop 事件
                        _this._emitEvent('drop', ev, pointInfo, null);
                    }
                    _this._emitEvent('dragend', ev, pointInfo, _this.draggingShape);
                    _this._afterDrag(_this.draggingShape, pointInfo, ev);
                }
            }
        };
        this.canvas = cfg.canvas;
    }
    EventController.prototype.init = function () {
        this._bindEvents();
    };
    // 注册事件
    EventController.prototype._bindEvents = function () {
        var _this = this;
        var el = this.canvas.get('el');
        util_1.each(EVENTS, function (eventName) {
            el.addEventListener(eventName, _this._eventCallback);
        });
        if (document) {
            // 处理移动到外面没有触发 shape mouse leave 的事件
            // 处理拖拽到外部的问题
            document.addEventListener('mousemove', this._onDocumentMove);
            // 处理拖拽过程中在外部释放鼠标的问题
            document.addEventListener('mouseup', this._onDocumentMouseUp);
        }
    };
    // 清理事件
    EventController.prototype._clearEvents = function () {
        var _this = this;
        var el = this.canvas.get('el');
        util_1.each(EVENTS, function (eventName) {
            el.removeEventListener(eventName, _this._eventCallback);
        });
        if (document) {
            document.removeEventListener('mousemove', this._onDocumentMove);
            document.removeEventListener('mouseup', this._onDocumentMouseUp);
        }
    };
    EventController.prototype._getEventObj = function (type, event, point, target, fromShape, toShape) {
        var eventObj = new graph_event_1.default(type, event);
        eventObj.fromShape = fromShape;
        eventObj.toShape = toShape;
        eventObj.x = point.x;
        eventObj.y = point.y;
        eventObj.clientX = point.clientX;
        eventObj.clientY = point.clientY;
        eventObj.propagationPath.push(target);
        // 事件的x,y应该是基于画布左上角的，与canvas的matrix无关
        return eventObj;
    };
    // 根据点获取图形，提取成独立方法，便于后续优化
    EventController.prototype._getShape = function (point, ev) {
        return this.canvas.getShape(point.x, point.y, ev);
    };
    // 获取事件的当前点的信息
    EventController.prototype._getPointInfo = function (ev) {
        var canvas = this.canvas;
        var clientPoint = canvas.getClientByEvent(ev);
        var point = canvas.getPointByEvent(ev);
        return {
            x: point.x,
            y: point.y,
            clientX: clientPoint.x,
            clientY: clientPoint.y,
        };
    };
    // 触发事件
    EventController.prototype._triggerEvent = function (type, ev) {
        var pointInfo = this._getPointInfo(ev);
        // 每次都获取图形有一定成本，后期可以考虑进行缓存策略
        var shape = this._getShape(pointInfo, ev);
        var method = this["_on" + type];
        var leaveCanvas = false;
        if (method) {
            method.call(this, pointInfo, shape, ev);
        }
        else {
            var preShape = this.currentShape;
            // 如果进入、移出画布时存在图形，则要分别触发事件
            if (type === 'mouseenter' || type === 'dragenter' || type === 'mouseover') {
                this._emitEvent(type, ev, pointInfo, null, null, shape); // 先进入画布
                if (shape) {
                    this._emitEvent(type, ev, pointInfo, shape, null, shape); // 再触发图形的事件
                }
                if (type === 'mouseenter' && this.draggingShape) {
                    // 如果正在拖拽图形, 则触发 dragleave
                    this._emitEvent('dragenter', ev, pointInfo, null);
                }
            }
            else if (type === 'mouseleave' || type === 'dragleave' || type === 'mouseout') {
                leaveCanvas = true;
                if (preShape) {
                    this._emitEvent(type, ev, pointInfo, preShape, preShape, null); // 先触发图形的事件
                }
                this._emitEvent(type, ev, pointInfo, null, preShape, null); // 再触发离开画布事件
                if (type === 'mouseleave' && this.draggingShape) {
                    this._emitEvent('dragleave', ev, pointInfo, null);
                }
            }
            else {
                this._emitEvent(type, ev, pointInfo, shape, null, null); // 一般事件中不需要考虑 from, to
            }
        }
        if (!leaveCanvas) {
            this.currentShape = shape;
        }
        // 当鼠标从画布移动到 shape 或者从 preShape 移动到 shape 时，应用 shape 上的鼠标样式
        if (shape && !shape.get('destroyed')) {
            var canvas = this.canvas;
            var el = canvas.get('el');
            el.style.cursor = shape.attr('cursor') || canvas.get('cursor');
        }
    };
    // 记录下点击的位置、图形，便于拖拽事件、click 事件的判定
    EventController.prototype._onmousedown = function (pointInfo, shape, event) {
        // 只有鼠标左键的 mousedown 事件才会设置 mousedownShape 等属性，避免鼠标右键的 mousedown 事件引起其他事件发生
        if (event.button === LEFT_BTN_CODE) {
            this.mousedownShape = shape;
            this.mousedownPoint = pointInfo;
            this.mousedownTimeStamp = event.timeStamp;
        }
        this._emitEvent('mousedown', event, pointInfo, shape, null, null); // mousedown 不考虑fromShape, toShape
    };
    // mouseleave 和 mouseenter 都是成对存在的
    // mouseenter 和 mouseover 同时触发
    EventController.prototype._emitMouseoverEvents = function (event, pointInfo, fromShape, toShape) {
        var el = this.canvas.get('el');
        if (fromShape !== toShape) {
            if (fromShape) {
                this._emitEvent('mouseout', event, pointInfo, fromShape, fromShape, toShape);
                this._emitEvent('mouseleave', event, pointInfo, fromShape, fromShape, toShape);
                // 当鼠标从 fromShape 移动到画布上时，重置鼠标样式
                if (!toShape || toShape.get('destroyed')) {
                    el.style.cursor = this.canvas.get('cursor');
                }
            }
            if (toShape) {
                this._emitEvent('mouseover', event, pointInfo, toShape, fromShape, toShape);
                this._emitEvent('mouseenter', event, pointInfo, toShape, fromShape, toShape);
            }
        }
    };
    // dragover 不等同于 mouseover，而等同于 mousemove
    EventController.prototype._emitDragoverEvents = function (event, pointInfo, fromShape, toShape, isCanvasEmit) {
        if (toShape) {
            if (toShape !== fromShape) {
                if (fromShape) {
                    this._emitEvent('dragleave', event, pointInfo, fromShape, fromShape, toShape);
                }
                this._emitEvent('dragenter', event, pointInfo, toShape, fromShape, toShape);
            }
            if (!isCanvasEmit) {
                this._emitEvent('dragover', event, pointInfo, toShape);
            }
        }
        else if (fromShape) {
            // TODO: 此处判断有问题，当 drag 图形时，也会触发一次 dragleave 事件，因为此时 toShape 为 null，这不是所期望的
            // 经过空白区域
            this._emitEvent('dragleave', event, pointInfo, fromShape, fromShape, toShape);
        }
        if (isCanvasEmit) {
            this._emitEvent('dragover', event, pointInfo, toShape);
        }
    };
    // drag 完成后，需要做一些清理工作
    EventController.prototype._afterDrag = function (draggingShape, pointInfo, event) {
        if (draggingShape) {
            draggingShape.set('capture', true); // 恢复可以拾取
            this.draggingShape = null;
        }
        this.dragging = false;
        // drag 完成后，有可能 draggingShape 已经移动到了当前位置，所以不能直接取当前图形
        var shape = this._getShape(pointInfo, event);
        // 拖拽完成后，进行 enter，leave 的判定
        if (shape !== draggingShape) {
            this._emitMouseoverEvents(event, pointInfo, draggingShape, shape);
        }
        this.currentShape = shape; // 更新当前 shape，如果不处理当前图形的 mouseleave 事件可能会出问题
    };
    // 按键抬起时，会终止拖拽、触发点击
    EventController.prototype._onmouseup = function (pointInfo, shape, event) {
        // eevent.button === 0 表示鼠标左键事件，此处加上判断主要是为了避免右键鼠标会触发 mouseup 和 click 事件
        // ref: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        if (event.button === LEFT_BTN_CODE) {
            var draggingShape = this.draggingShape;
            if (this.dragging) {
                // 存在可以拖拽的图形，同时拖拽到其他图形上时触发 drag 事件
                if (draggingShape) {
                    this._emitEvent('drop', event, pointInfo, shape);
                }
                this._emitEvent('dragend', event, pointInfo, draggingShape);
                this._afterDrag(draggingShape, pointInfo, event);
            }
            else {
                this._emitEvent('mouseup', event, pointInfo, shape); // 先触发 mouseup 再触发 click
                if (shape === this.mousedownShape) {
                    this._emitEvent('click', event, pointInfo, shape);
                }
                this.mousedownShape = null;
                this.mousedownPoint = null;
            }
        }
    };
    // 当触发浏览器的 dragover 事件时，不会再触发 mousemove ，所以这时候的 dragenter, dragleave 事件需要重新处理
    EventController.prototype._ondragover = function (pointInfo, shape, event) {
        event.preventDefault(); // 如果不对 dragover 进行 preventDefault，则不会在 canvas 上触发 drop 事件
        var preShape = this.currentShape;
        this._emitDragoverEvents(event, pointInfo, preShape, shape, true);
    };
    // 大量的图形事件，都通过 mousemove 模拟
    EventController.prototype._onmousemove = function (pointInfo, shape, event) {
        var canvas = this.canvas;
        var preShape = this.currentShape;
        var draggingShape = this.draggingShape;
        // 正在拖拽时
        if (this.dragging) {
            // 正在拖拽中
            if (draggingShape) {
                // 如果拖拽了 shape 会触发 dragenter, dragleave, dragover 和 drag 事件
                this._emitDragoverEvents(event, pointInfo, preShape, shape, false);
            }
            // 如果存在 draggingShape 则会在 draggingShape 上触发 drag 事件，冒泡到 canvas 上
            // 否则在 canvas 上触发 drag 事件
            this._emitEvent('drag', event, pointInfo, draggingShape);
        }
        else {
            var mousedownPoint = this.mousedownPoint;
            if (mousedownPoint) {
                // 当鼠标点击下去，同时移动时，进行 drag 判定
                var mousedownShape = this.mousedownShape;
                var now = event.timeStamp;
                var timeWindow = now - this.mousedownTimeStamp;
                var dx = mousedownPoint.clientX - pointInfo.clientX;
                var dy = mousedownPoint.clientY - pointInfo.clientY;
                var dist = dx * dx + dy * dy;
                if (timeWindow > 120 || dist > CLICK_OFFSET) {
                    if (mousedownShape && mousedownShape.get('draggable')) {
                        // 设置了 draggable 的 shape 才能触发 drag 相关的事件
                        draggingShape = this.mousedownShape; // 拖动鼠标点下时的 shape
                        draggingShape.set('capture', false); // 禁止继续拾取，否则无法进行 dragover,dragenter,dragleave,drop的判定
                        this.draggingShape = draggingShape;
                        this.dragging = true;
                        this._emitEvent('dragstart', event, pointInfo, draggingShape);
                        // 清理按下鼠标时缓存的值
                        this.mousedownShape = null;
                        this.mousedownPoint = null;
                    }
                    else if (!mousedownShape && canvas.get('draggable')) {
                        // 设置了 draggable 的 canvas 才能触发 drag 相关的事件
                        this.dragging = true;
                        this._emitEvent('dragstart', event, pointInfo, null);
                        // 清理按下鼠标时缓存的值
                        this.mousedownShape = null;
                        this.mousedownPoint = null;
                    }
                    else {
                        this._emitMouseoverEvents(event, pointInfo, preShape, shape);
                        this._emitEvent('mousemove', event, pointInfo, shape);
                    }
                }
                else {
                    this._emitMouseoverEvents(event, pointInfo, preShape, shape);
                    this._emitEvent('mousemove', event, pointInfo, shape);
                }
            }
            else {
                // 没有按键按下时，则直接触发 mouse over 相关的各种事件
                this._emitMouseoverEvents(event, pointInfo, preShape, shape);
                // 始终触发移动
                this._emitEvent('mousemove', event, pointInfo, shape);
            }
        }
    };
    // 触发事件
    EventController.prototype._emitEvent = function (type, event, pointInfo, shape, fromShape, toShape) {
        var eventObj = this._getEventObj(type, event, pointInfo, shape, fromShape, toShape);
        // 存在 shape 触发，则进行冒泡处理
        if (shape) {
            eventObj.shape = shape;
            // 触发 shape 上的事件
            emitTargetEvent(shape, type, eventObj);
            var parent_1 = shape.getParent();
            // 执行冒泡
            while (parent_1) {
                // 委托事件要先触发
                parent_1.emitDelegation(type, eventObj);
                // 事件冒泡停止，不能妨碍委托事件
                if (!eventObj.propagationStopped) {
                    bubbleEvent(parent_1, type, eventObj);
                }
                eventObj.propagationPath.push(parent_1);
                parent_1 = parent_1.getParent();
            }
        }
        else {
            // 如果没有 shape 直接在 canvas 上触发
            var canvas = this.canvas;
            // 直接触发 canvas 上的事件
            emitTargetEvent(canvas, type, eventObj);
        }
    };
    EventController.prototype.destroy = function () {
        // 清理事件
        this._clearEvents();
        // 清理缓存的对象
        this.canvas = null;
        this.currentShape = null;
        this.draggingShape = null;
        this.mousedownPoint = null;
        this.mousedownShape = null;
        this.mousedownTimeStamp = null;
    };
    return EventController;
}());
exports.default = EventController;
//# sourceMappingURL=event-contoller.js.map