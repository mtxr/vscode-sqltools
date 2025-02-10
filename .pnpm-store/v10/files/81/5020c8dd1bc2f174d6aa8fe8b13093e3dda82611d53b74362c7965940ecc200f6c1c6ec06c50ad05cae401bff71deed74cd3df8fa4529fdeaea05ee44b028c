import { AbstractShape } from '@antv/g-base';
import { ShapeAttrs, ChangeType, BBox } from '@antv/g-base';
import { IShape } from '../interfaces';
import Defs from '../defs';
import { setShadow, setTransform, setClip } from '../util/svg';
import { createDom } from '../util/dom';
import { refreshElement } from '../util/draw';
import { SVG_ATTR_MAP } from '../constant';
import * as Shape from './index';
import Group from '../group';
import { getBBoxMethod } from '@antv/g-base';

class ShapeBase extends AbstractShape implements IShape {
  type: string = 'svg';
  canFill: boolean = false;
  canStroke: boolean = false;

  getDefaultAttrs() {
    const attrs = super.getDefaultAttrs();
    // 设置默认值
    return {
      ...attrs,
      lineWidth: 1,
      lineAppendWidth: 0,
      strokeOpacity: 1,
      fillOpacity: 1,
    };
  }

  // 覆盖基类的 afterAttrsChange 方法
  afterAttrsChange(targetAttrs: ShapeAttrs) {
    super.afterAttrsChange(targetAttrs);
    const canvas = this.get('canvas');
    // 只有挂载到画布下，才对元素进行实际渲染
    if (canvas && canvas.get('autoDraw')) {
      const context = canvas.get('context');
      this.draw(context, targetAttrs);
    }
  }

  getShapeBase() {
    return Shape;
  }

  getGroupBase() {
    return Group;
  }

  /**
   * 一些方法调用会引起画布变化
   * @param {ChangeType} changeType 改变的类型
   */
  onCanvasChange(changeType: ChangeType) {
    refreshElement(this, changeType);
  }

  calculateBBox(): BBox {
    const el = this.get('el');
    let bbox = null;
    // 包围盒计算依赖于绘制，如果还没有生成对应的 Dom 元素，则包围盒的长宽均为 0
    if (el) {
      bbox = el.getBBox();
    } else {
      const bboxMethod = getBBoxMethod(this.get('type'));
      if (bboxMethod) {
        bbox = bboxMethod(this);
      }
    }
    if (bbox) {
      const { x, y, width, height } = bbox;
      const lineWidth = this.getHitLineWidth();
      const halfWidth = lineWidth / 2;
      const minX = x - halfWidth;
      const minY = y - halfWidth;
      const maxX = x + width + halfWidth;
      const maxY = y + height + halfWidth;
      return {
        x: minX,
        y: minY,
        minX,
        minY,
        maxX,
        maxY,
        width: width + lineWidth,
        height: height + lineWidth,
      };
    }
    return {
      x: 0,
      y: 0,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      width: 0,
      height: 0,
    };
  }

  isFill() {
    const { fill, fillStyle } = this.attr();
    return (fill || fillStyle || this.isClipShape()) && this.canFill;
  }

  isStroke() {
    const { stroke, strokeStyle } = this.attr();
    return (stroke || strokeStyle) && this.canStroke;
  }

  draw(context, targetAttrs) {
    const el = this.get('el');
    if (this.get('destroyed')) {
      if (el) {
        el.parentNode.removeChild(el);
      }
    } else {
      if (!el) {
        createDom(this);
      }
      setClip(this, context);
      this.createPath(context, targetAttrs);
      this.shadow(context, targetAttrs);
      this.strokeAndFill(context, targetAttrs);
      this.transform(targetAttrs);
    }
  }

  /**
   * @protected
   * 绘制图形的路径
   * @param {Defs} context 上下文
   * @param {ShapeAttrs} targetAttrs 渲染的目标属性
   */
  createPath(context: Defs, targetAttrs?: ShapeAttrs) {}

  // stroke and fill
  strokeAndFill(context, targetAttrs?) {
    const attrs = targetAttrs || this.attr();
    const { fill, fillStyle, stroke, strokeStyle, fillOpacity, strokeOpacity, lineWidth } = attrs;
    const el = this.get('el');

    if (this.canFill) {
      // 初次渲染和更新渲染的逻辑有所不同: 初次渲染值为空时，需要设置为 none，否则就会是黑色，而更新渲染则不需要
      if (!targetAttrs) {
        this._setColor(context, 'fill', fill || fillStyle);
      } else if ('fill' in attrs) {
        this._setColor(context, 'fill', fill);
      } else if ('fillStyle' in attrs) {
        // compatible with fillStyle
        this._setColor(context, 'fill', fillStyle);
      }
      if (fillOpacity) {
        el.setAttribute(SVG_ATTR_MAP['fillOpacity'], fillOpacity);
      }
    }

    if (this.canStroke && lineWidth > 0) {
      if (!targetAttrs) {
        this._setColor(context, 'stroke', stroke || strokeStyle);
      } else if ('stroke' in attrs) {
        this._setColor(context, 'stroke', stroke);
      } else if ('strokeStyle' in attrs) {
        // compatible with strokeStyle
        this._setColor(context, 'stroke', strokeStyle);
      }
      if (strokeOpacity) {
        el.setAttribute(SVG_ATTR_MAP['strokeOpacity'], strokeOpacity);
      }
      if (lineWidth) {
        el.setAttribute(SVG_ATTR_MAP['lineWidth'], lineWidth);
      }
    }
  }

  _setColor(context, attr, value) {
    const el = this.get('el');
    if (!value) {
      // need to set `none` to avoid default value
      el.setAttribute(SVG_ATTR_MAP[attr], 'none');
      return;
    }
    value = value.trim();
    if (/^[r,R,L,l]{1}[\s]*\(/.test(value)) {
      let id = context.find('gradient', value);
      if (!id) {
        id = context.addGradient(value);
      }
      el.setAttribute(SVG_ATTR_MAP[attr], `url(#${id})`);
    } else if (/^[p,P]{1}[\s]*\(/.test(value)) {
      let id = context.find('pattern', value);
      if (!id) {
        id = context.addPattern(value);
      }
      el.setAttribute(SVG_ATTR_MAP[attr], `url(#${id})`);
    } else {
      el.setAttribute(SVG_ATTR_MAP[attr], value);
    }
  }

  shadow(context, targetAttrs?) {
    const attrs = this.attr();
    const { shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor } = targetAttrs || attrs;
    if (shadowOffsetX || shadowOffsetY || shadowBlur || shadowColor) {
      setShadow(this, context);
    }
  }

  transform(targetAttrs?) {
    const attrs = this.attr();
    const { matrix } = targetAttrs || attrs;
    if (matrix) {
      setTransform(this);
    }
  }

  isInShape(refX: number, refY: number): boolean {
    return this.isPointInPath(refX, refY);
  }

  isPointInPath(refX: number, refY: number): boolean {
    const el = this.get('el');
    const canvas = this.get('canvas');
    const bbox = canvas.get('el').getBoundingClientRect();
    const clientX = refX + bbox.left;
    const clientY = refY + bbox.top;
    const element = document.elementFromPoint(clientX, clientY);
    if (element && element.isEqualNode(el)) {
      return true;
    }
    return false;
  }

  /**
   * 获取线拾取的宽度
   * @returns {number} 线的拾取宽度
   */
  getHitLineWidth() {
    const { lineWidth, lineAppendWidth } = this.attrs;
    if (this.isStroke()) {
      return lineWidth + lineAppendWidth;
    }
    return 0;
  }
}

export default ShapeBase;
