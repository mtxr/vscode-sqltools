import ListState from './list-state';
import { Point } from '../../../interface';
declare class ListRadio extends ListState {
    show(): void;
    hide(): void;
    private timeStamp;
    private location;
    private tooltip;
    destroy(): void;
    /**
     * 显示 Tooltip (展示在上方)
     * @returns
     */
    showTip(): void;
    /**
     * 隐藏 Tooltip。
     * @returns
     */
    hideTip(): void;
    protected showTooltip(curLoc: Point): void;
    protected hideTooltip(): void;
    private renderTooltip;
}
export default ListRadio;
