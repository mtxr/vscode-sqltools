import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { deepAssign } from '../../utils';
import { adaptor } from './adaptor';
import './interactions';
var Radar = /** @class */ (function (_super) {
    __extends(Radar, _super);
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
        return deepAssign({}, _super.prototype.getDefaultOptions.call(this), {
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
        return adaptor;
    };
    return Radar;
}(Plot));
export { Radar };
//# sourceMappingURL=index.js.map