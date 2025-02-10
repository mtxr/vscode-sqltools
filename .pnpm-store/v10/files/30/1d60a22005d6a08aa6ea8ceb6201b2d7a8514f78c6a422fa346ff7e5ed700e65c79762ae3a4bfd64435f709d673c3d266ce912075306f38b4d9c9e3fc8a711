import { each, isArray, isNil, isNumber } from '@antv/util';
export function formatPadding(padding) {
    var top = 0;
    var left = 0;
    var right = 0;
    var bottom = 0;
    if (isNumber(padding)) {
        top = left = right = bottom = padding;
    }
    else if (isArray(padding)) {
        top = padding[0];
        right = !isNil(padding[1]) ? padding[1] : padding[0];
        bottom = !isNil(padding[2]) ? padding[2] : padding[0];
        left = !isNil(padding[3]) ? padding[3] : right;
    }
    return [top, right, bottom, left];
}
export function clearDom(container) {
    var children = container.childNodes;
    var length = children.length;
    for (var i = length - 1; i >= 0; i--) {
        container.removeChild(children[i]);
    }
}
export function hasClass(elements, cName) {
    return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
}
export function regionToBBox(region) {
    var start = region.start, end = region.end;
    var minX = Math.min(start.x, end.x);
    var minY = Math.min(start.y, end.y);
    var maxX = Math.max(start.x, end.x);
    var maxY = Math.max(start.y, end.y);
    return {
        x: minX,
        y: minY,
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY,
        width: maxX - minX,
        height: maxY - minY,
    };
}
export function pointsToBBox(points) {
    var xs = points.map(function (point) { return point.x; });
    var ys = points.map(function (point) { return point.y; });
    var minX = Math.min.apply(Math, xs);
    var minY = Math.min.apply(Math, ys);
    var maxX = Math.max.apply(Math, xs);
    var maxY = Math.max.apply(Math, ys);
    return {
        x: minX,
        y: minY,
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY,
        width: maxX - minX,
        height: maxY - minY,
    };
}
export function createBBox(x, y, width, height) {
    var maxX = x + width;
    var maxY = y + height;
    return {
        x: x,
        y: y,
        width: width,
        height: height,
        minX: x,
        minY: y,
        // 非常奇葩的 js 特性
        // Infinity + Infinity = Infinity
        // Infinity - Infinity = NaN
        // fixed https://github.com/antvis/G2Plot/issues/1243
        maxX: isNaN(maxX) ? 0 : maxX,
        maxY: isNaN(maxY) ? 0 : maxY,
    };
}
export function getValueByPercent(min, max, percent) {
    return (1 - percent) * min + max * percent;
}
export function getCirclePoint(center, radius, angle) {
    return {
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
    };
}
export function distance(p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}
export var wait = function (interval) {
    return new Promise(function (resolve) {
        setTimeout(resolve, interval);
    });
};
/**
 * 判断两个数值 是否接近
 * - 解决精度问题（由于无法确定精度上限，根据具体场景可传入 精度 参数）
 */
export var near = function (x, y, e) {
    if (e === void 0) { e = Math.pow(Number.EPSILON, 0.5); }
    return [x, y].includes(Infinity) ? Math.abs(x) === Math.abs(y) : Math.abs(x - y) < e;
};
export function intersectBBox(box1, box2) {
    var minX = Math.max(box1.minX, box2.minX);
    var minY = Math.max(box1.minY, box2.minY);
    var maxX = Math.min(box1.maxX, box2.maxX);
    var maxY = Math.min(box1.maxY, box2.maxY);
    return createBBox(minX, minY, maxX - minX, maxY - minY);
}
export function mergeBBox(box1, box2) {
    var minX = Math.min(box1.minX, box2.minX);
    var minY = Math.min(box1.minY, box2.minY);
    var maxX = Math.max(box1.maxX, box2.maxX);
    var maxY = Math.max(box1.maxY, box2.maxY);
    return createBBox(minX, minY, maxX - minX, maxY - minY);
}
export function getBBoxWithClip(element) {
    var clipShape = element.getClip();
    var clipBBox = clipShape && clipShape.getBBox();
    var bbox;
    if (!element.isGroup()) {
        // 如果是普通的图形
        bbox = element.getBBox();
    }
    else {
        var minX_1 = Infinity;
        var maxX_1 = -Infinity;
        var minY_1 = Infinity;
        var maxY_1 = -Infinity;
        var children = element.getChildren();
        if (children.length > 0) {
            each(children, function (child) {
                if (child.get('visible')) {
                    // 如果分组没有子元素，则直接跳过
                    if (child.isGroup() && child.get('children').length === 0) {
                        return true;
                    }
                    var box = getBBoxWithClip(child);
                    // 计算 4 个顶点
                    var leftTop = child.applyToMatrix([box.minX, box.minY, 1]);
                    var leftBottom = child.applyToMatrix([box.minX, box.maxY, 1]);
                    var rightTop = child.applyToMatrix([box.maxX, box.minY, 1]);
                    var rightBottom = child.applyToMatrix([box.maxX, box.maxY, 1]);
                    // 从中取最小的范围
                    var boxMinX = Math.min(leftTop[0], leftBottom[0], rightTop[0], rightBottom[0]);
                    var boxMaxX = Math.max(leftTop[0], leftBottom[0], rightTop[0], rightBottom[0]);
                    var boxMinY = Math.min(leftTop[1], leftBottom[1], rightTop[1], rightBottom[1]);
                    var boxMaxY = Math.max(leftTop[1], leftBottom[1], rightTop[1], rightBottom[1]);
                    if (boxMinX < minX_1) {
                        minX_1 = boxMinX;
                    }
                    if (boxMaxX > maxX_1) {
                        maxX_1 = boxMaxX;
                    }
                    if (boxMinY < minY_1) {
                        minY_1 = boxMinY;
                    }
                    if (boxMaxY > maxY_1) {
                        maxY_1 = boxMaxY;
                    }
                }
            });
        }
        else {
            minX_1 = 0;
            maxX_1 = 0;
            minY_1 = 0;
            maxY_1 = 0;
        }
        bbox = createBBox(minX_1, minY_1, maxX_1 - minX_1, maxY_1 - minY_1);
    }
    if (clipBBox) {
        return intersectBBox(bbox, clipBBox);
    }
    else {
        return bbox;
    }
}
export function updateClip(element, newElement) {
    if (!element.getClip() && !newElement.getClip()) {
        // 两者都没有 clip
        return;
    }
    var newClipShape = newElement.getClip();
    if (!newClipShape) {
        // 新的 element 没有 clip
        element.setClip(null); // 移除 clip
        return;
    }
    var clipCfg = {
        type: newClipShape.get('type'),
        attrs: newClipShape.attr(),
    };
    element.setClip(clipCfg);
}
export function toPx(number) {
    return number + "px";
}
export function getTextPoint(start, end, position, offset) {
    var lineLength = distance(start, end);
    var offsetPercent = offset / lineLength; // 计算间距同线的比例，用于计算最终的位置
    var percent = 0;
    if (position === 'start') {
        percent = 0 - offsetPercent;
    }
    else if (position === 'end') {
        percent = 1 + offsetPercent;
    }
    return {
        x: getValueByPercent(start.x, end.x, percent),
        y: getValueByPercent(start.y, end.y, percent),
    };
}
//# sourceMappingURL=util.js.map