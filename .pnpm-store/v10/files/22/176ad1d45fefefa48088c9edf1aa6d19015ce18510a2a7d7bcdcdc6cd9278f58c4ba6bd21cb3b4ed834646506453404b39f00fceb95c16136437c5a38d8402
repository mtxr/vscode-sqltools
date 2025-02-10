import Action from '../base';
import Element from '../../../geometry/element/';
import { ShapeAttrs } from '../../../dependents';
type LinkActiveStyle = ShapeAttrs | ((style: ShapeAttrs, Element: Element) => ShapeAttrs);
/**
 * Link Elements by color
 *
 * public 方法是对外可用的反馈交互。使用方式，如：element-link-by-color:link, element-link-by-color:unlink, element-link-by-color:clear
 */
declare class LinkByColor extends Action {
    private linkGroup;
    private cache;
    private getColorScale;
    private getLinkPath;
    private addLinkShape;
    private linkByElement;
    private removeLink;
    /**
     * 连接 elements
     *
     * @usage
     * registerInteraction('xxx', {
     *   start: [
     *    {
     *      trigger: 'interval:mouseenter',
     *      action: 'element-link-by-color:link',
     *      arg: {
     *        // style: { fill: 'red' }
     *        style: (style, element) => ({ fill: 'red' })
     *     },
     *   },
     *  ],
     * });
     */
    link(args?: {
        style: LinkActiveStyle;
    }): void;
    /**
     * 取消连接 elements
     */
    unlink(): void;
    /**
     * 清除所有连接
     */
    clear(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
export default LinkByColor;
