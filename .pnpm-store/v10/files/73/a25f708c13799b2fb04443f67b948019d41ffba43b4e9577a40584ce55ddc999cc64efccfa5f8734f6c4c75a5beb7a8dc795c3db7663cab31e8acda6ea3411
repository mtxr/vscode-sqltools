import { each } from '@antv/util';
import { translate } from '../../../util/transform';
/**
 * @ignore
 * 将 label 限制在画布范围内，简单得将超出画布的 label 往画布内调整
 * @param labels
 * @param cfg
 */
export function limitInCanvas(items, labels, shapes, region) {
    each(labels, function (label) {
        var regionMinX = region.minX, regionMinY = region.minY, regionMaxX = region.maxX, regionMaxY = region.maxY;
        var _a = label.getCanvasBBox(), minX = _a.minX, minY = _a.minY, maxX = _a.maxX, maxY = _a.maxY, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        var finalX = x;
        var finalY = y;
        if (minX < regionMinX || maxX < regionMinX) {
            // 超出左侧
            finalX = regionMinX;
        }
        if (minY < regionMinY || maxY < regionMinY) {
            // 超出顶部
            finalY = regionMinY;
        }
        if (minX > regionMaxX) {
            // 整体超出右侧
            finalX = regionMaxX - width;
        }
        else if (maxX > regionMaxX) {
            // 超出右侧
            finalX = finalX - (maxX - regionMaxX);
        }
        if (minY > regionMaxY) {
            // 整体超出顶部
            finalY = regionMaxY - height;
        }
        else if (maxY > regionMaxY) {
            // 超出底部
            finalY = finalY - (maxY - regionMaxY);
        }
        if (finalX !== x || finalY !== y) {
            translate(label, finalX - x, finalY - y);
        }
    });
}
//# sourceMappingURL=limit-in-canvas.js.map