import { __extends } from "tslib";
import Element from './element';
import { isFunction, isObject, each, removeFromArray, upperFirst, isAllowCapture } from '../util/util';
var SHAPE_MAP = {};
var INDEX = '_INDEX';
/**
 * 设置 canvas
 * @param {IElement} element 元素
 * @param {ICanvas}  canvas  画布
 */
function setCanvas(element, canvas) {
    element.set('canvas', canvas);
    if (element.isGroup()) {
        var children = element.get('children');
        if (children.length) {
            children.forEach(function (child) {
                setCanvas(child, canvas);
            });
        }
    }
}
/**
 * 设置 timeline
 * @param {IElement} element  元素
 * @param {Timeline} timeline 时间轴
 */
function setTimeline(element, timeline) {
    element.set('timeline', timeline);
    if (element.isGroup()) {
        var children = element.get('children');
        if (children.length) {
            children.forEach(function (child) {
                setTimeline(child, timeline);
            });
        }
    }
}
function contains(container, element) {
    var children = container.getChildren();
    return children.indexOf(element) >= 0;
}
function removeChild(container, element, destroy) {
    if (destroy === void 0) { destroy = true; }
    // 不再调用 element.remove() 方法，会出现循环调用
    if (destroy) {
        element.destroy();
    }
    else {
        element.set('parent', null);
        element.set('canvas', null);
    }
    removeFromArray(container.getChildren(), element);
}
function getComparer(compare) {
    return function (left, right) {
        var result = compare(left, right);
        return result === 0 ? left[INDEX] - right[INDEX] : result;
    };
}
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Container.prototype.isCanvas = function () {
        return false;
    };
    // 根据子节点确定 BBox
    Container.prototype.getBBox = function () {
        // 所有的值可能在画布的可视区外
        var minX = Infinity;
        var maxX = -Infinity;
        var minY = Infinity;
        var maxY = -Infinity;
        // 将可见元素、图形以及不为空的图形分组筛选出来，用于包围盒合并
        var children = this.getChildren().filter(function (child) {
            return child.get('visible') && (!child.isGroup() || (child.isGroup() && child.getChildren().length > 0));
        });
        if (children.length > 0) {
            each(children, function (child) {
                var _a = child.getBBox(), childMinX = _a.minX, childMaxX = _a.maxX, childMinY = _a.minY, childMaxY = _a.maxY;
                if (childMinX < minX) {
                    minX = childMinX;
                }
                if (childMaxX > maxX) {
                    maxX = childMaxX;
                }
                if (childMinY < minY) {
                    minY = childMinY;
                }
                if (childMaxY > maxY) {
                    maxY = childMaxY;
                }
            });
        }
        else {
            minX = 0;
            maxX = 0;
            minY = 0;
            maxY = 0;
        }
        var box = {
            x: minX,
            y: minY,
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY,
            width: maxX - minX,
            height: maxY - minY,
        };
        return box;
    };
    // 获取画布的包围盒
    Container.prototype.getCanvasBBox = function () {
        var minX = Infinity;
        var maxX = -Infinity;
        var minY = Infinity;
        var maxY = -Infinity;
        // 将可见元素、图形以及不为空的图形分组筛选出来，用于包围盒合并
        var children = this.getChildren().filter(function (child) {
            return child.get('visible') && (!child.isGroup() || (child.isGroup() && child.getChildren().length > 0));
        });
        if (children.length > 0) {
            each(children, function (child) {
                var _a = child.getCanvasBBox(), childMinX = _a.minX, childMaxX = _a.maxX, childMinY = _a.minY, childMaxY = _a.maxY;
                if (childMinX < minX) {
                    minX = childMinX;
                }
                if (childMaxX > maxX) {
                    maxX = childMaxX;
                }
                if (childMinY < minY) {
                    minY = childMinY;
                }
                if (childMaxY > maxY) {
                    maxY = childMaxY;
                }
            });
        }
        else {
            minX = 0;
            maxX = 0;
            minY = 0;
            maxY = 0;
        }
        var box = {
            x: minX,
            y: minY,
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY,
            width: maxX - minX,
            height: maxY - minY,
        };
        return box;
    };
    Container.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        cfg['children'] = [];
        return cfg;
    };
    Container.prototype.onAttrChange = function (name, value, originValue) {
        _super.prototype.onAttrChange.call(this, name, value, originValue);
        if (name === 'matrix') {
            var totalMatrix = this.getTotalMatrix();
            this._applyChildrenMarix(totalMatrix);
        }
    };
    // 不但应用到自己身上还要应用于子元素
    Container.prototype.applyMatrix = function (matrix) {
        var preTotalMatrix = this.getTotalMatrix();
        _super.prototype.applyMatrix.call(this, matrix);
        var totalMatrix = this.getTotalMatrix();
        // totalMatrix 没有发生变化时，这里仅考虑两者都为 null 时
        // 不继续向下传递矩阵
        if (totalMatrix === preTotalMatrix) {
            return;
        }
        this._applyChildrenMarix(totalMatrix);
    };
    // 在子元素上设置矩阵
    Container.prototype._applyChildrenMarix = function (totalMatrix) {
        var children = this.getChildren();
        each(children, function (child) {
            child.applyMatrix(totalMatrix);
        });
    };
    // 兼容老版本的接口
    Container.prototype.addShape = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var type = args[0];
        var cfg = args[1];
        if (isObject(type)) {
            cfg = type;
        }
        else {
            cfg['type'] = type;
        }
        var shapeType = SHAPE_MAP[cfg.type];
        if (!shapeType) {
            shapeType = upperFirst(cfg.type);
            SHAPE_MAP[cfg.type] = shapeType;
        }
        var ShapeBase = this.getShapeBase();
        var shape = new ShapeBase[shapeType](cfg);
        this.add(shape);
        return shape;
    };
    Container.prototype.addGroup = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var groupClass = args[0], cfg = args[1];
        var group;
        if (isFunction(groupClass)) {
            if (cfg) {
                group = new groupClass(cfg);
            }
            else {
                group = new groupClass({
                    // canvas,
                    parent: this,
                });
            }
        }
        else {
            var tmpCfg = groupClass || {};
            var TmpGroupClass = this.getGroupBase();
            group = new TmpGroupClass(tmpCfg);
        }
        this.add(group);
        return group;
    };
    Container.prototype.getCanvas = function () {
        var canvas;
        if (this.isCanvas()) {
            canvas = this;
        }
        else {
            canvas = this.get('canvas');
        }
        return canvas;
    };
    Container.prototype.getShape = function (x, y, ev) {
        // 如果不支持拾取，则直接返回
        if (!isAllowCapture(this)) {
            return null;
        }
        var children = this.getChildren();
        var shape;
        // 如果容器是 group
        if (!this.isCanvas()) {
            var v = [x, y, 1];
            // 将 x, y 转换成对应于 group 的局部坐标
            v = this.invertFromMatrix(v);
            if (!this.isClipped(v[0], v[1])) {
                shape = this._findShape(children, v[0], v[1], ev);
            }
        }
        else {
            shape = this._findShape(children, x, y, ev);
        }
        return shape;
    };
    Container.prototype._findShape = function (children, x, y, ev) {
        var shape = null;
        for (var i = children.length - 1; i >= 0; i--) {
            var child = children[i];
            if (isAllowCapture(child)) {
                if (child.isGroup()) {
                    shape = child.getShape(x, y, ev);
                }
                else if (child.isHit(x, y)) {
                    shape = child;
                }
            }
            if (shape) {
                break;
            }
        }
        return shape;
    };
    Container.prototype.add = function (element) {
        var canvas = this.getCanvas();
        var children = this.getChildren();
        var timeline = this.get('timeline');
        var preParent = element.getParent();
        if (preParent) {
            removeChild(preParent, element, false);
        }
        element.set('parent', this);
        if (canvas) {
            setCanvas(element, canvas);
        }
        if (timeline) {
            setTimeline(element, timeline);
        }
        children.push(element);
        element.onCanvasChange('add');
        this._applyElementMatrix(element);
    };
    // 将当前容器的矩阵应用到子元素
    Container.prototype._applyElementMatrix = function (element) {
        var totalMatrix = this.getTotalMatrix();
        // 添加图形或者分组时，需要把当前图元的矩阵设置进去
        if (totalMatrix) {
            element.applyMatrix(totalMatrix);
        }
    };
    Container.prototype.getChildren = function () {
        return (this.get('children') || []);
    };
    Container.prototype.sort = function () {
        var children = this.getChildren();
        // 稳定排序
        each(children, function (child, index) {
            child[INDEX] = index;
            return child;
        });
        children.sort(getComparer(function (obj1, obj2) {
            return obj1.get('zIndex') - obj2.get('zIndex');
        }));
        this.onCanvasChange('sort');
    };
    Container.prototype.clear = function () {
        this.set('clearing', true);
        if (this.destroyed) {
            return;
        }
        var children = this.getChildren();
        for (var i = children.length - 1; i >= 0; i--) {
            children[i].destroy(); // 销毁子元素
        }
        this.set('children', []);
        this.onCanvasChange('clear');
        this.set('clearing', false);
    };
    Container.prototype.destroy = function () {
        if (this.get('destroyed')) {
            return;
        }
        this.clear();
        _super.prototype.destroy.call(this);
    };
    /**
     * 获取第一个子元素
     * @return {IElement} 第一个元素
     */
    Container.prototype.getFirst = function () {
        return this.getChildByIndex(0);
    };
    /**
     * 获取最后一个子元素
     * @return {IElement} 元素
     */
    Container.prototype.getLast = function () {
        var children = this.getChildren();
        return this.getChildByIndex(children.length - 1);
    };
    /**
     * 根据索引获取子元素
     * @return {IElement} 第一个元素
     */
    Container.prototype.getChildByIndex = function (index) {
        var children = this.getChildren();
        return children[index];
    };
    /**
     * 子元素的数量
     * @return {number} 子元素数量
     */
    Container.prototype.getCount = function () {
        var children = this.getChildren();
        return children.length;
    };
    /**
     * 是否包含对应元素
     * @param {IElement} element 元素
     * @return {boolean}
     */
    Container.prototype.contain = function (element) {
        var children = this.getChildren();
        return children.indexOf(element) > -1;
    };
    /**
     * 移除对应子元素
     * @param {IElement} element 子元素
     * @param {boolean} destroy 是否销毁子元素，默认为 true
     */
    Container.prototype.removeChild = function (element, destroy) {
        if (destroy === void 0) { destroy = true; }
        if (this.contain(element)) {
            element.remove(destroy);
        }
    };
    /**
     * 查找所有匹配的元素
     * @param  {ElementFilterFn}   fn  匹配函数
     * @return {IElement[]} 元素数组
     */
    Container.prototype.findAll = function (fn) {
        var rst = [];
        var children = this.getChildren();
        each(children, function (element) {
            if (fn(element)) {
                rst.push(element);
            }
            if (element.isGroup()) {
                rst = rst.concat(element.findAll(fn));
            }
        });
        return rst;
    };
    /**
     * 查找元素，找到第一个返回
     * @param  {ElementFilterFn} fn    匹配函数
     * @return {IElement|null} 元素，可以为空
     */
    Container.prototype.find = function (fn) {
        var rst = null;
        var children = this.getChildren();
        each(children, function (element) {
            if (fn(element)) {
                rst = element;
            }
            else if (element.isGroup()) {
                rst = element.find(fn);
            }
            if (rst) {
                return false;
            }
        });
        return rst;
    };
    /**
     * 根据 ID 查找元素
     * @param {string} id 元素 id
     * @return {IElement|null} 元素
     */
    Container.prototype.findById = function (id) {
        return this.find(function (element) {
            return element.get('id') === id;
        });
    };
    /**
     * 该方法即将废弃，不建议使用
     * 根据 className 查找元素
     * TODO: 该方式定义暂时只给 G6 3.3 以后的版本使用，待 G6 中的 findByClassName 方法移除后，G 也需要同步移除
     * @param {string} className 元素 className
     * @return {IElement | null} 元素
     */
    Container.prototype.findByClassName = function (className) {
        return this.find(function (element) {
            return element.get('className') === className;
        });
    };
    /**
     * 根据 name 查找元素列表
     * @param {string}      name 元素名称
     * @return {IElement[]} 元素
     */
    Container.prototype.findAllByName = function (name) {
        return this.findAll(function (element) {
            return element.get('name') === name;
        });
    };
    return Container;
}(Element));
export default Container;
//# sourceMappingURL=container.js.map