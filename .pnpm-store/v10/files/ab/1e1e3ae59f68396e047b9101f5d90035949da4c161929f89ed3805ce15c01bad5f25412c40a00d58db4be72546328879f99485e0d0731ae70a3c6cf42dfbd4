import { AnimateCfg, BBox, IGroup, IShape, Point, ShapeAttrs } from '@antv/g-base';
export type LocationType = 'point' | 'Region' | 'points' | 'circle' | 'none';

export { Point, BBox };

/** 用于返回样式 ShapeAttrs 的 Callback 函数定义 */
type ShapeAttrsCallback = (item: any, index: number, items: any[]) => ShapeAttrs;

/** 对象 */
export interface LooseObject {
  [key: string]: any;
}

export interface OffsetPoint {
  offsetX: number;
  offsetY: number;
}

export interface Region {
  /**
   * 起始点
   * @type {Point}
   */
  start: Point;
  /**
   * 结束点
   * @type {Point}
   */
  end: Point;
}

export interface Range {
  /**
   * 开始值
   * @type {number}
   */
  min: number;
  /**
   * 结束值
   * @type {number}
   */
  max: number;
}

/** 文本背景框配置 */
export interface EnhancedTextBackgroundCfg {
  /** 文字内边距，同 css 盒模型 */
  padding?: number | number[];
  /** 文字包围盒样式 */
  style?: ShapeAttrs;
}

/**
 * 增强型文本配置：
 * 1. 可自动缩略
 * 2. 可绘制背景框
 */
export interface EnhancedTextCfg {
  /** 文本标注内容 */
  content: string | number;
  /** 旋转，弧度制 */
  rotate?: number;
  /** 文本标注样式 */
  style?: ShapeAttrs;
  /** 文字包围盒样式设置 */
  background?: EnhancedTextBackgroundCfg;
  /** 文本的最大长度 */
  maxLength?: number;
  /** 超出 maxLength 是否自动省略 */
  autoEllipsis?: boolean;
  /** 文本在二维坐标系的显示位置，是沿着 x 轴显示 还是沿着 y 轴显示 */
  isVertical?: boolean;
  /** 文本截断的位置 */
  ellipsisPosition?: 'head' | 'middle' | 'tail';
}

/**
 * @interface
 * 列表选项接口
 */
export interface ListItem {
  /**
   * 唯一值，用于动画或者查找
   * @type {string}
   */
  id?: string;
  /**
   * 名称
   * @type {string}
   */
  name: string;
  /**
   * 值
   * @type {any}
   */
  value: any;
  /**
   * 图形标记
   * @type {object|string}
   */
  marker?: object | string;
  [key: string]: any;
}

/**
 * @interface
 * 栅格项的定义
 */
export interface GridItem {
  /**
   * 唯一值，用于动画或者查找
   * @type {string}
   */
  id?: string;
  /**
   * 栅格线的点集合
   * @type {Point[]}
   */
  points: Point[];
  [key: string]: any;
}

/**
 * @interface
 * 坐标轴线定义
 */
export interface AxisLineCfg {
  /**
   * 坐标轴线的配置项
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

/**
 * @interface
 * 坐标轴刻度定义
 */
export interface AxisTickLineCfg {
  /**
   * 坐标轴刻度线的配置项
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs | ShapeAttrsCallback;
  /**
   * 是否同 tick 对齐
   * @type {boolean}
   */
  alignTick?: boolean; // 是否同 tick 对齐
  /**
   * 长度
   * @type {number}
   */
  length?: number;
}

type avoidCallback = (isVertical: boolean, labelGroup: IGroup, limitLength?: number) => boolean;

/** 坐标轴自动隐藏的配置 */
export interface AxisLabelAutoHideCfg {
  /** 最小间距配置 */
  minGap?: number;
}

/**
 * @interface
 * 坐标轴文本定义
 */
export interface AxisLabelCfg {
  /**
   * 坐标轴文本的样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs | ShapeAttrsCallback;
  /**
   * label 的偏移量
   * @type {number}
   */
  offset?: number;
  /**
   * label 在X方向的额外偏移量
   * @type {number}
   */
  offsetX?: number;
  /**
   * label 在Y方向的额外偏移量
   * @type {number}
   */
  offsetY?: number;
  /**
   * 文本旋转角度
   * @type {number}
   */
  rotate?: number;
  /**
   * 格式化函数
   * @type {formatterCallback}
   */
  formatter?: formatterCallback;
  /**
   * 是否自动旋转，默认 true
   * @type {boolean|avoidCallback|string}
   */
  autoRotate?: boolean | avoidCallback | string;
  /**
   * 是否自动隐藏，默认 false
   * @type {boolean|avoidCallback|string|{type:string,cfg?:AxisLabelAutoHideCfg}}
   */
  autoHide?: boolean | avoidCallback | string | { type: string; cfg?: AxisLabelAutoHideCfg };
  /**
   * 是否自动省略，默认 false
   * @type {boolean|avoidCallback|string}
   */
  autoEllipsis?: boolean | avoidCallback | string;
}

/**
 * @interface
 * 坐标轴子刻度定义
 */
export interface AxisSubTickLineCfg {
  /**
   * 坐标轴刻度线的配置项
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs | ShapeAttrsCallback;
  /**
   * 子刻度个数
   * @type {number}
   */
  count?: number;
  /**
   * 子刻度线长度
   * @type {number}
   */
  length?: number;
}

/**
 * @interface
 * 坐标轴标题定义
 */
export interface AxisTitleCfg {
  /**
   * 标题距离坐标轴的距离
   * @type {number}
   */
  offset?: number;
  /**
   * 标题距离坐标轴文本的距离
   */
  spacing?: number;
  /**
   * 标题文本配置项
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
  /**
   * 是否自动旋转
   * @type {boolean}
   */
  autoRotate?: boolean;
  /**
   * 设置文本
   * @type {string}
   */
  text?: string;
  /**
   * 文本对齐方式
   * @type {string} start, center, end
   */
  position?: string;
  /**
   * 坐标轴标题详细信息
   */
  description?: string;
  /**
   * 坐标轴标题详情icon
   */
  iconStyle?: AxisIconStyle;
}

export interface AxisIconStyle {
  stroke?: string;
  strokeOpacity?: number;
  fill?: string;
  fillOpacity?: number;
  opacity?: number;
}

export interface BaseCfg {
  [key: string]: any;
}

export interface ComponentCfg extends BaseCfg {
  /**
   * 唯一标定组件的 id
   * @type {string}
   */
  id?: string;
  /**
   * 定位的方式
   * @type {string}
   */
  LocationType?: string;
  /**
   * 偏移位置 x
   * @type {number}
   */
  offsetX?: number;
  /**
   * 偏移位置 y
   * @type {number}
   */
  offsetY?: number;
  /**
   * 组件名称， axis, legend, tooltip
   * @type {string}
   */
  name?: string;
  /**
   * 组件的类型，同 name 配合使用可以确定具体组件的类型，例如：
   *  name: 'axis',
   *  type: 'line'
   */
  type?: string;
  /**
   * 是否会捕捉事件
   */
  capture?: boolean;
  /**
   * 是否允许动画，不同组件允许动画的内容不同
   * @type {boolean}
   */
  animate?: boolean;
  /**
   * 更新时自动渲染, 所有 html 的组件 update 时自动调用渲染，group 的组件默认 false
   */
  updateAutoRender?: boolean;
  /**
   * 动画的配置项
   * @type {AnimateCfg}
   */
  animateOption?: AnimateOption;
  /**
   * 事件对象，可以在配置项中传入事件
   * @example
   * events: {
   *   itemclick: ev => {
   *
   *   }
   * }
   * // 等效于
   * component.on('itemclick', ev => {
   *
   * });
   * @type {object}
   */
  events?: object;
  /**
   * @protected
   * 配置项生效时的默认值，一些配置项是对象时，防止将一些内置的配置项清空，减少判空判断
   * @example
   * new Axis({
   *   tickLine: {
   *     length: 10 // 此时没有设置 style，内部调用 tickLine.style 时会出问题
   *   }
   * })
   * @type {object}
   */
  defaultCfg?: object;
}

export interface AnimateOption {
  /** 初始化渲染时的入场动画，false/null 表示关闭入场动画 */
  appear?: AnimateCfg | false | null;
  /** 发生更新时，新增元素的入场动画，false/null 表示关闭入场动画 */
  enter?: AnimateCfg | false | null;
  /** 更新动画配置，false/null 表示关闭更新动画 */
  update?: AnimateCfg | false | null;
  /** 销毁动画配置，false/null 表示关闭销毁动画 */
  leave?: AnimateCfg | false | null;
}

export interface GroupComponentCfg extends ComponentCfg {
  /**
   * 组件的容器
   * @type {IGroup}
   */
  container: IGroup;
  /**
   * 当前组件对应的 group，一个 container 中可能会有多个组件，但是一个组件都有一个自己的 Group
   * @type {IGroup}
   */
  group?: IGroup;
  /**
   * 组件是否可以被拾取
   * @type {boolean}
   */
  capture?: boolean;
}

export interface HtmlComponentCfg extends ComponentCfg {
  /**
   * 组件的 DOM 容器
   * @type {HTMLElement|string}
   */
  container?: HTMLElement | string;
  /**
   * 组件的父容器
   */
  parent?: HTMLElement | string;
  /**
   * 内部 DOM 的样式
   */
  domStyles?: LooseObject;
}

export interface OptimizeCfg {
  /** 是否启动大数据量优化 */
  enable: boolean;
  /** 大数据数据量配置，达到 threshold 后启动优化，默认 400 */
  threshold?: number;
}

export interface AxisBaseCfg extends GroupComponentCfg {
  /**
   * 坐标轴刻度的集合
   * @type {ListItem[]}
   */
  ticks: ListItem[];
  /**
   * 坐标轴线的配置项
   * @type {AxisLineCfg}
   */
  line?: AxisLineCfg;
  /**
   * 坐标轴刻度线线的配置项
   * @type {AxisTickLineCfg}
   */
  tickLine?: AxisTickLineCfg;
  /**
   * 坐标轴子刻度线的配置项
   * @type {AxisSubTickLineCfg}
   */
  subTickLine?: AxisSubTickLineCfg;
  /**
   * 标题的配置项
   * @type {AxisTitleCfg}
   */
  title?: AxisTitleCfg;
  /**
   * 文本标签的配置项
   */
  label?: AxisLabelCfg;
  /**
   * 垂直于坐标轴方向的因子，决定文本、title、tickLine 在坐标轴的哪一侧，默认是 1，在坐标轴逆时针方向
   */
  verticalFactor?: number;
  /**
   * 垂直于坐标轴方向的限制长度，防止文本超出
   * @type {number}
   */
  verticalLimitLength?: number;
  /**
   * 处理遮挡时的顺序，默认 ['autoRotate', 'autoHide']
   */
  overlapOrder?: string[];
  /**
   * 针对大数据量进行优化配置
   */
  optimize?: OptimizeCfg;
}

export interface LineAxisCfg extends AxisBaseCfg {
  /**
   * 坐标轴的起始点
   * @type {Point}
   */
  start: Point;
  /**
   * 坐标轴的结束点
   * @type {Point}
   */
  end: Point;
}

export interface CircleAxisCfg extends AxisBaseCfg {
  /**
   * 中心点, x, y
   * @type {Point}
   */
  center: Point;
  /**
   * 半径
   * @type {number}
   */
  radius: number;
  /**
   * 开始弧度
   * @type {number}
   */
  startAngle?: number;
  /**
   * 结束弧度
   * @type {number}
   */
  endAngle?: number;
}

export interface GridLineCfg {
  /**
   * 栅格线的类型
   * @type {string}
   */
  type?: string;
  /**
   * 栅格线的配置项
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs | ShapeAttrsCallback;
}

export interface GridBaseCfg extends GroupComponentCfg {
  /**
   * 线的样式
   * @type {object}
   */
  line?: GridLineCfg;
  /**
   * 两个栅格线间的填充色，必须是一个数组
   * @type {string|string[]}
   */
  alternateColor?: string | string[];
  /**
   * 绘制 grid 需要的点的集合
   * @type {GridItem[]}
   */
  items: GridItem[];
  /**
   * 栅格线是否封闭
   * @type {boolean}
   */
  closed?: boolean;
}

export interface CircleGridCfg extends GridBaseCfg {
  /**
   * 中心点
   * @type {Point}
   */
  center: Point;
}

export interface LegendBaseCfg extends GroupComponentCfg {
  /**
   * 布局方式： horizontal，vertical
   * @type {String}
   */
  layout?: string;
  /**
   * 位置 x
   * @type {number}
   */
  x?: number;
  /**
   * 位置 y
   * @type {number}
   */
  y?: number;
  /**
   * 标题
   * @type {LegendTitleCfg}
   */
  title?: LegendTitleCfg;
  /**
   * 背景框配置项
   * @type {LegendBackgroundCfg}
   */
  background?: LegendBackgroundCfg;
}
export interface CategoryLegendCfg extends LegendBaseCfg {
  /**
   * 图例项水平方向的间距
   * @type {number}
   */
  itemSpacing?: number;
  /**
   * 图例项的最大宽度，默认为 null，由上层传入
   */
  maxItemWidth?: number;
  /**
   * 图例项的宽度, 默认为 null，自动计算
   * @type {number}
   */
  itemWidth?: number;
  /**
   * 图例的高度，默认为 null
   * @type {[type]}
   */
  itemHeight?: number;
  /**
   * 图例项 name 文本的配置
   * @type {LegendItemNameCfg}
   */
  itemName?: LegendItemNameCfg;
  /**
   * 图例项 value 附加值的配置项
   * @type {LegendItemValueCfg}
   */
  itemValue?: LegendItemValueCfg;
  /**
   *
   * @type {LegendRadio}
   */
  radio?: LegendRadio;
  /**
   * 最大宽度
   * @type {number}
   */
  maxWidth?: number;
  /**
   * 最大高度
   * @type {number}
   */
  maxHeight?: number;
  /**
   * 图例项的 marker 图标的配置
   * @type {LegendMarkerCfg}
   */
  marker?: LegendMarkerCfg;
  /**
   * 图例项集合
   * @type {ListItem[]}
   */
  items: ListItem[];
  /**
   * 是否翻页
   */
  flipPage?: boolean;
  /**
   * 翻页行数（只适用于横向）
   */
  maxRow?: number;
  /**
   * 分页器配置
   * @type {LegendPageNavigatorCfg}
   */
  flipNavigation?: LegendPageNavigatorCfg;
}

export interface ContinueLegendCfg extends LegendBaseCfg {
  /**
   * 选择范围的最小值
   * @type {number}
   */
  min: number;
  /**
   * 选择范围的最大值
   * @type {number}
   */
  max: number;
  /**
   * 选择的值
   * @type {number[]}
   */
  value: number[];
  /**
   * 图例的颜色，可以写多个颜色
   * @type {number[]}
   */
  colors: number[];
  /**
   * 选择范围的色块配置项
   * @type {ContinueLegendTrackCfg}
   */
  track: ContinueLegendTrackCfg;
  /**
   * 图例滑轨（背景）的配置项
   * @type {ContinueLegendRailCfg}
   */
  rail: ContinueLegendRailCfg;
  /**
   * 文本的配置项
   * @type {ContinueLegendLabelCfg}
   */
  label: ContinueLegendLabelCfg;
  /**
   * 滑块的配置项
   * @type {ContinueLegendHandlerCfg}
   */
  handler: ContinueLegendHandlerCfg;
  /**
   * 是否可以滑动
   * @type {boolean}
   */
  slidable: boolean;
}

export interface ContinueLegendTrackCfg {
  /**
   * 选定范围的样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface ContinueLegendHandlerCfg {
  /**
   * 滑块大小
   * @type {number}
   */
  size?: number;
  /**
   * 滑块样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface ContinueLegendRailCfg {
  /**
   * rail 的类型，color, size
   * @type {string}
   */
  type?: string;
  /**
   * 滑轨的宽度
   * @type {number}
   */
  size?: number;
  /**
   * 滑轨的默认长度，，当限制了 maxWidth,maxHeight 时，不会使用这个属性会自动计算长度
   * @type {number}
   */
  defaultLength?: number;
  /**
   * 滑轨的样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface ContinueLegendLabelCfg {
  /**
   * 文本同滑轨的对齐方式，有五种类型
   *  - rail ： 同滑轨对齐，在滑轨的两端
   *  - top, bottom: 图例水平布局时有效
   *  - left, right: 图例垂直布局时有效
   * @type {string}
   */
  align?: string;
  /**
   * 文本格式化
   * @type {string}
   */
  formatter?: (text: string | number | null) => string;
  /**
   * 文本同滑轨的距离
   * @type {number}
   */
  spacing?: number;
  /**
   * 文本样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface LegendTitleCfg {
  /**
   * 标题同图例项的间距
   * @type {number}
   */
  spacing?: number;
  /**
   * 文本配置项
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface LegendBackgroundCfg {
  /**
   * @type {number|number[]}
   * 背景的留白
   */
  padding?: number | number[];
  /**
   * @type {ShapeAttrs}
   * 背景配置项
   */
  style?: ShapeAttrs;
}

export interface LegendItemNameCfg {
  /**
   * 图例项 name 同后面 value 的间距
   * @type {number}
   */
  spacing?: number;
  /**
   * 格式化文本函数
   * @type {formatterCallback}
   */
  formatter?: formatterCallback;
  /**
   * 文本配置项
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs | ShapeAttrsCallback;
}

type formatterCallback = (text: string, item: ListItem, index: number) => any;

export interface LegendItemValueCfg {
  /**
   * 是否右对齐，默认为 false，仅当设置图例项宽度时生效
   * @type {boolean}
   */
  alignRight?: boolean;
  /**
   * 格式化文本函数
   * @type {formatterCallback}
   */
  formatter?: formatterCallback;
  /**
   * 图例项附加值的配置
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs | ShapeAttrsCallback;
  /**
   * 图例值和后面的间隔，可以控制和 RadioIcon 的间距
   * @type {number}
   */
  spacing?: number;
}

/**
 * radio 的配置项
 */
export interface LegendRadio {
  /**
   * radio 样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
  /**
   * radio 的提示信息
   */
  tip?: string;
}

export interface LegendMarkerCfg {
  /**
   * 图例项 marker 同后面 name 的间距
   * @type {number}
   */
  spacing?: number;
  /**
   * 图例 marker 形状
   */
  symbol?: string | ((x: number, y: number, r: number) => any);
  /**
   * 图例项 marker 的配置项
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

/**
 * 图例导航器，代指分页器
 */
export interface LegendPageNavigatorCfg {
  marker?: {
    style?: {
      /** 分页导航器 icon 填充色, 默认 #000 */
      fill?: string;
      /** 分页导航器 icon 填充色 透明度, 默认 1 */
      opacity?: number;
      /** 分页导航器 icon 非激活时的填充色 */
      inactiveFill?: string;
      /** 分页导航器 icon 非激活时的填充色 透明度, 默认 0.45 */
      inactiveOpacity?: number;
      /** 分页器的大小 */
      size?: number;
    };
  };
  text?: {
    style?: {
      /** 分页导航器 文本 填充色，默认 #ccc */
      fill?: string;
      /** 字体大小, 默认 12px */
      fontSize?: number;
    };
  };
}

export type TooltipPosition = 'top' | 'left' | 'right' | 'bottom' | 'auto';
export interface TooltipCfg extends HtmlComponentCfg {
  /**
   * DOM 节点的 id
   * @type {string}
   */
  containerId?: string;
  /**
   * 位置 x
   * @type {number}
   */
  x?: number;
  /**
   * 位置 y
   * @type {number}
   */
  y?: number;
  /**
   * 列表项集合
   * @type {ListItem[]}
   */
  items: ListItem[];
  /**
   * 容器的模板
   * @type {string}
   */
  containerTpl?: string;
  /**
   * 列表项的模板
   * @type {[type]}
   */
  itemTpl?: string;
  /**
   * 根据 x 定位的 crosshair 的模板
   * @type {string}
   */
  xCrosshairTpl?: string;
  /**
   * 根据 y 定位的 crosshair 的模板
   * @type {[type]}
   */
  yCrosshairTpl?: string;
  /**
   * tooltip 限制的区域
   * @type {Region}
   */
  region?: Region;
  /**
   * crosshairs 限制的区域
   * @type {Region}
   */
  crosshairsRegion?: Region;
  /**
   * crosshairs 的类型， x,y,xy
   * @type {string}
   */
  crosshairs?: string;
  /**
   * 是否跟随鼠标移动，会影响 x，y的定位
   * @type {boolean}
   */
  follow?: boolean;
  /**
   * 偏移量，同 position 相关
   * @type {number}
   */
  offset?: number;
  /**
   * 位置，top, bottom, left, right
   * @type {string}
   */
  position?: TooltipPosition;
  /**
   * 传入各个 dom 的样式
   * @type {object}
   */
  domStyles?: object;
  /**
   * 默认的各个 dom 的样式
   * @type {object}
   */
  defaultStyles?: object;
}

export interface LocationCfg {
  [key: string]: any;
}

export interface PointLocationCfg extends LocationCfg {
  /**
   * 位置 x
   * @type {number}
   */
  x?: number;
  /**
   * 位置 y
   * @type {number}
   */
  y?: number;
}

export interface RegionLocationCfg extends LocationCfg {
  /**
   * 起始点
   * @type {Point}
   */
  start?: Point;
  /**
   * 结束点
   * @type {Point}
   */
  end?: Point;
}

export interface PointsLocationCfg extends LocationCfg {
  /**
   * 定位点的集合
   * @type {Point[]}
   */
  points?: Point[];
}

export interface CircleLocationCfg extends LocationCfg {
  /**
   * 圆心
   * @type {Point}
   */
  center?: Point;
  /**
   * 半径
   * @type {number}
   */
  radius?: number;
  /**
   * 起始角度
   * @type {number}
   */
  startAngle?: number;
  /**
   * 结束角度
   * @type {number}
   */
  endAngle?: number;
}

/**
 * 自定义 Shape annotation 组件配置
 */
export interface ShapeAnnotationCfg extends GroupComponentCfg {
  /** 自定义 render 函数，注意绘制的 shape/group 需要设置 id */
  render: (container: IGroup) => void;
}

/**
 * Html Annotation 组件配置
 */
export interface HtmlAnnotationCfg extends HtmlComponentCfg {
  /** X 方向对齐，默认 left */
  alignX?: 'left' | 'middle' | 'right';
  /** Y 方向对齐，默认 top */
  alignY?: 'top' | 'middle' | 'bottom';
  /** 自定义 html */
  html: string | number | HTMLElement | ((container: HTMLElement) => void | string | number | HTMLElement);
  /** zIndex 设置 */
  zIndex?: number;
}

export interface TextAnnotationCfg extends GroupComponentCfg, EnhancedTextCfg {
  /**
   * 文本标注位置 x
   * @type {number}
   */
  x: number;
  /**
   * 文本标注位置 y
   * @type {number}
   */
  y: number;
}

export interface LineAnnotationCfg extends GroupComponentCfg {
  /**
   * 起始点
   * @type {Point}
   */
  start?: Point;
  /**
   * 结束点
   * @type {Point}
   */
  end?: Point;
  /**
   * 线上的文本配置
   * @type {LineAnnotationTextCfg}
   */
  text?: LineAnnotationTextCfg;
  /**
   * 线的样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface LineAnnotationTextCfg extends EnhancedTextCfg {
  /**
   * 位置，可以选择： start, end, center 和 '50%' 这类的百分比写法，默认 'center'
   * @type {string}
   */
  position?: string;
  /**
   * 自动旋转，沿着线的方向，默认 true
   * @type {boolean}
   */
  autoRotate?: boolean;
  /**
   * 文本的偏移 x
   * @type {number}
   */
  offsetX?: number;
  /**
   * 文本的偏移 y
   * @type {number}
   */
  offsetY?: number;
}

export interface RegionAnnotationCfg extends GroupComponentCfg {
  /**
   * 起始点
   * @type {Point}
   */
  start?: Point;
  /**
   * 结束点
   * @type {Point}
   */
  end?: Point;
  /**
   * 区域的样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface ImageAnnotationCfg extends GroupComponentCfg {
  /**
   * 起始点
   * @type {Point}
   */
  start?: Point;
  /**
   * 结束点
   * @type {Point}
   */
  end?: Point;
  /**
   * 图片地址
   * @type {string}
   */
  src?: string;
  /**
   * 区域的样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface ArcAnnotationCfg extends GroupComponentCfg {
  /**
   * 圆心
   * @type {Point}
   */
  center?: Point;
  /**
   * 半径
   * @type {number}
   */
  radius?: number;
  /**
   * 其实角度
   * @type {number}
   */
  startAngle?: number;
  /**
   * 结束角度
   * @type {number}
   */
  endAngle?: number;
  /**
   * 区域的样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface DataMarkerTextCfg extends EnhancedTextCfg {
  display?: boolean;
}

export interface DataMarkerAnnotationCfg extends GroupComponentCfg {
  /**
   * 标注位置 x
   * @type {number}
   */
  x: number;
  /**
   * 标注位置 y
   * @type {number}
   */
  y: number;
  point?: {
    display?: boolean;
    style?: ShapeAttrs;
  };
  line?: {
    display?: boolean;
    length?: number;
    style?: ShapeAttrs;
  };
  text: DataMarkerTextCfg;
  /**
   * 方向
   */
  direction?: 'upward' | 'downward' | 'leftward' | 'rightward';
  /**
   * 是否自动调整
   */
  autoAdjust?: boolean;
  /**
   * Coord 的 BBox，用于 autoAdjust
   */
  coordBBox?: BBox;
}

export interface DataRegionAnnotationCfg extends GroupComponentCfg {
  /**
   * 位置点信息
   * @type {Point}
   */
  points: Point[];
  region?: {
    style?: ShapeAttrs;
  };
  text: EnhancedTextCfg;
}

export interface RegionFilterAnnotationCfg extends GroupComponentCfg {
  /**
   * 起始点
   * @type {Point}
   */
  start: Point;
  /**
   * 结束点
   * @type {Point}
   */
  end: Point;
  /**
   * 染色色值
   */
  color: string;
  /**
   * 图形上的 Shapes
   */
  shapes: IShape[];
}

export interface CrosshairBaseCfg extends GroupComponentCfg {
  /**
   * 线的样式
   * @type {CrosshairLineCfg}
   */
  line?: CrosshairLineCfg;
  /**
   * 附加文本的样式
   * @type {CrosshairTextCfg}
   */
  text?: CrosshairTextCfg;
  /**
   * 文本背景的配置项
   * @type {CrosshairTextBackgroundCfg}
   */
  textBackground?: CrosshairTextBackgroundCfg;
}

export interface LineCrosshairCfg extends CrosshairBaseCfg {
  /**
   * 起始点
   * @type {Point}
   */
  start: Point;
  /**
   * 结束点
   * @type {Point}
   */
  end: Point;
}

export interface CircleCrosshairCfg extends CrosshairBaseCfg {
  /**
   * 圆心
   * @type {Point}
   */
  center: Point;
  /**
   * 半径
   * @type {number}
   */
  radius: number;
  /**
   * 开始角度
   * @type {number}
   */
  startAngle: number;
  /**
   * 结束角度
   * @type {number}
   */
  endAngle: number;
}

export interface CrosshairTextBaseCfg {
  /**
   * 文本位置，只支持 start， end
   * @type {string}
   */
  position?: string;
  /**
   * 文本内容
   */
  content?: string;
  /**
   * 距离线的距离
   * @type {number}
   */
  offset?: number;
}

export interface CrosshairTextCfg extends CrosshairTextBaseCfg {
  /**
   * 是否自动旋转
   * @type {boolean}
   */
  autoRotate?: boolean;
  /**
   * 文本的配置项
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface HtmlCrossHairCfg extends HtmlComponentCfg {
  /**
   * 起始位置
   */
  start: Point;
  /**
   * 结束位置
   */
  end: Point;
  /**
   * crosshair 的模板
   */
  crossHairTpl: string;
  /**
   * 文本的模板
   */
  textTpl: string;
  /**
   * 文本
   */
  text: CrosshairTextBaseCfg;
}

export interface CrosshairLineCfg {
  /**
   * 线的配置项
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface CrosshairTextBackgroundCfg {
  /**
   * 文本背景周围的留白
   * @type {number|number[]}
   */
  padding?: number | number[];
  /**
   * 文本背景的样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export { SliderCfg, TrendCfg } from './slider';
export { ScrollbarCfg, ScrollbarTheme } from './scrollbar';
