import { each, isNumber } from '@antv/util';
import { getMaxLabelWidth } from '../../util/label';
import { getMatrixByAngle } from '../../util/matrix';
import Theme from '../../util/theme';
// 统一设置文本的角度
function setLabelsAngle(labels, angle) {
    each(labels, function (label) {
        var x = label.attr('x');
        var y = label.attr('y');
        var matrix = getMatrixByAngle({ x: x, y: y }, angle);
        label.attr('matrix', matrix);
    });
}
// 旋转文本
function labelRotate(isVertical, labelsGroup, limitLength, getAngle) {
    var labels = labelsGroup.getChildren();
    if (!labels.length) {
        return false;
    }
    if (!isVertical && labels.length < 2) {
        // 水平时至少有两个时才旋转
        return false;
    }
    var maxWidth = getMaxLabelWidth(labels);
    var isOverlap = false;
    if (isVertical) {
        // limitLength 为 0 或者 null 时不生效
        isOverlap = !!limitLength && maxWidth > limitLength;
    }
    else {
        // 同 limitLength 无关
        var tickWidth = Math.abs(labels[1].attr('x') - labels[0].attr('x'));
        isOverlap = maxWidth > tickWidth;
    }
    if (isOverlap) {
        var angle = getAngle(limitLength, maxWidth);
        setLabelsAngle(labels, angle);
    }
    return isOverlap;
}
export function getDefault() {
    return fixedAngle;
}
/**
 * 固定角度旋转文本
 * @param  {boolean} isVertical  是否垂直方向
 * @param  {IGroup}  labelsGroup 文本的 group
 * @param  {number}  limitLength 限定长度
 * @param  {number}  customRotate 自定义旋转角度
 * @return {boolean}             是否发生了旋转
 */
export function fixedAngle(isVertical, labelsGroup, limitLength, customRotate) {
    return labelRotate(isVertical, labelsGroup, limitLength, function () {
        if (isNumber(customRotate)) {
            return customRotate;
        }
        return isVertical ? Theme.verticalAxisRotate : Theme.horizontalAxisRotate;
    });
}
/**
 * 非固定角度旋转文本
 * @param  {boolean} isVertical  是否垂直方向
 * @param  {IGroup}  labelsGroup 文本的 group
 * @param  {number}  limitLength 限定长度
 * @return {boolean}             是否发生了旋转
 */
export function unfixedAngle(isVertical, labelsGroup, limitLength) {
    return labelRotate(isVertical, labelsGroup, limitLength, function (length, maxWidth) {
        if (!length) {
            // 如果没有设置 limitLength，则使用固定的角度旋转
            return isVertical ? Theme.verticalAxisRotate : Theme.horizontalAxisRotate;
        }
        if (isVertical) {
            // 垂直时不需要判定 limitLength > maxWidth ，因为此时不会 overlap
            return -Math.acos(length / maxWidth);
        }
        else {
            var angle = 0;
            if (length > maxWidth) {
                // 需要判定，asin 的参数 -1， 1
                angle = Math.PI / 4;
            }
            else {
                angle = Math.asin(length / maxWidth);
                if (angle > Math.PI / 4) {
                    // 大于 Math.PI / 4 时没意义
                    angle = Math.PI / 4;
                }
            }
            return angle;
        }
    });
}
//# sourceMappingURL=auto-rotate.js.map