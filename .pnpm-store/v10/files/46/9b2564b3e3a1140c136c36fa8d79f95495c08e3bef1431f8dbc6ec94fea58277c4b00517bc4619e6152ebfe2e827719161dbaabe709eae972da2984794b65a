import { __assign, __extends } from "tslib";
import { isEqual, get, deepMix } from '@antv/util';
import { TOOLTIP_CSS_CONST } from '@antv/component';
import Action from '../../base';
import { HtmlTooltip } from '../../../../dependents';
/**
 * 用于组件文本省略后需要展示完整信息的 Tooltip Action
 * @ignore
 */
var EllipsisText = /** @class */ (function (_super) {
    __extends(EllipsisText, _super);
    function EllipsisText() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timeStamp = 0;
        return _this;
    }
    EllipsisText.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.tooltip && this.tooltip.destroy();
    };
    /**
     * 显示 Tooltip
     * @returns
     */
    EllipsisText.prototype.show = function () {
        var context = this.context;
        var ev = context.event;
        var lastTimeStamp = this.timeStamp;
        var timeStamp = +new Date();
        if (timeStamp - lastTimeStamp > 16) {
            var preLoc = this.location;
            var curLoc = { x: ev.x, y: ev.y };
            if (!preLoc || !isEqual(preLoc, curLoc)) {
                this.showTooltip(curLoc);
            }
            this.timeStamp = timeStamp;
            this.location = curLoc;
        }
    };
    /**
     * 隐藏 Tooltip。
     * @returns
     */
    EllipsisText.prototype.hide = function () {
        this.hideTooltip();
        this.location = null;
    };
    EllipsisText.prototype.showTooltip = function (curLoc) {
        var context = this.context;
        var ev = context.event;
        var target = ev.target;
        if (target && target.get('tip')) {
            if (!this.tooltip) {
                this.renderTooltip(); // 延迟生成
            }
            else {
                // 更新时需要重新获取 region 赋值，避免画布缩放后 tooltip 位置不对
                var view = context.view;
                var canvas = view.canvas;
                var region = {
                    start: { x: 0, y: 0 },
                    end: { x: canvas.get('width'), y: canvas.get('height') },
                };
                this.tooltip.set('region', region);
            }
            var tipContent = target.get('tip');
            // 展示 tooltip
            this.tooltip.update(__assign({ title: tipContent }, curLoc));
            this.tooltip.show();
        }
    };
    EllipsisText.prototype.hideTooltip = function () {
        this.tooltip && this.tooltip.hide();
    };
    EllipsisText.prototype.renderTooltip = function () {
        var _a;
        var view = this.context.view;
        var canvas = view.canvas;
        var region = {
            start: { x: 0, y: 0 },
            end: { x: canvas.get('width'), y: canvas.get('height') },
        };
        var theme = view.getTheme();
        var tooltipStyles = get(theme, ['components', 'tooltip', 'domStyles'], {}); // 获取 tooltip 样式
        var tooltip = new HtmlTooltip({
            parent: canvas.get('el').parentNode,
            region: region,
            visible: false,
            crosshairs: null,
            domStyles: __assign({}, deepMix({}, tooltipStyles, (_a = {},
                // 超长的时候，tooltip tip 最大宽度为 50%，然后可以换行
                _a[TOOLTIP_CSS_CONST.CONTAINER_CLASS] = { 'max-width': '50%' },
                _a[TOOLTIP_CSS_CONST.TITLE_CLASS] = { 'word-break': 'break-all' },
                _a))),
        });
        tooltip.init();
        tooltip.setCapture(false); // 不允许捕获事件
        this.tooltip = tooltip;
    };
    return EllipsisText;
}(Action));
export default EllipsisText;
//# sourceMappingURL=ellipsis-text.js.map