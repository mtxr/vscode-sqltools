import { __values } from "tslib";
import { isObject, each, find, get } from '@antv/util';
import { polarToCartesian } from '../../../../util/graphics';
/** label text和line距离 4px */
var MARGIN = 4;
function antiCollision(labelShapes, labels, lineHeight, plotRange, center, isRight) {
    var e_1, _a;
    // adjust y position of labels to avoid overlapping
    var overlapping = true;
    var start = plotRange.start;
    var end = plotRange.end;
    var startY = Math.min(start.y, end.y);
    var totalHeight = Math.abs(start.y - end.y);
    var i;
    var maxY = 0;
    var minY = Number.MIN_VALUE;
    var boxes = labels.map(function (label) {
        if (label.y > maxY) {
            maxY = label.y;
        }
        if (label.y < minY) {
            minY = label.y;
        }
        return {
            size: lineHeight,
            targets: [label.y - startY],
        };
    });
    minY -= startY;
    if (maxY - startY > totalHeight) {
        totalHeight = maxY - startY;
    }
    while (overlapping) {
        /* eslint no-loop-func: 0 */
        boxes.forEach(function (box) {
            var target = (Math.min.apply(minY, box.targets) + Math.max.apply(minY, box.targets)) / 2;
            box.pos = Math.min(Math.max(minY, target - box.size / 2), totalHeight - box.size);
            // box.pos = Math.max(0, target - box.size / 2);
        });
        // detect overlapping and join boxes
        overlapping = false;
        i = boxes.length;
        while (i--) {
            if (i > 0) {
                var previousBox = boxes[i - 1];
                var box = boxes[i];
                if (previousBox.pos + previousBox.size > box.pos) {
                    // overlapping
                    previousBox.size += box.size;
                    previousBox.targets = previousBox.targets.concat(box.targets);
                    // overflow, shift up
                    if (previousBox.pos + previousBox.size > totalHeight) {
                        previousBox.pos = totalHeight - previousBox.size;
                    }
                    boxes.splice(i, 1); // removing box
                    overlapping = true;
                }
            }
        }
    }
    i = 0;
    // step 4: normalize y and adjust x
    boxes.forEach(function (b) {
        var posInCompositeBox = startY + lineHeight / 2; // middle of the label
        b.targets.forEach(function () {
            labels[i].y = b.pos + posInCompositeBox;
            posInCompositeBox += lineHeight;
            i++;
        });
    });
    var labelsMap = {};
    try {
        for (var labelShapes_1 = __values(labelShapes), labelShapes_1_1 = labelShapes_1.next(); !labelShapes_1_1.done; labelShapes_1_1 = labelShapes_1.next()) {
            var labelShape = labelShapes_1_1.value;
            labelsMap[labelShape.get('id')] = labelShape;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (labelShapes_1_1 && !labelShapes_1_1.done && (_a = labelShapes_1.return)) _a.call(labelShapes_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // (x - cx)^2 + (y - cy)^2 = totalR^2
    labels.forEach(function (label) {
        var rPow2 = label.r * label.r;
        var dyPow2 = Math.pow(Math.abs(label.y - center.y), 2);
        if (rPow2 < dyPow2) {
            label.x = center.x;
        }
        else {
            var dx = Math.sqrt(rPow2 - dyPow2);
            if (!isRight) {
                // left
                label.x = center.x - dx;
            }
            else {
                // right
                label.x = center.x + dx;
            }
        }
        // adjust labelShape
        var labelShape = labelsMap[label.id];
        labelShape.attr('x', label.x);
        labelShape.attr('y', label.y);
        // because group could not effect text-shape, should set text-shape position manually
        var textShape = find(labelShape.getChildren(), function (ele) { return ele.get('type') === 'text'; });
        // @ts-ignore
        if (textShape) {
            textShape.attr('y', label.y);
            textShape.attr('x', label.x);
        }
    });
}
export function distribute(items, labels, shapes, region) {
    if (!items.length || !labels.length) {
        return;
    }
    var offset = items[0] ? items[0].offset : 0;
    var coordinate = labels[0].get('coordinate');
    var radius = coordinate.getRadius();
    var center = coordinate.getCenter();
    if (offset > 0) {
        // const lineHeight = get(this.geometry.theme, ['pieLabels', 'labelHeight'], 14);
        var lineHeight_1 = 14; // TODO
        var totalR = radius + offset;
        var totalHeight_1 = totalR * 2 + lineHeight_1 * 2;
        var plotRange_1 = {
            start: coordinate.start,
            end: coordinate.end,
        };
        // step 1: separate labels
        var halves_1 = [
            [],
            [], // right
        ];
        items.forEach(function (labelItem) {
            if (!labelItem) {
                return;
            }
            if (labelItem.textAlign === 'right') {
                // left
                halves_1[0].push(labelItem);
            }
            else {
                // right or center will be put on the right side
                halves_1[1].push(labelItem);
            }
        });
        halves_1.forEach(function (half, index) {
            // step 2: reduce labels
            var maxLabelsCountForOneSide = totalHeight_1 / lineHeight_1;
            if (half.length > maxLabelsCountForOneSide) {
                half.sort(function (a, b) {
                    // sort by percentage DESC
                    return b['..percent'] - a['..percent'];
                });
                half.splice(maxLabelsCountForOneSide, half.length - maxLabelsCountForOneSide);
            }
            // step 3: distribute position (x and y)
            half.sort(function (a, b) {
                // sort by y ASC
                return a.y - b.y;
            });
            antiCollision(labels, half, lineHeight_1, plotRange_1, center, index);
        });
    }
    // 配置 labelLine
    each(items, function (item) {
        if (item && item.labelLine) {
            var distance = item.offset;
            var angle = item.angle;
            // 贴近圆周
            var startPoint = polarToCartesian(center.x, center.y, radius, angle);
            var innerPoint = polarToCartesian(center.x, center.y, radius + distance / 2, angle);
            var itemX = item.x + get(item, 'offsetX', 0);
            var itemY = item.y + get(item, 'offsetY', 0);
            var endPoint = {
                x: itemX - Math.cos(angle) * MARGIN,
                y: itemY - Math.sin(angle) * MARGIN,
            };
            if (!isObject(item.labelLine)) {
                // labelLine: true
                item.labelLine = {};
            }
            item.labelLine.path = [
                "M ".concat(startPoint.x),
                "".concat(startPoint.y, " Q").concat(innerPoint.x),
                "".concat(innerPoint.y, " ").concat(endPoint.x),
                endPoint.y,
            ].join(',');
        }
    });
}
//# sourceMappingURL=distribute.js.map