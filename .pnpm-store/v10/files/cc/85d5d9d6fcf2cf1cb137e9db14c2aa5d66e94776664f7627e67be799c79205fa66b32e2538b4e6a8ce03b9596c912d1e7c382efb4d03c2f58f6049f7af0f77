import { ComponentOption } from '../../interface';
import View from '../view';
/** Component controller class type define */
export type ControllerCtor<O = any> = new (view: View) => Controller<O>;
/**
 * Component Controller 规范需要定义的基类
 * 1. 规范的 option 输入
 * 2. 统一的信息获取 API
 * 3. 明确定义的组件事件（名称、数据）
 */
export declare abstract class Controller<O = unknown> {
    /** 是否可见 */
    visible: boolean;
    protected view: View;
    /** option 配置，不同组件有自己不同的配置结构 */
    protected option: O;
    /** 所有的 component */
    protected components: ComponentOption[];
    constructor(view: View);
    abstract get name(): string;
    /**
     * init the component
     */
    abstract init(): any;
    /**
     * render the components
     */
    abstract render(): any;
    /**
     * update the components
     */
    /**
     * do layout
     */
    abstract layout(): any;
    /**
     * 组件的更新逻辑
     *  - 根据字段为标识，为每一个组件生成一个 id，放到 option 中
     *  - 更新的时候按照 id 去做 diff，然后对同的做处理
     *  - 创建增加的
     *  - 更新已有的
     *  - 销毁删除的
     */
    abstract update(): any;
    /**
     * clear
     * @param includeOption 是否清空 option 配置项（used in annotation）
     */
    clear(includeOption?: boolean): void;
    /**
     * destroy the component
     */
    destroy(): void;
    /**
     * get all components
     * @returns components array
     */
    getComponents(): ComponentOption[];
    /**
     * change visibility of component
     * @param visible
     */
    changeVisible(visible: boolean): void;
}
