/**
 * @fileoverview 图片
 * @author dxq613@gmail.com
 */

import ShapeBase from './base';
import { isString, isNil } from '../util/util';
function isCanvas(dom) {
  return dom instanceof HTMLElement && isString(dom.nodeName) && dom.nodeName.toUpperCase() === 'CANVAS';
}

class ImageShape extends ShapeBase {
  getDefaultAttrs() {
    const attrs = super.getDefaultAttrs();
    return {
      ...attrs,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  initAttrs(attrs) {
    this._setImage(attrs.img);
  }

  // image 不计算 stroke
  isStroke() {
    return false;
  }

  // 仅仅使用包围盒检测来进行拾取
  // 所以不需要复写 isInStrokeOrPath 的方法
  isOnlyHitBox() {
    return true;
  }

  _afterLoading() {
    if (this.get('toDraw') === true) {
      const canvas = this.get('canvas');
      if (canvas) {
        // 这段应该改成局部渲染
        canvas.draw();
      } else {
        // 这种方式如果发生遮挡会出现问题
        this.createPath(this.get('context'));
      }
    }
  }

  _setImage(img) {
    const attrs = this.attrs;
    if (isString(img)) {
      const image = new Image();
      image.onload = () => {
        // 图片未加载完，则已经被销毁
        if (this.destroyed) {
          return false;
        }
        // 缓存原始地址，可以做对比，防止重复加载图片
        // 如果考虑到在加载过程中可能替换 img 属性，则情况更加复杂
        // this.set('imgSrc', img);
        // 这里会循环调用 _setImage 方法，但不会再走这个分支
        this.attr('img', image);
        this.set('loading', false);
        this._afterLoading();
        const callback = this.get('callback');
        if (callback) {
          callback.call(this);
        }
      };
      // 设置跨域
      image.crossOrigin = 'Anonymous';

      image.src = img;
      // loading 过程中不绘制
      this.set('loading', true);
    } else if (img instanceof Image) {
      // 如果是一个 image 对象，则设置宽高
      if (!attrs.width) {
        attrs.width = img.width;
      }
      if (!attrs.height) {
        attrs.height = img.height;
      }
    } else if (isCanvas(img)) {
      // 如果设置了 canvas 对象
      if (!attrs.width) {
        attrs.width = Number(img.getAttribute('width'));
      }

      if (!attrs.height) {
        attrs.height, Number(img.getAttribute('height'));
      }
    }
  }

  onAttrChange(name: string, value: any, originValue: any) {
    super.onAttrChange(name, value, originValue);
    // 如果加载的已经是当前图片，则不再处理
    if (name === 'img') {
      // 可以加缓冲，&& this.get('imgSrc') !== value
      this._setImage(value);
    }
  }

  createPath(context: CanvasRenderingContext2D) {
    // 正在加载则不绘制
    if (this.get('loading')) {
      this.set('toDraw', true); // 加载完成后绘制
      this.set('context', context);
      return;
    }
    const attrs = this.attr();
    const { x, y, width, height, sx, sy, swidth, sheight } = attrs;

    const img = attrs.img;
    if (img instanceof Image || isCanvas(img)) {
      if (!isNil(sx) && !isNil(sy) && !isNil(swidth) && !isNil(sheight)) {
        context.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
      } else {
        context.drawImage(img, x, y, width, height);
      }
    }
  }
}

export default ImageShape;
