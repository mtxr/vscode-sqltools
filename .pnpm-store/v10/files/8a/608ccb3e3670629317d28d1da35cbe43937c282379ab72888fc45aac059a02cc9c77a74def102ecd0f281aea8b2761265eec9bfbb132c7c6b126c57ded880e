import { IBase } from '@antv/g-base';
import { BBox, ListItem, LocationCfg, LocationType, OffsetPoint, Range } from './types';

export interface IList {
  /**
   * 获取列表项
   * @return {ListItem[]} 列表项集合
   */
  getItems(): ListItem[];
  /**
   * 设置列表项
   * @param {ListItem[]} items 列表项集合
   */
  setItems(items: ListItem[]);
  /**
   * 更新列表项
   * @param {ListItem} item 列表项
   * @param {object}   cfg  列表项
   */
  updateItem(item: ListItem, cfg: object);
  /**
   * 清空列表
   */
  clearItems();
  /**
   * 设置列表项的状态
   * @param {ListItem} item  列表项
   * @param {string}   state 状态名
   * @param {boolean}  value 状态值, true, false
   */
  setItemState(item: ListItem, state: string, value: boolean);
  /**
   * 根据状态获取
   * @param  {state}     state 状态名
   * @return {ListItem[]} 列表项
   */
  getItemsByState(state): ListItem[];
  /**
   * 是否存在指定的状态
   * @param {ListItem} item  列表项
   * @param {string} state 状态名
   */
  hasState(item: ListItem, state: string): boolean;
  /**
   * 清楚所有列表项的状态
   * @param {string} state 状态值
   */
  clearItemsState(state: string);
}

export interface ISlider {
  /**
   * 设置可滑动范围
   * @param {number} min 最小值
   * @param {number} max 最大值
   */
  setRange(min: number, max: number);
  /**
   * 获取滑动的范围
   * @return {Range} 滑动范围
   */
  getRange(): Range;
  /**
   * 设置当前值，单值或者两个值
   * @param {number | number[]} value 值
   */
  setValue(value: number | number[]);
  /**
   * 获取当前值
   * @return {number|number[]} 当前值
   */
  getValue(): number | number[];
}

export interface ILocation<T extends LocationCfg = LocationCfg> {
  /**
   * 获取定位方式，point，points，region，circle，'none' 五种值
   * @return {LocationType} 定位方式
   */
  getLocationType(): LocationType;
  /**
   * 获取定位信息
   * @return {T} 定位信息
   */
  getLocation(): T;
  /**
   * 设置定位信息
   * @param {T} cfg 定位信息
   */
  setLocation(cfg: T);
  /**
   * 设置偏移量
   * @param {number} offsetX 偏移 x
   * @param {number} offsetY 偏移 y
   */
  setOffset(offsetX: number, offsetY: number);
  /**
   * 获取偏移信息
   * @return {OffsetPoint} 偏移信息
   */
  getOffset(): OffsetPoint;
}

export interface IComponent extends IBase {
  /**
   * 初始化组件
   */
  init(): void;
  /**
   * 是否是列表
   */
  isList(): boolean;
  /**
   * 是否是 slider
   */
  isSlider(): boolean;
  /**
   * 渲染组件
   */
  render();
  /**
   * 更新组件
   * @param {object} cfg 更新的配置项
   */
  update(cfg: object);
  /**
   * 清空组件
   */
  clear();
  /**
   * 组件在画布上的包围盒
   * @return {BBox} 包围盒
   */
  getBBox(): BBox;
  /**
   * 组件布局要求的包围盒，不一定等于 getBBox
   * @return {BBox} 包围盒
   */
  getLayoutBBox(): BBox;
  /**
   * 是否可以响应事件
   * @param capture 是否可以响应事件
   */
  setCapture(capture: boolean): void;
  /**
   * 显示
   */
  show();
  /**
   * 隐藏
   */
  hide();
}
