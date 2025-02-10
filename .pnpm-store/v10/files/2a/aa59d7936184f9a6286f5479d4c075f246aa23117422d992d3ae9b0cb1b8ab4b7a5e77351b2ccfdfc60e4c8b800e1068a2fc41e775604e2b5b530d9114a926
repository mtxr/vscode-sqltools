import type React from 'react';
declare class CacheMap {
    maps: Record<string, number>;
    id: number;
    diffKeys: Set<React.Key>;
    constructor();
    set(key: React.Key, value: number): void;
    get(key: React.Key): number;
    /**
     * CacheMap will record the key changed.
     * To help to know what's update in the next render.
     */
    resetRecord(): void;
    getRecord(): Set<React.Key>;
}
export default CacheMap;
