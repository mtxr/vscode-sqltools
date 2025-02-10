"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlignPoint = exports.getPointByPosition = exports.getOutSides = void 0;
// 检测各边是否超出
function getOutSides(x, y, width, height, limitBox) {
    var hits = {
        left: x < limitBox.x,
        right: x + width > limitBox.x + limitBox.width,
        top: y < limitBox.y,
        bottom: y + height > limitBox.y + limitBox.height,
    };
    return hits;
}
exports.getOutSides = getOutSides;
function getPointByPosition(x, y, offset, width, height, position) {
    var px = x;
    var py = y;
    switch (position) {
        case 'left': // left center
            px = x - width - offset;
            py = y - height / 2;
            break;
        case 'right':
            px = x + offset;
            py = y - height / 2;
            break;
        case 'top':
            px = x - width / 2;
            py = y - height - offset;
            break;
        case 'bottom':
            // bottom
            px = x - width / 2;
            py = y + offset;
            break;
        default:
            // auto, 在 top-right
            px = x + offset;
            py = y - height - offset;
            break;
    }
    return {
        x: px,
        y: py,
    };
}
exports.getPointByPosition = getPointByPosition;
function getAlignPoint(x, y, offset, width, height, position, limitBox) {
    var point = getPointByPosition(x, y, offset, width, height, position);
    if (limitBox) {
        var outSides = getOutSides(point.x, point.y, width, height, limitBox);
        if (position === 'auto') {
            // 如果是 auto，默认 tooltip 在右上角，仅需要判定右侧和上测冲突即可
            if (outSides.right) {
                point.x = Math.max(0, x - width - offset);
            }
            if (outSides.top) {
                point.y = Math.max(0, y - height - offset);
            }
        }
        else if (position === 'top' || position === 'bottom') {
            if (outSides.left) {
                // 左侧躲避
                point.x = limitBox.x;
            }
            if (outSides.right) {
                // 右侧躲避
                point.x = limitBox.x + limitBox.width - width;
            }
            if (position === 'top' && outSides.top) {
                // 如果上面对齐检测上面，不检测下面
                point.y = y + offset;
            }
            if (position === 'bottom' && outSides.bottom) {
                point.y = y - height - offset;
            }
        }
        else {
            // 检测左右位置
            if (outSides.top) {
                point.y = limitBox.y;
            }
            if (outSides.bottom) {
                point.y = limitBox.y + limitBox.height - height;
            }
            if (position === 'left' && outSides.left) {
                point.x = x + offset;
            }
            if (position === 'right' && outSides.right) {
                point.x = x - width - offset;
            }
        }
    }
    return point;
}
exports.getAlignPoint = getAlignPoint;
//# sourceMappingURL=align.js.map