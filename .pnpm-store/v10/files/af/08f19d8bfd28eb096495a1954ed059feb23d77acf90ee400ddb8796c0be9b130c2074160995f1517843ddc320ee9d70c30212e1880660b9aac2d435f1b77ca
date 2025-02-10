"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnglePoint = exports.getFactTitleConfig = void 0;
var constant_1 = require("../constant");
/**
 * @ignore
 * 获取 facet title 的最佳默认配置，防止
 */
function getFactTitleConfig(direction) {
    if ([constant_1.DIRECTION.TOP, constant_1.DIRECTION.BOTTOM].includes(direction)) {
        return {
            offsetX: 0,
            offsetY: direction === constant_1.DIRECTION.TOP ? -8 : 8,
            style: {
                textAlign: 'center',
                textBaseline: direction === constant_1.DIRECTION.TOP ? 'bottom' : 'top',
            },
        };
    }
    if ([constant_1.DIRECTION.LEFT, constant_1.DIRECTION.RIGHT].includes(direction)) {
        return {
            offsetX: direction === constant_1.DIRECTION.LEFT ? -8 : 8,
            offsetY: 0,
            style: {
                textAlign: direction === constant_1.DIRECTION.LEFT ? 'right' : 'left',
                textBaseline: 'middle',
                rotate: Math.PI / 2, // 文本阅读习惯从上往下
            },
        };
    }
    return {};
}
exports.getFactTitleConfig = getFactTitleConfig;
/**
 * @ignore
 * 根据角度，获取 ○ 上的点
 * @param center
 * @param r
 * @param angle
 */
function getAnglePoint(center, r, angle) {
    return {
        x: center.x + r * Math.cos(angle),
        y: center.y + r * Math.sin(angle),
    };
}
exports.getAnglePoint = getAnglePoint;
//# sourceMappingURL=facet.js.map