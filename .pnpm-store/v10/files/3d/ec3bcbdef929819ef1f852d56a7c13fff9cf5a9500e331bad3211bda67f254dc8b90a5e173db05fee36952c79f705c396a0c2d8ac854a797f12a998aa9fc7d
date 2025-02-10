import Action from '../base';
import { LooseObject } from '../../../interface';
/**
 * @ignore
 * 辅助框 Action 的基类
 */
declare abstract class MaskBase extends Action {
    protected maskShape: any;
    protected points: any[];
    protected starting: boolean;
    protected moving: boolean;
    protected preMovePoint: any;
    protected shapeType: string;
    protected getCurrentPoint(): {
        x: any;
        y: any;
    };
    protected emitEvent(type: any): void;
    private createMask;
    protected abstract getMaskAttrs(): LooseObject;
    protected getMaskPath(): any[];
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
    protected updateMask(maskStyle?: LooseObject): void;
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
     * 大小变化
     */
    resize(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
export default MaskBase;
