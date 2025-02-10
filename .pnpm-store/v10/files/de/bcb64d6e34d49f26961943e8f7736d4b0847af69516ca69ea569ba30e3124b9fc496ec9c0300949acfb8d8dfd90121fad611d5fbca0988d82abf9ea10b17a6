import getStyle from './get-style';
import getWidth from './get-width';
export default function getOuterWidth(el, defaultValue) {
    var width = getWidth(el, defaultValue);
    var bLeft = parseFloat(getStyle(el, 'borderLeftWidth')) || 0;
    var pLeft = parseFloat(getStyle(el, 'paddingLeft')) || 0;
    var pRight = parseFloat(getStyle(el, 'paddingRight')) || 0;
    var bRight = parseFloat(getStyle(el, 'borderRightWidth')) || 0;
    var mRight = parseFloat(getStyle(el, 'marginRight')) || 0;
    var mLeft = parseFloat(getStyle(el, 'marginLeft')) || 0;
    return width + bLeft + bRight + pLeft + pRight + mLeft + mRight;
}
//# sourceMappingURL=get-outer-width.js.map