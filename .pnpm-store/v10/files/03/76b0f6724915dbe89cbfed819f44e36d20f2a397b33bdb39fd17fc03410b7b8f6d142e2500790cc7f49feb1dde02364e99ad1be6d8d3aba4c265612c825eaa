import { __assign, __extends } from "tslib";
import { ext } from '@antv/matrix-util';
import { deepMix } from '@antv/util';
import { parsePadding } from '../../../util/padding';
import Action from '../base';
var PADDING_RIGHT = 10;
var PADDING_TOP = 5;
/**
 * Button action
 * @ignore
 */
var ButtonAction = /** @class */ (function (_super) {
    __extends(ButtonAction, _super);
    function ButtonAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buttonGroup = null;
        _this.buttonCfg = {
            name: 'button',
            text: 'button',
            textStyle: {
                x: 0,
                y: 0,
                fontSize: 12,
                fill: '#333333',
                cursor: 'pointer',
            },
            padding: [8, 10],
            style: {
                fill: '#f7f7f7',
                stroke: '#cccccc',
                cursor: 'pointer',
            },
            activeStyle: {
                fill: '#e6e6e6',
            },
        };
        return _this;
    }
    // mix 默认的配置和用户配置
    ButtonAction.prototype.getButtonCfg = function () {
        return deepMix(this.buttonCfg, this.cfg);
    };
    // 绘制 Button 和 文本
    ButtonAction.prototype.drawButton = function () {
        var config = this.getButtonCfg();
        var group = this.context.view.foregroundGroup.addGroup({
            name: config.name,
        });
        // 添加文本
        var textShape = group.addShape({
            type: 'text',
            name: 'button-text',
            attrs: __assign({ text: config.text }, config.textStyle),
        });
        var textBBox = textShape.getBBox();
        var padding = parsePadding(config.padding);
        // 添加背景按钮
        var buttonShape = group.addShape({
            type: 'rect',
            name: 'button-rect',
            attrs: __assign({ x: textBBox.x - padding[3], y: textBBox.y - padding[0], width: textBBox.width + padding[1] + padding[3], height: textBBox.height + padding[0] + padding[2] }, config.style),
        });
        buttonShape.toBack(); // 在后面
        // active 效果内置
        group.on('mouseenter', function () {
            buttonShape.attr(config.activeStyle);
        });
        group.on('mouseleave', function () {
            buttonShape.attr(config.style);
        });
        this.buttonGroup = group;
    };
    // 重置位置
    ButtonAction.prototype.resetPosition = function () {
        var view = this.context.view;
        var coord = view.getCoordinate();
        var point = coord.convert({ x: 1, y: 1 }); // 后面直接改成左上角
        var buttonGroup = this.buttonGroup;
        var bbox = buttonGroup.getBBox();
        var matrix = ext.transform(null, [
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
export default ButtonAction;
//# sourceMappingURL=button.js.map