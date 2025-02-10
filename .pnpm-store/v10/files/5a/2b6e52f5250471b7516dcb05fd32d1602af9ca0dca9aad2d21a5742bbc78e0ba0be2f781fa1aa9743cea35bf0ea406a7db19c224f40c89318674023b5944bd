import { Event, IGroup, IShape } from '@antv/g-base';
import { clamp, deepMix, each, get, isArray, isNil, size } from '@antv/util';
import GroupComponent from '../abstract/group-component';
import { ISlider } from '../interfaces';
import { Trend } from '../trend/trend';
import { DEFAULT_HANDLER_STYLE, Handler, HandlerCfg } from './handler';
import { GroupComponentCfg, Range } from '../types';
import {
  BACKGROUND_STYLE,
  DEFAULT_HANDLER_WIDTH,
  FOREGROUND_STYLE,
  HANDLER_STYLE,
  SLIDER_CHANGE,
  TEXT_STYLE,
} from './constant';

export interface TrendCfg {
  // 数据
  readonly data: number[];
  // 样式
  readonly smooth?: boolean;
  readonly isArea?: boolean;
  readonly backgroundStyle?: object;
  readonly lineStyle?: object;
  readonly areaStyle?: object;
}

/**
 * slider handler style 设置
 */
type HandlerStyle = HandlerCfg['style'] & {
  readonly width?: number;
  readonly height?: number;
};

export interface SliderCfg extends GroupComponentCfg {
  // position size
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;

  // style
  readonly trendCfg?: TrendCfg;
  readonly backgroundStyle?: any;
  readonly foregroundStyle?: any;
  readonly handlerStyle?: HandlerStyle;
  readonly textStyle?: any;
  // 允许滑动位置
  readonly minLimit?: number;
  readonly maxLimit?: number;
  // 初始位置
  readonly start?: number;
  readonly end?: number;
  // 滑块文本
  readonly minText?: string;
  readonly maxText?: string;
}

export class Slider extends GroupComponent<SliderCfg> implements ISlider {
  public cfg: SliderCfg;

  private minHandler: Handler;
  private maxHandler: Handler;
  private trend: Trend;
  private currentTarget: string;
  private prevX: number;
  private prevY: number;

  public setRange(min: number, max: number) {
    this.set('minLimit', min);
    this.set('maxLimit', max);
    const oldStart = this.get('start');
    const oldEnd = this.get('end');
    const newStart = clamp(oldStart, min, max);
    const newEnd = clamp(oldEnd, min, max);
    if (!this.get('isInit') && (oldStart !== newStart || oldEnd !== newEnd)) {
      this.setValue([newStart, newEnd]);
    }
  }

  public getRange(): Range {
    return {
      min: this.get('minLimit') || 0,
      max: this.get('maxLimit') || 1,
    };
  }

  public setValue(value: number | number[]) {
    const range = this.getRange();
    if (isArray(value) && value.length === 2) {
      const originValue = [this.get('start'), this.get('end')];
      this.update({
        start: clamp(value[0], range.min, range.max),
        end: clamp(value[1], range.min, range.max),
      });
      if (!this.get('updateAutoRender')) {
        this.render();
      }
      this.delegateEmit('valuechanged', {
        originValue,
        value,
      });
    }
  }

  public getValue(): number | number[] {
    return [this.get('start'), this.get('end')];
  }

  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'slider',
      x: 0,
      y: 0,
      width: 100,
      height: 16,
      backgroundStyle: {},
      foregroundStyle: {},
      handlerStyle: {},
      textStyle: {},
      defaultCfg: {
        backgroundStyle: BACKGROUND_STYLE,
        foregroundStyle: FOREGROUND_STYLE,
        handlerStyle: HANDLER_STYLE,
        textStyle: TEXT_STYLE,
      },
    };
  }

  public update(cfg: Partial<SliderCfg>) {
    const { start, end } = cfg;
    const validCfg = { ...cfg };
    if (!isNil(start)) {
      validCfg.start = clamp(start, 0, 1);
    }
    if (!isNil(end)) {
      validCfg.end = clamp(end, 0, 1);
    }
    super.update(validCfg);
    this.minHandler = this.getChildComponentById(this.getElementId('minHandler'));
    this.maxHandler = this.getChildComponentById(this.getElementId('maxHandler'));
    this.trend = this.getChildComponentById(this.getElementId('trend'));
  }

  public init() {
    this.set('start', clamp(this.get('start'), 0, 1));
    this.set('end', clamp(this.get('end'), 0, 1));
    super.init();
  }

  public render() {
    super.render();

    this.updateUI(
      this.getElementByLocalId('foreground'),
      this.getElementByLocalId('minText'),
      this.getElementByLocalId('maxText')
    );
  }

  protected renderInner(group: IGroup) {
    const {
      start,
      end,
      width,
      height,
      trendCfg = {},
      minText,
      maxText,
      backgroundStyle = {},
      foregroundStyle = {},
      textStyle = {},
    } = this.cfg;

    const handlerStyle = deepMix({}, DEFAULT_HANDLER_STYLE, this.cfg.handlerStyle);

    const min = start * width;
    const max = end * width;

    // 趋势图数据
    if (size(get(trendCfg, 'data'))) {
      this.trend = this.addComponent(group, {
        component: Trend,
        id: this.getElementId('trend'),
        x: 0,
        y: 0,
        width,
        height,
        ...trendCfg,
      });
    }

    // 1. 背景
    this.addShape(group, {
      id: this.getElementId('background'),
      type: 'rect',
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        ...backgroundStyle,
      },
    });

    // 2. 左右文字
    const minTextShape = this.addShape(group, {
      id: this.getElementId('minText'),
      type: 'text',
      attrs: {
        // x: 0,
        y: height / 2,
        textAlign: 'right',
        text: minText,
        silent: false,
        ...textStyle,
      },
    });

    const maxTextShape = this.addShape(group, {
      id: this.getElementId('maxText'),
      type: 'text',
      attrs: {
        // x: 0,
        y: height / 2,
        textAlign: 'left',
        text: maxText,
        silent: false,
        ...textStyle,
      },
    });

    // 3. 前景 选中背景框
    const foregroundShape = this.addShape(group, {
      id: this.getElementId('foreground'),
      name: 'foreground',
      type: 'rect',
      attrs: {
        // x: 0,
        y: 0,
        // width: 0,
        height,
        ...foregroundStyle,
      },
    });

    // 滑块相关的大小信息
    const handlerWidth = get(handlerStyle, 'width', DEFAULT_HANDLER_WIDTH);
    const handlerHeight = get(handlerStyle, 'height', 24);

    // 4. 左右滑块
    this.minHandler = this.addComponent(group, {
      component: Handler,
      id: this.getElementId('minHandler'),
      name: 'handler-min',
      x: 0,
      y: (height - handlerHeight) / 2,
      width: handlerWidth,
      height: handlerHeight,
      cursor: 'ew-resize',
      style: handlerStyle,
    });

    this.maxHandler = this.addComponent(group, {
      component: Handler,
      id: this.getElementId('maxHandler'),
      name: 'handler-max',
      x: 0,
      y: (height - handlerHeight) / 2,
      width: handlerWidth,
      height: handlerHeight,
      cursor: 'ew-resize',
      style: handlerStyle,
    });
  }

  protected applyOffset() {
    this.moveElementTo(this.get('group'), {
      x: this.get('x'),
      y: this.get('y'),
    });
  }

  protected initEvent() {
    this.bindEvents();
  }

  private updateUI(foregroundShape: IShape, minTextShape: IShape, maxTextShape: IShape) {
    const { start, end, width, minText, maxText, handlerStyle, height } = this.cfg as SliderCfg;
    const min = start * width;
    const max = end * width;

    if (this.trend) {
      this.trend.update({
        width,
        height,
      });
      if (!this.get('updateAutoRender')) {
        this.trend.render();
      }
    }

    // 1. foreground
    foregroundShape.attr('x', min);
    foregroundShape.attr('width', max - min);

    // 滑块相关的大小信息
    const handlerWidth = get(handlerStyle, 'width', DEFAULT_HANDLER_WIDTH);

    // 设置文本
    minTextShape.attr('text', minText);
    maxTextShape.attr('text', maxText);

    const [minAttrs, maxAttrs] = this._dodgeText([min, max], minTextShape, maxTextShape);
    // 2. 左侧滑块和文字位置
    if (this.minHandler) {
      this.minHandler.update({
        x: min - handlerWidth / 2,
      });
      if (!this.get('updateAutoRender')) {
        this.minHandler.render();
      }
    }
    each(minAttrs, (v, k) => minTextShape.attr(k, v));

    // 3. 右侧滑块和文字位置
    if (this.maxHandler) {
      this.maxHandler.update({
        x: max - handlerWidth / 2,
      });
      if (!this.get('updateAutoRender')) {
        this.maxHandler.render();
      }
    }
    each(maxAttrs, (v, k) => maxTextShape.attr(k, v));
  }

  private bindEvents() {
    const group: IGroup = this.get('group');

    group.on('handler-min:mousedown', this.onMouseDown('minHandler'));
    group.on('handler-min:touchstart', this.onMouseDown('minHandler'));

    // 2. 右滑块的滑动
    group.on('handler-max:mousedown', this.onMouseDown('maxHandler'));
    group.on('handler-max:touchstart', this.onMouseDown('maxHandler'));

    // 3. 前景选中区域
    const foreground = group.findById(this.getElementId('foreground'));
    foreground.on('mousedown', this.onMouseDown('foreground'));
    foreground.on('touchstart', this.onMouseDown('foreground'));
  }

  private onMouseDown = (target: string) => (e: Event) => {
    this.currentTarget = target;
    // 取出原生事件
    const event = e.originalEvent as MouseEvent;

    // 2. 存储当前点击位置
    event.stopPropagation();
    event.preventDefault();

    // 兼容移动端获取数据
    this.prevX = get(event, 'touches.0.pageX', event.pageX);
    this.prevY = get(event, 'touches.0.pageY', event.pageY);

    // 3. 开始滑动的时候，绑定 move 和 up 事件
    const containerDOM = this.getContainerDOM();

    containerDOM.addEventListener('mousemove', this.onMouseMove);
    containerDOM.addEventListener('mouseup', this.onMouseUp);
    containerDOM.addEventListener('mouseleave', this.onMouseUp);

    // 移动端事件
    containerDOM.addEventListener('touchmove', this.onMouseMove);
    containerDOM.addEventListener('touchend', this.onMouseUp);
    containerDOM.addEventListener('touchcancel', this.onMouseUp);
  };

  private onMouseMove = (event: MouseEvent) => {
    const { width } = this.cfg as SliderCfg;
    const originValue = [this.get('start'), this.get('end')];
    // 滑动过程中，计算偏移，更新滑块，然后 emit 数据出去
    event.stopPropagation();
    event.preventDefault();

    const x = get(event, 'touches.0.pageX', event.pageX);
    const y = get(event, 'touches.0.pageY', event.pageY);

    // 横向的 slider 只处理 x
    const offsetX = x - this.prevX;

    const offsetXRange = this.adjustOffsetRange(offsetX / width);

    // 更新 start end range 范围
    this.updateStartEnd(offsetXRange);
    // 更新 ui
    this.updateUI(
      this.getElementByLocalId('foreground'),
      this.getElementByLocalId('minText'),
      this.getElementByLocalId('maxText')
    );

    this.prevX = x;
    this.prevY = y;

    this.draw();

    // 因为存储的 start、end 可能不一定是按大小存储的，所以排序一下，对外是 end >= start
    this.emit(SLIDER_CHANGE, [this.get('start'), this.get('end')].sort());
    this.delegateEmit('valuechanged', {
      originValue,
      value: [this.get('start'), this.get('end')],
    });
  };

  private onMouseUp = () => {
    // 结束之后，取消绑定的事件
    if (this.currentTarget) {
      this.currentTarget = undefined;
    }

    const containerDOM = this.getContainerDOM();
    if (containerDOM) {
      containerDOM.removeEventListener('mousemove', this.onMouseMove);
      containerDOM.removeEventListener('mouseup', this.onMouseUp);
      // 防止滑动到 canvas 外部之后，状态丢失
      containerDOM.removeEventListener('mouseleave', this.onMouseUp);

      // 移动端事件
      containerDOM.removeEventListener('touchmove', this.onMouseMove);
      containerDOM.removeEventListener('touchend', this.onMouseUp);
      containerDOM.removeEventListener('touchcancel', this.onMouseUp);
    }
  };

  /**
   * 调整 offsetRange，因为一些范围的限制
   * @param offsetRange
   */
  private adjustOffsetRange(offsetRange: number): number {
    const { start, end } = this.cfg as SliderCfg;
    // 针对不同的滑动组件，处理的方式不同
    switch (this.currentTarget) {
      case 'minHandler': {
        const min = 0 - start;
        const max = 1 - start;

        return Math.min(max, Math.max(min, offsetRange));
      }
      case 'maxHandler': {
        const min = 0 - end;
        const max = 1 - end;

        return Math.min(max, Math.max(min, offsetRange));
      }
      case 'foreground': {
        const min = 0 - start;
        const max = 1 - end;

        return Math.min(max, Math.max(min, offsetRange));
      }
    }
  }

  private updateStartEnd(offsetRange: number) {
    let { start, end } = this.cfg as SliderCfg;
    // 操作不同的组件，反馈不一样
    switch (this.currentTarget) {
      case 'minHandler':
        start += offsetRange;
        break;
      case 'maxHandler':
        end += offsetRange;
        break;
      case 'foreground':
        start += offsetRange;
        end += offsetRange;
        break;
    }
    this.set('start', start);
    this.set('end', end);
  }

  /**
   * 调整 text 的位置，自动躲避
   * 根据位置，调整返回新的位置
   * @param range
   */
  private _dodgeText(range: [number, number], minTextShape, maxTextShape): [object, object] {
    const { handlerStyle, width } = this.cfg as SliderCfg;
    const PADDING = 2;
    const handlerWidth = get(handlerStyle, 'width', DEFAULT_HANDLER_WIDTH);

    let [min, max] = range;
    let sorted = false;

    // 如果交换了位置，则对应的 min max 也交互
    if (min > max) {
      [min, max] = [max, min];
      [minTextShape, maxTextShape] = [maxTextShape, minTextShape];
      sorted = true;
    }

    // 避让规则，优先显示在两侧，只有显示不下的时候，才显示在中间
    const minBBox = minTextShape.getBBox();
    const maxBBox = maxTextShape.getBBox();

    const minAttrs =
      minBBox.width > min - PADDING
        ? { x: min + handlerWidth / 2 + PADDING, textAlign: 'left' }
        : { x: min - handlerWidth / 2 - PADDING, textAlign: 'right' };

    const maxAttrs =
      maxBBox.width > width - max - PADDING
        ? { x: max - handlerWidth / 2 - PADDING, textAlign: 'right' }
        : { x: max + handlerWidth / 2 + PADDING, textAlign: 'left' };

    return !sorted ? [minAttrs, maxAttrs] : [maxAttrs, minAttrs];
  }

  public draw() {
    const container = this.get('container');
    const canvas = container && container.get('canvas');
    if (canvas) {
      canvas.draw();
    }
  }

  private getContainerDOM() {
    const container = this.get('container');
    const canvas = container && container.get('canvas');

    return canvas && canvas.get('container');
  }
}

export default Slider;
