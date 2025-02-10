import { ILocation } from '../interfaces';
import { LineCrosshairCfg, Point, RegionLocationCfg } from '../types';
import { getTextPoint } from '../util/util';
import CrosshairBase from './base';

class LineCrosshair extends CrosshairBase<LineCrosshairCfg> implements ILocation<RegionLocationCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      type: 'line',
      locationType: 'region',
      start: null,
      end: null,
    };
  }

  // 直线的文本需要同直线垂直
  protected getRotateAngle(): number {
    const { start, end } = this.getLocation();
    const { position } = this.get('text');
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const tangentAngle = position === 'start' ? angle - Math.PI / 2 : angle + Math.PI / 2;
    return tangentAngle;
  }

  protected getTextPoint() {
    const { start, end } = this.getLocation();
    const { position, offset } = this.get('text');
    return getTextPoint(start, end, position, offset);
  }

  protected getLinePath(): any[] {
    const { start, end } = this.getLocation();
    return [
      ['M', start.x, start.y],
      ['L', end.x, end.y],
    ];
  }
}

export default LineCrosshair;
