import { ILocation } from '../interfaces';
import { CircleCrosshairCfg, CircleLocationCfg, Point } from '../types';
import { getCirclePoint } from '../util/util';
import CrosshairBase from './base';

class LineCrosshair extends CrosshairBase<CircleCrosshairCfg> implements ILocation<CircleLocationCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      type: 'circle',
      locationType: 'circle',
      center: null,
      radius: 100,
      startAngle: -Math.PI / 2,
      endAngle: (Math.PI * 3) / 2,
    };
  }

  protected getRotateAngle(): number {
    const { startAngle, endAngle } = this.getLocation();
    const { position } = this.get('text');
    const tangentAngle = position === 'start' ? startAngle + Math.PI / 2 : endAngle - Math.PI / 2;
    return tangentAngle;
  }

  protected getTextPoint(): Point {
    const text = this.get('text');
    const { position, offset } = text;
    const { center, radius, startAngle, endAngle } = this.getLocation();
    const angle = position === 'start' ? startAngle : endAngle;
    const tangentAngle = this.getRotateAngle() - Math.PI;
    const point = getCirclePoint(center, radius, angle);
    // 这个地方其实应该求切线向量然后在乘以 offset，但是太啰嗦了，直接给出结果
    // const tangent = [Math.cos(tangentAngle), Math.sin(tangentAngle)];
    // const offsetVector = vec2.scale([], tangent, offset);
    const offsetX = Math.cos(tangentAngle) * offset;
    const offsetY = Math.sin(tangentAngle) * offset;
    return {
      x: point.x + offsetX,
      y: point.y + offsetY,
    };
  }

  protected getLinePath(): any[] {
    const { center, radius, startAngle, endAngle } = this.getLocation();
    let path = null;
    if (endAngle - startAngle === Math.PI * 2) {
      // 整圆
      const { x, y } = center;
      path = [
        ['M', x, y - radius],
        ['A', radius, radius, 0, 1, 1, x, y + radius],
        ['A', radius, radius, 0, 1, 1, x, y - radius],
        ['Z'],
      ];
    } else {
      const startPoint = getCirclePoint(center, radius, startAngle);
      const endPoint = getCirclePoint(center, radius, endAngle);
      const large = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
      const sweep = startAngle > endAngle ? 0 : 1;
      path = [
        ['M', startPoint.x, startPoint.y],
        ['A', radius, radius, 0, large, sweep, endPoint.x, endPoint.y],
      ];
    }
    return path;
  }
}

export default LineCrosshair;
