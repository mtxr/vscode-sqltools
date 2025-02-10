import { Action } from '@antv/g2';
export declare class SankeyNodeDragAction extends Action {
    /**
     * 是否在拖拽中的标记
     */
    private isDragging;
    /**
     * 鼠标上一次的位置的坐标点
     */
    private prevPoint;
    /**
     * 之前的节点动画配置
     */
    private prevNodeAnimateCfg;
    /**
     * 之前的边动画配置
     */
    private prevEdgeAnimateCfg;
    /**
     * 当前拖拽的 element 索引
     */
    private currentElementIdx;
    /**
     * 当前操作的是否是 element
     */
    private isNodeElement;
    private getNodeView;
    private getEdgeView;
    /**
     * 获取当前操作的 index
     * @param element
     */
    private getCurrentDatumIdx;
    /**
     * 点击下去，开始
     */
    start(): void;
    /**
     * 移动过程中，平移
     */
    translate(): void;
    /**
     * 结论，清除状态
     */
    end(): void;
}
