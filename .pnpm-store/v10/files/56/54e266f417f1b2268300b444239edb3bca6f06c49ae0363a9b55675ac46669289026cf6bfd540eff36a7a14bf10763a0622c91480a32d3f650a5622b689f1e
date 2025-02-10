import { BrushCfg } from '../types';
/**
 * G2 已经内置了 brush、brush-x、brush-y 等交互，其它：
 *
 * 1. element-range-highlight 是否可用重命名为 brush-highlight？(mask 可以移动)
 * 2. brush-visible 与 brush 的区别是？
 */
declare function isPointInView(context: any): any;
/**
 * 获取 交互 start 阶段的相关配置
 */
export declare function getInteractionCfg(interactionType: string, brushType?: string, options?: BrushCfg): {
    showEnable: ({
        trigger: string;
        action: string;
        isEnable: (context: any) => boolean;
    } | {
        trigger: string;
        action: string;
        isEnable?: undefined;
    })[];
    start: {
        trigger: string;
        isEnable: typeof isPointInView;
        action: string[];
        arg: {
            maskStyle: import("@antv/g2").ShapeAttrs;
        }[];
    }[];
    processing: {
        trigger: string;
        isEnable: typeof isPointInView;
        action: string[];
    }[];
    end: {
        trigger: string;
        isEnable: typeof isPointInView;
        action: string[];
    }[];
    rollback: {
        trigger: string;
        action: string[];
    }[];
} | {
    showEnable: ({
        trigger: string;
        action: string;
        isEnable: (context: any) => boolean;
    } | {
        trigger: string;
        action: string;
        isEnable?: undefined;
    })[];
    start: ({
        trigger: string;
        isEnable: (context: any) => boolean;
        action: string[];
        arg: {
            maskStyle: import("@antv/g2").ShapeAttrs;
        }[];
    } | {
        trigger: string;
        action: string[];
        isEnable?: undefined;
        arg?: undefined;
    })[];
    processing: {
        trigger: string;
        action: string[];
    }[];
    end: ({
        trigger: string;
        action: string[];
        isEnable?: undefined;
    } | {
        trigger: string;
        isEnable(context: any): boolean;
        action: string[];
    })[];
    rollback: {
        trigger: string;
        action: string[];
    }[];
} | {
    showEnable?: undefined;
    start?: undefined;
    processing?: undefined;
    end?: undefined;
    rollback?: undefined;
};
export {};
