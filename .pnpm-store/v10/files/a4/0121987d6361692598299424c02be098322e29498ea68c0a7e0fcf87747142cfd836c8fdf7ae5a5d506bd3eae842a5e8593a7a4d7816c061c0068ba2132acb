import Container from './container';
import { ICanvas } from '../interfaces';
import { CanvasCfg, Point, Renderer, Cursor } from '../types';
declare abstract class Canvas extends Container implements ICanvas {
    constructor(cfg: CanvasCfg);
    getDefaultCfg(): {
        visible: boolean; /**
         * 获取画布的 cursor 样式
         * @return {Cursor}
         */
        capture: boolean;
        zIndex: number;
    };
    /**
     * @protected
     * 初始化容器
     */
    initContainer(): void;
    /**
     * @protected
     * 初始化 DOM
     */
    initDom(): void;
    /**
     * 创建画布容器
     * @return {HTMLElement} 画布容器
     */
    abstract createDom(): HTMLElement | SVGSVGElement;
    /**
     * @protected
     * 初始化绑定的事件
     */
    initEvents(): void;
    /**
     * @protected
     * 初始化时间轴
     */
    initTimeline(): void;
    /**
     * @protected
     * 修改画布对应的 DOM 的大小
     * @param {number} width  宽度
     * @param {number} height 高度
     */
    setDOMSize(width: number, height: number): void;
    changeSize(width: number, height: number): void;
    /**
     * 获取当前的渲染引擎
     * @return {Renderer} 返回当前的渲染引擎
     */
    getRenderer(): Renderer;
    /**
     * 获取画布的 cursor 样式
     * @return {Cursor}
     */
    getCursor(): Cursor;
    /**
     * 设置画布的 cursor 样式
     * @param {Cursor} cursor  cursor 样式
     */
    setCursor(cursor: Cursor): void;
    getPointByEvent(ev: Event): Point;
    getClientByEvent(ev: Event): {
        x: number;
        y: number;
    };
    getPointByClient(clientX: number, clientY: number): Point;
    getClientByPoint(x: number, y: number): Point;
    draw(): void;
    /**
     * @protected
     * 销毁 DOM 容器
     */
    removeDom(): void;
    /**
     * @protected
     * 清理所有的事件
     */
    clearEvents(): void;
    isCanvas(): boolean;
    getParent(): any;
    destroy(): void;
}
export default Canvas;
