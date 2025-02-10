import * as React from 'react';
import type { HTMLAriaDataAttributes } from '../_util/aria-data-attrs';
import type { FormatConfig, valueType } from './utils';
interface StatisticReactProps extends FormatConfig {
    prefixCls?: string;
    className?: string;
    rootClassName?: string;
    style?: React.CSSProperties;
    value?: valueType;
    valueStyle?: React.CSSProperties;
    valueRender?: (node: React.ReactNode) => React.ReactNode;
    title?: React.ReactNode;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    loading?: boolean;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}
export type StatisticProps = HTMLAriaDataAttributes & StatisticReactProps;
declare const Statistic: React.FC<StatisticProps>;
export default Statistic;
