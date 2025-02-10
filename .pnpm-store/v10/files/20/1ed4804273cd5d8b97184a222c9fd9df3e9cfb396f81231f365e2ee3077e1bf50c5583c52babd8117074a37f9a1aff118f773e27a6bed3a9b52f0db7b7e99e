"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleKeyValues = exports.getFontSizeMapping = exports.processImageMask = exports.getSize = exports.transform = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var utils_1 = require("../../utils");
var padding_1 = require("../../utils/padding");
var word_cloud_1 = require("../../utils/transform/word-cloud");
/**
 * 用 DataSet 转换词云图数据
 * @param params
 */
function transform(params) {
    var rawOptions = params.options, chart = params.chart;
    var _a = chart, width = _a.width, height = _a.height, chartPadding = _a.padding, appendPadding = _a.appendPadding, ele = _a.ele;
    var data = rawOptions.data, imageMask = rawOptions.imageMask, wordField = rawOptions.wordField, weightField = rawOptions.weightField, colorField = rawOptions.colorField, wordStyle = rawOptions.wordStyle, timeInterval = rawOptions.timeInterval, random = rawOptions.random, spiral = rawOptions.spiral, _b = rawOptions.autoFit, autoFit = _b === void 0 ? true : _b, placementStrategy = rawOptions.placementStrategy;
    if (!data || !data.length) {
        return [];
    }
    var fontFamily = wordStyle.fontFamily, fontWeight = wordStyle.fontWeight, padding = wordStyle.padding, fontSize = wordStyle.fontSize;
    var arr = getSingleKeyValues(data, weightField);
    var range = [min(arr), max(arr)];
    // 变换出 text 和 value 字段
    var words = data.map(function (datum) { return ({
        text: datum[wordField],
        value: datum[weightField],
        color: datum[colorField],
        datum: datum,
    }); });
    var options = {
        imageMask: imageMask,
        font: fontFamily,
        fontSize: getFontSizeMapping(fontSize, range),
        fontWeight: fontWeight,
        // 图表宽高减去 padding 之后的宽高
        size: getSize({
            width: width,
            height: height,
            padding: chartPadding,
            appendPadding: appendPadding,
            autoFit: autoFit,
            container: ele,
        }),
        padding: padding,
        timeInterval: timeInterval,
        random: random,
        spiral: spiral,
        rotate: getRotate(rawOptions),
    };
    // 自定义布局函数
    if ((0, util_1.isFunction)(placementStrategy)) {
        var result = words.map(function (word, index, words) { return (tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, word), { hasText: !!word.text, font: (0, word_cloud_1.functor)(options.font)(word, index, words), weight: (0, word_cloud_1.functor)(options.fontWeight)(word, index, words), rotate: (0, word_cloud_1.functor)(options.rotate)(word, index, words), size: (0, word_cloud_1.functor)(options.fontSize)(word, index, words), style: 'normal' }), placementStrategy.call(chart, word, index, words))); });
        // 添加两个参照数据，分别表示左上角和右下角
        result.push({
            text: '',
            value: 0,
            x: 0,
            y: 0,
            opacity: 0,
        });
        result.push({
            text: '',
            value: 0,
            x: options.size[0],
            y: options.size[1],
            opacity: 0,
        });
        return result;
    }
    // 数据准备在外部做，wordCloud 单纯就是做布局
    return (0, word_cloud_1.wordCloud)(words, options);
}
exports.transform = transform;
/**
 * 获取最终的实际绘图尺寸：[width, height]
 * @param chart
 */
function getSize(options) {
    var width = options.width, height = options.height;
    var container = options.container, autoFit = options.autoFit, padding = options.padding, appendPadding = options.appendPadding;
    // 由于词云图每个词语的坐标都是先通过 DataSet 根据图表宽高计算出来的，
    // 也就是说，如果一开始提供给 DataSet 的宽高信息和最终显示的宽高不相同，
    // 那么就会出现布局错乱的情况，所以这里处理的目的就是让一开始提供给 DataSet 的
    // 宽高信息与最终显示的宽高信息相同，避免显示错乱。
    if (autoFit) {
        var containerSize = (0, utils_1.getContainerSize)(container);
        width = containerSize.width;
        height = containerSize.height;
    }
    // 宽高不能为 0，否则会造成死循环
    width = width || 400;
    height = height || 400;
    var _a = resolvePadding({ padding: padding, appendPadding: appendPadding }), top = _a[0], right = _a[1], bottom = _a[2], left = _a[3];
    var result = [width - (left + right), height - (top + bottom)];
    return result;
}
exports.getSize = getSize;
/**
 * 根据图表的 padding 和 appendPadding 计算出图表的最终 padding
 * @param chart
 */
function resolvePadding(options) {
    var padding = (0, padding_1.normalPadding)(options.padding);
    var appendPadding = (0, padding_1.normalPadding)(options.appendPadding);
    var top = padding[0] + appendPadding[0];
    var right = padding[1] + appendPadding[1];
    var bottom = padding[2] + appendPadding[2];
    var left = padding[3] + appendPadding[3];
    return [top, right, bottom, left];
}
/**
 * 处理 imageMask 可能为 url 字符串的情况
 * @param  {HTMLImageElement | string} img
 * @return {Promise}
 */
function processImageMask(img) {
    return new Promise(function (res, rej) {
        if (img instanceof HTMLImageElement) {
            res(img);
            return;
        }
        if ((0, util_1.isString)(img)) {
            var image_1 = new Image();
            image_1.crossOrigin = 'anonymous';
            image_1.src = img;
            image_1.onload = function () {
                res(image_1);
            };
            image_1.onerror = function () {
                (0, utils_1.log)(utils_1.LEVEL.ERROR, false, 'image %s load failed !!!', img);
                rej();
            };
            return;
        }
        (0, utils_1.log)(utils_1.LEVEL.WARN, img === undefined, 'The type of imageMask option must be String or HTMLImageElement.');
        rej();
    });
}
exports.processImageMask = processImageMask;
/**
 * 把用户提供的 fontSize 值转换成符合 DataSet 要求的值
 * @param options
 * @param range
 */
function getFontSizeMapping(fontSize, range) {
    if ((0, util_1.isFunction)(fontSize)) {
        return fontSize;
    }
    if ((0, util_1.isArray)(fontSize)) {
        var fMin_1 = fontSize[0], fMax_1 = fontSize[1];
        if (!range) {
            return function () { return (fMax_1 + fMin_1) / 2; };
        }
        var min_1 = range[0], max_1 = range[1];
        if (max_1 === min_1) {
            return function () { return (fMax_1 + fMin_1) / 2; };
        }
        return function fontSize(_a) {
            var value = _a.value;
            return ((fMax_1 - fMin_1) / (max_1 - min_1)) * (value - min_1) + fMin_1;
        };
    }
    return function () { return fontSize; };
}
exports.getFontSizeMapping = getFontSizeMapping;
function getSingleKeyValues(data, key) {
    return data
        .map(function (v) { return v[key]; })
        .filter(function (v) {
        // 过滤非 number
        if (typeof v === 'number' && !isNaN(v))
            return true;
        return false;
    });
}
exports.getSingleKeyValues = getSingleKeyValues;
/**
 * 把用户提供的关于旋转角度的字段值转换成符合 DataSet 要求的值
 * @param options
 */
function getRotate(options) {
    var _a = resolveRotate(options), rotation = _a.rotation, rotationSteps = _a.rotationSteps;
    if (!(0, util_1.isArray)(rotation))
        return rotation;
    var min = rotation[0];
    var max = rotation[1];
    // 等于 1 时不旋转，所以把每份大小设为 0
    var perSize = rotationSteps === 1 ? 0 : (max - min) / (rotationSteps - 1);
    return function rotate() {
        if (max === min)
            return max;
        return Math.floor(Math.random() * rotationSteps) * perSize;
    };
}
/**
 * 确保值在要求范围内
 * @param options
 */
function resolveRotate(options) {
    var rotationSteps = options.wordStyle.rotationSteps;
    if (rotationSteps < 1) {
        (0, utils_1.log)(utils_1.LEVEL.WARN, false, 'The rotationSteps option must be greater than or equal to 1.');
        rotationSteps = 1;
    }
    return {
        rotation: options.wordStyle.rotation,
        rotationSteps: rotationSteps,
    };
}
/**
 * 传入一个元素为数字的数组，
 * 返回该数组中值最小的数字。
 * @param numbers
 */
function min(numbers) {
    return Math.min.apply(Math, numbers);
}
/**
 * 传入一个元素为数字的数组，
 * 返回该数组中值最大的数字。
 * @param numbers
 */
function max(numbers) {
    return Math.max.apply(Math, numbers);
}
//# sourceMappingURL=utils.js.map