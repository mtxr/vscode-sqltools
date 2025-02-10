import { IElement, IGroup } from '@antv/g-base';
import { each } from '@antv/util';
import { charAtLength, strLen } from '../../util/text';

const WRAP_CODE = '\n';

function wrapLabel(label: IElement, limitLength: number){
    const text = label.attr('text');
    const labelLength = label.getBBox().width;
    const codeLength = strLen(text);
    let ellipsised = false;
    if (limitLength < labelLength) {
        const reseveLength = Math.floor((limitLength / labelLength) * codeLength);
        const newText = wrapText(text,reseveLength);
        label.attr('text', newText);
        ellipsised = true;
    }
    return ellipsised;
}

function wrapText(str: string, reseveLength: number){
    let breakIndex = 0;
    let rst = '';
    for (let i = 0, index = 0; i < reseveLength; ) {
        const charLength = charAtLength(str, index);
        if (i + charLength <= reseveLength) {
            rst += str[index];
            i += charAtLength(str, index);
            index++;
            breakIndex = index;
          } else {
            break;
          }
    }
    // 根据设计标准，文本折行不能超过两行
    const wrappedText = rst + WRAP_CODE + str.substring(breakIndex,str.length);
    return wrappedText;
}

export function wrapLabels(labelGroup: IGroup, limitLength: number){
    const children = labelGroup.getChildren();
    let wrapped = false;
    each(children, (label) => {
        const rst = wrapLabel(label, limitLength);
        wrapped = wrapped || rst;
    });
    return wrapped;
}