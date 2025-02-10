import { __assign, __extends } from "tslib";
import { each } from '@antv/util';
import GridBase from './base';
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Line.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { type: 'line' });
    };
    Line.prototype.getGridPath = function (points) {
        var path = [];
        each(points, function (point, index) {
            if (index === 0) {
                path.push(['M', point.x, point.y]);
            }
            else {
                path.push(['L', point.x, point.y]);
            }
        });
        return path;
    };
    return Line;
}(GridBase));
export default Line;
//# sourceMappingURL=line.js.map