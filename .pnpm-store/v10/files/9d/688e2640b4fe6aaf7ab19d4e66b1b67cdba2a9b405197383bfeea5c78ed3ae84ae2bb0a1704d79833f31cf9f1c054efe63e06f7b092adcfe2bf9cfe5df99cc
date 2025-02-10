import getArcParams from './get-arc-params';
import { isSamePoint } from './get-arc-params';
import parsePath from './parse-path';
// 点对称
function toSymmetry(point, center) {
    return [center[0] + (center[0] - point[0]), center[1] + (center[1] - point[1])];
}
export default function getSegments(path) {
    path = parsePath(path);
    var segments = [];
    var currentPoint = null; // 当前图形
    var nextParams = null; // 下一节点的 path 参数
    var startMovePoint = null; // 开始 M 的点，可能会有多个
    var lastStartMovePointIndex = 0; // 最近一个开始点 M 的索引
    var count = path.length;
    for (var i = 0; i < count; i++) {
        var params = path[i];
        nextParams = path[i + 1];
        var command = params[0];
        // 数学定义上的参数，便于后面的计算
        var segment = {
            command: command,
            prePoint: currentPoint,
            params: params,
            startTangent: null,
            endTangent: null,
        };
        switch (command) {
            case 'M':
                startMovePoint = [params[1], params[2]];
                lastStartMovePointIndex = i;
                break;
            case 'A':
                var arcParams = getArcParams(currentPoint, params);
                segment['arcParams'] = arcParams;
                break;
            default:
                break;
        }
        if (command === 'Z') {
            // 有了 Z 后，当前节点从开始 M 的点开始
            currentPoint = startMovePoint;
            // 如果当前点的命令为 Z，相当于当前点为最近一个 M 点，则下一个点直接指向最近一个 M 点的下一个点
            nextParams = path[lastStartMovePointIndex + 1];
        }
        else {
            var len = params.length;
            currentPoint = [params[len - 2], params[len - 1]];
        }
        if (nextParams && nextParams[0] === 'Z') {
            // 如果下一个点的命令为 Z，则下一个点直接指向最近一个 M 点
            nextParams = path[lastStartMovePointIndex];
            if (segments[lastStartMovePointIndex]) {
                // 如果下一个点的命令为 Z，则最近一个 M 点的前一个点为当前点
                segments[lastStartMovePointIndex].prePoint = currentPoint;
            }
        }
        segment['currentPoint'] = currentPoint;
        // 如果当前点与最近一个 M 点相同，则最近一个 M 点的前一个点为当前点的前一个点
        if (segments[lastStartMovePointIndex] &&
            isSamePoint(currentPoint, segments[lastStartMovePointIndex].currentPoint)) {
            segments[lastStartMovePointIndex].prePoint = segment.prePoint;
        }
        var nextPoint = nextParams ? [nextParams[nextParams.length - 2], nextParams[nextParams.length - 1]] : null;
        segment['nextPoint'] = nextPoint;
        // Add startTangent and endTangent
        var prePoint = segment.prePoint;
        if (['L', 'H', 'V'].includes(command)) {
            segment.startTangent = [prePoint[0] - currentPoint[0], prePoint[1] - currentPoint[1]];
            segment.endTangent = [currentPoint[0] - prePoint[0], currentPoint[1] - prePoint[1]];
        }
        else if (command === 'Q') {
            // 二次贝塞尔曲线只有一个控制点
            var cp = [params[1], params[2]];
            // 二次贝塞尔曲线的终点为 currentPoint
            segment.startTangent = [prePoint[0] - cp[0], prePoint[1] - cp[1]];
            segment.endTangent = [currentPoint[0] - cp[0], currentPoint[1] - cp[1]];
        }
        else if (command === 'T') {
            var preSegment = segments[i - 1];
            var cp = toSymmetry(preSegment.currentPoint, prePoint);
            if (preSegment.command === 'Q') {
                segment.command = 'Q';
                segment.startTangent = [prePoint[0] - cp[0], prePoint[1] - cp[1]];
                segment.endTangent = [currentPoint[0] - cp[0], currentPoint[1] - cp[1]];
            }
            else {
                segment.command = 'TL';
                segment.startTangent = [prePoint[0] - currentPoint[0], prePoint[1] - currentPoint[1]];
                segment.endTangent = [currentPoint[0] - prePoint[0], currentPoint[1] - prePoint[1]];
            }
        }
        else if (command === 'C') {
            // 三次贝塞尔曲线有两个控制点
            var cp1 = [params[1], params[2]];
            var cp2 = [params[3], params[4]];
            segment.startTangent = [prePoint[0] - cp1[0], prePoint[1] - cp1[1]];
            segment.endTangent = [currentPoint[0] - cp2[0], currentPoint[1] - cp2[1]];
            // horizontal line, eg. ['C', 100, 100, 100, 100, 200, 200]
            if (segment.startTangent[0] === 0 && segment.startTangent[1] === 0) {
                segment.startTangent = [cp1[0] - cp2[0], cp1[1] - cp2[1]];
            }
            if (segment.endTangent[0] === 0 && segment.endTangent[1] === 0) {
                segment.endTangent = [cp2[0] - cp1[0], cp2[1] - cp1[1]];
            }
        }
        else if (command === 'S') {
            var preSegment = segments[i - 1];
            var cp1 = toSymmetry(preSegment.currentPoint, prePoint);
            var cp2 = [params[1], params[2]];
            if (preSegment.command === 'C') {
                segment.command = 'C'; // 将 S 命令变换为 C 命令
                segment.startTangent = [prePoint[0] - cp1[0], prePoint[1] - cp1[1]];
                segment.endTangent = [currentPoint[0] - cp2[0], currentPoint[1] - cp2[1]];
            }
            else {
                segment.command = 'SQ'; // 将 S 命令变换为 SQ 命令
                segment.startTangent = [prePoint[0] - cp2[0], prePoint[1] - cp2[1]];
                segment.endTangent = [currentPoint[0] - cp2[0], currentPoint[1] - cp2[1]];
            }
        }
        else if (command === 'A') {
            var d = 0.001;
            var _a = segment['arcParams'] || {}, _b = _a.cx, cx = _b === void 0 ? 0 : _b, _c = _a.cy, cy = _c === void 0 ? 0 : _c, _d = _a.rx, rx = _d === void 0 ? 0 : _d, _e = _a.ry, ry = _e === void 0 ? 0 : _e, _f = _a.sweepFlag, sweepFlag = _f === void 0 ? 0 : _f, _g = _a.startAngle, startAngle = _g === void 0 ? 0 : _g, _h = _a.endAngle, endAngle = _h === void 0 ? 0 : _h;
            if (sweepFlag === 0) {
                d *= -1;
            }
            var dx1 = rx * Math.cos(startAngle - d) + cx;
            var dy1 = ry * Math.sin(startAngle - d) + cy;
            segment.startTangent = [dx1 - startMovePoint[0], dy1 - startMovePoint[1]];
            var dx2 = rx * Math.cos(startAngle + endAngle + d) + cx;
            var dy2 = ry * Math.sin(startAngle + endAngle - d) + cy;
            segment.endTangent = [prePoint[0] - dx2, prePoint[1] - dy2];
        }
        segments.push(segment);
    }
    return segments;
}
//# sourceMappingURL=path-2-segments.js.map