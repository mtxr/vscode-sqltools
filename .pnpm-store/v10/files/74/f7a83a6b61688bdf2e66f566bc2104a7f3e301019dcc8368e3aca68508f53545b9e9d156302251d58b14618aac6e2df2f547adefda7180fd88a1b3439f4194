import { __assign, __extends } from "tslib";
import ListState from './list-state';
import { isEqual } from '@antv/util';
import { TOOLTIP_CSS_CONST } from '@antv/component';
import { HtmlTooltip } from '../../../dependents';
var STATUS_SHOW = 'showRadio';
var TIP_ID = 'legend-radio-tip';
var ListRadio = /** @class */ (function (_super) {
    __extends(ListRadio, _super);
    function ListRadio() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timeStamp = 0;
        return _this;
    }
    ListRadio.prototype.show = function () {
        var triggerInfo = this.getTriggerListInfo();
        if (triggerInfo === null || triggerInfo === void 0 ? void 0 : triggerInfo.item) {
            var list = triggerInfo.list, item = triggerInfo.item;
            list.setItemState(item, STATUS_SHOW, true);
        }
    };
    ListRadio.prototype.hide = function () {
        var triggerInfo = this.getTriggerListInfo();
        if (triggerInfo === null || triggerInfo === void 0 ? void 0 : triggerInfo.item) {
            var list = triggerInfo.list, item = triggerInfo.item;
            list.setItemState(item, STATUS_SHOW, false);
        }
    };
    ListRadio.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.tooltip && this.tooltip.destroy();
    };
    /**
     * 显示 Tooltip (展示在上方)
     * @returns
     */
    ListRadio.prototype.showTip = function () {
        var context = this.context;
        var ev = context.event;
        var lastTimeStamp = this.timeStamp;
        var timeStamp = +new Date();
        var target = this.context.event.target;
        if (timeStamp - lastTimeStamp > 16 && target.get('name') === 'legend-item-radio') {
            var preLoc = this.location;
            var curLoc = { x: ev.x, y: ev.y };
            this.timeStamp = timeStamp;
            this.location = curLoc;
            if (!preLoc || !isEqual(preLoc, curLoc)) {
                this.showTooltip(curLoc);
            }
        }
    };
    /**
     * 隐藏 Tooltip。
     * @returns
     */
    ListRadio.prototype.hideTip = function () {
        this.hideTooltip();
        this.location = null;
    };
    ListRadio.prototype.showTooltip = function (curLoc) {
        var context = this.context;
        var ev = context.event;
        var target = ev.target;
        if (target && target.get('tip')) {
            if (!this.tooltip) {
                this.renderTooltip(); // 延迟生成
            }
            // 展示 tooltip
            var _a = context.view.getCanvas().get('el').getBoundingClientRect(), offsetX = _a.x, offsetY = _a.y;
            this.tooltip.update(__assign(__assign({ title: target.get('tip') }, curLoc), { x: curLoc.x + offsetX, y: curLoc.y + offsetY }));
            this.tooltip.show();
        }
    };
    ListRadio.prototype.hideTooltip = function () {
        this.tooltip && this.tooltip.hide();
    };
    ListRadio.prototype.renderTooltip = function () {
        var _a;
        var tooltipStyles = (_a = {},
            _a[TOOLTIP_CSS_CONST.CONTAINER_CLASS] = {
                padding: '6px 8px',
                transform: 'translate(-50%, -80%)',
                background: 'rgba(0,0,0,0.75)',
                color: '#fff',
                'border-radius': '2px',
                // 避免遮挡，如果还不够的话，再考虑开放用户配置
                'z-index': 100,
            },
            _a[TOOLTIP_CSS_CONST.TITLE_CLASS] = {
                'font-size': '12px',
                'line-height': '14px',
                'margin-bottom': 0,
                'word-break': 'break-all',
            },
            _a);
        if (document.getElementById(TIP_ID)) {
            document.body.removeChild(document.getElementById(TIP_ID));
        }
        var tooltip = new HtmlTooltip({
            parent: document.body,
            // tooltip 限制的区域
            region: null,
            visible: false,
            crosshairs: null,
            domStyles: tooltipStyles,
            containerId: TIP_ID,
        });
        tooltip.init();
        tooltip.setCapture(false); // 不允许捕获事件
        this.tooltip = tooltip;
    };
    return ListRadio;
}(ListState));
export default ListRadio;
//# sourceMappingURL=list-radio.js.map