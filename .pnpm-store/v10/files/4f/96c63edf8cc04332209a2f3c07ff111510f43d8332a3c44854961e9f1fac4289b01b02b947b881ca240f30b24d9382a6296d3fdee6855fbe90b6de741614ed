import { IElement } from '@antv/g-base';
import { BBox, Point, Region } from '../types';
export declare function formatPadding(padding: number | number[]): number[];
export declare function clearDom(container: HTMLElement): void;
export declare function hasClass(elements: any, cName: any): boolean;
export declare function regionToBBox(region: Region): BBox;
export declare function pointsToBBox(points: Point[]): BBox;
export declare function createBBox(x: number, y: number, width: number, height: number): BBox;
export declare function getValueByPercent(min: number, max: number, percent: number): number;
export declare function getCirclePoint(center: Point, radius: number, angle: number): {
    x: number;
    y: number;
};
export declare function distance(p1: Point, p2: Point): number;
export declare const wait: (interval: number) => Promise<void>;
/**
 * 判断两个数值 是否接近
 * - 解决精度问题（由于无法确定精度上限，根据具体场景可传入 精度 参数）
 */
export declare const near: (x: number, y: number, e?: number) => boolean;
export declare function intersectBBox(box1: BBox, box2: BBox): BBox;
export declare function mergeBBox(box1: BBox, box2: BBox): BBox;
export declare function getBBoxWithClip(element: IElement): BBox;
export declare function updateClip(element: IElement, newElement: IElement): void;
export declare function toPx(number: any): string;
export declare function getTextPoint(start: Point, end: Point, position: string, offset: number): Point;
