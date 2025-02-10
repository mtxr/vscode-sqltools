import type { CSSProperties, FC, HTMLAttributes, ReactNode } from 'react';
import React from 'react';
export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    classNames?: {
        actions?: string;
        extra?: string;
    };
    children?: ReactNode;
    prefixCls?: string;
    style?: CSSProperties;
    styles?: {
        actions?: CSSProperties;
        extra?: CSSProperties;
    };
    extra?: ReactNode;
    actions?: ReactNode[];
    colStyle?: CSSProperties;
}
export interface ListItemMetaProps {
    avatar?: ReactNode;
    className?: string;
    children?: ReactNode;
    description?: ReactNode;
    prefixCls?: string;
    style?: CSSProperties;
    title?: ReactNode;
}
export declare const Meta: FC<ListItemMetaProps>;
declare const InternalItem: React.ForwardRefExoticComponent<ListItemProps & React.RefAttributes<HTMLDivElement>>;
export type ListItemTypeProps = typeof InternalItem & {
    Meta: typeof Meta;
};
declare const Item: ListItemTypeProps;
export default Item;
