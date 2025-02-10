"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Radar = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var utils_1 = require("../../utils");
var adaptor_1 = require("./adaptor");
require("./interactions");
var Radar = /** @class */ (function (_super) {
    tslib_1.__extends(Radar, _super);
    function Radar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'radar';
        return _this;
    }
    /**
     * @override
     * @param data
     */
    Radar.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        this.chart.changeData(data);
    };
    /**
     * 获取 雷达图 默认配置
     */
    Radar.prototype.getDefaultOptions = function () {
        return (0, utils_1.deepAssign)({}, _super.prototype.getDefaultOptions.call(this), {
            xAxis: {
                label: {
                    offset: 15,
                },
                grid: {
                    line: {
                        type: 'line',
                    },
                },
            },
            yAxis: {
                grid: {
                    line: {
                        type: 'circle',
                    },
                },
            },
            legend: {
                position: 'top',
            },
            tooltip: {
                shared: true,
                showCrosshairs: true,
                showMarkers: true,
                crosshairs: {
                    type: 'xy',
                    line: {
                        style: {
                            stroke: '#565656',
                            lineDash: [4],
                        },
                    },
                    follow: true,
                },
            },
        });
    };
    /**
     * 获取 雷达图 的适配器
     */
    Radar.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Radar;
}(plot_1.Plot));
exports.Radar = Radar;
//# sourceMappingURL=index.js.map