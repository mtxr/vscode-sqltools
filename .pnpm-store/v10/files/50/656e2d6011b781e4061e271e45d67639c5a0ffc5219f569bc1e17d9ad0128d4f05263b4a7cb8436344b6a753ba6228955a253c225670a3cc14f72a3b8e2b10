var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { useRef, useEffect } from 'react';
import { isEqual, get } from '@antv/util';
import createNode from '../utils/createNode';
import { hasPath, isType, deepClone, clone, setPath, uuid } from '../utils';
export default function useInit(ChartClass, config) {
    var chart = useRef();
    var chartOptions = useRef();
    var container = useRef(null);
    var onReady = config.onReady, onEvent = config.onEvent;
    /**
     * Get data base64
     * @param {string} type A DOMString indicating the image format. The default format type is image/png.
     * @param {number} encoderOptions A Number between 0 and 1 indicating the image quality
     */
    var toDataURL = function (type, encoderOptions) {
        var _a;
        if (type === void 0) { type = 'image/png'; }
        return (_a = chart.current) === null || _a === void 0 ? void 0 : _a.chart.canvas.cfg.el.toDataURL(type, encoderOptions);
    };
    /**
     * Download Iamge
     * @param {string} name A name of image
     * @param {string} type A DOMString indicating the image format. The default format type is image/png.
     * @param {number} encoderOptions A Number between 0 and 1 indicating the image quality
     */
    var downloadImage = function (name, type, encoderOptions) {
        var _a;
        if (name === void 0) { name = 'download'; }
        if (type === void 0) { type = 'image/png'; }
        var imageName = name;
        if (name.indexOf('.') === -1) {
            imageName = "".concat(name, ".").concat(type.split('/')[1]);
        }
        var base64 = (_a = chart.current) === null || _a === void 0 ? void 0 : _a.chart.canvas.cfg.el.toDataURL(type, encoderOptions);
        var a = document.createElement('a');
        a.href = base64;
        a.download = imageName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        a = null;
        return imageName;
    };
    var reactDomToString = function (source, path, type, _uuid) {
        var statisticCustomHtml = hasPath(source, path);
        setPath(source, path, function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            var statisticDom = isType(statisticCustomHtml, 'Function') ? statisticCustomHtml.apply(void 0, arg) : statisticCustomHtml;
            if (isType(statisticDom, 'String') || isType(statisticDom, 'Number') || isType(statisticDom, 'HTMLDivElement')) {
                return statisticDom;
            }
            return createNode(statisticDom, type, _uuid);
        });
    };
    var processConfig = function () {
        var _uuid = uuid();
        // statistic
        if (hasPath(config, ['statistic', 'content', 'customHtml'])) {
            reactDomToString(config, ['statistic', 'content', 'customHtml']);
        }
        if (hasPath(config, ['statistic', 'title', 'customHtml'])) {
            reactDomToString(config, ['statistic', 'title', 'customHtml']);
        }
        // tooltip
        if (typeof config.tooltip === 'object') {
            if (hasPath(config, ['tooltip', 'container'])) {
                reactDomToString(config, ['tooltip', 'container'], 'tooltip', _uuid);
            }
            if (hasPath(config, ['tooltip', 'customContent'])) {
                reactDomToString(config, ['tooltip', 'customContent'], 'tooltip', _uuid);
            }
        }
    };
    useEffect(function () {
        if (chart.current && !isEqual(chartOptions.current, config)) {
            var changeData = false;
            if (chartOptions.current) {
                // 从 options 里面取出 data 、value 、 percent 进行比对，判断是否仅数值发生改变
                var _a = chartOptions.current, currentData = _a.data, currentValue = _a.value, currentPercent = _a.percent, currentConfig = __rest(_a, ["data", "value", "percent"]);
                var inputData = config.data, inputValue = config.value, inputPercent = config.percent, inputConfig = __rest(config, ["data", "value", "percent"]);
                changeData = isEqual(currentConfig, inputConfig);
            }
            chartOptions.current = deepClone(config);
            if (changeData && get(config, 'chartType') !== 'Mix') {
                var changeType_1 = 'data';
                var typeMaps = ['percent']; // 特殊类型的图表 data 字段，例如 RingProgress
                var currentKeys_1 = Object.keys(config);
                typeMaps.forEach(function (type) {
                    if (currentKeys_1.includes(type)) {
                        changeType_1 = type;
                    }
                });
                chart.current.changeData((config === null || config === void 0 ? void 0 : config[changeType_1]) || []);
                chart.current.render();
            }
            else {
                processConfig();
                chart.current.update(config);
            }
        }
    }, [config]);
    useEffect(function () {
        if (!container.current) {
            return function () { return null; };
        }
        if (!chartOptions.current) {
            chartOptions.current = deepClone(config);
        }
        processConfig();
        var chartInstance = new ChartClass(container.current, __assign({}, config));
        chartInstance.toDataURL = function (type, encoderOptions) {
            return toDataURL(type, encoderOptions);
        };
        chartInstance.downloadImage = function (name, type, encoderOptions) {
            return downloadImage(name, type, encoderOptions);
        };
        chartInstance.render();
        chart.current = clone(chartInstance);
        if (onReady) {
            onReady(chartInstance);
        }
        var handler = function (event) {
            if (onEvent) {
                onEvent(chartInstance, event);
            }
        };
        chartInstance.on('*', handler);
        // 组件销毁时销毁图表
        return function () {
            if (chart.current) {
                chart.current.destroy();
                chart.current.off('*', handler);
                chart.current = undefined;
            }
        };
    }, []);
    return {
        chart: chart,
        container: container,
    };
}
