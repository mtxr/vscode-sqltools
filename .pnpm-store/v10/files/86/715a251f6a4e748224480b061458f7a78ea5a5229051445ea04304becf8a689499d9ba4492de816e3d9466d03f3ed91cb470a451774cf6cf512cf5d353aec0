import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { ImageAnnotationCfg, RegionLocationCfg } from '../types';
import { regionToBBox } from '../util/util';

class ImageAnnotation extends GroupComponent<ImageAnnotationCfg> implements ILocation<RegionLocationCfg> {
  /**
   * @protected
   * 默认的配置项
   * @returns {object} 默认的配置项
   */
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'annotation',
      type: 'image',
      locationType: 'region',
      start: null,
      end: null,
      src: null,
      style: {},
    };
  }

  public renderInner(group: IGroup) {
    this.renderImage(group);
  }

  private getImageAttrs() {
    const start = this.get('start');
    const end = this.get('end');
    const style = this.get('style');
    const bbox = regionToBBox({ start, end });
    const src = this.get('src');
    return {
      x: bbox.x,
      y: bbox.y,
      img: src,
      width: bbox.width,
      height: bbox.height,
      ...style,
    };
  }

  // 绘制图片
  private renderImage(group: IGroup) {
    this.addShape(group, {
      type: 'image',
      id: this.getElementId('image'),
      name: 'annotation-image',
      attrs: this.getImageAttrs(),
    });
  }
}

export default ImageAnnotation;
