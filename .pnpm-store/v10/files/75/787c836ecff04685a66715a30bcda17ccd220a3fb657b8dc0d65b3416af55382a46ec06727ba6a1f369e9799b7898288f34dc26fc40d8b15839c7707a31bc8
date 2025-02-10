"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("./path"));
/** 引入 Path 对应的 ShapeFactory */
require("./shape/line");
/**
 * Line 几何标记。
 * 常用于折线图的绘制。
 */
var Line = /** @class */ (function (_super) {
    tslib_1.__extends(Line, _super);
    function Line(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.type = 'line';
        var _a = cfg.sortable, sortable = _a === void 0 ? false : _a; // 关闭默认的 X 轴数据排序
        _this.sortable = sortable;
        return _this;
    }
    return Line;
}(path_1.default));
exports.default = Line;
//# sourceMappingURL=line.js.map