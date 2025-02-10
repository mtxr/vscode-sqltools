"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticAction = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var util_1 = require("@antv/util");
var statistic_1 = require("../../../../utils/statistic");
var util_2 = require("../util");
/**
 * Pie 中心文本事件的 Action
 */
var StatisticAction = /** @class */ (function (_super) {
    tslib_1.__extends(StatisticAction, _super);
    function StatisticAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatisticAction.prototype.getAnnotations = function (_view) {
        var view = _view || this.context.view;
        // @ts-ignore
        return view.getController('annotation').option;
    };
    StatisticAction.prototype.getInitialAnnotation = function () {
        return this.initialAnnotation;
    };
    StatisticAction.prototype.init = function () {
        var _this = this;
        var view = this.context.view;
        view.removeInteraction('tooltip');
        view.on('afterchangesize', function () {
            var annotations = _this.getAnnotations(view);
            _this.initialAnnotation = annotations;
        });
    };
    StatisticAction.prototype.change = function (arg) {
        var _a = this.context, view = _a.view, event = _a.event;
        if (!this.initialAnnotation) {
            this.initialAnnotation = this.getAnnotations();
        }
        var data = (0, util_1.get)(event, ['data', 'data']);
        if (event.type.match('legend-item')) {
            var delegateObject = g2_1.Util.getDelegationObject(this.context);
            // @ts-ignore
            var colorField_1 = view.getGroupedFields()[0];
            if (delegateObject && colorField_1) {
                var item_1 = delegateObject.item;
                data = view.getData().find(function (d) { return d[colorField_1] === item_1.value; });
            }
        }
        if (data) {
            var annotations = (0, util_1.get)(arg, 'annotations', []);
            var statistic = (0, util_1.get)(arg, 'statistic', {});
            // 先清空标注，再重新渲染
            view.getController('annotation').clear(true);
            // 先进行其他 annotations，再去渲染统计文本
            (0, util_1.each)(annotations, function (annotation) {
                if (typeof annotation === 'object') {
                    view.annotation()[annotation.type](annotation);
                }
            });
            (0, statistic_1.renderStatistic)(view, { statistic: statistic, plotType: 'pie' }, data);
            view.render(true);
        }
        // 交互的时候，把 shape 提前
        var ele = (0, util_2.getCurrentElement)(this.context);
        if (ele) {
            ele.shape.toFront();
        }
    };
    StatisticAction.prototype.reset = function () {
        var view = this.context.view;
        var annotationController = view.getController('annotation');
        annotationController.clear(true);
        var initialStatistic = this.getInitialAnnotation();
        (0, util_1.each)(initialStatistic, function (a) {
            view.annotation()[a.type](a);
        });
        view.render(true);
    };
    return StatisticAction;
}(g2_1.Action));
exports.StatisticAction = StatisticAction;
//# sourceMappingURL=statistic-active.js.map