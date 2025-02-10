import getStyle from './get-style';
import getHeight from './get-height';
export default function getOuterHeight(el, defaultValue) {
    var height = getHeight(el, defaultValue);
    var bTop = parseFloat(getStyle(el, 'borderTopWidth')) || 0;
    var pTop = parseFloat(getStyle(el, 'paddingTop')) || 0;
    var pBottom = parseFloat(getStyle(el, 'paddingBottom')) || 0;
    var bBottom = parseFloat(getStyle(el, 'borderBottomWidth')) || 0;
    var mTop = parseFloat(getStyle(el, 'marginTop')) || 0;
    var mBottom = parseFloat(getStyle(el, 'marginBottom')) || 0;
    return height + bTop + bBottom + pTop + pBottom + mTop + mBottom;
}
//# sourceMappingURL=get-outer-height.js.map