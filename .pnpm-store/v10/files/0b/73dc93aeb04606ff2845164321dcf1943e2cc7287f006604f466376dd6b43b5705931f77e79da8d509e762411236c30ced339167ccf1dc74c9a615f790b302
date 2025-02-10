import { __assign, __extends } from "tslib";
import GroupComponent from '../abstract/group-component';
import { AREA_STYLE, BACKGROUND_STYLE, LINE_STYLE } from './constant';
import { dataToPath, linePathToAreaPath } from './path';
var Trend = /** @class */ (function (_super) {
    __extends(Trend, _super);
    function Trend() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Trend.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { name: 'trend', x: 0, y: 0, width: 200, height: 16, smooth: true, isArea: false, data: [], backgroundStyle: BACKGROUND_STYLE, lineStyle: LINE_STYLE, areaStyle: AREA_STYLE });
    };
    Trend.prototype.renderInner = function (group) {
        var _a = this.cfg, width = _a.width, height = _a.height, data = _a.data, smooth = _a.smooth, isArea = _a.isArea, backgroundStyle = _a.backgroundStyle, lineStyle = _a.lineStyle, areaStyle = _a.areaStyle;
        // 背景
        this.addShape(group, {
            id: this.getElementId('background'),
            type: 'rect',
            attrs: __assign({ x: 0, y: 0, width: width,
                height: height }, backgroundStyle),
        });
        var path = dataToPath(data, width, height, smooth);
        // 线
        this.addShape(group, {
            id: this.getElementId('line'),
            type: 'path',
            attrs: __assign({ path: path }, lineStyle),
        });
        // area
        // 在 path 的基础上，增加两个坐标点
        if (isArea) {
            var areaPath = linePathToAreaPath(path, width, height, data);
            this.addShape(group, {
                id: this.getElementId('area'),
                type: 'path',
                attrs: __assign({ path: areaPath }, areaStyle),
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
}(GroupComponent));
export { Trend };
export default Trend;
//# sourceMappingURL=trend.js.map