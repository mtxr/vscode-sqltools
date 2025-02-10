/**
 * @file utils of label
 */
import { isNil, isNumber, some } from '@antv/util';
import { rotate } from '../../../util/transform';
/**
 * 查找 Label Group 中的文本 shape 对象
 * @param label
 */
export function findLabelTextShape(label) {
    return label.find(function (el) { return el.get('type') === 'text'; });
}
/**
 * 获取标签背景信息: box (无旋转) + rotation (旋转角度)
 */
export function getLabelBackgroundInfo(labelGroup, labelItem, padding) {
    if (padding === void 0) { padding = [0, 0, 0, 0]; }
    var content = labelGroup && labelGroup.getChildren()[0];
    if (content) {
        var labelShape = content.clone();
        // revert rotate
        if (labelItem === null || labelItem === void 0 ? void 0 : labelItem.rotate) {
            rotate(labelShape, -labelItem.rotate);
        }
        // use `getCanvasBBox`, because if Shape is been translated, `getBBox` is not the actual box position
        var _a = labelShape.getCanvasBBox(), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        labelShape.destroy();
        var boxPadding = padding;
        if (isNil(boxPadding)) {
            boxPadding = [2, 2, 2, 2];
        }
        else if (isNumber(boxPadding)) {
            boxPadding = new Array(4).fill(boxPadding);
        }
        return {
            x: x - boxPadding[3],
            y: y - boxPadding[0],
            width: width + boxPadding[1] + boxPadding[3],
            height: height + boxPadding[0] + boxPadding[2],
            rotation: (labelItem === null || labelItem === void 0 ? void 0 : labelItem.rotate) || 0,
        };
    }
    return { x: 0, y: 0, width: 0, height: 0, rotation: 0 };
}
/**
 * 计算两个矩形之间的堆叠区域面积
 */
export function getOverlapArea(a, b, margin) {
    if (margin === void 0) { margin = 0; }
    var xOverlap = Math.max(0, Math.min(a.x + a.width + margin, b.x + b.width + margin) - Math.max(a.x - margin, b.x - margin));
    var yOverlap = Math.max(0, Math.min(a.y + a.height + margin, b.y + b.height + margin) - Math.max(a.y - margin, b.y - margin));
    return xOverlap * yOverlap;
}
/** 检测是否和已布局的堆叠 */
export function checkShapeOverlap(cur, dones) {
    var box = cur.getBBox();
    return some(dones, function (done) {
        var target = done.getBBox();
        return getOverlapArea(box, target, 2) > 0;
    });
}
//# sourceMappingURL=index.js.map