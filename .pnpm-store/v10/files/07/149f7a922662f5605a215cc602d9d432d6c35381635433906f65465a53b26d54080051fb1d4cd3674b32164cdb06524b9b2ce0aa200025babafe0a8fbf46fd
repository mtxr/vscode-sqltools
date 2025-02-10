import { each, isArray, max, min } from '@antv/util';
import { parseStyle } from './parse';
import getArcParams from './arc-params';
import { mergeRegion, intersectRect } from './util';
import * as ArrowUtil from '../util/arrow';
var SHAPE_ATTRS_MAP = {
    fill: 'fillStyle',
    stroke: 'strokeStyle',
    opacity: 'globalAlpha',
};
export function applyAttrsToContext(context, element) {
    var attrs = element.attr();
    for (var k in attrs) {
        var v = attrs[k];
        // 转换一下不与 canvas 兼容的属性名
        var name_1 = SHAPE_ATTRS_MAP[k] ? SHAPE_ATTRS_MAP[k] : k;
        if (name_1 === 'matrix' && v) {
            // 设置矩阵
            context.transform(v[0], v[1], v[3], v[4], v[6], v[7]);
        }
        else if (name_1 === 'lineDash' && context.setLineDash) {
            // 设置虚线，只支持数组形式，非数组形式不做任何操作
            isArray(v) && context.setLineDash(v);
        }
        else {
            if (name_1 === 'strokeStyle' || name_1 === 'fillStyle') {
                // 如果存在渐变、pattern 这个开销有些大
                // 可以考虑缓存机制，通过 hasUpdate 来避免一些运算
                v = parseStyle(context, element, v);
            }
            else if (name_1 === 'globalAlpha') {
                // opacity 效果可以叠加，子元素的 opacity 需要与父元素 opacity 相乘
                v = v * context.globalAlpha;
            }
            context[name_1] = v;
        }
    }
}
export function drawChildren(context, children, region) {
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.cfg.visible) {
            child.draw(context, region);
        }
        else {
            child.skipDraw();
        }
    }
}
// 这个地方的逻辑比较复杂，简单画了一张图：https://www.yuque.com/antv/ou292n/pcgt5g#OW1QE
export function checkRefresh(canvas, children, region) {
    var refreshElements = canvas.get('refreshElements');
    // 先遍历需要刷新的元素，将这些元素的父元素也设置 refresh
    each(refreshElements, function (el) {
        if (el !== canvas) {
            var parent_1 = el.cfg.parent;
            while (parent_1 && parent_1 !== canvas && !parent_1.cfg.refresh) {
                parent_1.cfg.refresh = true;
                parent_1 = parent_1.cfg.parent;
            }
        }
    });
    if (refreshElements[0] === canvas) {
        setChildrenRefresh(children, region);
    }
    else {
        // 检查所有子元素是否可以刷新
        checkChildrenRefresh(children, region);
    }
}
// 检查所有的子元素是否应该更新
export function checkChildrenRefresh(children, region) {
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.cfg.visible) {
            // 先判断 hasChanged，因为它的优先级判断应该高于 refresh
            if (child.cfg.hasChanged) {
                // 如果节点发生了 change，则需要级联设置子元素的 refresh
                child.cfg.refresh = true;
                if (child.isGroup()) {
                    setChildrenRefresh(child.cfg.children, region);
                }
            }
            else if (child.cfg.refresh) {
                // 如果当前图形/分组 refresh = true，说明其子节点存在 changed
                if (child.isGroup()) {
                    checkChildrenRefresh(child.cfg.children, region);
                }
            }
            else {
                // 这个分支说明此次局部刷新，所有的节点和父元素没有发生变化，仅需要检查包围盒（缓存）是否相交即可
                var refresh = checkElementRefresh(child, region);
                child.cfg.refresh = refresh;
                if (refresh && child.isGroup()) {
                    // 如果需要刷新，说明子元素也需要刷新，继续进行判定
                    checkChildrenRefresh(child.cfg.children, region);
                }
            }
        }
    }
}
// 由于对改变的图形放入 refreshElements 时做了优化，判定父元素 changed 时不加入
// 那么有可能会出现 elements 都为空，所以最终 group
export function clearChanged(elements) {
    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        el.cfg.hasChanged = false;
        // 级联清理
        if (el.isGroup() && !el.destroyed) {
            clearChanged(el.cfg.children);
        }
    }
}
// 当某个父元素发生改变时，调用这个方法级联设置 refresh
function setChildrenRefresh(children, region) {
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (!child.cfg.visible) {
            continue;
        }
        // let refresh = true;
        // 获取缓存的 bbox，如果这个 bbox 还存在则说明父元素不是矩阵发生了改变
        // const bbox = child.cfg.canvasBBox;
        // if (bbox) {
        //   // 如果这时候
        //   refresh = intersectRect(bbox, region);
        // }
        child.cfg.refresh = true;
        // 如果需要刷新当前节点，所有的子元素设置 refresh
        if (child.isGroup()) {
            setChildrenRefresh(child.get('children'), region);
        }
    }
}
function checkElementRefresh(shape, region) {
    var bbox = shape.cfg.cacheCanvasBBox;
    var isAllow = shape.cfg.isInView && bbox && intersectRect(bbox, region);
    return isAllow;
}
// 绘制 path
export function drawPath(shape, context, attrs, arcParamsCache) {
    var path = attrs.path, startArrow = attrs.startArrow, endArrow = attrs.endArrow;
    if (!path) {
        return;
    }
    var currentPoint = [0, 0]; // 当前图形
    var startMovePoint = [0, 0]; // 开始 M 的点，可能会有多个
    var distance = {
        dx: 0,
        dy: 0,
    };
    context.beginPath();
    for (var i = 0; i < path.length; i++) {
        var params = path[i];
        var command = params[0];
        if (i === 0 && startArrow && startArrow.d) {
            var tangent = shape.getStartTangent();
            distance = ArrowUtil.getShortenOffset(tangent[0][0], tangent[0][1], tangent[1][0], tangent[1][1], startArrow.d);
        }
        else if (i === path.length - 2 && path[i + 1][0] === 'Z' && endArrow && endArrow.d) {
            // 为了防止结尾为 Z 的 segment 缩短不起效，需要取最后两个 segment 特殊处理
            var lastPath = path[i + 1];
            if (lastPath[0] === 'Z') {
                var tangent = shape.getEndTangent();
                distance = ArrowUtil.getShortenOffset(tangent[0][0], tangent[0][1], tangent[1][0], tangent[1][1], endArrow.d);
            }
        }
        else if (i === path.length - 1 && endArrow && endArrow.d) {
            if (path[0] !== 'Z') {
                var tangent = shape.getEndTangent();
                distance = ArrowUtil.getShortenOffset(tangent[0][0], tangent[0][1], tangent[1][0], tangent[1][1], endArrow.d);
            }
        }
        var dx = distance.dx, dy = distance.dy;
        // V,H,S,T 都在前面被转换成标准形式
        switch (command) {
            case 'M':
                context.moveTo(params[1] - dx, params[2] - dy);
                startMovePoint = [params[1], params[2]];
                break;
            case 'L':
                context.lineTo(params[1] - dx, params[2] - dy);
                break;
            case 'Q':
                context.quadraticCurveTo(params[1], params[2], params[3] - dx, params[4] - dy);
                break;
            case 'C':
                context.bezierCurveTo(params[1], params[2], params[3], params[4], params[5] - dx, params[6] - dy);
                break;
            case 'A': {
                var arcParams = void 0;
                // 为了加速绘制，可以提供参数的缓存，各个图形自己缓存
                if (arcParamsCache) {
                    arcParams = arcParamsCache[i];
                    if (!arcParams) {
                        arcParams = getArcParams(currentPoint, params);
                        arcParamsCache[i] = arcParams;
                    }
                }
                else {
                    arcParams = getArcParams(currentPoint, params);
                }
                var cx = arcParams.cx, cy = arcParams.cy, rx = arcParams.rx, ry = arcParams.ry, startAngle = arcParams.startAngle, endAngle = arcParams.endAngle, xRotation = arcParams.xRotation, sweepFlag = arcParams.sweepFlag;
                // 直接使用椭圆的 api
                if (context.ellipse) {
                    context.ellipse(cx, cy, rx, ry, xRotation, startAngle, endAngle, 1 - sweepFlag);
                }
                else {
                    var r = rx > ry ? rx : ry;
                    var scaleX = rx > ry ? 1 : rx / ry;
                    var scaleY = rx > ry ? ry / rx : 1;
                    context.translate(cx, cy);
                    context.rotate(xRotation);
                    context.scale(scaleX, scaleY);
                    context.arc(0, 0, r, startAngle, endAngle, 1 - sweepFlag);
                    context.scale(1 / scaleX, 1 / scaleY);
                    context.rotate(-xRotation);
                    context.translate(-cx, -cy);
                }
                break;
            }
            case 'Z':
                context.closePath();
                break;
            default:
                break;
        }
        // 有了 Z 后，当前节点从开始 M 的点开始
        if (command === 'Z') {
            currentPoint = startMovePoint;
        }
        else {
            var len = params.length;
            currentPoint = [params[len - 2], params[len - 1]];
        }
    }
}
// 刷新图形元素(Shape 或者 Group)
export function refreshElement(element, changeType) {
    var canvas = element.get('canvas');
    // 只有存在于 canvas 上时生效
    if (canvas) {
        if (changeType === 'remove') {
            // 一旦 remove，则无法在 element 上拿到包围盒
            // destroy 后所有属性都拿不到，所以需要暂存一下
            // 这是一段 hack 的代码
            element._cacheCanvasBBox = element.get('cacheCanvasBBox');
        }
        // 防止反复刷新
        if (!element.get('hasChanged')) {
            // 但是始终要标记为 hasChanged，便于后面进行局部渲染
            element.set('hasChanged', true);
            // 本来只有局部渲染模式下，才需要记录更新的元素队列
            // if (canvas.get('localRefresh')) {
            //   canvas.refreshElement(element, changeType, canvas);
            // }
            // 但对于 https://github.com/antvis/g/issues/422 的场景，全局渲染的模式下也需要记录更新的元素队列
            // 如果当前元素的父元素发生了改变，可以不放入队列，这句话大概能够提升 15% 的初次渲染性能
            if (!(element.cfg.parent && element.cfg.parent.get('hasChanged'))) {
                canvas.refreshElement(element, changeType, canvas);
                if (canvas.get('autoDraw')) {
                    canvas.draw();
                }
            }
        }
    }
}
export function getRefreshRegion(element) {
    var region;
    if (!element.destroyed) {
        var cacheBox = element.get('cacheCanvasBBox');
        var validCache = cacheBox && !!(cacheBox.width && cacheBox.height);
        var bbox = element.getCanvasBBox();
        var validBBox = bbox && !!(bbox.width && bbox.height);
        // 是否是有效 bbox 判定，一些 NaN 或者 宽高为 0 的情况过滤掉
        if (validCache && validBBox) {
            region = mergeRegion(cacheBox, bbox);
        }
        else if (validCache) {
            region = cacheBox;
        }
        else if (validBBox) {
            region = bbox;
        }
    }
    else {
        // 因为元素已经销毁所以无法获取到缓存的包围盒
        region = element['_cacheCanvasBBox'];
    }
    return region;
}
export function getMergedRegion(elements) {
    if (!elements.length) {
        return null;
    }
    var minXArr = [];
    var minYArr = [];
    var maxXArr = [];
    var maxYArr = [];
    each(elements, function (el) {
        var region = getRefreshRegion(el);
        if (region) {
            minXArr.push(region.minX);
            minYArr.push(region.minY);
            maxXArr.push(region.maxX);
            maxYArr.push(region.maxY);
        }
    });
    return {
        minX: min(minXArr),
        minY: min(minYArr),
        maxX: max(maxXArr),
        maxY: max(maxYArr),
    };
}
export function mergeView(region, viewRegion) {
    if (!region || !viewRegion) {
        return null;
    }
    // 不相交，则直接返回 null
    if (!intersectRect(region, viewRegion)) {
        return null;
    }
    return {
        minX: Math.max(region.minX, viewRegion.minX),
        minY: Math.max(region.minY, viewRegion.minY),
        maxX: Math.min(region.maxX, viewRegion.maxX),
        maxY: Math.min(region.maxY, viewRegion.maxY),
    };
}
//# sourceMappingURL=draw.js.map