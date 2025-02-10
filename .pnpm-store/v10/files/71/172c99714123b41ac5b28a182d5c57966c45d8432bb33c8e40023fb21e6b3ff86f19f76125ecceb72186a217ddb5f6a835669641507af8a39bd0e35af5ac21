import { MappingDatum, AttributeOption, ColorAttrCallback } from '../interface';
import Geometry from './base';
/**
 * 用于绘制热力图。
 */
export default class Heatmap extends Geometry {
    readonly type: string;
    private paletteCache;
    private grayScaleBlurredCanvas;
    private shadowCanvas;
    private imageShape;
    protected updateElements(mappingDataArray: MappingDatum[][], isUpdate?: boolean): void;
    /** 热力图暂时不支持 callback 回调（文档需要说明下） */
    color(field: AttributeOption | string, cfg?: string | string[] | ColorAttrCallback): Geometry;
    /**
     * clear
     */
    clear(): void;
    private prepareRange;
    private prepareSize;
    private prepareGreyScaleBlurredCircle;
    private drawWithRange;
    private getDefaultSize;
    private clearShadowCanvasCtx;
    private getShadowCanvasCtx;
    private getGrayScaleBlurredCanvas;
    private drawGrayScaleBlurredCircle;
    private colorize;
    private getImageShape;
    private getShapeInfo;
}
