const ELLIPSIS_CODE = '\u2026';

/** 获取字符串长度 */
export function strLen(str: string) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
        len += charAtLength(str, i);
    }
    return len;
}

/** 是否属于ASCII编码范畴 */
export function charAtLength(str: string, i: number) {
    if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
        return 1;
    } else {
        return 2;
    }
}

/** 文本省略 */
export function ellipsisString(str: string, reseveLength: number, position:string = 'tail') {
    const count = str.length;
    let rst = '';
    if (position === 'tail') {
      for (let i = 0, index = 0; i < reseveLength; ) {
        const charLength = charAtLength(str, index);
        if (i + charLength <= reseveLength) {
          rst += str[index];
          i += charAtLength(str, index);
          index++;
        } else {
          break;
        }
      }
      rst += ELLIPSIS_CODE;
    } else if (position === 'head') {
      for (let i = 0, index = count - 1; i < reseveLength; ) {
        const charLength = charAtLength(str, index);
        if (i + charLength <= reseveLength) {
          rst += str[index];
          i += charAtLength(str, index);
          index--;
        } else {
          break;
        }
      }
      rst = ELLIPSIS_CODE + rst;
    } else {
      let startStr = '';
      let endStr = '';
      for (let i = 0, startIndex = 0, endIndex = count - 1; i < reseveLength; ) {
        const startCodeLen = charAtLength(str, startIndex);
        let hasAdd = false; // 设置标志位，防止头尾都没有附加字符
        if (startCodeLen + i <= reseveLength) {
          startStr += str[startIndex];
          startIndex++;
          i += startCodeLen;
          hasAdd = true;
        }

        const endCodeLen = charAtLength(str, endIndex);
        if (endCodeLen + i <= reseveLength) {
          endStr = str[endIndex] + endStr;
          i += endCodeLen;
          endIndex--;
          hasAdd = true;
        }
        if (!hasAdd) {
          // 如果都没有增加字符，说明都不适合则中断
          break;
        }
      }
      rst = startStr + ELLIPSIS_CODE + endStr;
    }
    return rst;
  }
