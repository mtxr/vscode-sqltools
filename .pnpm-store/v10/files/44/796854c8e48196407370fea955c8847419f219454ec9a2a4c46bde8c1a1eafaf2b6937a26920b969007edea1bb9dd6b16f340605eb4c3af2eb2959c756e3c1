import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import './shapes/word-cloud';
import { WordCloudOptions } from './types';
export type { WordCloudOptions };
export declare class WordCloud extends Plot<WordCloudOptions> {
    /**
     * 获取 词云图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<WordCloudOptions>;
    /** 词云图 */
    type: string;
    /**
     * @override
     * @param data
     */
    changeData(data: any): void;
    /**
     * 获取默认的 options 配置项
     */
    protected getDefaultOptions(): Partial<WordCloudOptions>;
    /**
     * 覆写父类方法，词云图需要加载图片资源，所以需要异步渲染
     */
    render(): Promise<void>;
    /**
     * 获取 词云图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<WordCloudOptions>;
    /**
     * 覆写父类的方法，因为词云图使用 单独的函数 进行布局，原理上有些不一样
     */
    protected triggerResize(): void;
}
