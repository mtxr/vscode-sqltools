/// <reference types="react" />
import { BasePlot, BaseConfig, AllBaseConfig } from '../interface';
interface Base extends BaseConfig<AllBaseConfig> {
    data?: any;
    value?: number;
    /** Gauge、Liquid、Progress、RingProgress */
    percent?: number;
}
export default function useInit<T extends BasePlot, U extends Base>(ChartClass: any, config: U): {
    chart: import("react").MutableRefObject<T>;
    container: import("react").MutableRefObject<HTMLDivElement>;
};
export {};
