import { IElement, IGroup } from '@antv/g-base';
import { each, isNumber } from '@antv/util';
import { getMaxLabelWidth } from '../../util/label';
import { getMatrixByAngle } from '../../util/matrix';
import Theme from '../../util/theme';

// 统一设置文本的角度
function setLabelsAngle(labels: IElement[], angle: number) {
  each(labels, (label) => {
    const x = label.attr('x');
    const y = label.attr('y');
    const matrix = getMatrixByAngle({ x, y }, angle);
    label.attr('matrix', matrix);
  });
}

type getAngleCallback = (limitLength: number, maxWidth: number) => number;

// 旋转文本
function labelRotate(
  isVertical: boolean,
  labelsGroup: IGroup,
  limitLength: number,
  getAngle: getAngleCallback
): boolean {
  const labels = labelsGroup.getChildren();
  if (!labels.length) {
    return false;
  }
  if (!isVertical && labels.length < 2) {
    // 水平时至少有两个时才旋转
    return false;
  }

  const maxWidth = getMaxLabelWidth(labels);
  let isOverlap = false;
  if (isVertical) {
    // limitLength 为 0 或者 null 时不生效
    isOverlap = !!limitLength && maxWidth > limitLength;
  } else {
    // 同 limitLength 无关
    const tickWidth = Math.abs(labels[1].attr('x') - labels[0].attr('x'));
    isOverlap = maxWidth > tickWidth;
  }

  if (isOverlap) {
    const angle = getAngle(limitLength, maxWidth);
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
export function fixedAngle(
  isVertical: boolean,
  labelsGroup: IGroup,
  limitLength: number,
  customRotate?: number
): boolean {
  return labelRotate(isVertical, labelsGroup, limitLength, () => {
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
export function unfixedAngle(isVertical: boolean, labelsGroup: IGroup, limitLength: number): boolean {
  return labelRotate(isVertical, labelsGroup, limitLength, (length, maxWidth) => {
    if (!length) {
      // 如果没有设置 limitLength，则使用固定的角度旋转
      return isVertical ? Theme.verticalAxisRotate : Theme.horizontalAxisRotate;
    }
    if (isVertical) {
      // 垂直时不需要判定 limitLength > maxWidth ，因为此时不会 overlap
      return -Math.acos(length / maxWidth);
    } else {
      let angle = 0;
      if (length > maxWidth) {
        // 需要判定，asin 的参数 -1， 1
        angle = Math.PI / 4;
      } else {
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
