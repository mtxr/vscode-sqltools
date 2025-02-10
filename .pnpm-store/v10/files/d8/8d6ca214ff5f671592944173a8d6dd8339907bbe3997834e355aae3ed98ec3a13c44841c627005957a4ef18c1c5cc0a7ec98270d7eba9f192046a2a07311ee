import { __assign } from "tslib";
import { registerShape } from '@antv/g2';
import { get } from '@antv/util';
import { deepAssign } from '../../utils';
/**
 * 获取柱子 path
 * @param points
 */
function getRectPath(points) {
    var path = [];
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        if (point) {
            var action = i === 0 ? 'M' : 'L';
            path.push([action, point.x, point.y]);
        }
    }
    var first = points[0];
    path.push(['L', first.x, first.y]);
    path.push(['z']);
    return path;
}
/**
 * 获取填充属性
 * @param cfg 图形绘制数据
 */
function getFillAttrs(cfg) {
    return deepAssign({}, cfg.defaultStyle, cfg.style, { fill: cfg.color });
}
registerShape('interval', 'waterfall', {
    draw: function (cfg, container) {
        var customInfo = cfg.customInfo, points = cfg.points, nextPoints = cfg.nextPoints;
        var group = container.addGroup();
        // ① 绘制柱体
        var rectPath = this.parsePath(getRectPath(points));
        var fillAttrs = getFillAttrs(cfg);
        group.addShape('path', {
            attrs: __assign(__assign({}, fillAttrs), { path: rectPath }),
        });
        // ② 绘制连接线
        var leaderLineCfg = get(customInfo, 'leaderLine');
        if (leaderLineCfg && nextPoints) {
            var linkPath = [
                ['M', points[2].x, points[2].y],
                ['L', nextPoints[0].x, nextPoints[0].y],
            ];
            if (points[2].y === nextPoints[1].y) {
                linkPath[1] = ['L', nextPoints[1].x, nextPoints[1].y];
            }
            linkPath = this.parsePath(linkPath);
            group.addShape('path', {
                attrs: __assign({ path: linkPath }, (leaderLineCfg.style || {})),
            });
        }
        return group;
    },
});
//# sourceMappingURL=shape.js.map