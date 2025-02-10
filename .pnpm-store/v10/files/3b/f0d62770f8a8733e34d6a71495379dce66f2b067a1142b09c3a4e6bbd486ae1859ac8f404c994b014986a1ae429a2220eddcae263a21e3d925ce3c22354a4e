import { AxisOption, ComponentOption } from '../../interface';
import View from '../view';
import { Controller } from './base';
type Option = Record<string, AxisOption> | boolean;
/**
 * @ignore
 * G2 Axis controller, will:
 *  - create component
 *    - axis
 *    - grid
 *  - life circle
 */
export default class Axis extends Controller<Option> {
    /** the draw group of axis */
    private axisContainer;
    private axisForeContainer;
    private gridContainer;
    private gridForeContainer;
    /** 使用 object 存储组件 */
    private cache;
    constructor(view: View);
    get name(): string;
    init(): void;
    render(): void;
    /**
     * 更新组件布局，位置大小
     */
    layout(): void;
    /**
     * 更新 axis 组件
     */
    update(): void;
    clear(): void;
    destroy(): void;
    /**
     * @override
     */
    getComponents(): ComponentOption[];
    /**
     * 更新 x axis
     * @param updatedCache
     */
    private updateXAxes;
    private updateYAxes;
    /**
     * 创建 line axis
     * @param scale
     * @param option
     * @param layer
     * @param direction
     * @param dim
     */
    private createLineAxis;
    private createLineGrid;
    private createCircleAxis;
    private createCircleGrid;
    /**
     * generate line axis cfg
     * @param scale
     * @param axisOption
     * @param direction
     * @return line axis cfg
     */
    private getLineAxisCfg;
    /**
     * generate line grid cfg
     * @param scale
     * @param axisOption
     * @param direction
     * @param dim
     * @return line grid cfg
     */
    private getLineGridCfg;
    /**
     * generate circle axis cfg
     * @param scale
     * @param axisOption
     * @param direction
     * @return circle axis cfg
     */
    private getCircleAxisCfg;
    /**
     * generate circle grid cfg
     * @param scale
     * @param axisOption
     * @param direction
     * @return circle grid cfg
     */
    private getCircleGridCfg;
    private getId;
    private getAnimateCfg;
}
export {};
