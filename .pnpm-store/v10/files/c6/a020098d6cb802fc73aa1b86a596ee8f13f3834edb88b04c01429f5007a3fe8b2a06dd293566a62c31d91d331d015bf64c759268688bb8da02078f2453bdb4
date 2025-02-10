"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var group_component_1 = require("../abstract/group-component");
var util_1 = require("../util/util");
var ImageAnnotation = /** @class */ (function (_super) {
    tslib_1.__extends(ImageAnnotation, _super);
    function ImageAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @protected
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    ImageAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'annotation', type: 'image', locationType: 'region', start: null, end: null, src: null, style: {} });
    };
    ImageAnnotation.prototype.renderInner = function (group) {
        this.renderImage(group);
    };
    ImageAnnotation.prototype.getImageAttrs = function () {
        var start = this.get('start');
        var end = this.get('end');
        var style = this.get('style');
        var bbox = util_1.regionToBBox({ start: start, end: end });
        var src = this.get('src');
        return tslib_1.__assign({ x: bbox.x, y: bbox.y, img: src, width: bbox.width, height: bbox.height }, style);
    };
    // 绘制图片
    ImageAnnotation.prototype.renderImage = function (group) {
        this.addShape(group, {
            type: 'image',
            id: this.getElementId('image'),
            name: 'annotation-image',
            attrs: this.getImageAttrs(),
        });
    };
    return ImageAnnotation;
}(group_component_1.default));
exports.default = ImageAnnotation;
//# sourceMappingURL=image.js.map