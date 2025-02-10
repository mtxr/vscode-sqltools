import { __assign, __extends } from "tslib";
import GroupComponent from '../abstract/group-component';
import { regionToBBox } from '../util/util';
var ImageAnnotation = /** @class */ (function (_super) {
    __extends(ImageAnnotation, _super);
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
        return __assign(__assign({}, cfg), { name: 'annotation', type: 'image', locationType: 'region', start: null, end: null, src: null, style: {} });
    };
    ImageAnnotation.prototype.renderInner = function (group) {
        this.renderImage(group);
    };
    ImageAnnotation.prototype.getImageAttrs = function () {
        var start = this.get('start');
        var end = this.get('end');
        var style = this.get('style');
        var bbox = regionToBBox({ start: start, end: end });
        var src = this.get('src');
        return __assign({ x: bbox.x, y: bbox.y, img: src, width: bbox.width, height: bbox.height }, style);
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
}(GroupComponent));
export default ImageAnnotation;
//# sourceMappingURL=image.js.map