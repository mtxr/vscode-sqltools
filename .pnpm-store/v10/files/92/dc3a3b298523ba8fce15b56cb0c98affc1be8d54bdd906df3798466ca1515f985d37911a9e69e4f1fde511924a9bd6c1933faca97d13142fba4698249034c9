"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkerActiveAction = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var util_1 = require("@antv/util");
var MarkerActiveAction = /** @class */ (function (_super) {
    tslib_1.__extends(MarkerActiveAction, _super);
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
            (0, util_1.each)(points, function (point) {
                (0, util_1.each)(point.elements, function (element) {
                    var active = (0, util_1.findIndex)(items_1, function (item) { return item.data === element.data; }) !== -1;
                    element.setState('active', active);
                });
            });
        }
    };
    MarkerActiveAction.prototype.reset = function () {
        var view = this.getView();
        var points = view.geometries.filter(function (geom) { return geom.type === 'point'; });
        (0, util_1.each)(points, function (point) {
            (0, util_1.each)(point.elements, function (element) {
                element.setState('active', false);
            });
        });
    };
    MarkerActiveAction.prototype.getView = function () {
        return this.context.view;
    };
    return MarkerActiveAction;
}(g2_1.InteractionAction));
exports.MarkerActiveAction = MarkerActiveAction;
//# sourceMappingURL=marker-active.js.map