import { __assign, __extends } from "tslib";
import { Action, registerComponentController, TooltipController, Util } from '@antv/g2';
import { isNil } from '@antv/util';
var RadarTooltipController = /** @class */ (function (_super) {
    __extends(RadarTooltipController, _super);
    function RadarTooltipController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(RadarTooltipController.prototype, "name", {
        get: function () {
            return 'radar-tooltip';
        },
        enumerable: false,
        configurable: true
    });
    RadarTooltipController.prototype.getTooltipItems = function (point) {
        var _a = this.getTooltipCfg(), shared = _a.shared, cfgTitle = _a.title;
        var hintItems = _super.prototype.getTooltipItems.call(this, point);
        if (hintItems.length > 0) {
            var geometry_1 = this.view.geometries[0];
            var dataArray = geometry_1.dataArray;
            var title_1 = hintItems[0].name;
            var result_1 = [];
            dataArray.forEach(function (mappingData) {
                mappingData.forEach(function (d) {
                    var items = Util.getTooltipItems(d, geometry_1);
                    var item = items[0];
                    if (!shared && item && item.name === title_1) {
                        var displayTitle = isNil(cfgTitle) ? title_1 : cfgTitle;
                        result_1.push(__assign(__assign({}, item), { name: item.title, title: displayTitle }));
                    }
                    else if (shared && item) {
                        var displayTitle = isNil(cfgTitle) ? item.name || title_1 : cfgTitle;
                        result_1.push(__assign(__assign({}, item), { name: item.title, title: displayTitle }));
                    }
                });
            });
            return result_1;
        }
        return [];
    };
    return RadarTooltipController;
}(TooltipController));
export { RadarTooltipController };
registerComponentController('radar-tooltip', RadarTooltipController);
/**
 * 雷达图 tooltip 激活 action
 */
var RadarTooltipAction = /** @class */ (function (_super) {
    __extends(RadarTooltipAction, _super);
    function RadarTooltipAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RadarTooltipAction.prototype.init = function () {
        var view = this.context.view;
        view.removeInteraction('tooltip');
    };
    RadarTooltipAction.prototype.show = function () {
        var event = this.context.event;
        var controller = this.getTooltipController();
        controller.showTooltip({ x: event.x, y: event.y });
    };
    RadarTooltipAction.prototype.hide = function () {
        var controller = this.getTooltipController();
        controller.hideTooltip();
    };
    RadarTooltipAction.prototype.getTooltipController = function () {
        var view = this.context.view;
        return view.getController('radar-tooltip');
    };
    return RadarTooltipAction;
}(Action));
export { RadarTooltipAction };
//# sourceMappingURL=radar-tooltip-action.js.map