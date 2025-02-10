import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { BulletOptions } from './types';
export type { BulletOptions };
export declare class Bullet extends Plot<BulletOptions> {
    /**
     * 获取 子弹图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<BulletOptions>;
    /** 图表类型 */
    type: string;
    changeData(data: any): void;
    /**
     * 获取子弹图的适配器
     */
    protected getSchemaAdaptor(): Adaptor<BulletOptions>;
    /**
     * 获取 子弹图 默认配置
     */
    protected getDefaultOptions(): Partial<BulletOptions>;
}
