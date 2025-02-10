import { Point } from '../../../dependents';
import TransformAction from './scale-transform';
/**
 * 拖拽 Scale 的 Action
 * @ignore
 */
declare class ScaleTranslate extends TransformAction {
    protected startPoint: Point;
    protected starting: boolean;
    private startCache;
    /**
     * 开始
     */
    start(): void;
    /**
     * 结束
     */
    end(): void;
    /**
     * 平移
     */
    translate(): void;
    private translateDim;
    private translateLinear;
    /**
     * 回滚
     */
    reset(): void;
}
export default ScaleTranslate;
