"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pieOuterLabelLayout = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var graphics_1 = require("../../../../util/graphics");
var util_2 = require("./util");
/** label text和line距离 4px */
var MARGIN = 4;
/**
 * 配置 labelline
 * @param item PolarLabelItem
 */
function drawLabelline(item /** PolarLabelItem */, coordinate) {
    /** 坐标圆心 */
    var center = coordinate.getCenter();
    /** 圆半径 */
    var radius = coordinate.getRadius();
    if (item && item.labelLine) {
        var angle = item.angle, labelOffset = item.offset;
        // 贴近圆周
        var startPoint = (0, graphics_1.polarToCartesian)(center.x, center.y, radius, angle);
        var itemX = item.x + (0, util_1.get)(item, 'offsetX', 0) * (Math.cos(angle) > 0 ? 1 : -1);
        var itemY = item.y + (0, util_1.get)(item, 'offsetY', 0) * (Math.sin(angle) > 0 ? 1 : -1);
        var endPoint = {
            x: itemX - Math.cos(angle) * MARGIN,
            y: itemY - Math.sin(angle) * MARGIN,
        };
        var smoothConnector = item.labelLine.smooth;
        var path = [];
        var dx = endPoint.x - center.x;
        var dy = endPoint.y - center.y;
        var endAngle = Math.atan(dy / dx);
        // 第三象限 & 第四象限
        if (dx < 0) {
            endAngle += Math.PI;
        }
        // 默认 smooth, undefined 也为 smooth
        if (smoothConnector === false) {
            if (!(0, util_1.isObject)(item.labelLine)) {
                // labelLine: true
                item.labelLine = {};
            }
            // 表示弧线的方向，0 表示从起点到终点沿逆时针画弧, 1 表示顺时针
            var sweepFlag = 0;
            // 第一象限
            if ((angle < 0 && angle > -Math.PI / 2) || angle > Math.PI * 1.5) {
                if (endPoint.y > startPoint.y) {
                    sweepFlag = 1;
                }
            }
            // 第二象限
            if (angle >= 0 && angle < Math.PI / 2) {
                if (endPoint.y > startPoint.y) {
                    sweepFlag = 1;
                }
            }
            // 第三象限
            if (angle >= Math.PI / 2 && angle < Math.PI) {
                if (startPoint.y > endPoint.y) {
                    sweepFlag = 1;
                }
            }
            // 第四象限
            if (angle < -Math.PI / 2 || (angle >= Math.PI && angle < Math.PI * 1.5)) {
                if (startPoint.y > endPoint.y) {
                    sweepFlag = 1;
                }
            }
            var distance = labelOffset / 2 > 4 ? 4 : Math.max(labelOffset / 2 - 1, 0);
            var breakPoint = (0, graphics_1.polarToCartesian)(center.x, center.y, radius + distance, angle);
            // 圆弧的结束点
            var breakPoint3 = (0, graphics_1.polarToCartesian)(center.x, center.y, radius + labelOffset / 2, endAngle);
            /**
             * @example
             * M 100 100 L100 90 A 50 50 0 0 0 150 50
             * 移动至 (100, 100), 连接到 (100, 90), 以 (50, 50) 为圆心，绘制圆弧至 (150, 50);
             * A 命令的第 4 个参数 large-arc-flag, 决定弧线是大于还是小于 180 度: 0 表示小角度弧，1 表示大角
             * 第 5 个参数: 是否顺时针绘制
             */
            // 默认小弧
            var largeArcFlag = 0;
            // step1: 移动至起点
            path.push("M ".concat(startPoint.x, " ").concat(startPoint.y));
            // step2: 连接拐点
            path.push("L ".concat(breakPoint.x, " ").concat(breakPoint.y));
            // step3: 绘制圆弧 至 结束点
            path.push("A ".concat(center.x, " ").concat(center.y, " 0 ").concat(largeArcFlag, " ").concat(sweepFlag, " ").concat(breakPoint3.x, " ").concat(breakPoint3.y));
            // step4: 连接结束点
            path.push("L ".concat(endPoint.x, " ").concat(endPoint.y));
        }
        else {
            var breakPoint = (0, graphics_1.polarToCartesian)(center.x, center.y, radius + (labelOffset / 2 > 4 ? 4 : Math.max(labelOffset / 2 - 1, 0)), angle);
            // G2 旧的拉线
            // path.push('Q', `${breakPoint.x}`, `${breakPoint.y}`, `${endPoint.x}`, `${endPoint.y}`);
            var xSign = startPoint.x < center.x ? 1 : -1;
            // step1: 连接结束点
            path.push("M ".concat(endPoint.x, " ").concat(endPoint.y));
            var slope1 = (startPoint.y - center.y) / (startPoint.x - center.x);
            var slope2 = (endPoint.y - center.y) / (endPoint.x - center.x);
            if (Math.abs(slope1 - slope2) > Math.pow(Math.E, -16)) {
                // step2: 绘制 curve line (起点 & 结合点与圆心的斜率不等时, 由于存在误差, 使用近似处理)
                path.push.apply(path, [
                    'C',
                    endPoint.x + xSign * 4,
                    endPoint.y,
                    2 * breakPoint.x - startPoint.x,
                    2 * breakPoint.y - startPoint.y,
                    startPoint.x,
                    startPoint.y,
                ]);
            }
            // step3: 连接至起点
            path.push("L ".concat(startPoint.x, " ").concat(startPoint.y));
        }
        item.labelLine.path = path.join(' ');
    }
}
/**
 * 饼图 outer-label 布局, 适用于 type = pie 且 label offset > 0 的标签
 */
function pieOuterLabelLayout(originalItems, labels, shapes, region) {
    var e_1, _a;
    var items = (0, util_1.filter)(originalItems, function (item) { return !(0, util_1.isNil)(item); });
    /** 坐标系 */
    var coordinate = labels[0] && labels[0].get('coordinate');
    if (!coordinate) {
        return;
    }
    /** 坐标圆心 */
    var center = coordinate.getCenter();
    /** 圆半径 */
    var radius = coordinate.getRadius();
    /** label shapes */
    var labelsMap = {};
    try {
        for (var labels_1 = tslib_1.__values(labels), labels_1_1 = labels_1.next(); !labels_1_1.done; labels_1_1 = labels_1.next()) {
            var labelShape = labels_1_1.value;
            labelsMap[labelShape.get('id')] = labelShape;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (labels_1_1 && !labels_1_1.done && (_a = labels_1.return)) _a.call(labels_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // note labelHeight 可以控制 label 的行高
    var labelHeight = (0, util_1.get)(items[0], 'labelHeight', 14);
    var labelOffset = (0, util_1.get)(items[0], 'offset', 0);
    if (labelOffset <= 0) {
        return;
    }
    var LEFT_HALF_KEY = 'left';
    var RIGHT_HALF_KEY = 'right';
    // step 1: separate labels
    var separateLabels = (0, util_1.groupBy)(items, function (item) { return (item.x < center.x ? LEFT_HALF_KEY : RIGHT_HALF_KEY); });
    var start = coordinate.start, end = coordinate.end;
    // step2: calculate totalHeight
    var totalHeight = Math.min((radius + labelOffset + labelHeight) * 2, coordinate.getHeight());
    var totalR = totalHeight / 2;
    /** labels 容器的范围(后续根据组件的布局设计进行调整) */
    var labelsContainerRange = {
        minX: start.x,
        maxX: end.x,
        minY: center.y - totalR,
        maxY: center.y + totalR,
    };
    // step 3: antiCollision
    (0, util_1.each)(separateLabels, function (half, key) {
        var maxLabelsCountForOneSide = Math.floor(totalHeight / labelHeight);
        if (half.length > maxLabelsCountForOneSide) {
            half.sort(function (a, b) {
                // sort by percentage DESC
                return b.percent - a.percent;
            });
            (0, util_1.each)(half, function (labelItem, idx) {
                if (idx + 1 > maxLabelsCountForOneSide) {
                    labelsMap[labelItem.id].set('visible', false);
                    labelItem.invisible = true;
                }
            });
        }
        (0, util_2.antiCollision)(half, labelHeight, labelsContainerRange);
    });
    (0, util_1.each)(separateLabels, function (half, key) {
        (0, util_1.each)(half, function (item) {
            var isRight = key === RIGHT_HALF_KEY;
            var labelShape = labelsMap[item.id];
            // because group could not effect content-shape, should set content-shape position manually
            var content = labelShape.getChildByIndex(0);
            // textShape 发生过调整
            if (content) {
                var r = radius + labelOffset;
                // (x - cx)^2 + (y - cy)^2 = totalR^2
                var dy = item.y - center.y;
                var rPow2 = Math.pow(r, 2);
                var dyPow2 = Math.pow(dy, 2);
                var dxPow2 = rPow2 - dyPow2 > 0 ? rPow2 - dyPow2 : 0;
                var dx = Math.sqrt(dxPow2);
                var dx_offset = Math.abs(Math.cos(item.angle) * r);
                if (!isRight) {
                    // left
                    item.x = center.x - Math.max(dx, dx_offset);
                }
                else {
                    // right
                    item.x = center.x + Math.max(dx, dx_offset);
                }
            }
            // adjust labelShape
            if (content) {
                content.attr('y', item.y);
                content.attr('x', item.x);
            }
            drawLabelline(item, coordinate);
        });
    });
}
exports.pieOuterLabelLayout = pieOuterLabelLayout;
//# sourceMappingURL=outer.js.map