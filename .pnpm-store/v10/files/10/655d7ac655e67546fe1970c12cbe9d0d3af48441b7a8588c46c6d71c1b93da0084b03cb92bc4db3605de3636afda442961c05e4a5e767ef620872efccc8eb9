import { BBox, IGroup, IShape } from '../dependents';
import { LabelItem } from '../geometry/label/interface';
import { AnimateOption, GeometryLabelLayoutCfg } from '../interface';
/**
 * Labels 实例创建时，传入构造函数的参数定义
 */
export interface LabelsGroupCfg {
    /** label 容器 */
    container: IGroup;
    /** label 布局配置 */
    layout?: GeometryLabelLayoutCfg | GeometryLabelLayoutCfg[];
}
/**
 * Geometry labels 渲染组件
 */
export default class Labels {
    /** 用于指定 labels 布局的类型 */
    layout: GeometryLabelLayoutCfg | GeometryLabelLayoutCfg[];
    /** 图形容器 */
    container: IGroup;
    /** 动画配置 */
    animate: AnimateOption | false;
    /** label 绘制的区域 */
    region: BBox;
    /** 存储当前 shape 的映射表，键值为 shape id */
    shapesMap: Record<string, IGroup>;
    constructor(cfg: LabelsGroupCfg);
    /**
     * 渲染文本
     */
    render(items: LabelItem[], shapes: Record<string, IShape | IGroup>, isUpdate?: boolean): Promise<void>;
    /** 清除当前 labels */
    clear(): void;
    /** 销毁 */
    destroy(): void;
    private renderLabel;
    private doLayout;
    private renderLabelLine;
    /**
     * 绘制标签背景
     * @param labelItems
     */
    private renderLabelBackground;
    private createOffscreenGroup;
    private adjustLabel;
}
