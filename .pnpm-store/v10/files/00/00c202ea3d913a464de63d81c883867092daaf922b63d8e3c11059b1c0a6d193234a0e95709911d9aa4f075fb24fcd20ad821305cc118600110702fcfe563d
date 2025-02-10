import { map, memoize, isString, each } from '@antv/util';
var RGB_REG = /rgba?\(([\s.,0-9]+)\)/;
var regexLG = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i;
var regexRG = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i;
var regexColorStop = /[\d.]+:(#[^\s]+|[^\)]+\))/gi;
var isGradientColor = function (val) { return /^[r,R,L,l]{1}[\s]*\(/.test(val); };
// 创建辅助 tag 取颜色
var createTmp = function () {
    var i = document.createElement('i');
    i.title = 'Web Colour Picker';
    i.style.display = 'none';
    document.body.appendChild(i);
    return i;
};
// 获取颜色之间的插值
var getValue = function (start, end, percent, index) {
    return start[index] + (end[index] - start[index]) * percent;
};
// 数组转换成颜色
function arr2rgb(arr) {
    return "#" + toHex(arr[0]) + toHex(arr[1]) + toHex(arr[2]);
}
// rgb 颜色转换成数组
var rgb2arr = function (str) {
    return [
        parseInt(str.substr(1, 2), 16),
        parseInt(str.substr(3, 2), 16),
        parseInt(str.substr(5, 2), 16),
    ];
};
// 将数值从 0-255 转换成16进制字符串
var toHex = function (value) {
    var x16Value = Math.round(value).toString(16);
    return x16Value.length === 1 ? "0" + x16Value : x16Value;
};
// 计算颜色
var calColor = function (points, percent) {
    var fixedPercent = isNaN(Number(percent)) || percent < 0 ? 0 :
        percent > 1 ? 1 :
            Number(percent);
    var steps = points.length - 1;
    var step = Math.floor(steps * fixedPercent);
    var left = steps * fixedPercent - step;
    var start = points[step];
    var end = step === steps ? start : points[step + 1];
    return arr2rgb([
        getValue(start, end, left, 0),
        getValue(start, end, left, 1),
        getValue(start, end, left, 2),
    ]);
};
// 用于给 toRGB 的缓存（使用 memoize 方法替换）
// const colorCache = {};
var iEl;
/**
 * 将颜色转换到 rgb 的格式
 * @param {color} color 颜色
 * @return 将颜色转换到 '#ffffff' 的格式
 */
var toRGB = function (color) {
    // 如果已经是 rgb的格式
    if (color[0] === '#' && color.length === 7) {
        return color;
    }
    if (!iEl) {
        // 防止防止在页头报错
        iEl = createTmp();
    }
    iEl.style.color = color;
    var rst = document.defaultView.getComputedStyle(iEl, '').getPropertyValue('color');
    var matches = RGB_REG.exec(rst);
    var cArray = matches[1].split(/\s*,\s*/).map(function (s) { return Number(s); });
    rst = arr2rgb(cArray);
    return rst;
};
/**
 * 获取渐变函数
 * @param colors 多个颜色
 * @return 颜色值
 */
var gradient = function (colors) {
    var colorArray = isString(colors) ? colors.split('-') : colors;
    var points = map(colorArray, function (color) {
        return rgb2arr(color.indexOf('#') === -1 ? toRGB(color) : color);
    });
    // 返回一个函数
    return function (percent) {
        return calColor(points, percent);
    };
};
var toCSSGradient = function (gradientColor) {
    if (isGradientColor(gradientColor)) {
        var cssColor_1;
        var steps = void 0;
        if (gradientColor[0] === 'l') {
            // 线性渐变
            var arr = regexLG.exec(gradientColor);
            var angle = +arr[1] + 90; // css 和 g 的渐变起始角度不同
            steps = arr[2];
            cssColor_1 = "linear-gradient(" + angle + "deg, ";
        }
        else if (gradientColor[0] === 'r') {
            // 径向渐变
            cssColor_1 = 'radial-gradient(';
            var arr = regexRG.exec(gradientColor);
            steps = arr[4];
        }
        var colorStops_1 = steps.match(regexColorStop);
        each(colorStops_1, function (item, index) {
            var itemArr = item.split(':');
            cssColor_1 += itemArr[1] + " " + itemArr[0] * 100 + "%";
            if (index !== (colorStops_1.length - 1)) {
                cssColor_1 += ', ';
            }
        });
        cssColor_1 += ')';
        return cssColor_1;
    }
    return gradientColor;
};
export default {
    rgb2arr: rgb2arr,
    gradient: gradient,
    toRGB: memoize(toRGB),
    toCSSGradient: toCSSGradient,
};
//# sourceMappingURL=index.js.map