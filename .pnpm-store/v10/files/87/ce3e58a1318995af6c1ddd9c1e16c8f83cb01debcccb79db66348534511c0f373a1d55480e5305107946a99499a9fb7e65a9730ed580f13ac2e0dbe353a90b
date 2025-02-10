import { __assign } from "tslib";
import { get, isArray, isNumber } from '@antv/util';
import { regressionExp, regressionLinear, regressionLoess, regressionLog, regressionPoly, regressionPow, regressionQuad, } from 'd3-regression';
import { getSplinePath } from '../../utils';
var REGRESSION_MAP = {
    exp: regressionExp,
    linear: regressionLinear,
    loess: regressionLoess,
    log: regressionLog,
    poly: regressionPoly,
    pow: regressionPow,
    quad: regressionQuad,
};
/**
 * 获取四象限默认配置
 * @param {number} xBaseline
 * @param {number} yBaseline
 */
export function getQuadrantDefaultConfig(xBaseline, yBaseline) {
    // 文本便宜距离
    var textOffset = 10;
    // 四象限默认样式
    var defaultConfig = {
        regionStyle: [
            {
                position: {
                    start: [xBaseline, 'max'],
                    end: ['max', yBaseline],
                },
                style: {
                    fill: '#d8d0c0',
                    opacity: 0.4,
                },
            },
            {
                position: {
                    start: ['min', 'max'],
                    end: [xBaseline, yBaseline],
                },
                style: {
                    fill: '#a3dda1',
                    opacity: 0.4,
                },
            },
            {
                position: {
                    start: ['min', yBaseline],
                    end: [xBaseline, 'min'],
                },
                style: {
                    fill: '#d8d0c0',
                    opacity: 0.4,
                },
            },
            {
                position: {
                    start: [xBaseline, yBaseline],
                    end: ['max', 'min'],
                },
                style: {
                    fill: '#a3dda1',
                    opacity: 0.4,
                },
            },
        ],
        lineStyle: {
            stroke: '#9ba29a',
            lineWidth: 1,
        },
        labelStyle: [
            {
                position: ['max', yBaseline],
                offsetX: -textOffset,
                offsetY: -textOffset,
                style: {
                    textAlign: 'right',
                    textBaseline: 'bottom',
                    fontSize: 14,
                    fill: '#ccc',
                },
            },
            {
                position: ['min', yBaseline],
                offsetX: textOffset,
                offsetY: -textOffset,
                style: {
                    textAlign: 'left',
                    textBaseline: 'bottom',
                    fontSize: 14,
                    fill: '#ccc',
                },
            },
            {
                position: ['min', yBaseline],
                offsetX: textOffset,
                offsetY: textOffset,
                style: {
                    textAlign: 'left',
                    textBaseline: 'top',
                    fontSize: 14,
                    fill: '#ccc',
                },
            },
            {
                position: ['max', yBaseline],
                offsetX: -textOffset,
                offsetY: textOffset,
                style: {
                    textAlign: 'right',
                    textBaseline: 'top',
                    fontSize: 14,
                    fill: '#ccc',
                },
            },
        ],
    };
    return defaultConfig;
}
var splinePath = function (data, config) {
    var view = config.view, _a = config.options, xField = _a.xField, yField = _a.yField;
    var xScaleView = view.getScaleByField(xField);
    var yScaleView = view.getScaleByField(yField);
    var pathData = data.map(function (d) {
        return view.getCoordinate().convert({ x: xScaleView.scale(d[0]), y: yScaleView.scale(d[1]) });
    });
    return getSplinePath(pathData, false);
};
export var getPath = function (config) {
    var options = config.options;
    var xField = options.xField, yField = options.yField, data = options.data, regressionLine = options.regressionLine;
    var _a = regressionLine.type, type = _a === void 0 ? 'linear' : _a, algorithm = regressionLine.algorithm, customEquation = regressionLine.equation;
    var pathData;
    var equation = null;
    if (algorithm) {
        pathData = isArray(algorithm) ? algorithm : algorithm(data);
        equation = customEquation;
    }
    else {
        var reg = REGRESSION_MAP[type]()
            .x(function (d) { return d[xField]; })
            .y(function (d) { return d[yField]; });
        pathData = reg(data);
        equation = getRegressionEquation(type, pathData);
    }
    return [splinePath(pathData, config), equation];
};
/**
 * 调整散点图 meta: { min, max } ① data.length === 1 ② 所有数据 y 值相等 ③ 所有数据 x 值相等
 * @param options
 * @returns
 */
export var getMeta = function (options) {
    var _a;
    var _b = options.meta, meta = _b === void 0 ? {} : _b, xField = options.xField, yField = options.yField, data = options.data;
    var xFieldValue = data[0][xField];
    var yFieldValue = data[0][yField];
    var xIsPositiveNumber = xFieldValue > 0;
    var yIsPositiveNumber = yFieldValue > 0;
    /**
     * 获得对应字段的 min max scale 配置
     */
    function getMetaMinMax(field, axis) {
        var fieldMeta = get(meta, [field]);
        function getCustomValue(type) {
            return get(fieldMeta, type);
        }
        var range = {};
        if (axis === 'x') {
            if (isNumber(xFieldValue)) {
                if (!isNumber(getCustomValue('min'))) {
                    range['min'] = xIsPositiveNumber ? 0 : xFieldValue * 2;
                }
                if (!isNumber(getCustomValue('max'))) {
                    range['max'] = xIsPositiveNumber ? xFieldValue * 2 : 0;
                }
            }
            return range;
        }
        if (isNumber(yFieldValue)) {
            if (!isNumber(getCustomValue('min'))) {
                range['min'] = yIsPositiveNumber ? 0 : yFieldValue * 2;
            }
            if (!isNumber(getCustomValue('max'))) {
                range['max'] = yIsPositiveNumber ? yFieldValue * 2 : 0;
            }
        }
        return range;
    }
    return __assign(__assign({}, meta), (_a = {}, _a[xField] = __assign(__assign({}, meta[xField]), getMetaMinMax(xField, 'x')), _a[yField] = __assign(__assign({}, meta[yField]), getMetaMinMax(yField, 'y')), _a));
};
/**
 * 获取回归函数表达式
 * @param {string} type - 回归函数类型
 * @param {D3RegressionResult} res - 回归计算结果集
 * @return {string}
 */
export function getRegressionEquation(type, res) {
    var _a, _b, _c;
    var roundByPrecision = function (n, p) {
        if (p === void 0) { p = 4; }
        return Math.round(n * Math.pow(10, p)) / Math.pow(10, p);
    };
    var safeFormat = function (value) { return (Number.isFinite(value) ? roundByPrecision(value) : '?'); };
    switch (type) {
        case 'linear':
            // y = ax + b
            return "y = ".concat(safeFormat(res.a), "x + ").concat(safeFormat(res.b), ", R^2 = ").concat(safeFormat(res.rSquared));
        case 'exp':
            // y = ae^(bx)
            return "y = ".concat(safeFormat(res.a), "e^(").concat(safeFormat(res.b), "x), R^2 = ").concat(safeFormat(res.rSquared));
        case 'log':
            // y = a · ln(x) + b
            return "y = ".concat(safeFormat(res.a), "ln(x) + ").concat(safeFormat(res.b), ", R^2 = ").concat(safeFormat(res.rSquared));
        case 'quad':
            // y = ax^2 + bx + c
            return "y = ".concat(safeFormat(res.a), "x^2 + ").concat(safeFormat(res.b), "x + ").concat(safeFormat(res.c), ", R^2 = ").concat(safeFormat(res.rSquared));
        case 'poly':
            // y = anx^n + ... + a1x + a0
            // eslint-disable-next-line no-case-declarations
            var temp = "y = ".concat(safeFormat((_a = res.coefficients) === null || _a === void 0 ? void 0 : _a[0]), " + ").concat(safeFormat((_b = res.coefficients) === null || _b === void 0 ? void 0 : _b[1]), "x + ").concat(safeFormat((_c = res.coefficients) === null || _c === void 0 ? void 0 : _c[2]), "x^2");
            for (var i = 3; i < res.coefficients.length; ++i) {
                temp += " + ".concat(safeFormat(res.coefficients[i]), "x^").concat(i);
            }
            return "".concat(temp, ", R^2 = ").concat(safeFormat(res.rSquared));
        case 'pow':
            // y = ax^b
            return "y = ".concat(safeFormat(res.a), "x^").concat(safeFormat(res.b), ", R^2 = ").concat(safeFormat(res.rSquared));
    }
    return null;
}
//# sourceMappingURL=util.js.map