"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScaleByField = exports.isInRecords = exports.getSiblingPoint = exports.getSilbings = exports.isInBox = exports.getSpline = exports.distance = exports.getComponents = exports.getElementsByPath = exports.getIntersectElements = exports.intersectRect = exports.getElementValue = exports.getElementsByState = exports.getElementsByField = exports.getElements = exports.getSiblingMaskElements = exports.getMaskedElements = exports.isMultipleMask = exports.isMask = exports.isSlider = exports.isList = exports.isElementChange = exports.getDelegationObject = exports.getCurrentElement = void 0;
var util_1 = require("@antv/util");
var path_1 = require("../../geometry/shape/util/path");
var bbox_1 = require("../../util/bbox");
var path_util_1 = require("@antv/path-util");
function getMaskBBox(context, tolerance) {
    var event = context.event;
    var maskShape = event.target;
    return getMaskBBoxByShape(maskShape, tolerance);
}
/**
 * 如果 mask BBox 过小则不返回
 */
function isValidMaskBBox(maskShape, tolerance) {
    var maskBBox = maskShape.getCanvasBBox();
    var width = maskBBox.width, height = maskBBox.height;
    return width > 0 && height > 0 && (width >= tolerance || height >= tolerance);
}
/**
 * 通过 maskShape 获取 mask 的 canvasBBox
 * @param maskShape
 * @param tolerance
 * @returns
 */
function getMaskBBoxByShape(maskShape, tolerance) {
    var maskBBox = maskShape.getCanvasBBox();
    return isValidMaskBBox(maskShape, tolerance) ? maskBBox : null;
}
/**
 * 获取 multiple 模式下 mask 的 canvasBBox 数组
 * @param context 上下文
 * @param tolerance box 宽高小于则不返回
 * @returns
 */
function getMultiMaskBBoxList(context, tolerance) {
    var maskShapes = context.event.maskShapes;
    return maskShapes.map(function (maskShape) { return getMaskBBoxByShape(maskShape, tolerance); }).filter(function (bBox) { return !!bBox; });
}
function getMaskPath(context, tolerance) {
    var event = context.event;
    var maskShape = event.target;
    return getMaskPathByMaskShape(maskShape, tolerance);
}
/**
 * 通过 maskShape 获取 mask path
 * @param maskShape
 * @param tolerance box 宽高小于则不返回
 * @returns
 */
function getMaskPathByMaskShape(maskShape, tolerance) {
    return isValidMaskBBox(maskShape, tolerance) ? maskShape.attr('path') : null;
}
/**
 * 获取 multiple 模式下 mask path 数组
 * @param context 上下文
 * @param tolerance box 宽高小于则不返回
 * @returns
 */
function getMultiMaskPathList(context, tolerance) {
    var maskShapes = context.event.maskShapes;
    return maskShapes.map(function (maskShape) { return getMaskPathByMaskShape(maskShape, tolerance); });
}
/**
 * 获取当前事件相关的图表元素
 * @param context 交互的上下文
 * @ignore
 */
function getCurrentElement(context) {
    var event = context.event;
    var element;
    var target = event.target;
    if (target) {
        element = target.get('element');
    }
    return element;
}
exports.getCurrentElement = getCurrentElement;
/**
 * 获取委托对象
 * @param context 上下文
 * @ignore
 */
function getDelegationObject(context) {
    var event = context.event;
    var target = event.target;
    var delegateObject;
    if (target) {
        delegateObject = target.get('delegateObject');
    }
    return delegateObject;
}
exports.getDelegationObject = getDelegationObject;
function isElementChange(context) {
    var event = context.event.gEvent;
    // 在同一个 element 内部移动，label 和 shape 之间
    if (event && event.fromShape && event.toShape && event.fromShape.get('element') === event.toShape.get('element')) {
        return false;
    }
    return true;
}
exports.isElementChange = isElementChange;
/**
 * 是否是列表组件
 * @param delegateObject 委托对象
 * @ignore
 */
function isList(delegateObject) {
    return delegateObject && delegateObject.component && delegateObject.component.isList();
}
exports.isList = isList;
/**
 * 是否是滑块组件
 * @param delegateObject 委托对象
 * @ignore
 */
function isSlider(delegateObject) {
    return delegateObject && delegateObject.component && delegateObject.component.isSlider();
}
exports.isSlider = isSlider;
/**
 * 是否由 mask 触发
 * @param context 上下文
 * @ignore
 */
function isMask(context) {
    var event = context.event;
    var target = event.target;
    return (target && (target === null || target === void 0 ? void 0 : target.get('name')) === 'mask') || isMultipleMask(context);
}
exports.isMask = isMask;
/**
 * 是否由 multiple mask 触发
 * @param context
 * @returns
 */
function isMultipleMask(context) {
    var _a;
    return ((_a = context.event.target) === null || _a === void 0 ? void 0 : _a.get('name')) === 'multi-mask';
}
exports.isMultipleMask = isMultipleMask;
/**
 * 获取被遮挡的 elements
 * @param context 上下文
 * @ignore
 */
function getMaskedElements(context, tolerance) {
    var target = context.event.target;
    // multiple 模式下
    if (isMultipleMask(context)) {
        return getMultiMaskedElements(context, tolerance);
    }
    // 正常模式下
    if (target.get('type') === 'path') {
        var maskPath = getMaskPath(context, tolerance);
        if (!maskPath) {
            return;
        }
        return getElementsByPath(context.view, maskPath);
    }
    var maskBBox = getMaskBBox(context, tolerance);
    // 如果 bbox 过小则不返回
    if (!maskBBox) {
        return null;
    }
    return getIntersectElements(context.view, maskBBox);
}
exports.getMaskedElements = getMaskedElements;
/**
 * 获取 multiple 模式下被 mask 遮挡的 elements
 * @param context 上下文
 * @returns
 */
function getMultiMaskedElements(context, tolerance) {
    var target = context.event.target;
    if (target.get('type') === 'path') {
        var maskPathList = getMultiMaskPathList(context, tolerance);
        if (maskPathList.length > 0) {
            return maskPathList.flatMap(function (maskPath) { return getElementsByPath(context.view, maskPath); });
        }
        return null;
    }
    var maskBBoxList = getMultiMaskBBoxList(context, tolerance);
    if (maskBBoxList.length > 0) {
        return maskBBoxList.flatMap(function (maskBBox) { return getIntersectElements(context.view, maskBBox); });
    }
    return null;
}
/**
 * @ignore
 */
function getSiblingMaskElements(context, sibling, tolerance) {
    // multiple 模式下
    if (isMultipleMask(context)) {
        return getSiblingMultiMaskedElements(context, sibling, tolerance);
    }
    // 正常模式下
    var maskBBox = getMaskBBox(context, tolerance);
    // 如果 bbox 过小则不返回
    if (!maskBBox) {
        return null;
    }
    return getSiblingMaskElementsByBBox(maskBBox, context, sibling);
}
exports.getSiblingMaskElements = getSiblingMaskElements;
/**
 * 通过 mashBBox 获取 sibling 模式下被 mask 遮挡的 elements
 * @param maskBBox
 * @param context 上下文
 * @param sibling sibling view
 * @returns
 */
function getSiblingMaskElementsByBBox(maskBBox, context, sibling) {
    var view = context.view;
    var start = getSiblingPoint(view, sibling, { x: maskBBox.x, y: maskBBox.y });
    var end = getSiblingPoint(view, sibling, { x: maskBBox.maxX, y: maskBBox.maxY });
    var box = {
        minX: start.x,
        minY: start.y,
        maxX: end.x,
        maxY: end.y,
    };
    return getIntersectElements(sibling, box);
}
/**
 * 获取 sibling 模式下被 multiple mask 遮挡的 elements
 * @param context 上下文
 * @param sibling sibling view
 * @param tolerance box 宽高小于则不返回
 * @returns
 */
function getSiblingMultiMaskedElements(context, sibling, tolerance) {
    var maskBBoxList = getMultiMaskBBoxList(context, tolerance);
    if (maskBBoxList.length > 0) {
        return maskBBoxList.flatMap(function (maskBBox) { return getSiblingMaskElementsByBBox(maskBBox, context, sibling); });
    }
    return null;
}
/**
 * 获取所有的图表元素
 * @param view View/Chart
 * @ignore
 */
function getElements(view) {
    var geometries = view.geometries;
    var rst = [];
    (0, util_1.each)(geometries, function (geom) {
        var elements = geom.elements;
        rst = rst.concat(elements);
    });
    if (view.views && view.views.length) {
        (0, util_1.each)(view.views, function (subView) {
            rst = rst.concat(getElements(subView));
        });
    }
    return rst;
}
exports.getElements = getElements;
/**
 * 获取所有的图表元素
 * @param view View/Chart
 * @param field 字段名
 * @param value 字段值
 * @ignore
 */
function getElementsByField(view, field, value) {
    var elements = getElements(view);
    return elements.filter(function (el) {
        return getElementValue(el, field) === value;
    });
}
exports.getElementsByField = getElementsByField;
/**
 * 根据状态名获取图表元素
 * @param view View/Chart
 * @param stateName 状态名
 * @ignore
 */
function getElementsByState(view, stateName) {
    var geometries = view.geometries;
    var rst = [];
    (0, util_1.each)(geometries, function (geom) {
        var elements = geom.getElementsBy(function (el) { return el.hasState(stateName); });
        rst = rst.concat(elements);
    });
    return rst;
}
exports.getElementsByState = getElementsByState;
/**
 * 获取图表元素对应字段的值
 * @param element 图表元素
 * @param field 字段名
 * @ignore
 */
function getElementValue(element, field) {
    var model = element.getModel();
    var record = model.data;
    var value;
    if ((0, util_1.isArray)(record)) {
        value = record[0][field];
    }
    else {
        value = record[field];
    }
    return value;
}
exports.getElementValue = getElementValue;
/**
 * 两个包围盒是否相交
 * @param box1 包围盒1
 * @param box2 包围盒2
 * @ignore
 */
function intersectRect(box1, box2) {
    return !(box2.minX > box1.maxX || box2.maxX < box1.minX || box2.minY > box1.maxY || box2.maxY < box1.minY);
}
exports.intersectRect = intersectRect;
/**
 * 获取包围盒内的图表元素
 * @param view View/Chart
 * @param box 包围盒
 * @ignore
 */
function getIntersectElements(view, box) {
    var elements = getElements(view);
    var rst = [];
    (0, util_1.each)(elements, function (el) {
        var shape = el.shape;
        var shapeBBox = shape.getCanvasBBox();
        if (intersectRect(box, shapeBBox)) {
            rst.push(el);
        }
    });
    return rst;
}
exports.getIntersectElements = getIntersectElements;
function pathToPoints(path) {
    var points = [];
    (0, util_1.each)(path, function (seg) {
        var command = seg[0];
        if (command !== 'A') {
            for (var i = 1; i < seg.length; i = i + 2) {
                points.push([seg[i], seg[i + 1]]);
            }
        }
        else {
            var length_1 = seg.length;
            points.push([seg[length_1 - 2], seg[length_1 - 1]]);
        }
    });
    return points;
}
/**
 * 获取包围盒内的图表元素
 * @param view View/Chart
 * @param path 路径
 * @ignore
 */
function getElementsByPath(view, path) {
    var elements = getElements(view);
    var points = pathToPoints(path);
    var rst = elements.filter(function (el) {
        var shape = el.shape;
        var shapePoints;
        if (shape.get('type') === 'path') {
            shapePoints = pathToPoints(shape.attr('path'));
        }
        else {
            var shapeBBox = shape.getCanvasBBox();
            shapePoints = (0, bbox_1.toPoints)(shapeBBox);
        }
        return (0, path_util_1.isPolygonsIntersect)(points, shapePoints);
    });
    return rst;
}
exports.getElementsByPath = getElementsByPath;
/**
 * 获取当前 View 的所有组件
 * @param view View/Chart
 * @ignore
 */
function getComponents(view) {
    return view.getComponents().map(function (co) { return co.component; });
}
exports.getComponents = getComponents;
/** @ignore */
function distance(p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}
exports.distance = distance;
/** @ignore */
function getSpline(points, z) {
    if (points.length <= 2) {
        return (0, path_1.getLinePath)(points, false);
    }
    var first = points[0];
    var arr = [];
    (0, util_1.each)(points, function (point) {
        arr.push(point.x);
        arr.push(point.y);
    });
    var path = (0, path_1.catmullRom2bezier)(arr, z, null);
    path.unshift(['M', first.x, first.y]);
    return path;
}
exports.getSpline = getSpline;
/**
 * 检测点是否在包围盒内
 * @param box 包围盒
 * @param point 点
 * @ignore
 */
function isInBox(box, point) {
    return box.x <= point.x && box.maxX >= point.x && box.y <= point.y && box.maxY > point.y;
}
exports.isInBox = isInBox;
/**
 * 获取同 view 同一级的 views
 * @param view 当前 view
 * @returns 同一级的 views
 * @ignore
 */
function getSilbings(view) {
    var parent = view.parent;
    var siblings = null;
    if (parent) {
        siblings = parent.views.filter(function (sub) { return sub !== view; });
    }
    return siblings;
}
exports.getSilbings = getSilbings;
function point2Normalize(view, point) {
    var coord = view.getCoordinate();
    return coord.invert(point);
}
/**
 * 将 view 上的一点转换成另一个 view 的点
 * @param view 当前的 view
 * @param sibling 同一层级的 view
 * @param point 指定点
 * @ignore
 */
function getSiblingPoint(view, sibling, point) {
    var normalPoint = point2Normalize(view, point);
    return sibling.getCoordinate().convert(normalPoint);
}
exports.getSiblingPoint = getSiblingPoint;
/**
 * 是否在记录中，临时因为所有的 view 中的数据不是引用，而使用的方法
 * 不同 view 上对数据的引用不相等，导致无法直接用 includes
 * 假设 x, y 值相等时是同一条数据，这个假设不完全正确，而改成 isEqual 则成本太高
 * 后面改成同一个引用时可以修改回来
 * @param records
 * @param record
 * @param xFiled
 * @param yField
 * @returns
 * @ignore
 */
function isInRecords(records, record, xFiled, yField) {
    var isIn = false;
    (0, util_1.each)(records, function (r) {
        if (r[xFiled] === record[xFiled] && r[yField] === record[yField]) {
            isIn = true;
            return false;
        }
    });
    return isIn;
}
exports.isInRecords = isInRecords;
// 级联获取 field 对应的 scale，如果 view 上没有，遍历子 view
function getScaleByField(view, field) {
    var scale = view.getScaleByField(field);
    if (!scale && view.views) {
        (0, util_1.each)(view.views, function (subView) {
            scale = getScaleByField(subView, field);
            if (scale) {
                return false; // 终止循环
            }
        });
    }
    return scale;
}
exports.getScaleByField = getScaleByField;
//# sourceMappingURL=util.js.map