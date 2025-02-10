import { Point, TooltipOption } from '../../interface';
import { Controller } from './base';
/** @ignore */
export default class Tooltip extends Controller<TooltipOption> {
    private tooltip;
    private tooltipMarkersGroup;
    private tooltipCrosshairsGroup;
    private xCrosshair;
    private yCrosshair;
    private guideGroup;
    private isLocked;
    private items;
    private title;
    private point;
    get name(): string;
    init(): void;
    private isVisible;
    render(): void;
    /**
     * Shows tooltip
     * @param point
     */
    showTooltip(point: Point): void;
    hideTooltip(): void;
    /**
     * lockTooltip
     */
    lockTooltip(): void;
    /**
     * unlockTooltip
     */
    unlockTooltip(): void;
    /**
     * isTooltipLocked
     */
    isTooltipLocked(): boolean;
    clear(): void;
    destroy(): void;
    reset(): void;
    changeVisible(visible: boolean): void;
    getTooltipItems(point: Point): any[];
    layout(): void;
    update(): void;
    /**
     * 当前鼠标点是在 enter tooltip 中
     * @param point
     */
    isCursorEntered(point: Point): boolean;
    getTooltipCfg(): any;
    protected processCustomContent(option: TooltipOption): TooltipOption;
    private getTitle;
    private renderTooltip;
    private renderTooltipMarkers;
    private renderCrosshairs;
    private renderXCrosshairs;
    private renderYCrosshairs;
    private getCrosshairsText;
    private getGuideGroup;
    private getTooltipMarkersGroup;
    private getTooltipCrosshairsGroup;
    private findItemsFromView;
    private getViewWithGeometry;
    /**
     * 根据用户配置的 items 配置，来进行用户自定义的处理，并返回最终的 items
     * 默认不做任何处理
     */
    private getItemsAfterProcess;
}
