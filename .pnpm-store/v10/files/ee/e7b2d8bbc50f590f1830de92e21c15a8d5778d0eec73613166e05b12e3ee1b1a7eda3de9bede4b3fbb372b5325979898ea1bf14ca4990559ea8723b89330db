import { isString, each, isArray } from './util';
var regexLG = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i;
var regexRG = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i;
var regexPR = /^p\s*\(\s*([axyn])\s*\)\s*(.*)/i;
var regexColorStop = /[\d.]+:(#[^\s]+|[^\)]+\))/gi;
function addStop(steps, gradient) {
    var arr = steps.match(regexColorStop);
    each(arr, function (item) {
        var itemArr = item.split(':');
        gradient.addColorStop(itemArr[0], itemArr[1]);
    });
}
/**
 * 将边和填充设置的颜色转换成线性渐变对象
 * @param {CanvasRenderingContext2D} context canvas 上下文
 * @param {IElement}                 element  图形元素
 * @param {string}                   gradientStr   颜色
 * @returns {any} 渐变对象
 */
export function parseLineGradient(context, element, gradientStr) {
    var arr = regexLG.exec(gradientStr);
    var angle = (parseFloat(arr[1]) % 360) * (Math.PI / 180);
    var steps = arr[2];
    var box = element.getBBox();
    var start;
    var end;
    if (angle >= 0 && angle < (1 / 2) * Math.PI) {
        start = {
            x: box.minX,
            y: box.minY,
        };
        end = {
            x: box.maxX,
            y: box.maxY,
        };
    }
    else if ((1 / 2) * Math.PI <= angle && angle < Math.PI) {
        start = {
            x: box.maxX,
            y: box.minY,
        };
        end = {
            x: box.minX,
            y: box.maxY,
        };
    }
    else if (Math.PI <= angle && angle < (3 / 2) * Math.PI) {
        start = {
            x: box.maxX,
            y: box.maxY,
        };
        end = {
            x: box.minX,
            y: box.minY,
        };
    }
    else {
        start = {
            x: box.minX,
            y: box.maxY,
        };
        end = {
            x: box.maxX,
            y: box.minY,
        };
    }
    var tanTheta = Math.tan(angle);
    var tanTheta2 = tanTheta * tanTheta;
    var x = (end.x - start.x + tanTheta * (end.y - start.y)) / (tanTheta2 + 1) + start.x;
    var y = (tanTheta * (end.x - start.x + tanTheta * (end.y - start.y))) / (tanTheta2 + 1) + start.y;
    var gradient = context.createLinearGradient(start.x, start.y, x, y);
    addStop(steps, gradient);
    return gradient;
}
/**
 * 将边和填充设置的颜色转换成圆形渐变对象
 * @param {CanvasRenderingContext2D} context canvas 上下文
 * @param {IElement}                 element  图形元素
 * @param {string}                   gradientStr   颜色
 * @returns {any} 渐变对象
 */
export function parseRadialGradient(context, element, gradientStr) {
    var arr = regexRG.exec(gradientStr);
    var fx = parseFloat(arr[1]);
    var fy = parseFloat(arr[2]);
    var fr = parseFloat(arr[3]);
    var steps = arr[4];
    // 环半径为0时，默认无渐变，取渐变序列的最后一个颜色
    if (fr === 0) {
        var colors = steps.match(regexColorStop);
        return colors[colors.length - 1].split(':')[1];
    }
    var box = element.getBBox();
    var width = box.maxX - box.minX;
    var height = box.maxY - box.minY;
    var r = Math.sqrt(width * width + height * height) / 2;
    var gradient = context.createRadialGradient(box.minX + width * fx, box.minY + height * fy, 0, box.minX + width / 2, box.minY + height / 2, fr * r);
    addStop(steps, gradient);
    return gradient;
}
/**
 * 边和填充设置的颜色转换成 pattern
 * @param {CanvasRenderingContext2D} context canvas 上下文
 * @param {IElement}                 element  图形元素
 * @param {string}                   patternStr   生成 pattern 的字符串
 */
export function parsePattern(context, element, patternStr) {
    // 在转换过程中进行了缓存
    if (element.get('patternSource') && element.get('patternSource') === patternStr) {
        return element.get('pattern');
    }
    var pattern;
    var img;
    var arr = regexPR.exec(patternStr);
    var repeat = arr[1];
    var source = arr[2];
    // Function to be called when pattern loads
    function onload() {
        // Create pattern
        pattern = context.createPattern(img, repeat);
        element.set('pattern', pattern); // be a cache
        element.set('patternSource', patternStr);
    }
    switch (repeat) {
        case 'a':
            repeat = 'repeat';
            break;
        case 'x':
            repeat = 'repeat-x';
            break;
        case 'y':
            repeat = 'repeat-y';
            break;
        case 'n':
            repeat = 'no-repeat';
            break;
        default:
            repeat = 'no-repeat';
    }
    img = new Image();
    // If source URL is not a data URL
    if (!source.match(/^data:/i)) {
        // Set crossOrigin for this image
        img.crossOrigin = 'Anonymous';
    }
    img.src = source;
    if (img.complete) {
        onload();
    }
    else {
        img.onload = onload;
        // Fix onload() bug in IE9
        img.src = img.src;
    }
    return pattern;
}
export function parseStyle(context, element, color) {
    var bbox = element.getBBox();
    if (isNaN(bbox.x) || isNaN(bbox.y) || isNaN(bbox.width) || isNaN(bbox.height)) {
        return color;
    }
    if (isString(color)) {
        if (color[1] === '(' || color[2] === '(') {
            if (color[0] === 'l') {
                // regexLG.test(color)
                return parseLineGradient(context, element, color);
            }
            if (color[0] === 'r') {
                // regexRG.test(color)
                return parseRadialGradient(context, element, color);
            }
            if (color[0] === 'p') {
                // regexPR.test(color)
                return parsePattern(context, element, color);
            }
        }
        return color;
    }
    if (color instanceof CanvasPattern) {
        return color;
    }
}
export function parseRadius(radius) {
    var r1 = 0;
    var r2 = 0;
    var r3 = 0;
    var r4 = 0;
    if (isArray(radius)) {
        if (radius.length === 1) {
            r1 = r2 = r3 = r4 = radius[0];
        }
        else if (radius.length === 2) {
            r1 = r3 = radius[0];
            r2 = r4 = radius[1];
        }
        else if (radius.length === 3) {
            r1 = radius[0];
            r2 = r4 = radius[1];
            r3 = radius[2];
        }
        else {
            r1 = radius[0];
            r2 = radius[1];
            r3 = radius[2];
            r4 = radius[3];
        }
    }
    else {
        r1 = r2 = r3 = r4 = radius;
    }
    return [r1, r2, r3, r4];
}
//# sourceMappingURL=parse.js.map