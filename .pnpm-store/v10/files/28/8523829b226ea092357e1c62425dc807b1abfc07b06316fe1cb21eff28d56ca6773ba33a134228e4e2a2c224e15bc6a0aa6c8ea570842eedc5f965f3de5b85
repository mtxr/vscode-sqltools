import Action from '../../base';
import { LooseObject } from '../../../../interface';
/**
 * @ignore
 * 辅助框 Action 的基类
 */
declare abstract class MultipleMaskBase extends Action {
    protected maskShapes: any[];
    protected starting: boolean;
    protected moving: boolean;
    protected recordPoints: any;
    protected preMovePoint: any;
    protected shapeType: string;
    protected maskType: string;
    /**
     * 获取当前的位置
     */
    protected getCurrentPoint(): {
        x: any;
        y: any;
    };
    /**
     * 触发 mask 的事件
     * @param type
     */
    protected emitEvent(type: any): void;
    /**
     * 创建 mask
     * @param index
     */
    private createMask;
    /**
     * 获取 mask shape attributes
     * @param points
     */
    protected abstract getMaskAttrs(points: number[]): LooseObject;
    /**
     * 生成 mask 的路径
     */
    protected getMaskPath(points: any): any[];
    /**
     * 显示
     */
    show(): void;
    /**
     * 开始
     */
    start(arg?: {
        maskStyle: LooseObject;
    }): void;
    /**
     * 开始移动
     */
    moveStart(): void;
    /**
     * 移动 mask
     */
    move(): void;
    /**
     * 更新
     * @param maskStyle
     */
    protected updateMask(maskStyle?: LooseObject): void;
    /**
     * 大小变化
     */
    resize(): void;
    /**
     * 结束移动
     */
    moveEnd(): void;
    /**
     * 结束
     */
    end(): void;
    /**
     * 隐藏
     */
    hide(): void;
    /**
     * 清除某个 mask
     */
    remove(): void;
    /**
     * 清除全部 mask
     */
    clearAll(): void;
    /**
     * 清除
     */
    clear(): void;
    /**
     * 销毁
     */
    destroy(): void;
    /**
     * 获取 mask 节点记录
     */
    protected getRecordPoints(): any[];
    /**
     * 创建 mask 节点记录
     */
    protected recordPointStart(): void;
    /**
     * 持续记录 mask 节点
     */
    protected recordPointContinue(): void;
    /**
     * 清除 mask 节点 记录
     */
    protected recordPointClear(): void;
    /**
     * 设置 capture
     * false: 避免创建、resize 时触发事件
     * true: 正常触发其它事件
     * @param isCapture
     */
    protected updateShapesCapture(isCapture: boolean): void;
    /**
     *
     * @returns 获取当前 event (x, y) 所在 maskShape 的 index
     */
    protected getCurMaskShapeIndex(): number;
}
export default MultipleMaskBase;
