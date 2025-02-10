import { each, mix } from '@antv/util';
// 获取多个状态量的合并值
export function getStatesStyle(item, elementName, stateStyles) {
    var styleName = elementName + "Style"; // activeStyle
    var styles = null;
    each(stateStyles, function (v, state) {
        if (item[state] && v[styleName]) {
            if (!styles) {
                styles = {};
            }
            mix(styles, v[styleName]); // 合并样式
        }
    });
    return styles;
}
//# sourceMappingURL=state.js.map