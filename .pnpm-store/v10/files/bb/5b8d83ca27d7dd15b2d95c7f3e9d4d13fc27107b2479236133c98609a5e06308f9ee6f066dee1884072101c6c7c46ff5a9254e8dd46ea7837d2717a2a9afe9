"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var g2plot_1 = require("@antv/g2plot");
var useChart_1 = __importDefault(require("../../hooks/useChart"));
var utils_1 = require("../../utils");
var errorBoundary_1 = __importDefault(require("../../errorBoundary"));
var createLoading_1 = __importDefault(require("../../utils/createLoading"));
var RadialBarChart = (0, react_1.forwardRef)(function (props, ref) {
    var chartRef = props.chartRef, _a = props.style, style = _a === void 0 ? {
        height: 'inherit',
    } : _a, className = props.className, loading = props.loading, loadingTemplate = props.loadingTemplate, errorTemplate = props.errorTemplate, rest = __rest(props, ["chartRef", "style", "className", "loading", "loadingTemplate", "errorTemplate"]);
    var _b = (0, useChart_1.default)(g2plot_1.RadialBar, rest), chart = _b.chart, container = _b.container;
    (0, react_1.useEffect)(function () {
        (0, utils_1.getChart)(chartRef, chart.current);
    }, [chart.current]);
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        getChart: function () { return chart.current; },
    }); });
    return (react_1.default.createElement(errorBoundary_1.default, { errorTemplate: errorTemplate },
        loading && react_1.default.createElement(createLoading_1.default, { loadingTemplate: loadingTemplate, theme: props.theme }),
        react_1.default.createElement("div", { className: className, style: style, ref: container })));
});
exports.default = RadialBarChart;
