import { __extends } from "tslib";
import { InteractionAction } from '@antv/g2';
import { each, findIndex } from '@antv/util';
var MarkerActiveAction = /** @class */ (function (_super) {
    __extends(MarkerActiveAction, _super);
    function MarkerActiveAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MarkerActiveAction.prototype.active = function () {
        var view = this.getView();
        var evt = this.context.event;
        if (evt.data) {
            // items: 数组对象，当前 tooltip 显示的每条内容
            var items_1 = evt.data.items;
            var points = view.geometries.filter(function (geom) { return geom.type === 'point'; });
            each(points, function (point) {
                each(point.elements, function (element) {
                    var active = findIndex(items_1, function (item) { return item.data === element.data; }) !== -1;
                    element.setState('active', active);
                });
            });
        }
    };
    MarkerActiveAction.prototype.reset = function () {
        var view = this.getView();
        var points = view.geometries.filter(function (geom) { return geom.type === 'point'; });
        each(points, function (point) {
            each(point.elements, function (element) {
                element.setState('active', false);
            });
        });
    };
    MarkerActiveAction.prototype.getView = function () {
        return this.context.view;
    };
    return MarkerActiveAction;
}(InteractionAction));
export { MarkerActiveAction };
//# sourceMappingURL=marker-active.js.map