import { each } from '@antv/util';
import { ellipsisLabel } from '../../util/label';
function ellipseLabels(isVertical, labelGroup, limitLength, position) {
    var children = labelGroup.getChildren();
    var ellipsisFlag = false;
    each(children, function (label) {
        var rst = ellipsisLabel(isVertical, label, limitLength, position);
        ellipsisFlag = ellipsisFlag || rst;
    });
    return ellipsisFlag;
}
export function getDefault() {
    return ellipsisTail;
}
export function ellipsisHead(isVertical, labelGroup, limitLength) {
    return ellipseLabels(isVertical, labelGroup, limitLength, 'head');
}
export function ellipsisTail(isVertical, labelGroup, limitLength) {
    return ellipseLabels(isVertical, labelGroup, limitLength, 'tail');
}
export function ellipsisMiddle(isVertical, labelGroup, limitLength) {
    return ellipseLabels(isVertical, labelGroup, limitLength, 'middle');
}
//# sourceMappingURL=auto-ellipsis.js.map