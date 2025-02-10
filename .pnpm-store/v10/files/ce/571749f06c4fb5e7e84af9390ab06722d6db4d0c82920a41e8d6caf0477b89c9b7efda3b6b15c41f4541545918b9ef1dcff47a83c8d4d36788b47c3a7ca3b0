"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_content_loader_1 = __importDefault(require("react-content-loader"));
var ChartLoading = function (_a) {
    var loadingTemplate = _a.loadingTemplate, _b = _a.theme, theme = _b === void 0 ? 'light' : _b;
    var renderLoading = function () {
        if (loadingTemplate) {
            return loadingTemplate;
        }
        return (react_1.default.createElement(react_content_loader_1.default, { viewBox: "0 0 400 180", width: 200, height: 90, speed: 1, backgroundColor: theme === 'dark' ? '#262626' : '#D9D9D9' },
            react_1.default.createElement("rect", { x: "20", y: "5", rx: "0", ry: "0", width: "1", height: "170" }),
            react_1.default.createElement("rect", { x: "20", y: "175", rx: "0", ry: "0", width: "360", height: "1" }),
            react_1.default.createElement("rect", { x: "40", y: "75", rx: "0", ry: "0", width: "35", height: "100" }),
            react_1.default.createElement("rect", { x: "80", y: "125", rx: "0", ry: "0", width: "35", height: "50" }),
            react_1.default.createElement("rect", { x: "120", y: "105", rx: "0", ry: "0", width: "35", height: "70" }),
            react_1.default.createElement("rect", { x: "160", y: "35", rx: "0", ry: "0", width: "35", height: "140" }),
            react_1.default.createElement("rect", { x: "200", y: "55", rx: "0", ry: "0", width: "35", height: "120" }),
            react_1.default.createElement("rect", { x: "240", y: "15", rx: "0", ry: "0", width: "35", height: "160" }),
            react_1.default.createElement("rect", { x: "280", y: "135", rx: "0", ry: "0", width: "35", height: "40" }),
            react_1.default.createElement("rect", { x: "320", y: "85", rx: "0", ry: "0", width: "35", height: "90" })));
    };
    return (react_1.default.createElement("div", { className: "charts-loading-container", style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            left: 0,
            top: 0,
            zIndex: 99,
            backgroundColor: theme === 'dark' ? 'rgb(20, 20, 20)' : 'rgb(255, 255, 255)',
        } }, renderLoading()));
};
exports.default = ChartLoading;
