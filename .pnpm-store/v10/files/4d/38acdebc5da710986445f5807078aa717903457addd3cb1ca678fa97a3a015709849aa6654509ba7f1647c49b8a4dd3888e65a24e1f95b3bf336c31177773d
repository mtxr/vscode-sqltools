"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var component_1 = require("@antv/component");
var util_1 = require("@antv/util");
var dependents_1 = require("../../../../dependents");
var base_1 = tslib_1.__importDefault(require("../../base"));
var util_2 = require("../../util");
var AXIS_DESCRIPTION_TOOLTIP = 'aixs-description-tooltip';
var AxisDescription = /** @class */ (function (_super) {
    tslib_1.__extends(AxisDescription, _super);
    function AxisDescription() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AxisDescription.prototype.show = function () {
        var context = this.context;
        var axis = (0, util_2.getDelegationObject)(context).axis;
        var _a = axis.cfg.title, description = _a.description, text = _a.text, descriptionTooltipStyle = _a.descriptionTooltipStyle;
        var _b = context.event, x = _b.x, y = _b.y;
        if (!this.tooltip) {
            this.renderTooltip();
        }
        this.tooltip.update({
            title: text || '',
            customContent: function () {
                return "\n          <div class=\"".concat(component_1.TOOLTIP_CSS_CONST.CONTAINER_CLASS, "\" style={").concat(descriptionTooltipStyle, "}>\n            <div class=\"").concat(component_1.TOOLTIP_CSS_CONST.TITLE_CLASS, "\">\n              \u5B57\u6BB5\u8BF4\u660E\uFF1A").concat(description, "\n            </div>\n          </div>\n        ");
            },
            x: x,
            y: y,
        });
        this.tooltip.show();
    };
    AxisDescription.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.tooltip && this.tooltip.destroy();
    };
    AxisDescription.prototype.hide = function () {
        this.tooltip && this.tooltip.hide();
    };
    AxisDescription.prototype.renderTooltip = function () {
        var _a;
        var view = this.context.view;
        var canvas = view.canvas;
        var region = {
            start: { x: 0, y: 0 },
            end: { x: canvas.get('width'), y: canvas.get('height') },
        };
        var tooltip = new dependents_1.HtmlTooltip({
            parent: canvas.get('el').parentNode,
            region: region,
            visible: false,
            containerId: AXIS_DESCRIPTION_TOOLTIP,
            domStyles: tslib_1.__assign({}, (0, util_1.deepMix)({}, (_a = {},
                // 超长的时候，tooltip tip 最大宽度为 50%，然后可以换行
                _a[component_1.TOOLTIP_CSS_CONST.CONTAINER_CLASS] = {
                    'max-width': '50%',
                    padding: '10px',
                    'line-height': '15px',
                    'font-size': '12px',
                    color: 'rgba(0, 0, 0, .65)',
                },
                _a[component_1.TOOLTIP_CSS_CONST.TITLE_CLASS] = {
                    'word-break': 'break-all',
                    'margin-bottom': '3px',
                },
                _a))),
        });
        tooltip.init();
        tooltip.setCapture(false);
        this.tooltip = tooltip;
    };
    return AxisDescription;
}(base_1.default));
exports.default = AxisDescription;
//# sourceMappingURL=axis-description.js.map