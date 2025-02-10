import { IElement, IGroup } from '@antv/g-base';
import { each } from '@antv/util';
import fecha from 'fecha';
import { testLabel } from '../../util/label';
import { strLen } from '../../util/text';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 31 * DAY;
const YEAR = 365 * DAY;


/** 时间周期显示 */
function dateTimeAbbrevaite(label: IElement, labels: IElement[], index: number, timeDuration: string, limitLength: number) {
    const text = label.attr('text');
    const labelLength = label.getBBox().width;
    const codeLength = strLen(text);
    const reseveLength = Math.floor((limitLength / labelLength) * codeLength);
    let ellipsised = false;
    let campareText;
    if (index === labels.length - 1) {
        campareText = labels[index - 1].attr('text');
    } else {
        campareText = labels[index + 1].attr('text');
    }
    const compare = new Date(campareText);
    const current = new Date(label.attr('text'));
    // time frequency
    const timeCycle = getDateTimeMode(current, compare);
    // 如果duration和frequency在同一区间
    if (timeDuration === timeCycle) {
        if (index !== 0 && index !== labels.length - 1) {
            const formatter = sameSectionFormatter(current,timeDuration,reseveLength);
            label.attr('text', fecha.format(current, formatter));
            ellipsised = true;
        }
        return;
    }
    if (index !== 0) {
        const previousText = labels[index - 1].attr('text')
        const previous = new Date(previousText);
        const isAbbreviate = needAbbrevaite(timeDuration, current, previous);
        if (isAbbreviate) {
          const formatter = getAbbrevaiteFormatter(timeDuration, timeCycle);
          label.attr('text', fecha.format(current, formatter));
          ellipsised = true;
        }
    }
    if (ellipsised) {
        label.set('tip', text);
    } else {
        label.set('tip', null);
    }
}

/** 工具方法： 获取时间周期 */
function getTimeDuration(labels: IElement[]) {
    const start = new Date(labels[0].attr('text'));
    const end = new Date(labels[labels.length - 1].attr('text'));
    return getDateTimeMode(start, end);
}

/** 工具方法： 获取连个时间戳之间差值的时间粒度 */
function getDateTimeMode(a, b):string {
    let mode;
    const dist = Math.abs(a - b);
    const mapper = {
        minute: [MINUTE, HOUR],
        hour: [HOUR, DAY],
        day: [DAY, MONTH],
        month: [MONTH, YEAR],
        year: [YEAR, Infinity],
    };
    each(mapper, (range, key) => {
        if (dist >= range[0] && dist < range[1]) {
            mode = key;
        }
    });
    return mode.toString();
}

/** 判断是否要进行时间周期显示 */
function needAbbrevaite(mode: string, current: Date, previous: Date) {
    const currentStamp = getTime(current, mode);
    const previousStamp = getTime(previous, mode);
    if (currentStamp !== previousStamp) {
        return false;
    }
    return true;
}

function getTime(date: Date, mode: string) {
    if (mode.toString() === 'year') {
        return date.getFullYear();
    }
    if (mode.toString() === 'month') {
        return date.getMonth() + 1;
    }
    if (mode.toString() === 'day') {
        return date.getDay() + 1;
    }

    if (mode.toString() === 'hour') {
        return date.getHours() + 1;
    }

    if (mode.toString() === 'minute') {
        return date.getMinutes() + 1;
    }
}

/** 获取时间周期显示的formatter */
function getAbbrevaiteFormatter(duration: string, cycle: string) {
    const times = ['year', 'month', 'day', 'hour', 'minute'];
    const formatters = ['YYYY', 'MM', 'DD', 'HH', 'MM'];
    const startIndex = times.indexOf(duration.toString()) + 1;
    const endIndex = times.indexOf(cycle.toString());
    let formatter = '';
    for (let i = startIndex; i <= endIndex; i++) {
        formatter += formatters[i];
        if (i < endIndex) {
            formatter += '-';
        }
    }
    return formatter;
}

/** 逐级显示逻辑 */
function sameSectionFormatter(time: Date,mode: string,reseveLength: number) {
    const times = ['year', 'month', 'day', 'hour', 'minute'];
    const formatters = ['YYYY', 'MM', 'DD', 'HH', 'MM'];
    const index = times.indexOf(mode);
    const formatter = formatters[index];
    /*
    * 格式补完、逐级显示逻辑：
    * YYYY、MM、DD、HH、mm、ss 为时间格式字段，DD左边的字段为高位字段，右边的字段为低位字段。
    * 如果空间允许，DD及之前向高位补一位，HH及之后向低位补一位
    */
    if(index!==0 && index!==times.length){
        const extendIndex = index <= 2 ? index - 1 : index + 1;
        const extendFormatter = index <= 2 ? `${formatters[extendIndex]}-${formatter}` : `${formatter}-${formatters[extendIndex]}`;
        if(strLen(fecha.format(time,extendFormatter)) <= reseveLength){
            return extendFormatter;
        }
    }
    return formatter;
}

export function ellipsisTime(labelGroup: IGroup, limitLength: number): boolean {
    const children = labelGroup.getChildren();
    let needEllipsis = false;
    let ellipsised = false;
    each(children, (label) => {
        const rst = testLabel(label, limitLength);
        needEllipsis = needEllipsis || rst;
    });
    if (needEllipsis) {
        const timeDuration = getTimeDuration(children);
        each(children, (label, index) => {
            dateTimeAbbrevaite(label, children, index, timeDuration, limitLength);
        });
        ellipsised = true;
    }
    return ellipsised;
}
