import { __extends } from "tslib";
import { Action, Util } from '@antv/g2';
import { each, get } from '@antv/util';
import { renderStatistic } from '../../../../utils/statistic';
import { getCurrentElement } from '../util';
/**
 * Pie 中心文本事件的 Action
 */
var StatisticAction = /** @class */ (function (_super) {
    __extends(StatisticAction, _super);
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
        var data = get(event, ['data', 'data']);
        if (event.type.match('legend-item')) {
            var delegateObject = Util.getDelegationObject(this.context);
            // @ts-ignore
            var colorField_1 = view.getGroupedFields()[0];
            if (delegateObject && colorField_1) {
                var item_1 = delegateObject.item;
                data = view.getData().find(function (d) { return d[colorField_1] === item_1.value; });
            }
        }
        if (data) {
            var annotations = get(arg, 'annotations', []);
            var statistic = get(arg, 'statistic', {});
            // 先清空标注，再重新渲染
            view.getController('annotation').clear(true);
            // 先进行其他 annotations，再去渲染统计文本
            each(annotations, function (annotation) {
                if (typeof annotation === 'object') {
                    view.annotation()[annotation.type](annotation);
                }
            });
            renderStatistic(view, { statistic: statistic, plotType: 'pie' }, data);
            view.render(true);
        }
        // 交互的时候，把 shape 提前
        var ele = getCurrentElement(this.context);
        if (ele) {
            ele.shape.toFront();
        }
    };
    StatisticAction.prototype.reset = function () {
        var view = this.context.view;
        var annotationController = view.getController('annotation');
        annotationController.clear(true);
        var initialStatistic = this.getInitialAnnotation();
        each(initialStatistic, function (a) {
            view.annotation()[a.type](a);
        });
        view.render(true);
    };
    return StatisticAction;
}(Action));
export { StatisticAction };
//# sourceMappingURL=statistic-active.js.map