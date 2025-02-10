import { Datum } from '../../types';
export declare const X_FIELD = "x";
export declare const Y_FIELD = "y";
export declare const NODE_COLOR_FIELD = "name";
export declare const EDGE_COLOR_FIELD = "source";
export declare const DEFAULT_OPTIONS: {
    nodeStyle: {
        opacity: number;
        fillOpacity: number;
        lineWidth: number;
    };
    edgeStyle: {
        opacity: number;
        lineWidth: number;
    };
    label: {
        fields: string[];
        callback: (x: number[], name: string) => {
            offsetX: number;
            content: string;
        };
        labelEmit: boolean;
        style: {
            fill: string;
        };
    };
    tooltip: {
        showTitle: boolean;
        showMarkers: boolean;
        fields: string[];
        showContent: (items: any) => boolean;
        formatter: (datum: Datum) => {
            name: string;
            value: any;
        };
    };
    interactions: {
        type: string;
    }[];
    weight: boolean;
    nodePaddingRatio: number;
    nodeWidthRatio: number;
};
