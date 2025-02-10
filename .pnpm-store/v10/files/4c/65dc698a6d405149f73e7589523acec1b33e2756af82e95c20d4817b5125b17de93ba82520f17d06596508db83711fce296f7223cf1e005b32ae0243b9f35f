import { registerShape, Util } from '@antv/g2';
import { clamp } from '@antv/util';
/**
 * 自定义 Shape 部分: 自定义米轨仪表盘
 * 定义 STEP, STEP_RATIO. 可绘制区域: 1 / (STEP + 1) * i -> 1 / (STEP + 1) * i + (STEP_RATIO / (STEP + 1))
 */
registerShape('interval', 'meter-gauge', {
    draw: function (cfg, container) {
        // 使用 customInfo 传递参数
        var _a = cfg.customInfo.meter, meter = _a === void 0 ? {} : _a;
        var _b = meter.steps, STEP = _b === void 0 ? 50 : _b, _c = meter.stepRatio, STEP_RATIO = _c === void 0 ? 0.5 : _c;
        STEP = STEP < 1 ? 1 : STEP;
        // stepRatio 取值范围: (0, 1]
        STEP_RATIO = clamp(STEP_RATIO, 0, 1);
        var _d = this.coordinate, COORD_START_ANGLE = _d.startAngle, COORD_END_ANGLE = _d.endAngle;
        var GAP = 0;
        if (STEP_RATIO > 0 && STEP_RATIO < 1) {
            var TOTAL = COORD_END_ANGLE - COORD_START_ANGLE;
            GAP = TOTAL / STEP / (STEP_RATIO / (1 - STEP_RATIO) + 1 - 1 / STEP);
        }
        var INTERVAL = (GAP / (1 - STEP_RATIO)) * STEP_RATIO;
        var group = container.addGroup();
        // 绘制图形的时候，留下 gap
        var center = this.coordinate.getCenter();
        var radius = this.coordinate.getRadius();
        var _e = Util.getAngle(cfg, this.coordinate), START_ANGLE = _e.startAngle, END_ANGLE = _e.endAngle;
        for (var startAngle = START_ANGLE; startAngle < END_ANGLE;) {
            var endAngle = void 0;
            var r = (startAngle - COORD_START_ANGLE) % (INTERVAL + GAP);
            if (r < INTERVAL) {
                endAngle = startAngle + (INTERVAL - r);
            }
            else {
                startAngle += INTERVAL + GAP - r;
                endAngle = startAngle + INTERVAL;
            }
            var path = Util.getSectorPath(center.x, center.y, radius, startAngle, Math.min(endAngle, END_ANGLE), radius * this.coordinate.innerRadius);
            group.addShape('path', {
                name: 'meter-gauge',
                attrs: {
                    path: path,
                    fill: cfg.color,
                    stroke: cfg.color,
                    lineWidth: 0.5,
                },
            });
            startAngle = endAngle + GAP;
        }
        return group;
    },
});
//# sourceMappingURL=meter-gauge.js.map