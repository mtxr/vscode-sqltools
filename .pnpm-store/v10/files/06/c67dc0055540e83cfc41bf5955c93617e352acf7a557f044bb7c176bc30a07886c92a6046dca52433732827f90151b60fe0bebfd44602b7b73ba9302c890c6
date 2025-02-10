import * as React from 'react';
import type { Breakpoint } from '../_util/responsiveObserver';
import DescriptionsContext from './DescriptionsContext';
import type { DescriptionsItemProps } from './Item';
import DescriptionsItem from './Item';
interface CompoundedComponent {
    Item: typeof DescriptionsItem;
}
export interface InternalDescriptionsItemType extends DescriptionsItemProps {
    key?: React.Key;
    filled?: boolean;
}
export interface DescriptionsItemType extends Omit<InternalDescriptionsItemType, 'span' | 'filled'> {
    span?: number | 'filled' | {
        [key in Breakpoint]?: number;
    };
}
export interface DescriptionsProps {
    prefixCls?: string;
    className?: string;
    rootClassName?: string;
    style?: React.CSSProperties;
    bordered?: boolean;
    size?: 'middle' | 'small' | 'default';
    /**
     * @deprecated use `items` instead
     */
    children?: React.ReactNode;
    title?: React.ReactNode;
    extra?: React.ReactNode;
    column?: number | Partial<Record<Breakpoint, number>>;
    layout?: 'horizontal' | 'vertical';
    colon?: boolean;
    labelStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    styles?: {
        root?: React.CSSProperties;
        header?: React.CSSProperties;
        title?: React.CSSProperties;
        extra?: React.CSSProperties;
        label?: React.CSSProperties;
        content?: React.CSSProperties;
    };
    classNames?: {
        root?: string;
        header?: string;
        title?: string;
        extra?: string;
        label?: string;
        content?: string;
    };
    items?: DescriptionsItemType[];
    id?: string;
}
declare const Descriptions: React.FC<DescriptionsProps> & CompoundedComponent;
export type { DescriptionsContextProps } from './DescriptionsContext';
export { DescriptionsContext };
export default Descriptions;
