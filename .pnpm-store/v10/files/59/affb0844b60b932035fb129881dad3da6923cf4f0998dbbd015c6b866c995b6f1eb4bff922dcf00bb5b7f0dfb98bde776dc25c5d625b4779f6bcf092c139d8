import { __assign, __extends, __rest } from "tslib";
import { get } from '@antv/util';
import GroupComponent from '../abstract/group-component';
import { renderTag } from '../util/graphic';
import { applyTranslate } from '../util/matrix';
import Theme from '../util/theme';
var DataMarkerAnnotation = /** @class */ (function (_super) {
    __extends(DataMarkerAnnotation, _super);
    function DataMarkerAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    DataMarkerAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { name: 'annotation', type: 'dataMarker', locationType: 'point', x: 0, y: 0, point: {}, line: {}, text: {}, direction: 'upward', autoAdjust: true, coordinateBBox: null, defaultCfg: {
                point: {
                    display: true,
                    style: {
                        r: 3,
                        fill: '#FFFFFF',
                        stroke: '#1890FF',
                        lineWidth: 2,
                    },
                },
                line: {
                    display: true,
                    length: 20,
                    style: {
                        stroke: Theme.lineColor,
                        lineWidth: 1,
                    },
                },
                text: {
                    content: '',
                    display: true,
                    style: {
                        fill: Theme.textColor,
                        opacity: 0.65,
                        fontSize: 12,
                        textAlign: 'start',
                        fontFamily: Theme.fontFamily,
                    },
                },
            } });
    };
    DataMarkerAnnotation.prototype.renderInner = function (group) {
        if (get(this.get('line'), 'display')) {
            this.renderLine(group);
        }
        if (get(this.get('text'), 'display')) {
            this.renderText(group);
        }
        if (get(this.get('point'), 'display')) {
            this.renderPoint(group);
        }
        if (this.get('autoAdjust')) {
            this.autoAdjust(group);
        }
    };
    DataMarkerAnnotation.prototype.applyOffset = function () {
        this.moveElementTo(this.get('group'), {
            x: this.get('x') + this.get('offsetX'),
            y: this.get('y') + this.get('offsetY'),
        });
    };
    DataMarkerAnnotation.prototype.renderPoint = function (group) {
        var point = this.getShapeAttrs().point;
        this.addShape(group, {
            type: 'circle',
            id: this.getElementId('point'),
            name: 'annotation-point',
            attrs: point,
        });
    };
    DataMarkerAnnotation.prototype.renderLine = function (group) {
        var line = this.getShapeAttrs().line;
        this.addShape(group, {
            type: 'path',
            id: this.getElementId('line'),
            name: 'annotation-line',
            attrs: line,
        });
    };
    DataMarkerAnnotation.prototype.renderText = function (group) {
        var textAttrs = this.getShapeAttrs().text;
        var x = textAttrs.x, y = textAttrs.y, text = textAttrs.text, style = __rest(textAttrs, ["x", "y", "text"]);
        var _a = this.get('text'), background = _a.background, maxLength = _a.maxLength, autoEllipsis = _a.autoEllipsis, isVertival = _a.isVertival, ellipsisPosition = _a.ellipsisPosition;
        var tagCfg = {
            x: x,
            y: y,
            id: this.getElementId('text'),
            name: 'annotation-text',
            content: text,
            style: style,
            background: background,
            maxLength: maxLength,
            autoEllipsis: autoEllipsis,
            isVertival: isVertival,
            ellipsisPosition: ellipsisPosition,
        };
        renderTag(group, tagCfg);
    };
    DataMarkerAnnotation.prototype.autoAdjust = function (group) {
        var direction = this.get('direction');
        var x = this.get('x');
        var y = this.get('y');
        var lineLength = get(this.get('line'), 'length', 0);
        var coordinateBBox = this.get('coordinateBBox');
        var _a = group.getBBox(), minX = _a.minX, maxX = _a.maxX, minY = _a.minY, maxY = _a.maxY;
        var textGroup = group.findById(this.getElementId('text-group'));
        var textShape = group.findById(this.getElementId('text'));
        var lineShape = group.findById(this.getElementId('line'));
        if (!coordinateBBox) {
            return;
        }
        if (textGroup) {
            var translateX = textGroup.attr('x'), translateY = textGroup.attr('y');
            var _b = textShape.getCanvasBBox(), width = _b.width, height = _b.height;
            var xFactor = 0, yFactor = 0;
            if (x + minX <= coordinateBBox.minX) {
                // 左侧超出
                if (direction === 'leftward') {
                    xFactor = 1;
                }
                else {
                    var overflow = coordinateBBox.minX - (x + minX);
                    translateX = textGroup.attr('x') + overflow;
                }
            }
            else if (x + maxX >= coordinateBBox.maxX) {
                // 右侧超出
                if (direction === 'rightward') {
                    xFactor = -1;
                }
                else {
                    var overflow = x + maxX - coordinateBBox.maxX;
                    translateX = textGroup.attr('x') - overflow;
                }
            }
            if (!!xFactor) {
                if (lineShape) {
                    lineShape.attr('path', [
                        ['M', 0, 0],
                        ['L', lineLength * xFactor, 0],
                    ]);
                }
                translateX = (lineLength + 2 + width) * xFactor;
            }
            if (y + minY <= coordinateBBox.minY) {
                // 上方超出
                if (direction === 'upward') {
                    yFactor = 1;
                }
                else {
                    var overflow = coordinateBBox.minY - (y + minY);
                    translateY = textGroup.attr('y') + overflow;
                }
            }
            else if (y + maxY >= coordinateBBox.maxY) {
                // 下方超出
                if (direction === 'downward') {
                    yFactor = -1;
                }
                else {
                    var overflow = y + maxY - coordinateBBox.maxY;
                    translateY = textGroup.attr('y') - overflow;
                }
            }
            if (!!yFactor) {
                if (lineShape) {
                    lineShape.attr('path', [
                        ['M', 0, 0],
                        ['L', 0, lineLength * yFactor],
                    ]);
                }
                translateY = (lineLength + 2 + height) * yFactor;
            }
            if (translateX !== textGroup.attr('x') || translateY !== textGroup.attr('y'))
                applyTranslate(textGroup, translateX, translateY);
        }
    };
    DataMarkerAnnotation.prototype.getShapeAttrs = function () {
        var lineDisplay = get(this.get('line'), 'display');
        var pointStyle = get(this.get('point'), 'style', {});
        var lineStyle = get(this.get('line'), 'style', {});
        var textStyle = get(this.get('text'), 'style', {});
        var direction = this.get('direction');
        var lineLength = lineDisplay ? get(this.get('line'), 'length', 0) : 0;
        var xFactor = 0, yFactor = 0;
        var textBaseline = 'top', textAlign = 'start';
        switch (direction) {
            case 'upward':
                yFactor = -1;
                textBaseline = 'bottom';
                break;
            case 'downward':
                yFactor = 1;
                textBaseline = 'top';
                break;
            case 'leftward':
                xFactor = -1;
                textAlign = 'end';
                break;
            case 'rightward':
                xFactor = 1;
                textAlign = 'start';
                break;
        }
        return {
            point: __assign({ x: 0, y: 0 }, pointStyle),
            line: __assign({ path: [
                    ['M', 0, 0],
                    ['L', lineLength * xFactor, lineLength * yFactor],
                ] }, lineStyle),
            text: __assign({ x: (lineLength + 2) * xFactor, y: (lineLength + 2) * yFactor, text: get(this.get('text'), 'content', ''), textBaseline: textBaseline,
                textAlign: textAlign }, textStyle),
        };
    };
    return DataMarkerAnnotation;
}(GroupComponent));
export default DataMarkerAnnotation;
//# sourceMappingURL=data-marker.js.map