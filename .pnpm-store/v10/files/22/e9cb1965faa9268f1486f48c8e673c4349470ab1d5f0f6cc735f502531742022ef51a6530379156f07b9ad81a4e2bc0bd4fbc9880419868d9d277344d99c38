import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { RegionAnnotationCfg, RegionLocationCfg } from '../types';
import Theme from '../util/theme';
import { regionToBBox } from '../util/util';

class RegionAnnotation extends GroupComponent<RegionAnnotationCfg> implements ILocation<RegionLocationCfg> {
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
      type: 'region',
      locationType: 'region',
      start: null,
      end: null,
      style: {},
      defaultCfg: {
        style: {
          lineWidth: 0,
          fill: Theme.regionColor,
          opacity: 0.4,
        },
      },
    };
  }

  protected renderInner(group: IGroup) {
    this.renderRegion(group);
  }

  private renderRegion(group: IGroup) {
    const start = this.get('start');
    const end = this.get('end');
    const style = this.get('style');
    const bbox = regionToBBox({ start, end });
    this.addShape(group, {
      type: 'rect',
      id: this.getElementId('region'),
      name: 'annotation-region',
      attrs: {
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height,
        ...style,
      },
    });
  }
}

export default RegionAnnotation;
