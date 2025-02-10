var onmessage = function (e) {
    // Copy from src/util/collision-detect.ts
    function generateUtils() {
        function dot(a, b) {
            return (a[0] || 0) * (b[0] || 0) + (a[1] || 0) * (b[1] || 0) + (a[2] || 0) * (b[2] || 0);
        }
        /**
         * 1. 获取投影轴
         */
        function getAxes(points /** 多边形的关键点 */) {
            // 目前先处理 平行矩形 的场景, 其他多边形不处理
            if (points.length > 4) {
                return [];
            }
            // 获取向量
            var vector = function (start, end) {
                return [end.x - start.x, end.y - start.y];
            };
            // 由于 矩形的平行原理，所以只有 2 条投影轴: A -> B, B -> C
            var AB = vector(points[0], points[1]);
            var BC = vector(points[1], points[2]);
            return [AB, BC];
        }
        /**
         * 绕指定点顺时针旋转后的点坐标
         * 默认绕原点旋转
         */
        function rotateAtPoint(point, deg, origin) {
            if (deg === void 0) { deg = 0; }
            if (origin === void 0) { origin = { x: 0, y: 0 }; }
            var x = point.x, y = point.y;
            return {
                x: (x - origin.x) * Math.cos(-deg) + (y - origin.y) * Math.sin(-deg) + origin.x,
                y: (origin.x - x) * Math.sin(-deg) + (y - origin.y) * Math.cos(-deg) + origin.y,
            };
        }
        /**
         * @private
         * 转化为顶点坐标数组
         *
         * @param {Object} box
         */
        function getRectPoints(box) {
            var points = [
                { x: box.x, y: box.y },
                { x: box.x + box.width, y: box.y },
                { x: box.x + box.width, y: box.y + box.height },
                { x: box.x, y: box.y + box.height },
            ];
            var rotation = box.rotation;
            if (rotation) {
                return [
                    rotateAtPoint(points[0], rotation, points[0]),
                    rotateAtPoint(points[1], rotation, points[0]),
                    rotateAtPoint(points[2], rotation, points[0]),
                    rotateAtPoint(points[3], rotation, points[0]),
                ];
            }
            return points;
        }
        /**
         * 2. 获取多边形在投影轴上的投影
         *
         * 向量的点积的其中一个几何含义是：一个向量在平行于另一个向量方向上的投影的数值乘积。
         * 由于投影轴是单位向量（长度为1），投影的长度为 x1 * x2 + y1 * y2
         */
        function getProjection(points /** 多边形的关键点 */, axis) {
            // 目前先处理矩形的场景
            if (points.length > 4) {
                return { min: 0, max: 0 };
            }
            var scalars = [];
            points.forEach(function (point) {
                scalars.push(dot([point.x, point.y], axis));
            });
            return { min: Math.min.apply(null, scalars), max: Math.max.apply(null, scalars) };
        }
        function isProjectionOverlap(projection1, projection2) {
            return projection1.max > projection2.min && projection1.min < projection2.max;
        }
        function isValidNumber(d) {
            return typeof d === 'number' && !Number.isNaN(d) && d !== Infinity && d !== -Infinity;
        }
        function isValidBox(box) {
            return ['x', 'y', 'width', 'height'].every(function (attr) { return isValidNumber(box[attr]); });
        }
        function isIntersectRect(box1, box2, margin) {
            if (margin === void 0) { margin = 0; }
            return !(box2.x > box1.x + box1.width + margin ||
                box2.x + box2.width < box1.x - margin ||
                box2.y > box1.y + box1.height + margin ||
                box2.y + box2.height < box1.y - margin);
        }
        function intersect(box1, box2, margin) {
            if (margin === void 0) { margin = 0; }
            if (!isValidBox(box1) || !isValidBox(box2))
                return false;
            // Quick detect, if rotation is null or zero.
            if (!box1.rotation && !box2.rotation) {
                return isIntersectRect(box1, box2, margin);
            }
            // 分别获取 4 个关键点
            var rect1Points = getRectPoints(box1);
            var rect2Points = getRectPoints(box2);
            // 获取所有投影轴
            var axes = getAxes(rect1Points).concat(getAxes(rect2Points));
            for (var i = 0; i < axes.length; i++) {
                var axis = axes[i];
                var projection1 = getProjection(rect1Points, axis);
                var projection2 = getProjection(rect2Points, axis);
                if (!isProjectionOverlap(projection1, projection2))
                    return false;
            }
            return true;
        }
        return { intersect: intersect };
    }
    var intersect = generateUtils().intersect;
    // Label layouts.
    function hideOverlap(items) {
        var boxes = items.slice();
        for (var i = 0; i < boxes.length; i++) {
            var box1 = boxes[i];
            if (box1.visible) {
                for (var j = i + 1; j < boxes.length; j++) {
                    var box2 = boxes[j];
                    if (box1 !== box2 && box2.visible) {
                        if (intersect(box1, box2)) {
                            box2.visible = false;
                        }
                    }
                }
            }
        }
        return boxes;
    }
    var methods = {
        'hide-overlap': hideOverlap,
    };
    // Main
    try {
        var eventData = JSON.parse(e.data);
        if (!eventData || !eventData.type || !methods[eventData.type])
            return;
        var type = eventData.type, items = eventData.items;
        var result = methods[type](items);
        self.postMessage(result);
    }
    catch (e) {
        throw e;
    }
};
var code = "\n   self.onmessage = ".concat(onmessage.toString(), "\n");
export { code };
//# sourceMappingURL=hide-overlap.js.map