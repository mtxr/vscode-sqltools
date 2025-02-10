"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trend = void 0;
var tslib_1 = require("tslib");
var group_component_1 = require("../abstract/group-component");
var constant_1 = require("./constant");
var path_1 = require("./path");
var Trend = /** @class */ (function (_super) {
    tslib_1.__extends(Trend, _super);
    function Trend() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Trend.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'trend', x: 0, y: 0, width: 200, height: 16, smooth: true, isArea: false, data: [], backgroundStyle: constant_1.BACKGROUND_STYLE, lineStyle: constant_1.LINE_STYLE, areaStyle: constant_1.AREA_STYLE });
    };
    Trend.prototype.renderInner = function (group) {
        var _a = this.cfg, width = _a.width, height = _a.height, data = _a.data, smooth = _a.smooth, isArea = _a.isArea, backgroundStyle = _a.backgroundStyle, lineStyle = _a.lineStyle, areaStyle = _a.areaStyle;
        // 背景
        this.addShape(group, {
            id: this.getElementId('background'),
            type: 'rect',
            attrs: tslib_1.__assign({ x: 0, y: 0, width: width,
                height: height }, backgroundStyle),
        });
        var path = path_1.dataToPath(data, width, height, smooth);
        // 线
        this.addShape(group, {
            id: this.getElementId('line'),
            type: 'path',
            attrs: tslib_1.__assign({ path: path }, lineStyle),
        });
        // area
        // 在 path 的基础上，增加两个坐标点
        if (isArea) {
            var areaPath = path_1.linePathToAreaPath(path, width, height, data);
            this.addShape(group, {
                id: this.getElementId('area'),
                type: 'path',
                attrs: tslib_1.__assign({ path: areaPath }, areaStyle),
            });
        }
    };
    Trend.prototype.applyOffset = function () {
        var _a = this.cfg, x = _a.x, y = _a.y;
        // 统一移动到对应的位置
        this.moveElementTo(this.get('group'), {
            x: x,
            y: y,
        });
    };
    return Trend;
}(group_component_1.default));
exports.Trend = Trend;
exports.default = Trend;
//# sourceMappingURL=trend.js.map