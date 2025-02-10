/**
 * @fileoverview 事件处理器
 * @author dxq613@gmail.com
 */
import GraphEvent from './graph-event';
import { IShape } from '../interfaces';
declare class EventController {
    private canvas;
    private draggingShape;
    private dragging;
    private currentShape;
    private mousedownShape;
    private mousedownPoint;
    private mousedownTimeStamp;
    constructor(cfg: any);
    init(): void;
    _bindEvents(): void;
    _clearEvents(): void;
    _getEventObj(type: any, event: any, point: any, target: any, fromShape: any, toShape: any): GraphEvent;
    _eventCallback: (ev: any) => void;
    _getShape(point: any, ev: Event): IShape;
    _getPointInfo(ev: any): {
        x: number;
        y: number;
        clientX: number;
        clientY: number;
    };
    _triggerEvent(type: any, ev: any): void;
    _onDocumentMove: (ev: Event) => void;
    _onDocumentMouseUp: (ev: any) => void;
    _onmousedown(pointInfo: any, shape: any, event: any): void;
    _emitMouseoverEvents(event: any, pointInfo: any, fromShape: any, toShape: any): void;
    _emitDragoverEvents(event: any, pointInfo: any, fromShape: any, toShape: any, isCanvasEmit: any): void;
    _afterDrag(draggingShape: any, pointInfo: any, event: any): void;
    _onmouseup(pointInfo: any, shape: any, event: any): void;
    _ondragover(pointInfo: any, shape: any, event: any): void;
    _onmousemove(pointInfo: any, shape: any, event: any): void;
    _emitEvent(type: any, event: any, pointInfo: any, shape: any, fromShape?: any, toShape?: any): void;
    destroy(): void;
}
export default EventController;
