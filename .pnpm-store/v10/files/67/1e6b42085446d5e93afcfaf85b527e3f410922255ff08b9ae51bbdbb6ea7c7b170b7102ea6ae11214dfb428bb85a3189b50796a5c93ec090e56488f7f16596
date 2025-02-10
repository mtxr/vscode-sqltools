import { each } from '@antv/util';
import { charAtLength, strLen } from '../../util/text';
var WRAP_CODE = '\n';
function wrapLabel(label, limitLength) {
    var text = label.attr('text');
    var labelLength = label.getBBox().width;
    var codeLength = strLen(text);
    var ellipsised = false;
    if (limitLength < labelLength) {
        var reseveLength = Math.floor((limitLength / labelLength) * codeLength);
        var newText = wrapText(text, reseveLength);
        label.attr('text', newText);
        ellipsised = true;
    }
    return ellipsised;
}
function wrapText(str, reseveLength) {
    var breakIndex = 0;
    var rst = '';
    for (var i = 0, index = 0; i < reseveLength;) {
        var charLength = charAtLength(str, index);
        if (i + charLength <= reseveLength) {
            rst += str[index];
            i += charAtLength(str, index);
            index++;
            breakIndex = index;
        }
        else {
            break;
        }
    }
    // 根据设计标准，文本折行不能超过两行
    var wrappedText = rst + WRAP_CODE + str.substring(breakIndex, str.length);
    return wrappedText;
}
export function wrapLabels(labelGroup, limitLength) {
    var children = labelGroup.getChildren();
    var wrapped = false;
    each(children, function (label) {
        var rst = wrapLabel(label, limitLength);
        wrapped = wrapped || rst;
    });
    return wrapped;
}
//# sourceMappingURL=auto-wrap.js.map