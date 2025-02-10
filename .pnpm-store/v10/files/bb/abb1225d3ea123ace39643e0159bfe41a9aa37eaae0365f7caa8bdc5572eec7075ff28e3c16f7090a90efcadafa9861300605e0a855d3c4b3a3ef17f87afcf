import getStyle from './get-style';
export default function getHeight(el, defaultValue) {
    var height = getStyle(el, 'height', defaultValue);
    if (height === 'auto') {
        height = el.offsetHeight;
    }
    return parseFloat(height);
}
//# sourceMappingURL=get-height.js.map