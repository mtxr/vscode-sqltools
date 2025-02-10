import { IGroup } from '../interfaces';
import Container from './container';

abstract class AbstractGroup extends Container implements IGroup {
  isGroup() {
    return true;
  }

  isEntityGroup() {
    return false;
  }

  clone() {
    const clone = super.clone();
    // 获取构造函数
    const children = this.getChildren();
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      clone.add(child.clone());
    }
    return clone;
  }
}

export default AbstractGroup;
