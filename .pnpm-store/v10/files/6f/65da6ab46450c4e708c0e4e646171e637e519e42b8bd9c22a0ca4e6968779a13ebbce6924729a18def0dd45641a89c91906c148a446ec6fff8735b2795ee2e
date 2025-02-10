import { __values } from "tslib";
import { each, get, isNil, deepMix, groupBy } from '@antv/util';
import { polarToCartesian } from '../../../../util/graphics';
import { antiCollision } from './util';
import { translate } from '../../../../util/transform';
/** 拐点偏移量, 暂不可配置 */
var INFLECTION_OFFSET = 4;
/** 标签偏移量, distance between label and edge: offsetX */
var LABEL_OFFSET_X = 4;
/** 标签与牵引线的偏移量 */
var LABEL_TEXT_LINE_OFFSET = 4;
function drawLabelline(item, coordinate, inRight) {
    /** 坐标圆心 */
    var center = coordinate.getCenter();
    /** 圆半径 */
    var radius = coordinate.getRadius();
    var startPoint = {
        x: item.x - (inRight ? LABEL_TEXT_LINE_OFFSET : -LABEL_TEXT_LINE_OFFSET),
        y: item.y,
    };
    var inflectionPoint = polarToCartesian(center.x, center.y, radius + INFLECTION_OFFSET, item.angle);
    var p1 = { x: startPoint.x, y: startPoint.y };
    var p2 = { x: inflectionPoint.x, y: inflectionPoint.y };
    var endPoint = polarToCartesian(center.x, center.y, radius, item.angle);
    var path = '';
    // 文本被调整下去了，则添加拐点连接线
    if (startPoint.y !== inflectionPoint.y) {
        var offset = inRight ? 4 : -4;
        p1.y = startPoint.y;
        /** 是否在第一象限 */
        if (item.angle < 0 && item.angle >= -Math.PI / 2) {
            p1.x = Math.max(inflectionPoint.x, startPoint.x - offset);
            if (startPoint.y < inflectionPoint.y) {
                p2.y = p1.y;
            }
            else {
                p2.y = inflectionPoint.y;
                p2.x = Math.max(p2.x, p1.x - offset);
            }
        }
        /** 是否在 第二象限 */
        if (item.angle > 0 && item.angle < Math.PI / 2) {
            p1.x = Math.max(inflectionPoint.x, startPoint.x - offset);
            if (startPoint.y > inflectionPoint.y) {
                p2.y = p1.y;
            }
            else {
                p2.y = inflectionPoint.y;
                p2.x = Math.max(p2.x, p1.x - offset);
            }
        }
        /** 是否在 第三象限 */
        if (item.angle > Math.PI / 2) {
            p1.x = Math.min(inflectionPoint.x, startPoint.x - offset);
            if (startPoint.y > inflectionPoint.y) {
                p2.y = p1.y;
            }
            else {
                p2.y = inflectionPoint.y;
                p2.x = Math.min(p2.x, p1.x - offset);
            }
        }
        /** 是否在 第四象限 */
        if (item.angle < -Math.PI / 2) {
            p1.x = Math.min(inflectionPoint.x, startPoint.x - offset);
            if (startPoint.y < inflectionPoint.y) {
                p2.y = p1.y;
            }
            else {
                p2.y = inflectionPoint.y;
                p2.x = Math.min(p2.x, p1.x - offset);
            }
        }
    }
    path = [
        "M ".concat(startPoint.x, ",").concat(startPoint.y),
        "L ".concat(p1.x, ",").concat(p1.y),
        "L ".concat(p2.x, ",").concat(p2.y),
        "L ".concat(inflectionPoint.x, ",").concat(inflectionPoint.y),
        "L ".concat(endPoint.x, ",").concat(endPoint.y),
    ].join(' ');
    item.labelLine = deepMix({}, item.labelLine, { path: path });
}
/**
 * 饼图标签 spider 布局, 只适用于 pie-spider 的标签类型
 * region 应该是 labelsRenderer 容器的范围限制(便于后续组件间布局)
 */
export function pieSpiderLabelLayout(items, labels, shapes, region) {
    var e_1, _a;
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
        for (var labels_1 = __values(labels), labels_1_1 = labels_1.next(); !labels_1_1.done; labels_1_1 = labels_1.next()) {
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
    var labelHeight = get(items[0], 'labelHeight', 14);
    var labelOffset = Math.max(get(items[0], 'offset', 0), INFLECTION_OFFSET);
    // step 1: adjust items to spider
    each(items, function (item) {
        if (!item)
            return;
        var label = get(labelsMap, [item.id]);
        if (!label)
            return;
        var inRight = item.x > center.x || (item.x === center.x && item.y > center.y);
        var offsetX = !isNil(item.offsetX) ? item.offsetX : LABEL_OFFSET_X;
        var inflectionPoint = polarToCartesian(center.x, center.y, radius + INFLECTION_OFFSET, item.angle);
        var totalOffset = labelOffset + offsetX;
        item.x = center.x + (inRight ? 1 : -1) * (radius + totalOffset);
        item.y = inflectionPoint.y;
    });
    var start = coordinate.start, end = coordinate.end;
    var LEFT_HALF_KEY = 'left';
    var RIGHT_HALF_KEY = 'right';
    // step 1: separate labels
    var separateLabels = groupBy(items, function (item) { return (item.x < center.x ? LEFT_HALF_KEY : RIGHT_HALF_KEY); });
    // step2: calculate totalHeight
    var totalHeight = (radius + labelOffset) * 2 + labelHeight;
    each(separateLabels, function (half) {
        var halfHeight = half.length * labelHeight;
        if (halfHeight > totalHeight) {
            totalHeight = Math.min(halfHeight, Math.abs(start.y - end.y));
        }
    });
    /** labels 容器的范围(后续根据组件的布局设计进行调整) */
    var labelsContainerRange = {
        minX: start.x,
        maxX: end.x,
        minY: center.y - totalHeight / 2,
        maxY: center.y + totalHeight / 2,
    };
    // step 3: antiCollision
    each(separateLabels, function (half, key) {
        var maxLabelsCountForOneSide = totalHeight / labelHeight;
        if (half.length > maxLabelsCountForOneSide) {
            half.sort(function (a, b) {
                // sort by percentage DESC
                return b.percent - a.percent;
            });
            each(half, function (labelItem, idx) {
                if (idx > maxLabelsCountForOneSide) {
                    labelsMap[labelItem.id].set('visible', false);
                    labelItem.invisible = true;
                }
            });
        }
        antiCollision(half, labelHeight, labelsContainerRange);
    });
    var startY = labelsContainerRange.minY;
    var endY = labelsContainerRange.maxY;
    // step4: applyTo labels and adjust labelLines
    each(separateLabels, function (half, key) {
        var inRight = key === RIGHT_HALF_KEY;
        each(half, function (item) {
            var label = get(labelsMap, item && [item.id]);
            if (!label) {
                return;
            }
            // out of range, hidden
            if (item.y < startY || item.y > endY) {
                label.set('visible', false);
                return;
            }
            var labelContent = label.getChildByIndex(0);
            var box = labelContent.getCanvasBBox();
            var originalPos = { x: inRight ? box.x : box.maxX, y: box.y + box.height / 2 /** vertical-align: middle */ };
            translate(labelContent, item.x - originalPos.x /** 从 pos.x 移动到 item.x */, item.y - originalPos.y);
            // adjust labelLines
            if (item.labelLine) {
                drawLabelline(item, coordinate, inRight);
            }
        });
    });
}
//# sourceMappingURL=spider.js.map