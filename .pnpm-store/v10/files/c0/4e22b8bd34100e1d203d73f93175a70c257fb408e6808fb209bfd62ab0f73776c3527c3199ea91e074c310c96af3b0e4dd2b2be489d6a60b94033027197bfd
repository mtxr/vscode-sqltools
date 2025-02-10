import * as React from 'react';
export interface CellProps {
    itemPrefixCls: string;
    span: number;
    className?: string;
    component: string;
    style?: React.CSSProperties;
    /** @deprecated Please use `styles={{ label: {} }}` instead */
    labelStyle?: React.CSSProperties;
    /** @deprecated Please use `styles={{ content: {} }}` instead */
    contentStyle?: React.CSSProperties;
    styles?: {
        label?: React.CSSProperties;
        content?: React.CSSProperties;
    };
    classNames?: {
        label?: string;
        content?: string;
    };
    bordered?: boolean;
    label?: React.ReactNode;
    content?: React.ReactNode;
    colon?: boolean;
    type?: 'label' | 'content' | 'item';
}
declare const Cell: React.FC<CellProps>;
export default Cell;
