import { Element, ShapeAttrs } from '@antv/g2';
import { Params } from '../core/adaptor';
export interface ConnectedAreaOptions {
    /** 触发方式, 默认 hover */
    trigger?: 'hover' | 'click';
    /** 自定义样式 */
    style?: ShapeAttrs | ((style: ShapeAttrs, element: Element) => ShapeAttrs);
}
/** 联通区域组件：使用于堆叠柱形图、堆叠条形图 */
export interface OptionWithConnectedArea {
    connectedArea?: ConnectedAreaOptions | false;
}
/**
 * 返回支持联通区域组件交互的 adaptor，适用于堆叠柱形图/堆叠条形图
 * @param disable
 */
export declare function connectedArea<O extends OptionWithConnectedArea>(disable?: boolean): (params: Params<O>) => Params<O>;
