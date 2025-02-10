import { IGroup } from '@antv/g-base';
import { isFunction, noop } from '@antv/util';

import GroupComponent from '../abstract/group-component';
import { ShapeAnnotationCfg } from '../types';

export default class ShapeAnnotation extends GroupComponent<ShapeAnnotationCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'annotation',
      type: 'shape',
      draw: noop,
    };
  }

  protected renderInner(group: IGroup) {
    const render = this.get('render');
    if (isFunction(render)) {
      render(group);
    }
  }
}
