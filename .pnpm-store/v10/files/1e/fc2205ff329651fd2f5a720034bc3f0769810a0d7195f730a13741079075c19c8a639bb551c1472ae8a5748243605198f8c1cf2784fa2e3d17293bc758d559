import { IGroup, IShape, Point, ShapeAttrs } from '@antv/g-base';
import { clone, each } from '@antv/util';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { RegionFilterAnnotationCfg, RegionLocationCfg } from '../types';
import { regionToBBox } from '../util/util';

class RegionFilterAnnotation extends GroupComponent<RegionFilterAnnotationCfg> implements ILocation<RegionLocationCfg> {
  /**
   * 默认的配置项
   * @returns {object} 默认的配置项
   */
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'annotation',
      type: 'regionFilter',
      locationType: 'region',
      start: null,
      end: null,
      color: null,
      shape: [],
    };
  }

  protected renderInner(group: IGroup) {
    const start: Point = this.get('start');
    const end: Point = this.get('end');

    // 1. add region layer
    const layer: IGroup = this.addGroup(group, {
      id: this.getElementId('region-filter'),
      capture: false,
    });

    // 2. clone shape & color it
    each(this.get('shapes'), (shape: IShape, shapeIdx: number) => {
      const type = shape.get('type');
      const attrs = clone(shape.attr());
      this.adjustShapeAttrs(attrs);
      this.addShape(layer, {
        id: this.getElementId(`shape-${type}-${shapeIdx}`),
        capture: false,
        type,
        attrs,
      });
    });

    // 3. clip
    const clipBBox = regionToBBox({ start, end });
    layer.setClip({
      type: 'rect',
      attrs: {
        x: clipBBox.minX,
        y: clipBBox.minY,
        width: clipBBox.width,
        height: clipBBox.height,
      },
    });
  }

  private adjustShapeAttrs(attr: ShapeAttrs) {
    const color = this.get('color');
    if (attr.fill) {
      attr.fill = attr.fillStyle = color;
    }
    attr.stroke = attr.strokeStyle = color;
  }
}

export default RegionFilterAnnotation;
