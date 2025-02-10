import { __assign, __read } from "tslib";
import { getArcParams } from '@antv/g-canvas';
import { isNumberEqual, isEqual, isFunction } from '@antv/util';
import { getArcPath, getSectorPath } from '../../util/graphics';
function getAngle(startPoint, arcPath) {
    var _a;
    var _b = getArcParams(startPoint, arcPath), startAngle = _b.startAngle, endAngle = _b.endAngle;
    if (!isNumberEqual(startAngle, -Math.PI * 0.5) && startAngle < -Math.PI * 0.5) {
        startAngle += Math.PI * 2;
    }
    if (!isNumberEqual(endAngle, -Math.PI * 0.5) && endAngle < -Math.PI * 0.5) {
        endAngle += Math.PI * 2;
    }
    if (arcPath[5] === 0) {
        // 逆时针，需要将 startAngle 和 endAngle 转置，因为 G2 极坐标系为顺时针方向
        _a = __read([endAngle, startAngle], 2), startAngle = _a[0], endAngle = _a[1];
    }
    if (isNumberEqual(startAngle, Math.PI * 1.5)) {
        startAngle = Math.PI * -0.5;
    }
    // 当 startAngle, endAngle 接近相等时，不进行 endAngle = Math.PI * 1.5 防止变化从整个圆开始
    if (isNumberEqual(endAngle, Math.PI * -0.5) && !isNumberEqual(startAngle, endAngle)) {
        endAngle = Math.PI * 1.5;
    }
    return {
        startAngle: startAngle,
        endAngle: endAngle,
    };
}
function getArcStartPoint(path) {
    var startPoint;
    if (path[0] === 'M' || path[0] === 'L') {
        startPoint = [path[1], path[2]];
    }
    else if (path[0] === 'a' || path[0] === 'A' || path[0] === 'C') {
        startPoint = [path[path.length - 2], path[path.length - 1]];
    }
    return startPoint;
}
/**
 * path 存在以下情况
 * 1. 饼图不为整圆的 path，命令为 M, L, A, L, Z
 * 2. 饼图为整圆的 path，命令为 M, M, A, A, M, Z
 * 3. 环图不为整圆的 path，命令为 M, A, L, A, L, Z
 * 4. 环图为整圆的 path，命令为 M, A, A, M, A, A, M, Z
 * 5. radial-line, 不为整圆时的 path, 命令为 M, A, A, Z
 * 6. radial-line, 为整圆时的 path，命令为 M, A, A, A, A, Z
 * @param path theta 坐标系下圆弧的 path 命令
 */
export function getArcInfo(path) {
    var _a;
    var startAngle;
    var endAngle;
    var arcPaths = path.filter(function (command) {
        return command[0] === 'A' || command[0] === 'a';
    });
    if (arcPaths.length === 0) {
        return {
            startAngle: 0,
            endAngle: 0,
            radius: 0,
            innerRadius: 0,
        };
    }
    var firstArcPathCommand = arcPaths[0];
    var lastArcPathCommand = arcPaths.length > 1 ? arcPaths[1] : arcPaths[0];
    var firstIndex = path.indexOf(firstArcPathCommand);
    var lastIndex = path.indexOf(lastArcPathCommand);
    var firstStartPoint = getArcStartPoint(path[firstIndex - 1]);
    var lastStartPoint = getArcStartPoint(path[lastIndex - 1]);
    var _b = getAngle(firstStartPoint, firstArcPathCommand), firstStartAngle = _b.startAngle, firstEndAngle = _b.endAngle;
    var _c = getAngle(lastStartPoint, lastArcPathCommand), lastStartAngle = _c.startAngle, lastEndAngle = _c.endAngle;
    if (isNumberEqual(firstStartAngle, lastStartAngle) && isNumberEqual(firstEndAngle, lastEndAngle)) {
        startAngle = firstStartAngle;
        endAngle = firstEndAngle;
    }
    else {
        startAngle = Math.min(firstStartAngle, lastStartAngle);
        endAngle = Math.max(firstEndAngle, lastEndAngle);
    }
    var radius = firstArcPathCommand[1];
    var innerRadius = arcPaths[arcPaths.length - 1][1];
    if (radius < innerRadius) {
        _a = __read([innerRadius, radius], 2), radius = _a[0], innerRadius = _a[1];
    }
    else if (radius === innerRadius) {
        innerRadius = 0;
    }
    return {
        startAngle: startAngle,
        endAngle: endAngle,
        radius: radius,
        innerRadius: innerRadius,
    };
}
/**
 * @ignore
 * 饼图更新动画
 * @param shape 文本图形
 * @param animateCfg
 * @param cfg
 */
export function sectorPathUpdate(shape, animateCfg, cfg) {
    var toAttrs = cfg.toAttrs, coordinate = cfg.coordinate;
    var path = toAttrs.path || [];
    var pathCommands = path.map(function (command) { return command[0]; });
    if (path.length < 1)
        return;
    var _a = getArcInfo(path), curStartAngle = _a.startAngle, curEndAngle = _a.endAngle, radius = _a.radius, innerRadius = _a.innerRadius;
    var _b = getArcInfo(shape.attr('path')), preStartAngle = _b.startAngle, preEndAngle = _b.endAngle;
    var center = coordinate.getCenter();
    var diffStartAngle = curStartAngle - preStartAngle;
    var diffEndAngle = curEndAngle - preEndAngle;
    // 没有 diff 时直接返回最终 attrs，不需要额外动画
    if (diffStartAngle === 0 && diffEndAngle === 0) {
        shape.attr(toAttrs);
        return;
    }
    shape.animate(function (ratio) {
        var onFrameStartAngle = preStartAngle + ratio * diffStartAngle;
        var onFrameEndAngle = preEndAngle + ratio * diffEndAngle;
        return __assign(__assign({}, toAttrs), { path: 
            // hack, 兼容 /examples/bar/basic/demo/radial-line.ts 动画
            isEqual(pathCommands, ['M', 'A', 'A', 'Z'])
                ? getArcPath(center.x, center.y, radius, onFrameStartAngle, onFrameEndAngle)
                : getSectorPath(center.x, center.y, radius, onFrameStartAngle, onFrameEndAngle, innerRadius) });
    }, __assign(__assign({}, animateCfg), { callback: function () {
            // 将 path 保持原始态，否则会影响 setState() 的动画
            shape.attr('path', path);
            isFunction(animateCfg.callback) && animateCfg.callback();
        } }));
}
//# sourceMappingURL=sector-path-update.js.map