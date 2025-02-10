import { __assign, __extends } from "tslib";
import { Action, Util } from '@antv/g2';
import { get } from '@antv/util';
import { deepAssign, normalPadding } from '../../utils';
var PADDING_RIGHT = 10;
var PADDING_TOP = 5;
/**
 * Action 中的 Button 按钮配置
 *
 * 可能的使用场景：brush filter
 */
export var BUTTON_ACTION_CONFIG = {
    padding: [8, 10],
    text: 'reset',
    textStyle: {
        default: {
            x: 0,
            y: 0,
            fontSize: 12,
            fill: '#333333',
            cursor: 'pointer',
        },
    },
    buttonStyle: {
        default: {
            fill: '#f7f7f7',
            stroke: '#cccccc',
            cursor: 'pointer',
        },
        active: {
            fill: '#e6e6e6',
        },
    },
};
/**
 * @override 复写 G2 Button Action, 后续直接使用 GUI
 */
var ButtonAction = /** @class */ (function (_super) {
    __extends(ButtonAction, _super);
    function ButtonAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buttonGroup = null;
        _this.buttonCfg = __assign({ name: 'button' }, BUTTON_ACTION_CONFIG);
        return _this;
    }
    /**
     * 获取 mix 默认的配置和用户配置
     */
    ButtonAction.prototype.getButtonCfg = function () {
        var view = this.context.view;
        var buttonCfg = get(view, ['interactions', 'filter-action', 'cfg', 'buttonConfig']);
        return deepAssign(this.buttonCfg, buttonCfg, this.cfg);
    };
    /**
     * 绘制 Button 和 文本
     */
    ButtonAction.prototype.drawButton = function () {
        var config = this.getButtonCfg();
        var group = this.context.view.foregroundGroup.addGroup({
            name: config.name,
        });
        var textShape = this.drawText(group);
        this.drawBackground(group, textShape.getBBox());
        this.buttonGroup = group;
    };
    /**
     * 绘制文本
     */
    ButtonAction.prototype.drawText = function (group) {
        var _a;
        var config = this.getButtonCfg();
        // 添加文本
        return group.addShape({
            type: 'text',
            name: 'button-text',
            attrs: __assign({ text: config.text }, (_a = config.textStyle) === null || _a === void 0 ? void 0 : _a.default),
        });
    };
    ButtonAction.prototype.drawBackground = function (group, bbox) {
        var _a;
        var config = this.getButtonCfg();
        var padding = normalPadding(config.padding);
        // 添加背景按钮
        var buttonShape = group.addShape({
            type: 'rect',
            name: 'button-rect',
            attrs: __assign({ x: bbox.x - padding[3], y: bbox.y - padding[0], width: bbox.width + padding[1] + padding[3], height: bbox.height + padding[0] + padding[2] }, (_a = config.buttonStyle) === null || _a === void 0 ? void 0 : _a.default),
        });
        buttonShape.toBack(); // 在后面
        // active 效果内置
        group.on('mouseenter', function () {
            var _a;
            buttonShape.attr((_a = config.buttonStyle) === null || _a === void 0 ? void 0 : _a.active);
        });
        group.on('mouseleave', function () {
            var _a;
            buttonShape.attr((_a = config.buttonStyle) === null || _a === void 0 ? void 0 : _a.default);
        });
        return buttonShape;
    };
    // 重置位置
    ButtonAction.prototype.resetPosition = function () {
        var view = this.context.view;
        var coord = view.getCoordinate();
        var point = coord.convert({ x: 1, y: 1 }); // 后面直接改成左上角
        var buttonGroup = this.buttonGroup;
        var bbox = buttonGroup.getBBox();
        var matrix = Util.transform(null, [
            ['t', point.x - bbox.width - PADDING_RIGHT, point.y + bbox.height + PADDING_TOP],
        ]);
        buttonGroup.setMatrix(matrix);
    };
    /**
     * 显示
     */
    ButtonAction.prototype.show = function () {
        if (!this.buttonGroup) {
            this.drawButton();
        }
        this.resetPosition();
        this.buttonGroup.show();
    };
    /**
     * 隐藏
     */
    ButtonAction.prototype.hide = function () {
        if (this.buttonGroup) {
            this.buttonGroup.hide();
        }
    };
    /**
     * 销毁
     */
    ButtonAction.prototype.destroy = function () {
        var buttonGroup = this.buttonGroup;
        if (buttonGroup) {
            buttonGroup.remove();
        }
        _super.prototype.destroy.call(this);
    };
    return ButtonAction;
}(Action));
export { ButtonAction };
//# sourceMappingURL=reset-button.js.map