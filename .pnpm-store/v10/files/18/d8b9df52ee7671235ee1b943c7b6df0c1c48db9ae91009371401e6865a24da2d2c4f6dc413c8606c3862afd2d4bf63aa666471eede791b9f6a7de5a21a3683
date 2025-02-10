import { each, pick } from '@antv/util';
import { getCoordinateBBox } from '../../../util/coordinate';
import { getEllipsisText } from '../../../util/text';
import { translate } from '../../../util/transform';
/**
 * @ignore
 * 将 label 限制在 Plot 范围内，将超出 Plot 范围的 label 可选择进行隐藏或者移动位置
 * @param labels
 * @param cfg
 */
export function limitInPlot(items, labels, shapes, region, cfg) {
    if (labels.length <= 0) {
        return;
    }
    var direction = (cfg === null || cfg === void 0 ? void 0 : cfg.direction) || ['top', 'right', 'bottom', 'left'];
    var action = (cfg === null || cfg === void 0 ? void 0 : cfg.action) || 'translate';
    var margin = (cfg === null || cfg === void 0 ? void 0 : cfg.margin) || 0;
    var coordinate = labels[0].get('coordinate');
    if (!coordinate) {
        return;
    }
    var _a = getCoordinateBBox(coordinate, margin), regionMinX = _a.minX, regionMinY = _a.minY, regionMaxX = _a.maxX, regionMaxY = _a.maxY;
    each(labels, function (label) {
        var _a = label.getCanvasBBox(), minX = _a.minX, minY = _a.minY, maxX = _a.maxX, maxY = _a.maxY, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        var finalX = x;
        var finalY = y;
        if (direction.indexOf('left') >= 0 && (minX < regionMinX || maxX < regionMinX)) {
            // 超出左侧
            finalX = regionMinX;
        }
        if (direction.indexOf('top') >= 0 && (minY < regionMinY || maxY < regionMinY)) {
            // 超出顶部
            finalY = regionMinY;
        }
        if (direction.indexOf('right') >= 0) {
            if (minX > regionMaxX) {
                // 整体超出右侧
                finalX = regionMaxX - width;
            }
            else if (maxX > regionMaxX) {
                // 超出右侧
                finalX = finalX - (maxX - regionMaxX);
            }
        }
        if (direction.indexOf('bottom') >= 0) {
            if (minY > regionMaxY) {
                // 整体超出底部
                finalY = regionMaxY - height;
            }
            else if (maxY > regionMaxY) {
                // 超出底部
                finalY = finalY - (maxY - regionMaxY);
            }
        }
        if (finalX !== x || finalY !== y) {
            var translateX_1 = finalX - x;
            if (action === 'translate') {
                translate(label, translateX_1, finalY - y);
            }
            else if (action === 'ellipsis') {
                var textShapes = label.findAll(function (shape) { return shape.get('type') === 'text'; });
                textShapes.forEach(function (textShape) {
                    var style = pick(textShape.attr(), ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'fontVariant']);
                    var textBox = textShape.getCanvasBBox();
                    var text = getEllipsisText(textShape.attr('text'), textBox.width - Math.abs(translateX_1), style);
                    textShape.attr('text', text);
                });
            }
            else {
                label.hide();
            }
        }
    });
}
//# sourceMappingURL=limit-in-plot.js.map