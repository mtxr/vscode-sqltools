"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var matrix_util_1 = require("@antv/matrix-util");
var util_1 = require("@antv/util");
var padding_1 = require("../../../util/padding");
var base_1 = tslib_1.__importDefault(require("../base"));
var PADDING_RIGHT = 10;
var PADDING_TOP = 5;
/**
 * Button action
 * @ignore
 */
var ButtonAction = /** @class */ (function (_super) {
    tslib_1.__extends(ButtonAction, _super);
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
        return (0, util_1.deepMix)(this.buttonCfg, this.cfg);
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
            attrs: tslib_1.__assign({ text: config.text }, config.textStyle),
        });
        var textBBox = textShape.getBBox();
        var padding = (0, padding_1.parsePadding)(config.padding);
        // 添加背景按钮
        var buttonShape = group.addShape({
            type: 'rect',
            name: 'button-rect',
            attrs: tslib_1.__assign({ x: textBBox.x - padding[3], y: textBBox.y - padding[0], width: textBBox.width + padding[1] + padding[3], height: textBBox.height + padding[0] + padding[2] }, config.style),
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
        var matrix = matrix_util_1.ext.transform(null, [
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
}(base_1.default));
exports.default = ButtonAction;
//# sourceMappingURL=button.js.map