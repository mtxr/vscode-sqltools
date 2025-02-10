import { GeometryCfg } from './geometry/base';
import Area, { AreaCfg } from './geometry/area';
import Edge from './geometry/edge';
import Heatmap from './geometry/heatmap';
import Interval, { IntervalCfg } from './geometry/interval';
import Line from './geometry/line';
import Path, { PathCfg } from './geometry/path';
import Point from './geometry/point';
import Polygon from './geometry/polygon';
import Schema from './geometry/schema';
import Violin from './geometry/violin';
import './geometry/shape/area/line';
import './geometry/shape/area/smooth';
import './geometry/shape/area/smooth-line';
import './geometry/shape/edge/arc';
import './geometry/shape/edge/smooth';
import './geometry/shape/edge/vhv';
import './geometry/shape/interval/funnel';
import './geometry/shape/interval/hollow-rect';
import './geometry/shape/interval/line';
import './geometry/shape/interval/pyramid';
import './geometry/shape/interval/tick';
import './geometry/shape/line/step';
import './geometry/shape/point/hollow';
import './geometry/shape/point/image';
import './geometry/shape/point/solid';
import './geometry/shape/schema/box';
import './geometry/shape/schema/candle';
import './geometry/shape/polygon/square';
import './geometry/shape/violin/smooth';
import './geometry/shape/violin/hollow';
import { ELEMENT_RANGE_HIGHLIGHT_EVENTS } from './interaction/action/element/range-highlight';
import { BRUSH_FILTER_EVENTS } from './interaction/action/data/range-filter';
/**
 * 往 View 原型上添加的创建 Geometry 的方法
 *
 * Tips:
 * view module augmentation, detail: http://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */
declare module './chart/view' {
    interface View {
        /**
         * 创建 Polygon 几何标记。
         * @param [cfg] 传入 Polygon 构造函数的配置。
         * @returns polygon 返回 Polygon 实例。
         */
        polygon(cfg?: Partial<GeometryCfg>): Polygon;
        /**
         * 创建 Point 几何标记。
         * @param [cfg] 传入 Point 构造函数的配置。
         * @returns point 返回 Point 实例。
         */
        point(cfg?: Partial<GeometryCfg>): Point;
        /**
         * 创建 Interval 几何标记。
         * @param [cfg] 传入 Interval 构造函数的配置。
         * @returns interval 返回 Interval 实例。
         */
        interval(cfg?: Partial<IntervalCfg>): Interval;
        /**
         * 创建 Schema 几何标记。
         * @param [cfg] 传入 Schema 构造函数的配置。
         * @returns schema 返回 Schema 实例。
         */
        schema(cfg?: Partial<GeometryCfg>): Schema;
        /**
         * 创建 Path 几何标记。
         * @param [cfg] 传入 Path 构造函数的配置。
         * @returns path 返回 Path 实例。
         */
        path(cfg?: Partial<PathCfg>): Path;
        /**
         * 创建 Line 几何标记。
         * @param [cfg] 传入 Line 构造函数的配置。
         * @returns line 返回 Line 实例。
         */
        line(cfg?: Partial<PathCfg>): Line;
        /**
         * 创建 Area 几何标记。
         * @param [cfg] 传入 Area 构造函数的配置。
         * @returns area 返回 Area 实例。
         */
        area(cfg?: Partial<AreaCfg>): Area;
        /**
         * 创建 Edge 几何标记。
         * @param [cfg] 传入 Edge 构造函数的配置。
         * @returns schema 返回 Edge 实例。
         */
        edge(cfg?: Partial<GeometryCfg>): Edge;
        /**
         * 创建 Heatmap 几何标记。
         * @param [cfg] 传入 Heatmap 构造函数的配置。
         * @returns heatmap 返回 Heatmap 实例。
         */
        heatmap(cfg?: Partial<GeometryCfg>): Heatmap;
        /**
         * 创建 Violin 几何标记。
         * @param [cfg] 传入 Violin 构造函数的配置。
         * @returns violin 返回 Violin 实例。
         */
        violin(cfg?: Partial<GeometryCfg>): Violin;
    }
}
export { VIEW_LIFE_CIRCLE } from './constant';
/** brush 范围筛选的一些事件常量 */
export { BRUSH_FILTER_EVENTS, ELEMENT_RANGE_HIGHLIGHT_EVENTS };
export * from './core';
