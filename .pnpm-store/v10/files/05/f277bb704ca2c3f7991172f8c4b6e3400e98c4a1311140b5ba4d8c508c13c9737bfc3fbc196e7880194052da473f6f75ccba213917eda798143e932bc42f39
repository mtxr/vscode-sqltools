import { __assign, __extends } from "tslib";
import { isNumber, isString } from '@antv/util';
import GroupComponent from '../abstract/group-component';
import { renderTag } from '../util/graphic';
import Theme from '../util/theme';
import { getValueByPercent } from '../util/util';
var LineAnnotation = /** @class */ (function (_super) {
    __extends(LineAnnotation, _super);
    function LineAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @protected
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    LineAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { name: 'annotation', type: 'line', locationType: 'region', start: null, end: null, style: {}, text: null, defaultCfg: {
                style: {
                    fill: Theme.textColor,
                    fontSize: 12,
                    textAlign: 'center',
                    textBaseline: 'bottom',
                    fontFamily: Theme.fontFamily,
                },
                text: {
                    position: 'center',
                    autoRotate: true,
                    content: null,
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        stroke: Theme.lineColor,
                        lineWidth: 1,
                    },
                },
            } });
    };
    LineAnnotation.prototype.renderInner = function (group) {
        this.renderLine(group);
        if (this.get('text')) {
            this.renderLabel(group);
        }
    };
    // 绘制线
    LineAnnotation.prototype.renderLine = function (group) {
        var start = this.get('start');
        var end = this.get('end');
        var style = this.get('style');
        this.addShape(group, {
            type: 'line',
            id: this.getElementId('line'),
            name: 'annotation-line',
            attrs: __assign({ x1: start.x, y1: start.y, x2: end.x, y2: end.y }, style),
        });
    };
    // 获取 label 的位置
    LineAnnotation.prototype.getLabelPoint = function (start, end, position) {
        var percent;
        if (position === 'start') {
            percent = 0;
        }
        else if (position === 'center') {
            percent = 0.5;
        }
        else if (isString(position) && position.indexOf('%') !== -1) {
            percent = parseInt(position, 10) / 100;
        }
        else if (isNumber(position)) {
            percent = position;
        }
        else {
            percent = 1;
        }
        if (percent > 1 || percent < 0) {
            percent = 1;
        }
        return {
            x: getValueByPercent(start.x, end.x, percent),
            y: getValueByPercent(start.y, end.y, percent),
        };
    };
    // 绘制 label
    LineAnnotation.prototype.renderLabel = function (group) {
        var text = this.get('text');
        var start = this.get('start');
        var end = this.get('end');
        var position = text.position, content = text.content, style = text.style, offsetX = text.offsetX, offsetY = text.offsetY, autoRotate = text.autoRotate, maxLength = text.maxLength, autoEllipsis = text.autoEllipsis, ellipsisPosition = text.ellipsisPosition, background = text.background, _a = text.isVertical, isVertical = _a === void 0 ? false : _a;
        var point = this.getLabelPoint(start, end, position);
        var x = point.x + offsetX;
        var y = point.y + offsetY;
        var cfg = {
            id: this.getElementId('line-text'),
            name: 'annotation-line-text',
            x: x,
            y: y,
            content: content,
            style: style,
            maxLength: maxLength,
            autoEllipsis: autoEllipsis,
            ellipsisPosition: ellipsisPosition,
            background: background,
            isVertical: isVertical,
        };
        // 如果自动旋转
        if (autoRotate) {
            var vector = [end.x - start.x, end.y - start.y];
            cfg.rotate = Math.atan2(vector[1], vector[0]);
        }
        renderTag(group, cfg);
    };
    return LineAnnotation;
}(GroupComponent));
export default LineAnnotation;
//# sourceMappingURL=line.js.map