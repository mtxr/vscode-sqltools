/**
 * @fileoverview 使用 G.Group 的组件
 * @author dxq613@gmail.com
 */
import { IElement, IGroup, IShape } from '@antv/g-base';
import { difference, each, isNil, keys, mix, pick } from '@antv/util';
import { BBox, GroupComponentCfg, LooseObject, Point } from '../types';
import { propagationDelegate } from '../util/event';
import { applyMatrix2BBox, getMatrixByTranslate } from '../util/matrix';
import { getBBoxWithClip, updateClip } from '../util/util';
import Component from './component';
type Callback = (evt: object) => void;

const STATUS_UPDATE = 'update_status';
const COPY_PROPERTIES = ['visible', 'tip', 'delegateObject']; // 更新对象时需要复制的属性
const COPY_PROPERTIES_EXCLUDES = ['container', 'group', 'shapesMap', 'isRegister', 'isUpdating', 'destroyed']; // 更新子组件时排除的属性

export type GroupComponentCtor<
  C extends GroupComponentCfg = GroupComponentCfg,
  T extends GroupComponent = GroupComponent
> = new (cfg: C) => T;

abstract class GroupComponent<T extends GroupComponentCfg = GroupComponentCfg> extends Component<T> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      container: null,
      /**
       * @private
       * 缓存图形的 Map
       */
      shapesMap: {},
      group: null,
      capture: true,
      /**
       * @private 组件或者图形是否允许注册
       * @type {false}
       */
      isRegister: false,
      /**
       * @private 是否正在更新
       * @type {false}
       */
      isUpdating: false,
      /**
       * @private
       * 是否初始状态，一旦 render，update 后，这个状态就变成 false, clear 后恢复
       */
      isInit: true,
    };
  }

  public remove() {
    this.clear();
    const group = this.get('group');
    group.remove();
  }

  public clear() {
    const group = this.get('group');
    group.clear();
    this.set('shapesMap', {});
    this.clearOffScreenCache();
    this.set('isInit', true);
  }

  public getChildComponentById(id: string) {
    const group = this.getElementById(id);
    const inst = group && group.get('component');
    return inst;
  }

  public getElementById(id: string) {
    return this.get('shapesMap')[id];
  }

  public getElementByLocalId(localId) {
    const id = this.getElementId(localId);
    return this.getElementById(id);
  }

  public getElementsByName(name: string) {
    const rst = [];
    each(this.get('shapesMap'), (elem) => {
      if (elem.get('name') === name) {
        rst.push(elem);
      }
    });

    return rst;
  }

  public getContainer(): IGroup {
    return this.get('container') as IGroup;
  }

  public updateInner(cfg: Partial<T>) {
    // this.updateInner();
    // this.set('isUpdating', false);
    this.offScreenRender();
    if (this.get('updateAutoRender')) {
      this.render();
    }
  }

  public render() {
    let offScreenGroup = this.get('offScreenGroup');
    if (!offScreenGroup) {
      offScreenGroup = this.offScreenRender();
    }
    const group = this.get('group');
    this.updateElements(offScreenGroup, group);
    this.deleteElements();
    this.applyOffset();
    if (!this.get('eventInitted')) {
      this.initEvent();
      this.set('eventInitted', true);
    }
    this.set('isInit', false);
  }

  public show() {
    const group = this.get('group');
    group.show();
    this.set('visible', true);
  }

  public hide() {
    const group = this.get('group');
    group.hide();
    this.set('visible', false);
  }

  public setCapture(capture) {
    const group = this.get('group');
    group.set('capture', capture);
    this.set('capture', capture);
  }

  public destroy() {
    this.removeEvent();
    this.remove();
    super.destroy();
  }

  public getBBox(): BBox {
    return this.get('group').getCanvasBBox();
  }

  public getLayoutBBox(): BBox {
    const group = this.get('group');
    // 防止被 clear 了，offScreenBBox 不存在
    let bbox = this.getInnerLayoutBBox();
    const matrix = group.getTotalMatrix();
    if (matrix) {
      bbox = applyMatrix2BBox(matrix, bbox);
    }
    return bbox; // 默认返回 getBBox，不同的组件内部单独实现
  }

  // 复写 on, off, emit 透传到 group
  public on(evt: string, callback: Callback, once?: boolean): this {
    const group = this.get('group');
    group.on(evt, callback, once);
    return this;
  }

  public off(evt?: string, callback?: Callback): this {
    const group = this.get('group');
    group && group.off(evt, callback);
    return this;
  }

  public emit(eventName: string, eventObject: LooseObject) {
    const group = this.get('group');
    group.emit(eventName, eventObject);
  }

  public init() {
    super.init();
    if (!this.get('group')) {
      this.initGroup();
    }
    this.offScreenRender(); // 绘制离屏 group
  }

  // 获取组件内部布局占的包围盒
  protected getInnerLayoutBBox() {
    return this.get('offScreenBBox') || this.get('group').getBBox();
  }

  // 抛出委托对象
  protected delegateEmit(eventName: string, eventObject: LooseObject) {
    const group = this.get('group');
    eventObject.target = group;
    group.emit(eventName, eventObject);
    propagationDelegate(group, eventName, eventObject);
  }
  // 创建离屏的 group ,不添加在 canvas 中
  protected createOffScreenGroup() {
    const group = this.get('group');
    const GroupClass = group.getGroupBase(); // 获取分组的构造函数
    const newGroup = new GroupClass({
      delegateObject: this.getDelegateObject(), // 生成委托事件触发时附加的对象
    });
    return newGroup;
  }

  // 应用 offset
  protected applyOffset() {
    const offsetX = this.get('offsetX');
    const offsetY = this.get('offsetY');
    this.moveElementTo(this.get('group'), {
      x: offsetX,
      y: offsetY,
    });
  }

  protected initGroup() {
    const container = this.get('container');
    this.set(
      'group',
      container.addGroup({
        id: this.get('id'),
        name: this.get('name'),
        capture: this.get('capture'),
        visible: this.get('visible'),
        isComponent: true,
        component: this,
        delegateObject: this.getDelegateObject(),
      })
    );
  }

  // 离屏渲染
  protected offScreenRender() {
    this.clearOffScreenCache();
    const offScreenGroup = this.createOffScreenGroup();

    this.renderInner(offScreenGroup);
    this.set('offScreenGroup', offScreenGroup);
    // 包含包围盒的 bbox
    this.set('offScreenBBox', getBBoxWithClip(offScreenGroup));
    return offScreenGroup;
  }

  /**
   * @protected
   * 在组件上添加分组，主要解决 isReigeter 的问题
   * @param {IGroup} parent 父元素
   * @param {object} cfg    分组的配置项
   */
  protected addGroup(parent: IGroup, cfg) {
    this.appendDelegateObject(parent, cfg);
    const group = parent.addGroup(cfg);
    if (this.get('isRegister')) {
      this.registerElement(group);
    }
    return group;
  }

  /**
   * @protected
   * 在组件上添加图形，主要解决 isReigeter 的问题
   * @param {IGroup} parent 父元素
   * @param {object} cfg    分组的配置项
   */
  protected addShape(parent: IGroup, cfg) {
    this.appendDelegateObject(parent, cfg);
    const shape = parent.addShape(cfg);
    if (this.get('isRegister')) {
      this.registerElement(shape);
    }
    return shape;
  }

  /**
   * 在组件上添加子组件
   *
   * @param parent 父元素
   * @param cfg 子组件配置项
   */
  protected addComponent<C extends GroupComponentCfg = GroupComponentCfg, CT extends GroupComponent = GroupComponent>(
    parent: IGroup,
    cfg: Omit<C, 'container'> & { component: GroupComponentCtor<C, CT> }
  ) {
    const { id, component: Ctor, ...restCfg } = cfg;
    // @ts-ignore
    const inst: CT = new Ctor({
      ...restCfg,
      id,
      container: parent,
      updateAutoRender: this.get('updateAutoRender'),
    });
    inst.init();
    inst.render();

    if (this.get('isRegister')) {
      this.registerElement(inst.get('group'));
    }

    return inst;
  }

  protected initEvent() {}

  protected removeEvent() {
    const group = this.get('group');
    group.off();
  }

  protected getElementId(localId: string) {
    const id = this.get('id'); // 组件的 Id
    const name = this.get('name'); // 组件的名称
    return `${id}-${name}-${localId}`;
  }

  protected registerElement(element) {
    const id = element.get('id');
    this.get('shapesMap')[id] = element;
  }

  protected unregisterElement(element) {
    const id = element.get('id');
    delete this.get('shapesMap')[id];
  }

  // 移动元素
  protected moveElementTo(element: IElement, point: Point) {
    const matrix = getMatrixByTranslate(point);
    element.attr('matrix', matrix);
  }

  /**
   * 内部的渲染
   * @param {IGroup} group 图形分组
   */
  protected abstract renderInner(group: IGroup);

  /**
   * 图形元素新出现时的动画，默认图形从透明度 0 到当前透明度
   * @protected
   * @param {string} elmentName 图形元素名称
   * @param {IElement} newElement  新的图形元素
   * @param {object} animateCfg 动画的配置项
   */
  protected addAnimation(elmentName, newElement, animateCfg) {
    // 缓存透明度
    let originOpacity = newElement.attr('opacity');
    if (isNil(originOpacity)) {
      originOpacity = 1;
    }
    newElement.attr('opacity', 0);
    newElement.animate({ opacity: originOpacity }, animateCfg);
  }

  /**
   * 图形元素新出现时的动画，默认图形从透明度 0 到当前透明度
   * @protected
   * @param {string} elmentName 图形元素名称
   * @param {IElement} originElement 要删除的图形元素
   * @param {object} animateCfg 动画的配置项
   */
  protected removeAnimation(elementName, originElement, animateCfg) {
    originElement.animate({ opacity: 0 }, animateCfg);
  }

  /**
   * 图形元素的更新动画
   * @param {string} elmentName 图形元素名称
   * @param {IElement} originElement 现有的图形元素
   * @param {object} newAttrs  新的图形元素
   * @param {object} animateCfg 动画的配置项
   */
  protected updateAnimation(elementName, originElement, newAttrs, animateCfg) {
    originElement.animate(newAttrs, animateCfg);
  }

  // 更新组件的图形
  protected updateElements(newGroup, originGroup) {
    const animate = this.get('animate');
    const animateOption = this.get('animateOption');
    const children = newGroup.getChildren().slice(0); // 创建一个新数组，防止添加到 originGroup 时， children 变动
    let preElement; // 前面已经匹配到的图形元素，用于
    each(children, (element) => {
      const elementId = element.get('id');
      const originElement = this.getElementById(elementId);
      const elementName = element.get('name');
      if (originElement) {
        if (element.get('isComponent')) {
          // 嵌套子组件更新
          const childComponent = element.get('component');
          const origChildComponent: GroupComponent<any> = originElement.get('component');
          const newCfg = pick(childComponent.cfg, difference(keys(childComponent.cfg), COPY_PROPERTIES_EXCLUDES));
          origChildComponent.update(newCfg);
          originElement.set(STATUS_UPDATE, 'update');
        } else {
          const replaceAttrs = this.getReplaceAttrs(originElement, element);
          // 更新
          if (animate && animateOption.update) {
            // 没有动画
            this.updateAnimation(elementName, originElement, replaceAttrs, animateOption.update);
          } else {
            // originElement.attrs = replaceAttrs; // 直接替换
            originElement.attr(replaceAttrs);
          }
          // 如果是分组，则继续执行
          if (element.isGroup()) {
            this.updateElements(element, originElement);
          }
          // 复制属性
          each(COPY_PROPERTIES, (name) => {
            originElement.set(name, element.get(name));
          });
          updateClip(originElement, element);

          preElement = originElement;
          // 执行完更新后设置状态位为更新
          originElement.set(STATUS_UPDATE, 'update');
        }
      } else {
        // 没有对应的图形，则插入当前图形
        originGroup.add(element); // 应该在 group 加个 insertAt 的方法
        const siblings = originGroup.getChildren(); // 兄弟节点
        siblings.splice(siblings.length - 1, 1); // 先从数组中移除，然后放到合适的位置
        if (preElement) {
          // 前面已经有更新的图形或者插入的图形，则在这个图形后面插入
          const index = siblings.indexOf(preElement);
          siblings.splice(index + 1, 0, element); // 在已经更新的图形元素后面插入
        } else {
          siblings.unshift(element);
        }
        this.registerElement(element); // 注册节点
        element.set(STATUS_UPDATE, 'add'); // 执行完更新后设置状态位为添加
        if (element.get('isComponent')) {
          // 直接新增子组件container属性，实例不变
          const childComponent = element.get('component');
          childComponent.set('container', originGroup);
        } else if (element.isGroup()) {
          // 如果元素是新增加的元素，则遍历注册所有的子节点
          this.registerNewGroup(element);
        }
        preElement = element;
        if (animate) {
          const animateCfg = this.get('isInit') ? animateOption.appear : animateOption.enter;
          if (animateCfg) {
            this.addAnimation(elementName, element, animateCfg);
          }
        }
      }
    });
  }

  protected clearUpdateStatus(group: IGroup) {
    const children = group.getChildren();
    each(children, (el) => {
      el.set(STATUS_UPDATE, null); // 清理掉更新状态
    });
  }

  // 清理离屏缓存
  private clearOffScreenCache() {
    const offScreenGroup = this.get('offScreenGroup');
    if (offScreenGroup) {
      // 销毁原先的离线 Group
      offScreenGroup.destroy();
    }
    this.set('offScreenGroup', null);
    this.set('offScreenBBox', null);
  }

  // private updateInner() {
  //   const group = this.get('group');
  //   const newGroup = this.createOffScreenGroup();
  //   this.renderInner(newGroup);
  //   this.applyOffset();
  //   this.updateElements(newGroup, group);
  //   this.deleteElements();
  //   newGroup.destroy(); // 销毁虚拟分组
  // }

  // 获取发生委托时的对象，在事件中抛出
  private getDelegateObject() {
    const name = this.get('name');
    const delegateObject = {
      [name]: this,
      component: this,
    };
    return delegateObject;
  }

  // 附加委托信息，用于事件
  private appendDelegateObject(parent: IGroup, cfg) {
    const parentObject = parent.get('delegateObject');
    if (!cfg.delegateObject) {
      cfg.delegateObject = {};
    }
    mix(cfg.delegateObject, parentObject); // 将父元素上的委托信息复制到自身
  }

  // 获取需要替换的属性，如果原先图形元素存在，而新图形不存在，则设置 undefined
  private getReplaceAttrs(originElement: IElement, newElement: IElement) {
    const originAttrs = originElement.attr();
    const newAttrs = newElement.attr();
    each(originAttrs, (v, k) => {
      if (newAttrs[k] === undefined) {
        newAttrs[k] = undefined;
      }
    });
    return newAttrs;
  }

  private registerNewGroup(group) {
    const children = group.getChildren();
    each(children, (element) => {
      this.registerElement(element); // 注册节点
      element.set(STATUS_UPDATE, 'add'); // 执行完更新后设置状态位为添加
      if (element.isGroup()) {
        this.registerNewGroup(element);
      }
    });
  }

  // 移除多余的元素
  private deleteElements() {
    const shapesMap = this.get('shapesMap');
    const deleteArray = [];
    // 遍历获取需要删除的图形元素
    each(shapesMap, (element, id) => {
      if (!element.get(STATUS_UPDATE) || element.destroyed) {
        deleteArray.push([id, element]);
      } else {
        element.set(STATUS_UPDATE, null); // 清理掉更新状态
      }
    });
    const animate = this.get('animate');
    const animateOption = this.get('animateOption');
    // 删除图形元素
    each(deleteArray, (item) => {
      const [id, element] = item;
      if (!element.destroyed) {
        const elementName = element.get('name');
        if (animate && animateOption.leave) {
          // 需要动画结束时移除图形
          const callbackAnimCfg = mix(
            {
              callback: () => {
                this.removeElement(element);
              },
            },
            animateOption.leave
          );
          this.removeAnimation(elementName, element, callbackAnimCfg);
        } else {
          this.removeElement(element);
        }
      }
      delete shapesMap[id]; // 从缓存中移除
    });
  }

  private removeElement(element: IShape | IGroup) {
    if (element.get('isGroup')) {
      const component = element.get('component');
      if (component) {
        component.destroy();
      }
    }
    element.remove();
  }
}

export default GroupComponent;
