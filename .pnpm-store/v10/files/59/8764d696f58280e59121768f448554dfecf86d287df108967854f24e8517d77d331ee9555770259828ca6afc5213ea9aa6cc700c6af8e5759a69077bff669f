import { Scale, Coordinate } from '../../dependents';
import { Data, ScaleOption, ViewCfg } from '../../interface';
/** @ignore */
export declare class ScalePool {
    /** 所有的 scales */
    private scales;
    /** 需要同步的 scale 分组， key: scaleKeyArray */
    private syncScales;
    /**
     * 创建 scale
     * @param field
     * @param data
     * @param scaleDef
     * @param key
     */
    createScale(field: string, data: Data, scaleDef: ScaleOption, key: string): Scale;
    /**
     * 同步 scale
     */
    sync(coordinate: Coordinate, theme: ViewCfg['theme']): void;
    /**
     * 缓存一个 scale
     * @param scale
     * @param scaleDef
     * @param key
     */
    private cacheScale;
    /**
     * 通过 key 获取 scale
     * @param key
     */
    getScale(key: string): Scale;
    /**
     * 在 view 销毁的时候，删除 scale 实例，防止内存泄露
     * @param key
     */
    deleteScale(key: string): void;
    /**
     * 清空
     */
    clear(): void;
    /**
     * 删除 sync scale 引用
     * @param key
     */
    private removeFromSyncScales;
    /**
     * get sync key
     * @param sm
     */
    private getSyncKey;
    /**
     * 通过 key 获取 scale
     * @param key
     */
    private getScaleMeta;
}
